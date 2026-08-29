import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourcePath = path.join(root, "public", "brand", "logo-mark.svg");
const source = await readFile(sourcePath);

async function renderPng(size) {
  return sharp(source, { density: 384 })
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

const [favicon16, favicon32, favicon48, appleIcon, brandPreview] = await Promise.all([
  renderPng(16),
  renderPng(32),
  renderPng(48),
  renderPng(180),
  renderPng(512),
]);

function createIco(images) {
  const headerSize = 6;
  const entrySize = 16;
  const directory = Buffer.alloc(headerSize + entrySize * images.length);
  directory.writeUInt16LE(0, 0);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(images.length, 4);

  let offset = directory.length;
  images.forEach(({ size, data }, index) => {
    const entryOffset = headerSize + index * entrySize;
    directory.writeUInt8(size === 256 ? 0 : size, entryOffset);
    directory.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    directory.writeUInt8(0, entryOffset + 2);
    directory.writeUInt8(0, entryOffset + 3);
    directory.writeUInt16LE(1, entryOffset + 4);
    directory.writeUInt16LE(32, entryOffset + 6);
    directory.writeUInt32LE(data.length, entryOffset + 8);
    directory.writeUInt32LE(offset, entryOffset + 12);
    offset += data.length;
  });

  return Buffer.concat([directory, ...images.map(({ data }) => data)]);
}

await Promise.all([
  writeFile(path.join(root, "src", "app", "favicon.ico"), createIco([
    { size: 16, data: favicon16 },
    { size: 32, data: favicon32 },
    { size: 48, data: favicon48 },
  ])),
  writeFile(path.join(root, "src", "app", "apple-icon.png"), appleIcon),
  writeFile(path.join(root, "public", "brand", "logo-mark-512.png"), brandPreview),
]);

console.log("Brand icons generated from public/brand/logo-mark.svg");
