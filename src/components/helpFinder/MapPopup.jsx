import { Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

export default function MapPopup({ center }) {
  const navigate = useNavigate();
  
  const typeMap = {
    government_legal_aid: '#1D9E75',
    ngo: '#E24B4A',
    court: '#378ADD',
    police_station: '#EF9F27',
    government_office: '#639922',
    law_chamber: '#7C3AED'
  };
  const bg = typeMap[center.center_type] || '#E24B4A';
  const typeName = center.center_type.replace('_', ' ').toUpperCase();

  const primaryContact = center.contacts?.find(c => c.is_primary) || center.contacts?.[0];

  return (
    <Popup className="custom-popup" closeButton={false} autoPan={true}>
      <div style={{ height: 4, background: bg }} />
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 600, color: '#1C1B1A' }}>
          {center.name_bn}
        </div>
        <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#888780', marginTop: 2 }}>
          {typeName}
        </div>
        {center.distanceKm && (
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#1D9E75', marginTop: 6, fontWeight: 500 }}>
            {center.distanceKm.toLocaleString('bn-BD')} কিমি দূরে
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
          <div style={{ color: '#EF9F27', fontSize: 14 }}>
            {'★'.repeat(Math.round(center.avg_safety_rating || 0))}{'☆'.repeat(5 - Math.round(center.avg_safety_rating || 0))}
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, marginLeft: 4 }}>
            {center.avg_safety_rating}
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780', marginLeft: 4 }}>
            ({center.total_ratings})
          </span>
        </div>
      </div>
      
      <div style={{ padding: '10px 16px 14px', display: 'flex', gap: 8 }}>
        {primaryContact && (primaryContact.type === 'phone' || primaryContact.type === 'toll_free') ? (
          <a
            href={`tel:${primaryContact.value}`}
            style={{
              background: '#1D9E75', color: 'white', borderRadius: 8, padding: 7, flex: 1,
              fontFamily: "'Inter', sans-serif", fontSize: 12, textAlign: 'center',
              textDecoration: 'none', border: 'none', display: 'block'
            }}
          >
            কল করুন
          </a>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/help-finder/${center.id}`);
          }}
          style={{
            background: 'white', color: '#1C1B1A', border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: 8, padding: 7, flex: 1, fontFamily: "'Inter', sans-serif",
            fontSize: 12, cursor: 'pointer'
          }}
        >
          বিস্তারিত দেখুন
        </button>
      </div>
    </Popup>
  );
}
