import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Loly Daily Message',
    short_name: 'LOLO Message',
    description: 'رسائل يومية لليلى',
    start_url: '/',
    display: 'standalone',
    background_color: "hsl(257.59deg 96.67% 11.76%)",
    theme_color: 'hsl(282.09deg 83.41% 44.9%)',
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
