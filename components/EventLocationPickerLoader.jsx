
'use client';

import dynamic from 'next/dynamic';

const EventLocationPicker = dynamic(
  () => import('./EventLocationPicker'),
  {
    ssr: false,
    loading: () => (
      <div className="event-location-loading">
        Загрузка карты...
      </div>
    ),
  },
);

export default function EventLocationPickerLoader(props) {
  return <EventLocationPicker {...props} />;
}
