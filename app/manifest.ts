import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gbadegesin Mariam Omowumi Portfolio & Analytics Platform',
    short_name: 'MariamData',
    description: 'Premium Data Analyst Portfolio and CMS Dashboard Console',
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
