import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DeadlineAlertBanner({ cases }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [urgentCase, setUrgentCase] = useState(null);

  useEffect(() => {
    // Check if session has dismissed this
    const dismissed = sessionStorage.getItem('protiker_deadline_alert_dismissed');
    if (dismissed === 'true') return;

    // Find if there is a case with deadline within 7 days
    const urgent = cases.find(c => {
      if (!c.deadlineDate) return false;
      const diffTime = new Date(c.deadlineDate) - new Date();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7 && c.caseStatus !== 'resolved';
    });

    if (urgent) {
      setUrgentCase(urgent);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [cases]);

  const handleDismiss = () => {
    sessionStorage.setItem('protiker_deadline_alert_dismissed', 'true');
    setVisible(false);
  };

  if (!visible || !urgentCase) return null;

  const getDaysLeft = () => {
    const diffTime = new Date(urgentCase.deadlineDate) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(226,75,74,0.08), rgba(226,75,74,0.04))',
        border: '1.5px solid rgba(226,75,74,0.25)',
        borderRadius: 14,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        animation: 'alertPulse 2s infinite'
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <AlertCircle size={20} color="#E24B4A" style={{ marginTop: 2 }} />
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: '#A32D2D' }}>
            সময়সীমার সতর্কতা
          </div>
          <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#7F1D1D', marginTop: 4 }}>
            আপনার কেস "{urgentCase.title}"-এর সময়সীমা {getDaysLeft().toLocaleString('bn-BD')} দিনের মধ্যে শেষ হয়ে যাবে।
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button 
          onClick={() => navigate(`/case-log/${urgentCase.id}`)}
          style={{
            background: 'white', border: '1px solid #E24B4A', color: '#E24B4A',
            borderRadius: 8, padding: '6px 14px', fontFamily: "'Hind Siliguri', sans-serif",
            fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
          }}
          className="action-btn-hover"
        >
          কেস দেখুন
        </button>
        <button 
          onClick={handleDismiss}
          style={{ background: 'none', border: 'none', color: '#888780', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
