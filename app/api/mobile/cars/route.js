
import { NextResponse } from 'next/server';
import { getProfiles } from '../../../../lib/profiles';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const profiles = await getProfiles();

    const cars = profiles.map((p) => ({
      username: p.username,
      name: p.name,
      car: p.car,
      plate: p.plate,
      avatar: p.avatar,
      video: p.video,
      views: p.views,
      likes: p.likes,
      instagram: p.instagram,
      telegram: p.telegram,
      tiktok: p.tiktok,
      youtube: p.youtube,
    }));

    return NextResponse.json({
      success: true,
      cars,
    });
  } catch (error) {
    console.error('Mobile cars error:', error);

    return NextResponse.json(
      { error: 'Не удалось загрузить автомобили' },
      { status: 500 }
    );
  }
}
