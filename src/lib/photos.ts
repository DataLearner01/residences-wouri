import type { ImageMetadata } from 'astro';

// Toutes les photos de src/assets/photos, retrouvées par leur nom de fichier.
// Les fichiers de données n'indiquent que ce nom (ex. « photo-a-remplacer-akwa-facade.jpg »).
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

const byName = new Map(Object.entries(files).map(([path, mod]) => [path.split('/').pop()!, mod.default]));

export function photo(name: string): ImageMetadata {
  const image = byName.get(name);
  if (!image) throw new Error(`Photo introuvable : src/assets/photos/${name}`);
  return image;
}
