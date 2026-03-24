import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://simoesemijoias.com.br'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/conta/',
        '/checkout/',
        '/auth/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
