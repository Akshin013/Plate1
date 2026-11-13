
'use client';

import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const locationIcon = new L.DivIcon({
  className: 'event-location-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #ff9500;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 5px rgba(255,149,0,.25);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: event.latlng.lat.toFixed(6),
        longitude: event.latlng.lng.toFixed(6),
      });
    },
  });

  return null;
}

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    if (position) {
      map.setView(position, Math.max(map.getZoom(), 13));
    }
  }, [map, position]);

  return null;
}

export default function EventLocationPicker({
  latitude,
  longitude,
  onChange,
}) {
  const hasCoordinates =
    latitude !== '' &&
    longitude !== '' &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude)) &&
    Number(latitude) >= -90 &&
    Number(latitude) <= 90 &&
    Number(longitude) >= -180 &&
    Number(longitude) <= 180;

  const position = hasCoordinates
    ? [Number(latitude), Number(longitude)]
    : null;

  const initialCenter = position || [55.751244, 37.618423];

  return (
    <div className="event-location-picker">
      <div className="event-location-picker-heading">
        <strong>Место проведения</strong>
        <span>Нажми на карту, чтобы выбрать точку</span>
      </div>

      <MapContainer
        center={initialCenter}
        zoom={position ? 13 : 4}
        scrollWheelZoom
        style={{
          width: '100%',
          height: '350px',
          borderRadius: '14px',
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onSelect={onChange} />
        <MapController position={position} />

        {position && (
          <Marker position={position} icon={locationIcon} />
        )}
      </MapContainer>

      <div className="event-location-coordinates">
        <span>
          Широта: <strong>{latitude || 'Не выбрана'}</strong>
        </span>

        <span>
          Долгота: <strong>{longitude || 'Не выбрана'}</strong>
        </span>
      </div>

      {position && (
        <button
          type="button"
          className="event-location-clear"
          onClick={() =>
            onChange({ latitude: '', longitude: '' })
          }
        >
          Сбросить координаты
        </button>
      )}
    </div>
  );
}
