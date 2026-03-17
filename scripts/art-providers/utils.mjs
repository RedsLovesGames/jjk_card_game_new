import { promises as fs } from 'node:fs';
import path from 'node:path';

export const slugify = (value) => String(value ?? '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const normalizeLookupKey = ({ id, name, variant }) => (
  `${slugify(id)}__${slugify(name)}__${slugify(variant || 'default')}`
);

export const ensureRequiredAttribution = (metadata, requiredFields, providerName, cardId) => {
  const missing = requiredFields.filter((field) => !String(metadata[field] ?? '').trim());
  if (missing.length > 0) {
    throw new Error(`Provider ${providerName} missing required metadata for ${cardId}: ${missing.join(', ')}`);
  }
};

export const downloadToFile = async (url, destinationAbsolutePath, userAgent = 'jjk-card-game-art-pipeline/1.0') => {
  const response = await fetch(url, { headers: { 'user-agent': userAgent } });
  if (!response.ok) {
    throw new Error(`Failed download (${response.status}) for ${url}`);
  }

  const data = new Uint8Array(await response.arrayBuffer());
  await fs.mkdir(path.dirname(destinationAbsolutePath), { recursive: true });
  await fs.writeFile(destinationAbsolutePath, data);
  return { bytes: data.length };
};

export const createCardDerivativeFromUrl = async ({ sourceUrl, destinationPath, width, height, userAgent }) => {
  const url = new URL('https://images.weserv.nl/');
  url.searchParams.set('url', sourceUrl.replace(/^https?:\/\//, ''));
  url.searchParams.set('w', String(width));
  url.searchParams.set('h', String(height));
  url.searchParams.set('fit', 'cover');
  url.searchParams.set('a', 'attention');
  url.searchParams.set('output', 'png');
  await downloadToFile(url.toString(), destinationPath, userAgent);
};

const pngSize = (buffer) => ({ width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), format: 'png' });
const jpgSize = (buffer) => {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xFF) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    const blockLength = buffer.readUInt16BE(offset + 2);
    if ([0xC0, 0xC1, 0xC2].includes(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
        format: 'jpg',
      };
    }
    offset += 2 + blockLength;
  }
  throw new Error('Invalid JPG image');
};
const webpSize = (buffer) => {
  const riffType = buffer.toString('utf8', 8, 12);
  if (riffType !== 'WEBP') throw new Error('Invalid WEBP image');
  const chunkHeader = buffer.toString('utf8', 12, 16);
  if (chunkHeader === 'VP8X') {
    const widthMinusOne = buffer.readUIntLE(24, 3);
    const heightMinusOne = buffer.readUIntLE(27, 3);
    return { width: widthMinusOne + 1, height: heightMinusOne + 1, format: 'webp' };
  }
  throw new Error('Unsupported WEBP layout');
};

export const detectImageMetadata = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  if (buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) {
    return pngSize(buffer);
  }
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    return jpgSize(buffer);
  }
  if (buffer.toString('ascii', 0, 4) === 'RIFF') {
    return webpSize(buffer);
  }
  throw new Error(`Unsupported image format for ${filePath}`);
};
