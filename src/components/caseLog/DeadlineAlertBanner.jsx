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
    <div className="cl-deadline-banner">
      <div className="cl-deadline-banner-left">
        <AlertCircle size={20} className="cl-deadline-banner-icon" />
        <div>
          <div className="cl-deadline-banner-title">
            সময়সীমার সতর্কতা
          </div>
          <div className="cl-deadline-banner-text">
            আপনার কেস "{urgentCase.title}"-এর সময়সীমা {getDaysLeft().toLocaleString('bn-BD')} দিনের মধ্যে শেষ হয়ে যাবে।
          </div>
        </div>
      </div>

      <div className="cl-deadline-banner-right">
        <button 
          onClick={() => navigate(`/case-log/${urgentCase.id}`)}
          className="cl-deadline-banner-btn"
        >
          কেস দেখুন
        </button>
        <button 
          onClick={handleDismiss}
          className="cl-deadline-banner-close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
