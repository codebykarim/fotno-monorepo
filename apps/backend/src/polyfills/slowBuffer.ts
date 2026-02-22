import { Buffer } from "buffer";

type BufferModuleCompat = {
  SlowBuffer?: typeof Buffer;
};

// Some legacy dependencies still reference buffer.SlowBuffer.prototype.
// Node.js v25 no longer exposes SlowBuffer, so alias it to Buffer.
const bufferModule = require("buffer") as BufferModuleCompat;

if (typeof bufferModule.SlowBuffer === "undefined") {
  bufferModule.SlowBuffer = Buffer;
}
