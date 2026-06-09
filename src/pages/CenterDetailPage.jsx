import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, MessageCircle, Mail, Globe, Users, Gift, Accessibility } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import Sidebar from '../components/dashboard/Sidebar';
import { mockCenters } from '../data/mockCenters';
import CenterTypeIcon from '../components/helpFinder/CenterTypeIcon';
import WeeklySchedule from '../components/helpFinder/WeeklySchedule';
import CaseHandoffCard from '../components/helpFinder/CaseHandoffCard';
import SafetyRatingBar from '../components/helpFinder/SafetyRatingBar';
import RatingForm from '../components/helpFinder/RatingForm';
import { isOpenNow } from '../utils/helpFinderUtils';
import '../styles/helpFinder.css';

export default function CenterDetailPage() {
  const { centerId } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);

  useEffect(() => {
    // In real app, fetch from API. Here we use mock data.
    const found = mockCenters.find(c => c.id === parseInt(centerId, 10));
    if (found) {
      setCenter(found);
    } else {
      navigate('/help-finder');
    }
  }, [centerId, navigate]);

  const customIcon = useMemo(() => {
    if (!center) return null;
    const typeMap = {
      government_legal_aid: '#1D9E75',
      ngo: '#E24B4A',
      court: '#378ADD',
      police_station: '#EF9F27',
      government_office: '#639922',
      law_chamber: '#7C3AED'
    };
    const bg = typeMap[center.center_type] || '#E24B4A';
    
    return L.divIcon({
      className: 'custom-marker-wrapper',
      html: `<div class="custom-marker" style="background: ${bg}; transform: scale(1.3);"></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  }, [center]);

  if (!center) return null;

  const open = isOpenNow(center.hours);

  return (
    <div className="hf-layout">
      <Sidebar activeItem="সহায়তা খুঁজুন" />
      
      <main className="hf-detail-main" style={{ marginLeft: 260, minWidth: 1024 }}>
        {/* Back Button Row */}
        <div style={{ padding: '24px 40px 0' }}>
          <button 
            onClick={() => navigate('/help-finder')}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#4A4845', padding: 0 
            }}
          >
            <ChevronLeft size={16} /> সহায়তা খুঁজুনে ফিরুন
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28, padding: '24px 40px' }}>
          
          {/* LEFT COLUMN */}
          <div>
            {/* HERO CARD */}
            <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              
              {/* Top color banner */}
              <div style={{ 
                height: 80, position: 'relative', overflow: 'hidden',
                background: center.center_type === 'government_legal_aid' ? 'linear-gradient(135deg,#1D9E75,#0F6E56)' :
                            center.center_type === 'ngo' ? 'linear-gradient(135deg,#E24B4A,#991B1B)' :
                            center.center_type === 'court' ? 'linear-gradient(135deg,#378ADD,#1E40AF)' :
                            center.center_type === 'police_station' ? 'linear-gradient(135deg,#EF9F27,#B45309)' :
                            center.center_type === 'government_office' ? 'linear-gradient(135deg,#639922,#3F6212)' :
                            'linear-gradient(135deg,#7C3AED,#5B21B6)'
              }}>
                <div style={{
                  position: 'absolute', top: -20, right: -20, width: 100, height: 100,
                  background: 'rgba(255,255,255,0.10)', borderRadius: '50%'
                }} />
              </div>

              {/* Content */}
              <div style={{ padding: '20px 24px 24px' }}>
                {/* Icon */}
                <div style={{ 
                  width: 52, height: 52, borderRadius: '50%', background: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)', border: '3px solid white',
                  position: 'relative', marginTop: -46, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <CenterTypeIcon type={center.center_type} size={22} />
                </div>

                <h1 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 20, fontWeight: 600, color: '#1C1B1A', marginTop: 12, marginBottom: 4 }}>
                  {center.name_bn}
                </h1>
                
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {center.short_name && (
                    <span style={{ background: '#F4F6F8', borderRadius: 4, padding: '1px 6px', fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#888780' }}>
                      {center.short_name}
                    </span>
                  )}
                  {center.verified === 'verified' && (
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#378ADD', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#378ADD' }}>✔</span> যাচাইকৃত
                    </span>
                  )}
                </div>

                <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, color: '#4A4845', lineHeight: 1.7, marginTop: 12 }}>
                  {center.description_bn}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {center.specializations?.map((s, i) => (
                    <span key={i} style={{
                      background: s.level === 'primary' ? '#E1F5EE' : '#F4F6F8',
                      color: s.level === 'primary' ? '#0F6E56' : '#888780',
                      borderRadius: 100, padding: '2px 10px', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 500
                    }}>
                      {s.category}
                    </span>
                  ))}
                </div>

                {/* FEATURE BADGES */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {center.is_free && (
                    <div style={{ background: '#E1F5EE', color: '#0F6E56', padding: '6px 14px', borderRadius: 8, display: 'flex', gap: 6, alignItems: 'center', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, fontWeight: 500 }}>
                      <Gift size={14} /> বিনামূল্যে সেবা
                    </div>
                  )}
                  {center.has_women_desk && (
                    <div style={{ background: '#FCEBEB', color: '#A32D2D', padding: '6px 14px', borderRadius: 8, display: 'flex', gap: 6, alignItems: 'center', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, fontWeight: 500 }}>
                      <Users size={14} /> মহিলা ডেস্ক আছে
                    </div>
                  )}
                  {center.has_wheelchair_access && (
                    <div style={{ background: '#E6F1FB', color: '#185FA5', padding: '6px 14px', borderRadius: 8, display: 'flex', gap: 6, alignItems: 'center', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, fontWeight: 500 }}>
                      <Accessibility size={14} /> হুইলচেয়ার সুবিধা
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CONTACT SECTION */}
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, fontWeight: 600, color: '#1C1B1A', marginBottom: 12 }}>
                যোগাযোগ করুন
              </h2>
              {center.contacts?.map((contact, idx) => {
                const map = {
                  phone: { icon: Phone, bg: '#E1F5EE', color: '#1D9E75', btnText: 'কল করুন', btnBg: '#1D9E75', href: `tel:${contact.value}` },
                  toll_free: { icon: Phone, bg: '#E1F5EE', color: '#1D9E75', btnText: 'কল করুন', btnBg: '#1D9E75', href: `tel:${contact.value}` },
                  whatsapp: { icon: MessageCircle, bg: '#E1F5EE', color: '#25D366', btnText: 'চ্যাট করুন', btnBg: '#25D366', href: `https://wa.me/${contact.value}` },
                  email: { icon: Mail, bg: '#E6F1FB', color: '#378ADD', btnText: 'ইমেইল করুন', btnBg: '#378ADD', href: `mailto:${contact.value}` },
                  website: { icon: Globe, bg: '#FAEEDA', color: '#EF9F27', btnText: 'ওয়েবসাইট', btnBg: '#EF9F27', href: contact.value },
                  facebook: { icon: Users, bg: '#E6F1FB', color: '#378ADD', btnText: 'ফেসবুক', btnBg: '#378ADD', href: contact.value }
                };
                const cfg = map[contact.type] || map.phone;
                const Icon = cfg.icon;

                return (
                  <div key={idx} style={{
                    background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12,
                    padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780' }}>
                        {contact.label_bn}
                      </div>
                      <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, color: '#1C1B1A' }}>
                        {contact.value}
                      </div>
                    </div>
                    <a href={cfg.href} target="_blank" rel="noopener noreferrer" style={{
                      background: cfg.btnBg, color: 'white', borderRadius: 100, padding: '6px 16px',
                      fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, textDecoration: 'none'
                    }}>
                      {cfg.btnText}
                    </a>
                  </div>
                );
              })}
            </div>

            {/* HOURS SECTION */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
                  অফিস সময়সূচী
                </h2>
                <div style={{ 
                  background: open ? '#E1F5EE' : '#F4F6F8', color: open ? '#0F6E56' : '#888780',
                  borderRadius: 100, padding: '3px 10px', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600 
                }}>
                  {open ? '● খোলা আছে' : 'বন্ধ'}
                </div>
              </div>
              <WeeklySchedule hours={center.hours} />
            </div>

            {/* CASE HANDOFF */}
            <CaseHandoffCard center={center} />

          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* MINI MAP CARD */}
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ height: 240, width: '100%' }}>
                <MapContainer 
                  center={[center.latitude, center.longitude]} 
                  zoom={14} 
                  zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                  <Marker position={[center.latitude, center.longitude]} icon={customIcon} />
                </MapContainer>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <MapPin size={14} color="#1D9E75" />
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#1C1B1A' }}>
                    {center.address_bn}
                  </span>
                </div>
                <a 
                  href={`https://maps.google.com/?q=${center.latitude},${center.longitude}`} 
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#378ADD', textDecoration: 'none' }}
                >
                  Google Maps-এ দেখুন →
                </a>
              </div>
            </div>

            {/* SAFETY RATINGS CARD */}
            <div style={{ background: 'white', borderRadius: 16, padding: 20, marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
                  নাগরিক রেটিং
                </h2>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780' }}>
                  মোট {center.total_ratings}টি রেটিং
                </span>
              </div>

              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 700, color: '#1C1B1A' }}>
                    {center.avg_safety_rating}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, color: '#888780' }}>
                    /৫
                  </span>
                </div>
                <div style={{ color: '#EF9F27', fontSize: 22 }}>
                  {'★'.repeat(Math.round(center.avg_safety_rating || 0))}{'☆'.repeat(5 - Math.round(center.avg_safety_rating || 0))}
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <SafetyRatingBar label="কর্মীদের আচরণ" score={center.ratings?.staff_friendliness || 0} />
                <SafetyRatingBar label="অপেক্ষার সময়" score={center.ratings?.wait_time || 0} />
                <SafetyRatingBar label="প্রক্রিয়ার সহজতা" score={center.ratings?.ease_of_process || 0} />
                <SafetyRatingBar label="নিরাপত্তা বোধ" score={center.ratings?.felt_safe || 0} />
              </div>

              <RatingForm centerId={center.id} />
            </div>

            {/* RECENT REVIEWS */}
            {center.recentReviews && center.recentReviews.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600, color: '#1C1B1A', marginBottom: 12 }}>
                  সাম্প্রতিক মন্তব্য
                </h3>
                {center.recentReviews.map((review, idx) => (
                  <div key={idx} style={{ background: '#F8F9FA', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ color: '#EF9F27', fontSize: 14 }}>
                        {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#888780' }}>
                        {review.date}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#1C1B1A', lineHeight: 1.6 }}>
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
