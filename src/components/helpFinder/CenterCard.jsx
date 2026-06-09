import { useHelpFinder } from '../../context/HelpFinderContext';
import { MapPin, Building, BadgeCheck, Users, Accessibility, Gift } from 'lucide-react';
import CenterTypeIcon from './CenterTypeIcon';
import OpenClosedBadge from './OpenClosedBadge';
import ContactButton from './ContactButton';
import DistanceBadge from './DistanceBadge';
import { useNavigate } from 'react-router-dom';

export default function CenterCard({ center, index, isSelected, onClick }) {
  const { state } = useHelpFinder();
  const navigate = useNavigate();
  const primaryContact = center.contacts?.find(c => c.is_primary) || center.contacts?.[0];
  const whatsappContact = center.contacts?.find(c => c.type === 'whatsapp');

  const handleNavigate = (e) => {
    e.stopPropagation();
    window.open(`https://maps.google.com/?q=${center.latitude},${center.longitude}`, '_blank');
  };

  return (
    <div 
      onClick={onClick}
      style={{
        background: 'white',
        border: `1px solid ${isSelected ? '#1D9E75' : 'rgba(0,0,0,0.07)'}`,
        borderRadius: 16,
        padding: 16,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        position: 'relative',
        boxShadow: isSelected ? '0 0 0 3px rgba(29,158,117,0.10)' : 'none',
        animation: `cardSlideIn 250ms ease-out ${index * 60}ms backwards`
      }}
      className="center-card-hover"
    >
      {center.isRecommended && (
        <div style={{
          position: 'absolute', top: -1, left: 16,
          background: 'linear-gradient(135deg,#1D9E75,#0F6E56)',
          color: 'white', borderRadius: '0 0 8px 8px',
          padding: '3px 10px', fontFamily: "'Inter', sans-serif",
          fontSize: 10, fontWeight: 600
        }}>
          ✦ Proti পরামর্শ
        </div>
      )}

      {/* TOP ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: center.isRecommended ? 12 : 0 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <CenterTypeIcon type={center.center_type} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 600, color: '#1C1B1A' }}>
                {center.name_bn}
              </span>
              {center.short_name && (
                <span style={{
                  background: '#F4F6F8', borderRadius: 4, padding: '1px 6px',
                  fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#888780', marginLeft: 6
                }}>
                  {center.short_name}
                </span>
              )}
            </div>
            <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#888780', marginTop: 2 }}>
              {center.center_type.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>
        <OpenClosedBadge hours={center.hours} />
      </div>

      {/* DISTANCE + LOCATION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
        {center.distanceKm && <DistanceBadge distanceKm={center.distanceKm} />}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Building size={12} color="#888780" />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780' }}>
            {center.district}, {center.division}
          </span>
        </div>

        {center.verified === 'verified' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <BadgeCheck size={12} color="#378ADD" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#378ADD' }}>
              যাচাইকৃত
            </span>
          </div>
        )}
      </div>

      {/* SPECIALIZATIONS */}
      {center.specializations && center.specializations.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {center.specializations.filter(s => s.level === 'primary').slice(0, 3).map((s, i) => (
            <div key={i} style={{
              background: '#E1F5EE', color: '#0F6E56', borderRadius: 100,
              padding: '2px 10px', fontFamily: "'Hind Siliguri', sans-serif",
              fontSize: 11, fontWeight: 500
            }}>
              {s.category}
            </div>
          ))}
          {center.specializations.filter(s => s.level === 'primary').length > 3 && (
            <div style={{
              background: '#F4F6F8', color: '#888780', borderRadius: 100,
              padding: '2px 10px', fontFamily: "'Hind Siliguri', sans-serif",
              fontSize: 11, fontWeight: 500
            }}>
              +{center.specializations.filter(s => s.level === 'primary').length - 3} আরও
            </div>
          )}
        </div>
      )}

      {/* RATING ROW */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', color: '#EF9F27', fontSize: 14 }}>
            {'★'.repeat(Math.round(center.avg_safety_rating || 0))}{'☆'.repeat(5 - Math.round(center.avg_safety_rating || 0))}
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#1C1B1A', marginLeft: 6 }}>
            {center.avg_safety_rating}
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780', marginLeft: 4 }}>
            ({center.total_ratings}টি রেটিং)
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {center.has_women_desk && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FCEBEB', borderRadius: 100, padding: '2px 7px' }}>
              <Users size={12} color="#E24B4A" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#A32D2D' }}>মহিলা ডেস্ক</span>
            </div>
          )}
          {center.has_wheelchair_access && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E6F1FB', borderRadius: 100, padding: '2px 7px' }}>
              <Accessibility size={12} color="#378ADD" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#185FA5' }}>হুইলচেয়ার</span>
            </div>
          )}
          {center.is_free && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E1F5EE', borderRadius: 100, padding: '2px 7px' }}>
              <Gift size={12} color="#1D9E75" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#0F6E56' }}>বিনামূল্যে</span>
            </div>
          )}
        </div>
      </div>

      {/* CONTACT QUICK BUTTONS */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
        <ContactButton contact={primaryContact} />
        <ContactButton contact={whatsappContact} />
        
        <button 
          onClick={handleNavigate}
          className="map-nav-btn"
          style={{
            background: 'white', border: '1px solid rgba(0,0,0,0.10)',
            borderRadius: 10, padding: '8px 12px', width: 40, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <MapPin size={15} color="#4A4845" className="nav-icon" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/help-finder/${center.id}`);
          }}
          style={{
            background: '#E1F5EE', color: '#0F6E56', border: 'none',
            borderRadius: 10, padding: '8px 16px', fontFamily: "'Hind Siliguri', sans-serif",
            fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: 4, marginLeft: 'auto', height: 36
          }}
        >
          বিস্তারিত দেখুন
        </button>
      </div>
    </div>
  );
}
