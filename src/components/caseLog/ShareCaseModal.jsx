import { useState, useEffect } from 'react';
import { X, Link2, Lock, MessageCircle } from 'lucide-react';

export default function ShareCaseModal({ caseItem, onClose }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/case/share/${caseItem.shareToken || caseItem.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
    });
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`আমার কেস লক শেয়ারিং লিংক: ${shareUrl}`)}`;

  return (
    <div className="cl-modal-overlay">
      <div className="cl-modal-card" style={{ width: 420 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{ background: '#F4F6F8', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#888780' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: -10 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D9E75', marginBottom: 16 }}>
            <Link2 size={28} />
          </div>

          <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 20, fontWeight: 600, color: '#1C1B1A', margin: '0 0 8px' }}>
            কেস শেয়ার করুন
          </h2>
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#4A4845', margin: 0, lineHeight: 1.5 }}>
            এই লিংকটি NGO কর্মী বা আইনজীবীকে দিন। তারা আপনার কেসের সারসংক্ষেপ দেখতে পাবেন।
          </p>

          {/* Link Box */}
          <div style={{
            width: '100%', background: '#F4F6F8', borderRadius: 10, padding: '12px 16px',
            display: 'flex', gap: 8, alignItems: 'center', marginTop: 20, border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
              {shareUrl}
            </div>
            <button 
              onClick={handleCopy}
              style={{
                background: 'none', border: 'none', color: '#1D9E75',
                fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}
            >
              {copied ? 'কপি হয়েছে ✓' : 'কপি করুন'}
            </button>
          </div>

          {/* Privacy Note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, justifyContent: 'center' }}>
            <Lock size={12} color="#888780" />
            <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: '#888780' }}>
              শুধুমাত্র এই লিংক জানা মানুষ দেখতে পাবেন
            </span>
          </div>

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%', background: '#25D366', color: 'white', borderRadius: 12,
              padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 600, marginTop: 20,
              textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,211,102,0.2)'
            }}
          >
            <MessageCircle size={18} />
            WhatsApp-এ শেয়ার করুন
          </a>
        </div>
      </div>
    </div>
  );
}
