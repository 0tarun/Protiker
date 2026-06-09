import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function AiRecommendationBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div style={{
      marginTop: 16, padding: '14px 16px', margin: '16px 24px 0',
      background: 'linear-gradient(135deg, rgba(29,158,117,0.10), rgba(29,158,117,0.05))',
      border: '1px solid rgba(29,158,117,0.25)', borderRadius: 14,
      display: 'flex', gap: 12, alignItems: 'flex-start',
      animation: 'bannerSlideDown 300ms ease-out'
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', background: '#1D9E75',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Sparkles size={20} color="white" />
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 600, color: '#0F6E56' }}>
          Proti-র পরামর্শ অনুযায়ী সংস্থা
        </div>
        <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#1D9E75', marginTop: 4 }}>
          আপনার সমস্যার জন্য বিশেষজ্ঞ সংস্থাগুলো উপরে দেখানো হচ্ছে।
        </div>
      </div>
      
      <button 
        onClick={() => setVisible(false)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
      >
        <X size={16} color="#888780" />
      </button>
    </div>
  );
}
