import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const src = "/Users/karim/KARINITY/CODE/fotno/monorepo/packages/ui/src/assets/fotno-logo.png";
const dst = "/Users/karim/KARINITY/CODE/fotno/monorepo/packages/ui/src/assets/fotno-logo-white.png";

const img = sharp(src).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// For each pixel, if it's essentially grayscale and dark -> turn it white.
// Otherwise (colored, e.g. orange "t") keep as-is.
for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  if (a === 0) continue;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const isGrayscale = max - min < 25;
  const isDark = max < 160;
  if (isGrayscale && isDark) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
  }
}

await sharp(data, { raw: { width, height, channels } }).png().toFile(dst);
console.log("wrote", dst, width + "x" + height);
