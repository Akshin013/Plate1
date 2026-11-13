
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEvents } from '../../../lib/google-apps-script';

export const dynamic = 'force-dynamic';

function formatDate(date) {
  if (!date) return '';

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const events = await getEvents();
    const event = events.find((item) => item.id === id);

    if (!event) {
      return { title: 'Мероприятие не найдено | Plate' };
    }

    return {
      title: `${event.title} | Plate`,
      description: event.description || 'Автомобильное мероприятие Plate',
    };
  } catch {
    return { title: 'Мероприятие | Plate' };
  }
}

export default async function EventDetailPage({ params }) {
  const { id } = await params;

  let event;

  try {
    const events = await getEvents();
    event = events.find((item) => item.id === id);
  } catch (error) {
    console.error('Event detail error:', error);
    throw error;
  }

  if (!event) notFound();

  const mapUrl = event.latitude && event.longitude
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        `${event.latitude},${event.longitude}`,
      )}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [event.address, event.city].filter(Boolean).join(', '),
      )}`;

  return (
    <main className="event-detail-page">
      <div className="event-detail-container">
        <header className="events-topbar">
          <Link href="/" className="events-brand">
            PLATE<span>.ru</span>
          </Link>

          <Link href="/events" className="events-back">
            ← Все мероприятия
          </Link>
        </header>

        <Link href="/events" className="event-detail-back">
          ← Назад к мероприятиям
        </Link>

        <article className="event-detail">
          <div className="event-detail-hero">
            {event.image ? (
              <img src={event.image} alt={event.title} />
            ) : (
              <div className="event-detail-placeholder">🏎️</div>
            )}

            <span className="event-card-category">
              {event.type || 'Автомобильное мероприятие'}
            </span>
          </div>

          <div className="event-detail-content">
            <span className="events-overline">PLATE COMMUNITY</span>

            <h1>{event.title}</h1>

            <div className="event-detail-info">
              <div>
                <span>◷</span>
                <p>
                  <small>Дата и время</small>
                  <strong>
                    {formatDate(event.event_date)}
                    {event.event_time && ` · ${event.event_time}`}
                  </strong>
                </p>
              </div>

              <div>
                <span>⌖</span>
                <p>
                  <small>Место проведения</small>
                  <strong>
                    {event.city}
                    {event.address && `, ${event.address}`}
                  </strong>
                </p>
              </div>

              {event.organizer && (
                <div>
                  <span>♙</span>
                  <p>
                    <small>Организатор</small>
                    <strong>{event.organizer}</strong>
                  </p>
                </div>
              )}
            </div>

            {event.description && (
              <section className="event-detail-description">
                <h2>О мероприятии</h2>
                <p>{event.description}</p>
              </section>
            )}

            {event.contact && (
              <div className="event-detail-contact">
                <h2>Контакты организатора</h2>
                <p>{event.contact}</p>
              </div>
            )}

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="events-hero-button"
            >
              Открыть на карте <span>↗</span>
            </a>
          </div>
        </article>

        <footer className="events-footer">
          <Link href="/" className="events-brand">
            PLATE<span>.</span>
          </Link>

          <p>DRIVE · MEET · CONNECT</p>

          <span>
            © {new Date().getFullYear()} Plate. Все права защищены.
          </span>
        </footer>
      </div>
    </main>
  );
}
