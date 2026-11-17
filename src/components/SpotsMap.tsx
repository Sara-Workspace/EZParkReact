import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Destination, SearchResult } from '../types';

interface SpotsMapProps {
  destination: Destination | null;
  spots: SearchResult[];
}

function SpotsMap({ destination, spots }: SpotsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const navigate = useNavigate();

  // אתחול המפה פעם אחת
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const defaultCenter: [number, number] = destination
      ? [destination.latitude, destination.longitude]
      : [32.0853, 34.7818]; // תל אביב כברירת מחדל

    const map = L.map(mapContainerRef.current).setView(defaultCenter, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // עדכון סמנים ומיקום המפה בכל חיפוש חדש
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const boundsPoints: [number, number][] = [];

    // סמן יעד החיפוש
    if (destination && destination.latitude !== 0 && destination.longitude !== 0) {
      const destIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `<div style="background:#dc2626;color:white;font-weight:900;font-size:12px;padding:4px 8px;border-radius:999px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;">📍 היעד שלך</div>`,
        iconSize: [80, 28],
        iconAnchor: [40, 14],
      });

      L.marker([destination.latitude, destination.longitude], { icon: destIcon })
        .addTo(layer)
        .bindPopup(`<div dir="rtl" style="font-family:inherit;"><strong>היעד:</strong> ${destination.address}</div>`);

      boundsPoints.push([destination.latitude, destination.longitude]);
    }

    // סמני החניות הפנויות
    spots.forEach((spot) => {
      if (spot.latitude === 0 || spot.longitude === 0) return;

      const priceLabel = `${spot.effectivePricePerHour} נק׳/שעה`;
      const spotIcon = L.divIcon({
        className: 'custom-spot-pin',
        html: `<div style="background:#0a6cf0;color:white;font-weight:700;font-size:11px;padding:4px 8px;border-radius:10px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;cursor:pointer;">🅿️ ${priceLabel}</div>`,
        iconSize: [96, 28],
        iconAnchor: [48, 14],
      });

      const marker = L.marker([spot.latitude, spot.longitude], { icon: spotIcon }).addTo(layer);

      const popupDiv = document.createElement('div');
      popupDiv.dir = 'rtl';
      popupDiv.style.fontFamily = 'inherit';
      popupDiv.style.minWidth = '160px';
      popupDiv.innerHTML = `
        <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${spot.address}, ${spot.city}</div>
        <div style="font-size:12px;color:#44566e;margin-bottom:4px;">מחיר: <strong>${spot.effectivePricePerHour} נק׳/שעה</strong></div>
        <div style="font-size:11px;color:#5a6b82;margin-bottom:8px;">${spot.evCharger ? '⚡ כולל עמדת טעינה' : 'חניה רגילה'}</div>
      `;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'לפרטי החניה ←';
      btn.style.cssText =
        'width:100%;padding:6px 10px;background:#0a6cf0;color:white;border:none;border-radius:8px;font-weight:700;font-size:12px;cursor:pointer;';
      btn.onclick = () => navigate(`/parking/${spot.spotId}`);
      popupDiv.appendChild(btn);

      marker.bindPopup(popupDiv);
      boundsPoints.push([spot.latitude, spot.longitude]);
    });

    if (boundsPoints.length === 1) {
      map.setView(boundsPoints[0], 16);
    } else if (boundsPoints.length > 1) {
      map.fitBounds(boundsPoints, { padding: [40, 40], maxZoom: 16 });
    }
  }, [destination, spots, navigate]);

  return (
    <div
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #cfdbea',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: '360px', zIndex: 1 }} />
    </div>
  );
}

export default SpotsMap;