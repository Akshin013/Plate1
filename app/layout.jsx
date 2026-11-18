
import './globals.css';
import AutoRefresh from '../components/AutoRefresh';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  metadataBase: new URL('https://plateru.vercel.app'),

  title: {
    default: 'Plate — цифровой профиль автомобиля',
    template: '%s | Plate',
  },

  description:
    'Создай цифровой профиль своего автомобиля на Plate. Фотографии, видео, госномер и социальные сети в одном месте.',

  applicationName: 'Plate',

  keywords: [
    'Plate',
    'автомобиль',
    'профиль автомобиля',
    'автомобильный профиль',
    'госномер',
    'автомобили',
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://plateru.vercel.app',
    siteName: 'Plate',
    title: 'Plate — цифровой профиль автомобиля',
    description:
      'Твой автомобиль — твой цифровой профиль. Фотографии, видео и социальные сети в одном месте.',
    images: ['/og-image.jpg'],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Plate — цифровой профиль автомобиля',
    description: 'Создай цифровой профиль своего автомобиля.',
    images: ['/og-image.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AutoRefresh />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
