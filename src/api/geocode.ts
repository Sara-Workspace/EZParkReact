import type { Destination } from '../types';

interface NominatimItem {
  lat: string;
  lon: string;
}

// מחזירה null אם הכתובת לא נמצאה
export async function geocodeAddress(address: string): Promise<Destination | null> {
  const url =
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=il&q=' +
    encodeURIComponent(address);

  const response = await fetch(url, { headers: { 'Accept-Language': 'he' } });
  if (!response.ok) {
    throw new Error('Geocoding failed');
  }

  const data = (await response.json()) as NominatimItem[];
  if (data.length === 0) return null;

  return {
    address,
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
  };
}