import { NextResponse } from 'next/server';
import { getProfiles } from '../../../../lib/profiles';

export const dynamic = 'force-dynamic';

function normalizePlate(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^А-ЯЁ0-9]/g, '');
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const plate = normalizePlate(searchParams.get('plate'));

    if (plate.length < 2) {
      return NextResponse.json({ profiles: [] });
    }

    const allProfiles = await getProfiles();

    const profiles = allProfiles.filter((item) =>
      normalizePlate(item.plate).includes(plate)
    );

    return NextResponse.json({
      success: true,
      profiles: profiles.slice(0, 20),
    });
  } catch (error) {
    console.error('Mobile search error:', error);

    return NextResponse.json(
      { error: 'Ошибка поиска автомобиля' },
      { status: 500 }
    );
  }
}