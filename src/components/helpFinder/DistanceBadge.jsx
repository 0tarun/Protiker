import { MapPin } from 'lucide-react';

export default function DistanceBadge({ distanceKm }) {
  if (distanceKm === undefined || distanceKm === null) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <MapPin size={12} color="#1D9E75" />
      <span style={{ 
        fontFamily: "'Inter', sans-serif", fontSize: 12, 
        color: '#1D9E75', fontWeight: 500 
      }}>
        {distanceKm.toLocaleString('bn-BD')} কিমি দূরে
      </span>
    </div>
  );
}
