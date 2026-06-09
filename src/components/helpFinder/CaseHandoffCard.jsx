import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CaseHandoffCard({ center }) {
  const navigate = useNavigate();
  const sessionIdStr = localStorage.getItem('protiker_chat_session');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleSend = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }, 1500);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(29,158,117,0.06), rgba(29,158,117,0.02))',
      border: '1px solid rgba(29,158,117,0.20)', borderRadius: 14, padding: 20, marginTop: 20
    }}>
      <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600, color: '#0F6E56' }}>
        আপনার কেস সারসংক্ষেপ পাঠান
      </div>
      <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#1D9E75', marginTop: 8 }}>
        Proti আপনার চ্যাট থেকে একটি সংক্ষিপ্ত সারসংক্ষেপ তৈরি করবে যা এই সংস্থাকে পাঠানো যাবে। তাহলে আপনাকে আর সব কিছু নতুন করে বলতে হবে না।
      </div>

      {!sessionIdStr ? (
        <div style={{ marginTop: 16 }}>
          <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#888780', marginRight: 8 }}>
            আগে Proti-র সাথে কথা বলুন
          </span>
          <button 
            onClick={() => navigate('/chat')}
            style={{ 
              background: 'none', border: 'none', color: '#1D9E75', 
              fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500,
              cursor: 'pointer', padding: 0 
            }}
          >
            চ্যাটে যান →
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{ background: 'white', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span style={{ background: '#FCEBEB', color: '#A32D2D', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontFamily: "'Hind Siliguri', sans-serif" }}>জরুরি</span>
              <span style={{ background: '#E1F5EE', color: '#0F6E56', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontFamily: "'Hind Siliguri', sans-serif" }}>শ্রম অধিকার</span>
            </div>
            <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#4A4845', lineHeight: 1.5 }}>
              ৩ মাস ধরে বেতন দেওয়া হচ্ছে না এবং বিনা নোটিশে চাকরি থেকে বরখাস্ত করা হয়েছে...
            </div>
            <button style={{ 
              background: 'none', border: 'none', color: '#1D9E75', fontSize: 12,
              fontFamily: "'Hind Siliguri', sans-serif", padding: 0, marginTop: 8, cursor: 'pointer' 
            }}>
              সম্পূর্ণ সারসংক্ষেপ দেখুন
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={status !== 'idle'}
            style={{
              width: '100%', height: 44, background: status === 'success' ? '#1D9E75' : 'linear-gradient(to right, #1D9E75, #15805E)',
              color: 'white', borderRadius: 10, border: 'none', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600,
              cursor: status === 'idle' ? 'pointer' : 'default', transition: 'all 0.2s',
              animation: status === 'success' ? 'summarySuccess 300ms ease' : 'none'
            }}
          >
            {status === 'idle' && 'সারসংক্ষেপ পাঠান'}
            {status === 'loading' && 'পাঠানো হচ্ছে...'}
            {status === 'success' && 'পাঠানো হয়েছে ✓'}
          </button>
        </div>
      )}
    </div>
  );
}
