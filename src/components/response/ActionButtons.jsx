import { useState } from 'react';
import { Download, BookOpen, Check } from 'lucide-react';

export default function ActionButtons({ isStreaming }) {
  const [dlState, setDlState] = useState('idle'); // idle | loading | done

  if (isStreaming) return null;

  const handleDownload = () => {
    setDlState('loading');
    setTimeout(() => {
      setDlState('done');
      setTimeout(() => setDlState('idle'), 500);
    }, 1000);
  };

  return (
    <div className="action-buttons">
      <button className="action-btn dl" onClick={handleDownload} id="btn-dl-pdf">
        {dlState === 'loading' ? (
          <span className="spin" style={{ display: 'inline-block' }}>⏳</span>
        ) : dlState === 'done' ? (
          <Check size={14} />
        ) : (
          <Download size={14} />
        )}
        PDF ডাউনলোড
      </button>
      <button className="action-btn save" id="btn-save-log">
        <BookOpen size={14} /> কেস সংরক্ষণ
      </button>
    </div>
  );
}
