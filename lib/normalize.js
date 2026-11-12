
// Нормализация российских автомобильных номеров
export const normalizePlate = (s) =>
  (s || '')
    .toUpperCase()
    .replace(/[^АВЕКМНОРСТУХA-Z0-9]/g, '');
