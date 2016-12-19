import fs from 'fs';

export function includeChunkManifest() {
  if (process.env.NODE_ENV === 'development') return '';
  return `<script>window.__WEBPACK_MANIFEST__ = ${fs.readFileSync('./dist/web/chunk-manifest.json')};</script>`;
}

export let includeAsset = path => path;
if (process.env.NODE_ENV === 'production') {
  const assetManifest = JSON.parse(fs.readFileSync('./dist/web/asset-manifest.json'));
  includeAsset = path => assetManifest[path];
}
