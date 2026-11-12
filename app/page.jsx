
import Search from '../components/Search';
import { getProfiles } from '../lib/profiles';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const all = await getProfiles();

  const list = all.map((p) => ({
    username: p.username,
    name: p.name,
    car: p.car,
    plate: p.plate,
  }));

  return (
    <>
      <div className="amb" />

      <main className="home plate-home">
        <header className="plate-header">
          <a href="/" className="plate-brand">
            <span className="plate-brand-icon">P</span>
            <span>plate<span className="plate-dot">.ru</span></span>
          </a>

          <span className="plate-header-label">
            ЦИФРОВОЙ ПРОФИЛЬ АВТОМОБИЛЯ
          </span>
        </header>

        <section className="plate-hero">
          <div className="plate-badge">
            <span className="plate-badge-dot" />
            ТВОЙ АВТОМОБИЛЬ. ТВОЙ ПРОФИЛЬ.
          </div>

          <h1 className="plate-title">
            Твой автомобиль.
            <br />
            <span>Твоя индивидуальность.</span>
          </h1>

          <p className="plate-description">
            Создай персональный цифровой профиль своего автомобиля.
            Делись им с помощью QR-кода в пару касаний.
          </p>

          <div className="plate-search">
            <Search profiles={list} />
          </div>

          <div className="plate-hint">
            Найди автомобиль по имени, модели или госномеру
          </div>
        </section>

        <footer className="plate-footer">
          <span>plate.ru © 2026</span>
          <span>СДЕЛАНО ДЛЯ АВТОЛЮБИТЕЛЕЙ</span>
        </footer>
      </main>
    </>
  );
}
