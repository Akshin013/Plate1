
'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';

import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const eventIcon = new L.DivIcon({
  className: 'event-map-marker',
  html: `
    <div style="
      width: 18px;
      height: 18px;
      background: #ff9500;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 0 5px rgba(255,149,0,0.25);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -12],
});

function MapSizeFix() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

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

export default function EventsMap({ events = [] }) {
  const validEvents = events.filter((event) => {
    const lat = Number(event.latitude);
    const lng = Number(event.longitude);

    return (
      event.latitude !== '' &&
      event.longitude !== '' &&
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  });

  return (
    <MapContainer
      center={[55.751244, 37.618423]}
      zoom={4}
      scrollWheelZoom={false}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        borderRadius: '18px',
      }}
    >
      <MapSizeFix />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validEvents.map((event) => (
        <Marker
          key={event.id}
          position={[
            Number(event.latitude),
            Number(event.longitude),
          ]}
          icon={eventIcon}
        >
          <Popup>
            <div style={{ minWidth: '150px' }}>
              <strong>{event.title}</strong>

              <p style={{ margin: '6px 0' }}>
                {event.city}
              </p>

              <small>
                {formatDate(event.event_date)}
                {event.event_time && ` · ${event.event_time}`}
              </small>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
