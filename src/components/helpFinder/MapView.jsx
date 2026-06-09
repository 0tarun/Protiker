import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useHelpFinder } from '../../context/HelpFinderContext';
import MapMarker from './MapMarker';
import { Crosshair, Plus, Minus, Maximize } from 'lucide-react';

// To assign map reference to context
function MapController() {
  const map = useMap();
  const { state, dispatch } = useHelpFinder();
  
  useEffect(() => {
    dispatch({ type: 'SET_MAP_REF', payload: map });
  }, [map, dispatch]);

  useEffect(() => {
    if (state.userLocation && map) {
      map.flyTo([state.userLocation.latitude, state.userLocation.longitude], 12, { duration: 0.8 });
    }
  }, [state.userLocation, map]);
  
  return null;
}

export default function MapView({ height = '100vh' }) {
  const { state, dispatch } = useHelpFinder();
  const mapCenter = [23.7272, 90.4093]; // Default Narayanganj/Dhaka area
  const zoom = 12;

  const handleMarkerClick = (center) => {
    dispatch({ type: 'SELECT_CENTER', payload: center });
    if (state.mapRef) {
      state.mapRef.flyTo([center.latitude, center.longitude], 15, { duration: 0.8 });
    }
    
    // Scroll corresponding card into view
    const cardEl = document.getElementById(`center-card-${center.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleZoomIn = () => state.mapRef?.zoomIn();
  const handleZoomOut = () => state.mapRef?.zoomOut();
  const handleMyLocation = () => {
    if (state.userLocation && state.mapRef) {
      state.mapRef.flyTo([state.userLocation.latitude, state.userLocation.longitude], 14, { duration: 0.8 });
    }
  };
  const handleFullScreen = () => {
    const el = document.getElementById('map-container');
    if (el?.requestFullscreen) el.requestFullscreen();
  };

  const userIcon = L.divIcon({
    className: 'user-marker-wrapper',
    html: `<div class="user-location-dot"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  return (
    <div id="map-container" style={{ height: height, width: '100%', position: 'relative', zIndex: 1, borderRadius: height !== '100vh' ? '12px' : '0', overflow: 'hidden' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <MapController />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {state.userLocation && (
          <Marker 
            position={[state.userLocation.latitude, state.userLocation.longitude]} 
            icon={userIcon} 
          />
        )}

        {state.filteredCenters.map(center => (
          <MapMarker 
            key={center.id} 
            center={center} 
            isSelected={state.selectedCenter?.id === center.id}
            onClick={() => handleMarkerClick(center)}
          />
        ))}

        {state.selectedCenter && state.userLocation && (
          <Polyline 
            positions={[
              [state.userLocation.latitude, state.userLocation.longitude],
              [state.selectedCenter.latitude, state.selectedCenter.longitude]
            ]}
            pathOptions={{ color: '#1D9E75', weight: 2, dashArray: '6 8', opacity: 0.6 }}
          />
        )}
      </MapContainer>

      {/* Custom Map Controls */}
      <div style={{
        position: 'absolute', top: height !== '100vh' ? 8 : 16, right: height !== '100vh' ? 8 : 16, zIndex: 999,
        background: 'white', borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column'
      }}>
        <button onClick={handleZoomIn} className="map-control-btn">
          <Plus size={18} color="#1C1B1A" />
        </button>
        <button onClick={handleZoomOut} className="map-control-btn">
          <Minus size={18} color="#1C1B1A" />
        </button>
        <button onClick={handleMyLocation} className="map-control-btn">
          <Crosshair size={18} color="#1D9E75" />
        </button>
        <button onClick={handleFullScreen} className="map-control-btn" style={{ borderBottom: 'none' }}>
          <Maximize size={16} color="#4A4845" />
        </button>
      </div>
    </div>
  );
}
