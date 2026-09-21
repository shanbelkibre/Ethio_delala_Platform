'use client';

import { useEffect, useRef, useState, useId } from 'react';
import L from 'leaflet';

interface MapPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MapPicker({ value, onChange }: MapPickerProps) {
  const generatedId = useId();
  const containerId = `map-picker-${generatedId.replace(/:/g, '')}`;
  const [coords, setCoords] = useState<[number, number]>(() => {
    if (value) {
      const match = value.match(/query=([-0-9.]+),([-0-9.]+)/);
      if (match) {
        return [parseFloat(match[1]), parseFloat(match[2])];
      }
    }
    return [9.03, 38.74];
  });
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // 1. Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // 2. Initial coordinates
    const [initialLat, initialLng] = coords;

    // 3. Fix icon markers
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // 4. Initialize map synchronously (clears container collision since remove() is synchronous)
    const map = L.map(containerId).setView([initialLat, initialLng], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      setCoords([position.lat, position.lng]);
      onChange(`https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`);
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCoords([lat, lng]);
      onChange(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    });

    return () => {
      document.head.removeChild(link);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wide">
        <span>Click on the map to pin house location</span>
        <span className="text-emerald-600 font-bold font-mono">
          Coords: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
        </span>
      </div>
      <div 
        id={containerId} 
        className="h-80 w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden z-10"
      />
    </div>
  );
}
