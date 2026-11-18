
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

    if (!plate) {
      return NextResponse.json(
        { error: 'Введите корректный номер автомобиля' },
        { status: 400 }
      );
    }

    const profiles = await getProfiles();

    const profile = profiles.find(
        (item) => normalizePlate(item.plate).startsWith(plate)
    );

    if (!profile) {
      return NextResponse.json(
        { error: 'Автомобиль не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Mobile search error:', error);

    return NextResponse.json(
      { error: 'Ошибка поиска автомобиля' },
      { status: 500 }
    );
  }
}
