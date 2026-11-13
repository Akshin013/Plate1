
import { getEvents } from '../../lib/google-apps-script';
import EventsMap from '../../components/EventsMap';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Автомобильные мероприятия | Plate',
  description:
    'Автомобильные встречи, выставки, дрифт-заезды и другие события автомобильного сообщества.',
};

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

export default async function EventsPage() {
  let events = [];
  let error = null;

  try {
    events = await getEvents();
  } catch (err) {
    console.error('Events page error:', err);
    error = 'Не удалось загрузить мероприятия.';
  }

  return (
    <main className="events-page">
      <div className="events-container">
        <header className="events-topbar">
          <a href="/" className="events-brand">
            PLATE<span>.ru</span>
          </a>

          <a href="/" className="events-back">
            ← Главная
          </a>
        </header>

        <section className="events-hero">
          <div className="events-hero-content">
            <span className="events-label">
              <span className="events-label-dot" />
              PLATE АВТОСООБЩЕСТВО
            </span>

            <h1>
              Мир
              <br />
              <span>Автомобилей</span>
            </h1>

            <p>
              Открывай автомобильные встречи, выставки, дрифт-заезды
              и другие интересные события. Встречайся с единомышленниками
              и будь частью автомобильного сообщества!
            </p>

            <a href="#events-list" className="events-hero-button">
              Смотреть мероприятия
              <span>↗</span>
            </a>
          </div>

          <div className="events-hero-decoration">
            <span>01</span>
            <div />
            <small>РОССИЯ / 2026</small>
          </div>
        </section>

        {error && <p className="events-error">{error}</p>}

        <section className="events-section">
          <div className="events-heading">
            <div>
              <span className="events-overline">ОТКРОЙ</span>
              <h2>Карта мероприятий</h2>
              <p>Автомобильные события на одной карте</p>
            </div>

            <div className="events-count">
              <strong>{events.length}</strong>
              <span>мероприятий</span>
            </div>
          </div>

          <div className="events-map-wrapper">
            <EventsMap events={events} />
            <div className="events-map-caption">
              <span className="events-map-dot" />
              Найди мероприятие на карте
            </div>
          </div>
        </section>

        <section className="events-section" id="events-list">
          <div className="events-heading">
            <div>
              <span className="events-overline">PLATE COMMUNITY</span>
              <h2>Предстоящие мероприятия</h2>
              <p>Не пропускай интересные автомобильные события</p>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="events-empty">
              <span className="events-empty-icon">🏁</span>
              <h3>Пока нет мероприятий</h3>
              <p>
                Здесь появятся новые автомобильные встречи,
                выставки и другие события.
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <Link
                  href={`/events/${event.id}`}
                  className="event-card"
                  key={event.id}
                >
                  <div className="event-card-image">
                    {event.image ? (
                      <img src={event.image} alt={event.title} />
                    ) : (
                      <div className="event-card-placeholder">🏎️</div>
                    )}

                    <span className="event-card-category">
                      {event.type || 'Автомобильное мероприятие'}
                    </span>
                  </div>

                  <div className="event-card-content">
                    <div className="event-card-date">
                      <span>◷</span>
                      {formatDate(event.event_date)}
                      {event.event_time && ` · ${event.event_time}`}
                    </div>

                    <h3>{event.title}</h3>

                    <div className="event-card-location">
                      <span>⌖</span>
                      {event.city}
                      {event.address ? ` · ${event.address}` : ''}
                    </div>

                    {event.description && (
                      <p className="event-card-description">
                        {event.description}
                      </p>
                    )}

                    {event.organizer && (
                      <div className="event-card-organizer">
                        Организатор: {event.organizer}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <footer className="events-footer">
          <a href="/" className="events-brand">
            PLATE<span>.</span>
          </a>

          <p>DRIVE · MEET · CONNECT</p>

          <span>
            © {new Date().getFullYear()} Plate. Все права защищены.
          </span>
        </footer>
      </div>
    </main>
  );
}
