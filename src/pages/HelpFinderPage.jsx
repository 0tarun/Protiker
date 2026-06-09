import { useEffect, useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { HelpFinderProvider, useHelpFinder } from '../context/HelpFinderContext';
import { MapPin, Search, Compass } from 'lucide-react';
import FilterTabs from '../components/helpFinder/FilterTabs';
import ToggleChips from '../components/helpFinder/ToggleChips';
import AiRecommendationBanner from '../components/helpFinder/AiRecommendationBanner';
import CenterCard from '../components/helpFinder/CenterCard';
import MapView from '../components/helpFinder/MapView';
import '../styles/helpFinder.css';
import { useNavigate } from 'react-router-dom';

function HelpFinderContent() {
  const { state, dispatch } = useHelpFinder();
  const navigate = useNavigate();
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const presetLocations = [
    { latitude: 23.6238, longitude: 90.5000, label: "নারায়ণগঞ্জ, ঢাকা" },
    { latitude: 23.7330, longitude: 90.4172, label: "মতিঝিল, ঢাকা" },
    { latitude: 23.8042, longitude: 90.3673, label: "মিরপুর, ঢাকা" },
    { latitude: 22.3569, longitude: 91.7832, label: "জিইসি মোড়, চট্টগ্রাম" },
    { latitude: 24.8949, longitude: 91.8687, label: "জিন্দাবাজার, সিলেট" },
  ];

  const handleUseLiveLocation = () => {
    if (navigator.geolocation) {
      dispatch({ type: 'SET_LOCATION_STATUS', payload: 'detecting' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const liveLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            label: "আমার অবস্থান (লাইভ)"
          };
          dispatch({ type: 'SET_USER_LOCATION', payload: liveLoc });
          setShowLocationMenu(false);
        },
        (error) => {
          console.error("Geolocation error", error);
          dispatch({ type: 'SET_LOCATION_STATUS', payload: 'denied' });
          alert("আপনার জিপিএস লোকেশন পাওয়া যায়নি। অনুগ্রহ করে পারমিশন চেক করুন।");
        }
      );
    } else {
      alert("আপনার ব্রাউজারে লোকেশন সার্ভিস সাপোর্ট করে না।");
    }
  };

  // Load chat session if exists, could trigger recommendation banner
  const sessionIdStr = localStorage.getItem('protiker_chat_session');

  const LocationPill = () => {
    if (state.locationStatus === 'detecting') {
      return (
        <div style={{ background: '#FAEEDA', color: '#EF9F27', borderRadius: 100, padding: '3px 10px', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500 }}>
          অবস্থান খোঁজা হচ্ছে...
        </div>
      );
    }
    if (state.locationStatus === 'found') {
      return (
        <div style={{ background: '#E1F5EE', color: '#0F6E56', borderRadius: 100, padding: '3px 10px', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500 }}>
          ● অবস্থান পাওয়া গেছে
        </div>
      );
    }
    return (
      <div style={{ background: '#FCEBEB', color: '#E24B4A', borderRadius: 100, padding: '3px 10px', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500 }}>
        অবস্থান অ্যাক্সেস নেই
      </div>
    );
  };

  return (
    <div className="hf-layout">
      <Sidebar activeItem="সহায়তা খুঁজুন" />
      
      <main className="hf-main">
        {/* Left Panel */}
        <div className="hf-left-panel">
          
          <div style={{ padding: '24px 24px 0' }}>
            <h1 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 22, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
              সহায়তা খুঁজুন
            </h1>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, color: '#4A4845', margin: 0 }}>
              আপনার কাছের বিনামূল্যে আইনি সংস্থা খুঁজুন
            </p>

            {/* LOCATION BAR */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'white', border: '1.5px solid rgba(0,0,0,0.10)', borderRadius: 12,
                padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginTop: 16
              }}>
                <MapPin size={18} color="#1D9E75" />
                <div style={{ flex: 1, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, color: '#1C1B1A' }}>
                  {state.userLocation ? state.userLocation.label : 'অবস্থান নির্ধারণ করুন'}
                </div>
                <button 
                  onClick={() => setShowLocationMenu(!showLocationMenu)}
                  style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 600, color: '#1D9E75', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showLocationMenu ? 'বন্ধ করুন' : 'পরিবর্তন করুন'}
                </button>
                <LocationPill />
              </div>

              {showLocationMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                  background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, padding: '8px 0',
                  animation: 'formReveal 200ms ease'
                }}>
                  <button
                    onClick={handleUseLiveLocation}
                    style={{
                      width: 'calc(100% - 28px)', margin: '6px 14px 10px',
                      background: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
                      color: 'white', border: 'none', borderRadius: 8,
                      padding: '10px 14px', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13,
                      fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 8, boxShadow: '0 4px 12px rgba(29,158,117,0.2)'
                    }}
                  >
                    <Compass size={16} className={state.locationStatus === 'detecting' ? 'animate-spin' : ''} />
                    {state.locationStatus === 'detecting' ? 'লাইভ অবস্থান খোঁজা হচ্ছে...' : 'আমার লাইভ অবস্থান নিন (GPS)'}
                  </button>
                  <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />
                  <div style={{ padding: '6px 14px', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#888780', fontWeight: 600 }}>
                    আপনার নতুন অবস্থান নির্বাচন করুন:
                  </div>
                  {presetLocations.map((loc) => (
                    <div
                      key={loc.label}
                      onClick={() => {
                        dispatch({ type: 'SET_USER_LOCATION', payload: loc });
                        setShowLocationMenu(false);
                      }}
                      style={{
                        padding: '10px 16px', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14,
                        color: state.userLocation?.label === loc.label ? '#1D9E75' : '#1C1B1A',
                        background: state.userLocation?.label === loc.label ? '#E1F5EE' : 'transparent',
                        cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: 8
                      }}
                      className="location-menu-item"
                    >
                      <MapPin size={14} color={state.userLocation?.label === loc.label ? '#1D9E75' : '#888780'} />
                      {loc.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* AI BANNER */}
          {sessionIdStr && <AiRecommendationBanner />}

          {/* FILTER ROW */}
          <div style={{ padding: '16px 24px 0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#888780" style={{ position: 'absolute', left: 14, top: 12 }} />
              <input 
                type="text" 
                placeholder="সংস্থার নাম বা এলাকা খুঁজুন..."
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                style={{
                  width: '100%', background: 'white', border: '1.5px solid rgba(0,0,0,0.10)',
                  borderRadius: 12, padding: '10px 14px 10px 40px', fontFamily: "'Hind Siliguri', sans-serif",
                  fontSize: 14, outline: 'none'
                }}
                className="hf-search-input"
              />
            </div>
            
            <FilterTabs />
            <ToggleChips />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780' }}>
              <span>{state.filteredCenters.length}টি সংস্থা পাওয়া গেছে | আপনার অবস্থান থেকে</span>
              <select 
                value={state.sortBy}
                onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#4A4845', outline: 'none' }}
              >
                <option value="distance">দূরত্ব অনুযায়ী ▾</option>
                <option value="rating">রেটিং অনুযায়ী ▾</option>
                <option value="type">ধরন অনুযায়ী ▾</option>
              </select>
            </div>
          </div>

          {/* MAP VIEW */}
          <div style={{ padding: '0 24px', marginTop: 16 }}>
            <MapView height="280px" />
          </div>

          {/* CENTER CARDS LIST */}
          <div style={{ padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {state.filteredCenters.map((center, index) => (
              <div id={`center-card-${center.id}`} key={center.id}>
                <CenterCard 
                  center={center} 
                  index={index}
                  isSelected={state.selectedCenter?.id === center.id}
                  onClick={() => {
                    dispatch({ type: 'SELECT_CENTER', payload: center });
                    if (state.mapRef) {
                      state.mapRef.flyTo([center.latitude, center.longitude], 15, { duration: 0.8 });
                    }
                  }}
                />
              </div>
            ))}
            {state.filteredCenters.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#888780', fontFamily: "'Hind Siliguri', sans-serif" }}>
                কোনো সংস্থা পাওয়া যায়নি।
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HelpFinderPage() {
  return (
    <HelpFinderProvider>
      <HelpFinderContent />
    </HelpFinderProvider>
  );
}
