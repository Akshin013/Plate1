
import Link from 'next/link';

export const metadata = {
  title: 'Страница не найдена | Plate',
  description: 'Запрашиваемая страница не найдена.',
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-container">

        <Link href="/" className="not-found-logo">
          PLATE<span>.ru</span>
        </Link>

        <div className="not-found-content">
          <div className="not-found-label">
            <span />
            МАРШРУТ НЕ НАЙДЕН
          </div>

          <h1>
            4<span>0</span>4
          </h1>

          <h2>Похоже, мы сбились с маршрута.</h2>

          <p>
            Страница, которую вы ищете, не существует,
            была перемещена или больше недоступна.
            Давайте вернёмся на правильный путь.
          </p>

          <Link href="/" className="not-found-button">
            Вернуться на главную
            <span>↗</span>
          </Link>
        </div>

        <div className="not-found-bottom">
          <span>PLATE AUTOMOTIVE COMMUNITY</span>
          <span>DRIVE · MEET · CONNECT</span>
        </div>

      </div>
    </main>
  );
}
