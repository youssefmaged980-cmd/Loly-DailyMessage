import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Loly Daily Message',
    short_name: 'LOLO Message',
    description: 'رسائل يومية لليلى',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a0b2e',
    theme_color: '#8e4a9f',
    icons: [
      {
        src: '/icon2.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon2.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
