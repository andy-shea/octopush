import fs from 'fs';

export let includeAsset = (path: string) => path;
if (process.env.NODE_ENV === 'production') {
  const assetManifest = JSON.parse(fs.readFileSync('./dist/web/asset-manifest.json') as any);
  includeAsset = path => assetManifest[path];
}
