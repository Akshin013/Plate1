
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: 'https://plate1.vercel.app/sitemap.xml',
    host: 'https://plate1.vercel.app',
  };
}
