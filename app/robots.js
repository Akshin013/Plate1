
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: 'https://plateru.vercel.app/sitemap.xml',
    host: 'https://plateru.vercel.app',
  };
}
