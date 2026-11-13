
const PROFILE_HEADERS = [
  'username',
  'name',
  'car_brand',
  'car_model',
  'plate',
  'avatar',
  'video',
  'instagram',
  'telegram',
  'tiktok',
  'youtube',
  'active',
  'views',
  'last_viewed',
  'likes',
  'last_liked',
];

const EVENT_HEADERS = [
  'id',
  'title',
  'type',
  'city',
  'address',
  'latitude',
  'longitude',
  'event_date',
  'event_time',
  'description',
  'image',
  'organizer',
  'contact',
  'status',
  'created_at',
];

async function callGoogleAppsScript(payload) {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
  const token = process.env.GOOGLE_APPS_SCRIPT_TOKEN;

  if (!url || !token) {
    throw new Error('Google Apps Script is not configured');
  }

  let response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...payload }),
      cache: 'no-store',
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
  } catch (error) {
    throw new Error(`Could not reach Google Apps Script: ${error.message}`);
  }

  const responseText = await response.text();

  let result;

  try {
    result = JSON.parse(responseText);
  } catch {
    if (
      responseText.includes('accounts.google.com') ||
      responseText.includes('ServiceLogin')
    ) {
      throw new Error(
        'Google Apps Script requires sign-in. Redeploy it as a web app accessible to Anyone.',
      );
    }

    throw new Error(
      `Google Apps Script returned a non-JSON response (HTTP ${response.status}). Check the deployment.`,
    );
  }

  if (!response.ok || !result.ok) {
    throw new Error(
      `Google Apps Script failed${result.code ? ` (${result.code})` : ''}: ${result.error || response.status}`,
    );
  }

  return result;
}

export async function appendProfile(profile) {
  try {
    await callGoogleAppsScript({ profile });
    return true;
  } catch (error) {
    if (error.message?.includes('DUPLICATE_USERNAME')) return false;

    if (error.message?.includes('INVALID_HEADERS')) {
      throw new Error(
        `Google Sheet header row must be: ${PROFILE_HEADERS.join(', ')}`,
      );
    }

    throw error;
  }
}

// Получить опубликованные мероприятия
export async function getEvents() {
  const result = await callGoogleAppsScript({
    action: 'events_list',
  });

  return result.events || [];
}

// Получить все мероприятия для админ-панели
export async function getAdminEvents() {
  const result = await callGoogleAppsScript({
    action: 'events_admin_list',
  });

  return result.events || [];
}

// Создать мероприятие
export async function createEvent(event) {
  return callGoogleAppsScript({
    action: 'event_create',
    event,
  });
}

// Обновить мероприятие
export async function updateEvent(id, event) {
  return callGoogleAppsScript({
    action: 'event_update',
    id,
    event,
  });
}

// Удалить мероприятие
export async function deleteEvent(id) {
  return callGoogleAppsScript({
    action: 'event_delete',
    id,
  });
}
