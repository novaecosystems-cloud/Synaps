import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://synaps.ai';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/legal/*', '/login', '/register'],
        disallow: ['/dashboard/*', '/api/*', '/_next/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
