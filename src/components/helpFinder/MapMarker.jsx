import L from 'leaflet';
import { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import MapPopup from './MapPopup';

export default function MapMarker({ center, isSelected, onClick }) {
  const customIcon = useMemo(() => {
    const map = {
      government_legal_aid: '#1D9E75',
      ngo: '#E24B4A',
      court: '#378ADD',
      police_station: '#EF9F27',
      government_office: '#639922',
      law_chamber: '#7C3AED'
    };
    const bg = map[center.center_type] || '#E24B4A';
    
    // Scale up if selected
    const scale = isSelected ? 'scale(1.3)' : 'scale(1)';
    const pulseClass = isSelected ? 'marker-pulse' : '';

    const html = `
      <div class="custom-marker ${pulseClass}" style="
        background: ${bg};
        transform: ${scale};
      ">
      </div>
    `;

    return L.divIcon({
      className: 'custom-marker-wrapper',
      html,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  }, [center.center_type, isSelected]);

  return (
    <Marker 
      position={[center.latitude, center.longitude]} 
      icon={customIcon}
      eventHandlers={{ click: onClick }}
    >
      <MapPopup center={center} />
    </Marker>
  );
}
