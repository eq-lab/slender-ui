import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Slender',
    short_name: 'Slender',
    icons: [
      { src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
  };
}
