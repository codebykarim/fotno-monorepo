import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import satori from "satori";
import archiver from "archiver";
import { PDFDocument } from "pdf-lib";
import { PassThrough } from "stream";

// Lambda — limit Sharp resources
sharp.cache(false);
sharp.concurrency(1);

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.AWS_S3_BUCKET!;

// ─── Constants ────────────────────────────────────────────────────────

const PAGE_BG = { r: 24, g: 24, b: 27 };
const DPI = 300;
const CM_TO_INCH = 1 / 2.54;
// PDF uses points (72 per inch)
const CM_TO_PT = CM_TO_INCH * 72;

// ─── Types ────────────────────────────────────────────────────────────

type ExportEvent = {
  submissionId: string;
  version: number;
  designSnapshot: any;
  photos: { id: string; s3Key: string }[];
  widthCm: number;
  heightCm: number;
  albumName: string;
  galleryName: string;
  productName: string;
};

type ExportResult = {
  s3Key: string;
  fileName: string;
};

// ─── Font cache ──────────────────────────────────────────────────────

const fontBufferCache = new Map<string, ArrayBuffer>();

async function fetchFontBuffer(fontFamily: string): Promise<ArrayBuffer | null> {
  if (fontBufferCache.has(fontFamily)) return fontBufferCache.get(fontFamily)!;

  try {
    const cssUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(fontFamily)}`;
    const cssRes = await fetch(cssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; U; Android 4.4.2; en-us) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
      },
    });
    const css = await cssRes.text();

    let fontUrl: string | null = null;
    const ttfMatch = css.match(/url\(([^)]+\.ttf)\)/);
    if (ttfMatch) {
      fontUrl = ttfMatch[1];
    } else {
      const anyMatch = css.match(/url\(([^)]+)\)\s+format\(/);
      if (anyMatch) fontUrl = anyMatch[1];
    }

    if (!fontUrl) return null;

    const fontRes = await fetch(fontUrl);
    const buffer = await fontRes.arrayBuffer();
    fontBufferCache.set(fontFamily, buffer);
    return buffer;
  } catch {
    return null;
  }
}

// ─── Dimensions ───────────────────────────────────────────────────────

function cmToPixels(cm: number): number {
  return Math.round(cm * CM_TO_INCH * DPI);
}

function singlePageDims(widthCm: number, heightCm: number) {
  return { w: cmToPixels(widthCm), h: cmToPixels(heightCm) };
}

function spreadDims(widthCm: number, heightCm: number) {
  return { w: cmToPixels(widthCm) * 2, h: cmToPixels(heightCm) };
}

// ─── Render a single image slot ───────────────────────────────────────

async function renderSlot(
  photoBuffer: Buffer,
  slot: any,
  slotWidth: number,
  slotHeight: number,
): Promise<Buffer> {
  const rotation: number = slot.rotation || 0;
  const zoom: number = slot.cropWidth || 100;
  const posX: number = slot.cropX ?? 50;
  const posY: number = slot.cropY ?? 50;
  const s = zoom / 100;

  const meta = await sharp(photoBuffer).metadata();
  let imgW = meta.width!;
  let imgH = meta.height!;

  let srcBuffer = photoBuffer;
  if (rotation) {
    srcBuffer = await sharp(photoBuffer).rotate(rotation).toBuffer();
    if (rotation === 90 || rotation === 270) {
      [imgW, imgH] = [imgH, imgW];
    }
  }

  const coverScale = Math.max(slotWidth / imgW, slotHeight / imgH);
  const covW = imgW * coverScale;
  const covH = imgH * coverScale;
  const exW = covW - slotWidth;
  const exH = covH - slotHeight;

  const ox = (posX / 100) * exW;
  const oy = (posY / 100) * exH;
  const tx = ((100 - posX) / 100) * slotWidth;
  const ty = ((100 - posY) / 100) * slotHeight;

  const cropLeft = ox + tx * (1 - 1 / s);
  const cropTop = oy + ty * (1 - 1 / s);
  const cropWidth = slotWidth / s;
  const cropHeight = slotHeight / s;

  let srcLeft = Math.round(cropLeft / coverScale);
  let srcTop = Math.round(cropTop / coverScale);
  let srcWidth = Math.round(cropWidth / coverScale);
  let srcHeight = Math.round(cropHeight / coverScale);

  srcWidth = Math.max(1, Math.min(srcWidth, imgW));
  srcHeight = Math.max(1, Math.min(srcHeight, imgH));
  srcLeft = Math.max(0, Math.min(imgW - srcWidth, srcLeft));
  srcTop = Math.max(0, Math.min(imgH - srcHeight, srcTop));

  // Output as raw PNG (lossless) — these are intermediate buffers for compositing.
  // If we let Sharp default to JPEG here, it compresses at quality 80 and the
  // final quality-98 step can't recover the lost detail.
  return sharp(srcBuffer)
    .extract({
      left: srcLeft,
      top: srcTop,
      width: srcWidth,
      height: srcHeight,
    })
    .resize(slotWidth, slotHeight)
    .png({ compressionLevel: 1 })
    .toBuffer();
}

// ─── Build text overlay using satori ──────────────────────────────────

async function buildTextOverlay(
  texts: any[] | undefined,
  canvasWidth: number,
  canvasHeight: number,
): Promise<Buffer | null> {
  if (!texts || texts.length === 0) return null;

  const validTexts = texts.filter((t: any) => t.content);
  if (validTexts.length === 0) return null;

  const families = [
    ...new Set(validTexts.map((t: any) => t.fontFamily).filter(Boolean)),
  ];
  const fonts: { name: string; data: ArrayBuffer; weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; style: "normal" | "italic" }[] = [];

  await Promise.all(
    families.map(async (family: string) => {
      const buf = await fetchFontBuffer(family);
      if (buf) {
        fonts.push({
          name: family,
          data: buf,
          weight: 400 as const,
          style: "normal" as const,
        });
      }
    }),
  );

  if (fonts.length === 0) return null;

  const canvasScale = canvasHeight / 500;

  const children = validTexts.map((text: any) => {
    const fontSize = Math.max(10, text.fontSize * canvasScale);
    const padding = Math.max(4, canvasScale * 8);

    return {
      type: "div" as const,
      props: {
        style: {
          position: "absolute" as const,
          left: `${text.x - 50}%`,
          top: `${text.y - 50}%`,
          width: "100%",
          height: "100%",
          display: "flex" as const,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },
        children: {
          type: "div" as const,
          props: {
            style: {
              width: "85%",
              display: "flex" as const,
              justifyContent:
                text.textAlign === "center"
                  ? ("center" as const)
                  : text.textAlign === "right"
                    ? ("flex-end" as const)
                    : ("flex-start" as const),
              textAlign: text.textAlign as "left" | "center" | "right",
              fontFamily: text.fontFamily,
              fontSize,
              color: text.color,
              lineHeight: 1.3,
              whiteSpace: "pre-wrap" as const,
              wordBreak: "break-word" as const,
              textShadow:
                "0 1px 4px rgba(0,0,0,0.3), 0 0 2px rgba(0,0,0,0.2)",
              padding,
            },
            children: text.content,
          },
        },
      },
    };
  });

  const element = {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative" as const,
      },
      children,
    },
  };

  const svg = await satori(element as any, {
    width: canvasWidth,
    height: canvasHeight,
    fonts,
  });

  return Buffer.from(svg);
}

// ─── Render a full album page ─────────────────────────────────────────

async function renderPage(
  page: { layoutId?: string; slots?: any[]; texts?: any[] },
  photoBuffers: Map<string, Buffer>,
  canvasWidth: number,
  canvasHeight: number,
): Promise<Buffer> {
  const composites: sharp.OverlayOptions[] = [];

  for (const slot of page.slots || []) {
    if (!slot.photoId) continue;
    const photoBuffer = photoBuffers.get(slot.photoId);
    if (!photoBuffer) continue;

    const slotLeft = Math.round((slot.x / 100) * canvasWidth);
    const slotTop = Math.round((slot.y / 100) * canvasHeight);
    const slotWidth = Math.max(1, Math.round((slot.width / 100) * canvasWidth));
    const slotHeight = Math.max(
      1,
      Math.round((slot.height / 100) * canvasHeight),
    );

    try {
      const rendered = await renderSlot(
        photoBuffer,
        slot,
        slotWidth,
        slotHeight,
      );
      composites.push({ input: rendered, left: slotLeft, top: slotTop });
    } catch {
      // Skip photo if rendering fails
    }
  }

  const textSvg = await buildTextOverlay(page.texts, canvasWidth, canvasHeight);
  if (textSvg) {
    composites.push({ input: textSvg, left: 0, top: 0 });
  }

  return sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 3,
      background: PAGE_BG,
    },
  })
    .composite(composites)
    .withMetadata({ density: DPI })
    .jpeg({ quality: 98 })
    .toBuffer();
}

// ─── Build print-ready PDF ───────────────────────────────────────────

async function buildPdf(
  pages: [string, Buffer][],
  widthCm: number,
  heightCm: number,
  spreads: string[],
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  const singleWPt = widthCm * CM_TO_PT;
  const singleHPt = heightCm * CM_TO_PT;
  const spreadWPt = widthCm * 2 * CM_TO_PT;

  for (const [name, jpegBuffer] of pages) {
    const isSpread = spreads.includes(name);
    const pageW = isSpread ? spreadWPt : singleWPt;
    const pageH = singleHPt;

    const image = await pdf.embedJpg(jpegBuffer);
    const page = pdf.addPage([pageW, pageH]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: pageW,
      height: pageH,
    });
  }

  return pdf.save();
}

// ─── Extract photo IDs from snapshot ──────────────────────────────────

function extractPhotoIds(snapshot: any): Set<string> {
  const ids = new Set<string>();
  const addFromSlots = (slots: any[]) => {
    for (const slot of slots || []) {
      if (slot.photoId) ids.add(slot.photoId);
    }
  };
  addFromSlots(snapshot?.cover?.slots);
  addFromSlots(snapshot?.firstPage?.slots);
  addFromSlots(snapshot?.lastPage?.slots);
  for (const spread of snapshot?.spreads || []) {
    addFromSlots(spread.slots);
  }
  return ids;
}

// ─── Sanitize filename parts ─────────────────────────────────────────

function sanitize(str: string | undefined | null): string {
  if (!str) return "untitled";
  return str
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s_-]/g, "")
    .replace(/\s+/g, "_")
    .trim() || "untitled";
}

// ─── Lambda Handler ──────────────────────────────────────────────────

export const handler = async (event: ExportEvent): Promise<ExportResult> => {
  const startedAt = Date.now();
  console.log(
    `[export-lambda] start submissionId=${event.submissionId} photos=${event.photos.length} ${event.widthCm}x${event.heightCm}cm`,
  );

  const snapshot = event.designSnapshot;
  const usedPhotoIds = extractPhotoIds(snapshot);

  // Download only the photos that are actually used in the snapshot
  const photosToDownload = event.photos.filter((p) => usedPhotoIds.has(p.id));

  console.log(
    `[export-lambda] downloading ${photosToDownload.length} photos from S3`,
  );

  const photoBuffers = new Map<string, Buffer>();
  await Promise.all(
    photosToDownload.map(async (photo) => {
      try {
        const res = await s3.send(
          new GetObjectCommand({ Bucket: BUCKET, Key: photo.s3Key }),
        );
        const buffer = Buffer.from(await res.Body!.transformToByteArray());
        photoBuffers.set(photo.id, buffer);
        console.log(
          `[export-lambda] downloaded photoId=${photo.id} bytes=${buffer.length}`,
        );
      } catch (err: any) {
        console.error(
          `[export-lambda] failed to download photoId=${photo.id}: ${err.message}`,
        );
      }
    }),
  );

  // Calculate dimensions
  const single = singlePageDims(event.widthCm, event.heightCm);
  const spread = spreadDims(event.widthCm, event.heightCm);

  console.log(
    `[export-lambda] rendering pages single=${single.w}x${single.h} spread=${spread.w}x${spread.h}`,
  );

  // Render all pages — track which filenames are spreads for PDF page sizing
  const pages: [string, Buffer][] = [];
  const spreadNames: string[] = [];

  if (snapshot.cover) {
    pages.push([
      "01_cover.jpg",
      await renderPage(snapshot.cover, photoBuffers, single.w, single.h),
    ]);
    console.log(`[export-lambda] rendered cover`);
  }
  if (snapshot.firstPage) {
    pages.push([
      "02_first_page.jpg",
      await renderPage(snapshot.firstPage, photoBuffers, single.w, single.h),
    ]);
    console.log(`[export-lambda] rendered first page`);
  }
  for (const sp of snapshot.spreads || []) {
    const num = String(sp.order + 3).padStart(2, "0");
    const name = `${num}_spread_${sp.order + 1}.jpg`;
    pages.push([
      name,
      await renderPage(sp, photoBuffers, spread.w, spread.h),
    ]);
    spreadNames.push(name);
    console.log(`[export-lambda] rendered spread ${sp.order + 1}`);
  }
  if (snapshot.lastPage) {
    const num = String((snapshot.spreads?.length || 0) + 3).padStart(2, "0");
    pages.push([
      `${num}_last_page.jpg`,
      await renderPage(snapshot.lastPage, photoBuffers, single.w, single.h),
    ]);
    console.log(`[export-lambda] rendered last page`);
  }

  // Build print-ready PDF with exact cm page dimensions
  console.log(`[export-lambda] building PDF...`);
  const pdfBytes = await buildPdf(pages, event.widthCm, event.heightCm, spreadNames);
  console.log(`[export-lambda] PDF created bytes=${pdfBytes.length}`);

  // Build ZIP: individual JPEGs + print-ready PDF
  const fileName = `${sanitize(event.albumName)}-${sanitize(event.galleryName)}-${sanitize(event.productName)}-v${event.version}.zip`;

  const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
    const passThrough = new PassThrough();
    const chunks: Buffer[] = [];
    passThrough.on("data", (chunk) => chunks.push(chunk));
    passThrough.on("end", () => resolve(Buffer.concat(chunks)));
    passThrough.on("error", reject);

    const archive = archiver("zip", { store: true });
    archive.on("error", reject);
    archive.pipe(passThrough);

    // Print-ready PDF first
    archive.append(Buffer.from(pdfBytes), { name: "00_READY_PRINT.pdf" });

    // Individual JPEG pages
    for (const [name, buffer] of pages) {
      archive.append(buffer, { name });
    }

    archive.finalize();
  });

  console.log(
    `[export-lambda] zip created pages=${pages.length} zipBytes=${zipBuffer.length}`,
  );

  // Upload ZIP to S3
  const s3Key = `exports/smart-album/${event.submissionId}/${fileName}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: zipBuffer,
      ContentType: "application/zip",
    }),
  );

  const durationMs = Date.now() - startedAt;
  console.log(
    `[export-lambda] done submissionId=${event.submissionId} s3Key=${s3Key} ${durationMs}ms`,
  );

  return { s3Key, fileName };
};
