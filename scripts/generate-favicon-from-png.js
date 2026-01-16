/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, '..', 'public', 'brand-icon.png');
const output = path.join(__dirname, '..', 'public', 'favicon.ico');

if (!fs.existsSync(input)) {
  console.error('Input PNG not found:', input);
  process.exit(1);
}

const png = fs.readFileSync(input);

// Read PNG IHDR width/height (big-endian) at offsets 16 and 20
if (png.length < 24) {
  console.error('Invalid PNG, too small');
  process.exit(1);
}

const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);

const widthByte = width >= 256 ? 0 : width;
const heightByte = height >= 256 ? 0 : height;

// ICONDIR (6 bytes)
const iconDir = Buffer.alloc(6);
iconDir.writeUInt16LE(0, 0); // reserved
iconDir.writeUInt16LE(1, 2); // type 1 = icon
iconDir.writeUInt16LE(1, 4); // count

// ICONDIRENTRY (16 bytes)
const entry = Buffer.alloc(16);
entry.writeUInt8(widthByte, 0); // bWidth
entry.writeUInt8(heightByte, 1); // bHeight
entry.writeUInt8(0, 2); // bColorCount
entry.writeUInt8(0, 3); // bReserved
entry.writeUInt16LE(1, 4); // wPlanes
entry.writeUInt16LE(32, 6); // wBitCount
entry.writeUInt32LE(png.length, 8); // dwBytesInRes
entry.writeUInt32LE(6 + 16, 12); // dwImageOffset (after header + entries)

const out = Buffer.concat([iconDir, entry, png]);
fs.writeFileSync(output, out);
console.log('Generated', output, `(${width}x${height})`);
