
import { getProfiles } from '../lib/profiles';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = 'https://plate1.vercel.app';

  const profiles = await getProfiles();

  const profileUrls = profiles
    .filter((profile) => profile.username)
    .map((profile) => ({
      url: `${baseUrl}/${encodeURIComponent(profile.username)}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...profileUrls,
  ];
}
