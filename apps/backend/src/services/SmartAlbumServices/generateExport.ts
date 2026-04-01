import sharp from "sharp";
import satori from "satori";
import archiver from "archiver";
import { PassThrough } from "stream";
import { db, extractPhotoIds } from "./_shared";
import {
  getS3ObjectBuffer,
  putS3Object,
  getPresignedDownloadUrl,
} from "../../utils/s3";

// ─── Constants ────────────────────────────────────────────────────────

// Album page background — always dark (zinc-900) to match gallery/dashboard preview
const PAGE_BG = { r: 24, g: 24, b: 27 };

// Aspect ratios matching the gallery UI
const SINGLE_ASPECT = 4 / 3; // height / width  (portrait 3:4)

// ─── Font cache ──────────────────────────────────────────────────────
// satori needs raw font ArrayBuffers. We fetch from Google Fonts and cache.

const fontBufferCache = new Map<string, ArrayBuffer>();

async function fetchFontBuffer(fontFamily: string): Promise<ArrayBuffer | null> {
  if (fontBufferCache.has(fontFamily)) return fontBufferCache.get(fontFamily)!;

  try {
    // satori supports TTF, OTF, WOFF — but NOT woff2.
    // Use Google Fonts CSS v1 with an old Android user-agent to get TTF URLs.
    const cssUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(fontFamily)}`;
    const cssRes = await fetch(cssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; U; Android 4.4.2; en-us) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
      },
    });
    const css = await cssRes.text();

    // Extract TTF URL from the CSS response
    let fontUrl: string | null = null;
    const ttfMatch = css.match(/url\(([^)]+\.ttf)\)/);
    if (ttfMatch) {
      fontUrl = ttfMatch[1];
    } else {
      // Fallback: try any font URL (woff, etc.)
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

function parseProductDimensions(size: string): { base: number } {
  const parts = size.split("x").map(Number);
  const dpi = 150;
  if (parts.length === 2 && !isNaN(parts[0])) {
    return { base: parts[0] * dpi };
  }
  return { base: 1800 };
}

function singlePageDims(base: number): { w: number; h: number } {
  return { w: base, h: Math.round(base * SINGLE_ASPECT) };
}

function spreadDims(base: number): { w: number; h: number } {
  return { w: base * 2, h: base };
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

  return sharp(srcBuffer)
    .extract({
      left: srcLeft,
      top: srcTop,
      width: srcWidth,
      height: srcHeight,
    })
    .resize(slotWidth, slotHeight)
    .toBuffer();
}

// ─── Build text overlay using satori ──────────────────────────────────
// satori converts text + font data → SVG <path> outlines.
// This is font-independent at render time — Sharp/librsvg can composite
// the resulting SVG without needing Google Fonts installed on the server.

async function buildTextOverlay(
  texts: any[] | undefined,
  canvasWidth: number,
  canvasHeight: number,
): Promise<Buffer | null> {
  if (!texts || texts.length === 0) return null;

  const validTexts = texts.filter((t: any) => t.content);
  if (validTexts.length === 0) return null;

  // Collect unique font families and fetch their data
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

  // If no fonts loaded, skip text rendering
  if (fonts.length === 0) return null;

  // Replicate the gallery SpreadCanvas text CSS exactly:
  //   left: x%, top: y%, transform: translate(-50%, -50%), width: 85%
  //   fontFamily, fontSize (scaled), color, lineHeight: 1.3,
  //   textAlign, whiteSpace: pre-wrap, padding, textShadow
  //
  // satori doesn't support translate(-50%, -50%), so we simulate it:
  // Place a 100%×100% container shifted so its CENTER lands at (x%, y%),
  // then flex-center the 85%-wide text box inside it.

  const canvasScale = canvasHeight / 500;

  const children = validTexts.map((text: any) => {
    const fontSize = Math.max(10, text.fontSize * canvasScale);
    const padding = Math.max(4, canvasScale * 8);

    return {
      type: "div" as const,
      props: {
        style: {
          position: "absolute" as const,
          // Shift a 100%×100% box so its center is at (text.x%, text.y%)
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
              // satori treats all elements as flex containers, so textAlign
              // alone won't work. Use justifyContent to match the alignment.
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

  // satori accepts plain {type, props} objects; cast to satisfy TS ReactNode type
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

  // Text overlay via satori (renders as SVG paths — font-independent)
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
    .jpeg({ quality: 90 })
    .toBuffer();
}

// ─── Main export ──────────────────────────────────────────────────────

export const generateExport = async (
  userId: string,
  submissionId: string,
  force = false,
) => {
  try {
    const submission = await db.smartAlbumSubmission.findFirst({
      where: { id: submissionId },
      include: {
        design: {
          select: {
            id: true,
            title: true,
            gallery: { select: { userId: true } },
            product: { select: { size: true, name: true } },
          },
        },
      },
    });

    if (!submission) {
      return { error: "Submission not found", status: 404 as const };
    }

    if (submission.design.gallery.userId !== userId) {
      return { error: "Forbidden", status: 403 as const };
    }

    if (submission.status !== "APPROVED") {
      return {
        error: "Only approved submissions can be exported",
        status: 400 as const,
      };
    }

    // Return existing export if already generated (unless force regenerate)
    if (!force && submission.exportReady && submission.exportUrl) {
      const signedUrl = await getPresignedDownloadUrl(
        submission.exportUrl,
        3600,
      );
      return {
        data: {
          exportUrl: signedUrl,
          expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
          fileName: `album-v${submission.version}.zip`,
        },
      };
    }

    const snapshot = submission.designSnapshot as any;
    const photoIds = extractPhotoIds(snapshot);

    const photos = await db.photo.findMany({
      where: { id: { in: photoIds } },
      select: { id: true, s3Key: true },
    });

    const photoBuffers = new Map<string, Buffer>();
    await Promise.all(
      photos.map(async (photo: any) => {
        try {
          const buffer = await getS3ObjectBuffer(photo.s3Key);
          photoBuffers.set(photo.id, buffer);
        } catch {
          // Skip photos that fail to download
        }
      }),
    );

    const { base } = parseProductDimensions(submission.design.product.size);
    const single = singlePageDims(base);
    const spread = spreadDims(base);

    const pages: [string, Buffer][] = [];

    if (snapshot.cover) {
      pages.push([
        "01_cover.jpg",
        await renderPage(snapshot.cover, photoBuffers, single.w, single.h),
      ]);
    }
    if (snapshot.firstPage) {
      pages.push([
        "02_first_page.jpg",
        await renderPage(snapshot.firstPage, photoBuffers, single.w, single.h),
      ]);
    }
    for (const sp of snapshot.spreads || []) {
      const num = String(sp.order + 3).padStart(2, "0");
      pages.push([
        `${num}_spread_${sp.order + 1}.jpg`,
        await renderPage(sp, photoBuffers, spread.w, spread.h),
      ]);
    }
    if (snapshot.lastPage) {
      const num = String((snapshot.spreads?.length || 0) + 3).padStart(2, "0");
      pages.push([
        `${num}_last_page.jpg`,
        await renderPage(snapshot.lastPage, photoBuffers, single.w, single.h),
      ]);
    }

    // Create ZIP archive in memory
    const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
      const passThrough = new PassThrough();
      const chunks: Buffer[] = [];
      passThrough.on("data", (chunk) => chunks.push(chunk));
      passThrough.on("end", () => resolve(Buffer.concat(chunks)));
      passThrough.on("error", reject);

      const archive = archiver("zip", { zlib: { level: 6 } });
      archive.on("error", reject);
      archive.pipe(passThrough);

      for (const [name, buffer] of pages) {
        archive.append(buffer, { name });
      }

      archive.finalize();
    });

    const s3Key = `exports/smart-album/${submissionId}/album-v${submission.version}.zip`;
    await putS3Object(s3Key, zipBuffer, "application/zip");

    await db.smartAlbumSubmission.update({
      where: { id: submissionId },
      data: { exportReady: true, exportUrl: s3Key },
    });

    const signedUrl = await getPresignedDownloadUrl(s3Key, 3600);

    return {
      data: {
        exportUrl: signedUrl,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        fileName: `album-v${submission.version}.zip`,
      },
    };
  } catch (err: any) {
    return { error: err.message, status: 500 as const };
  }
};
