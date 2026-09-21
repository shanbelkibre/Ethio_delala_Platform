'use client';

import { useEffect, useRef, useId } from 'react';
import L from 'leaflet';

interface MapViewProps {
  value: string;
}

export default function MapView({ value }: MapViewProps) {
  const generatedId = useId();
  const containerId = `map-view-${generatedId.replace(/:/g, '')}`;
  const mapRef = useRef<L.Map | null>(null);

  const match = value?.match(/query=([-0-9.]+),([-0-9.]+)/);
  const lat = match ? parseFloat(match[1]) : null;
  const lng = match ? parseFloat(match[2]) : null;

  useEffect(() => {
    if (lat === null || lng === null) {
      return;
    }

    // 1. Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // 2. Fix icon markers
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // 3. Initialize map synchronously
    const map = L.map(containerId).setView([lat, lng], 15);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lng]).addTo(map);

    return () => {
      document.head.removeChild(link);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, containerId]);

  if (lat === null || lng === null) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Interactive Map Location</h3>
      <div 
        id={containerId} 
        className="h-80 w-full rounded-2xl border border-slate-250 dark:border-slate-800 shadow-sm overflow-hidden z-10"
      />
    </div>
  );
}
