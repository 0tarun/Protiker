import { useState } from 'react';
import StarRating from './StarRating';
import { LockKeyhole, CheckCircle } from 'lucide-react';

export default function RatingForm({ centerId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setRating(0);
        setComment('');
        setDate('');
      }, 3000);
    }, 1500);
  };

  return (
    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, fontWeight: 600, color: '#1C1B1A', marginBottom: 16 }}>
        রেটিং দিন
      </div>
      
      <form onSubmit={handleSubmit}>
        <StarRating rating={rating} setRating={setRating} />
        
        {rating > 0 && (
          <div style={{ animation: 'formReveal 300ms ease-out', marginTop: 16 }}>
            <textarea
              placeholder="আপনার অভিজ্ঞতা লিখুন (ঐচ্ছিক)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%', minHeight: 80, padding: 12, borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.1)', fontFamily: "'Hind Siliguri', sans-serif",
                fontSize: 14, resize: 'vertical', marginBottom: 12, outline: 'none'
              }}
            />
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#4A4845', marginBottom: 6 }}>
                কবে গিয়েছিলেন?
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)',
                  fontFamily: "'Inter', sans-serif", fontSize: 14, outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              style={{
                width: '100%', height: 44, background: status === 'success' ? '#E1F5EE' : '#1D9E75',
                color: status === 'success' ? '#0F6E56' : 'white', borderRadius: 10, border: 'none',
                fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600,
                cursor: status === 'idle' ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s'
              }}
            >
              {status === 'idle' && 'রেটিং জমা দিন'}
              {status === 'loading' && 'জমা হচ্ছে...'}
              {status === 'success' && (
                <>
                  ধন্যবাদ! রেটিং যোগ হয়েছে <CheckCircle size={16} />
                </>
              )}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'center' }}>
              <LockKeyhole size={12} color="#888780" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#888780' }}>
                আপনার রেটিং সম্পূর্ণ বেনামে
              </span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
