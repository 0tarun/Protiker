/**
 * LegalTipCard — Displays a random legal tip with refresh button.
 * Refresh spins icon and fades in new tip content.
 */
import { useState, useCallback } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { mockTips } from '../../data/mockDashboard';

export default function LegalTipCard() {
  const [tipIndex, setTipIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [fading, setFading] = useState(false);

  const handleRefresh = useCallback(() => {
    setSpinning(true);
    setFading(false);

    setTimeout(() => {
      let next;
      do {
        next = Math.floor(Math.random() * mockTips.length);
      } while (next === tipIndex && mockTips.length > 1);
      setTipIndex(next);
      setFading(true);
      setSpinning(false);
    }, 400);
  }, [tipIndex]);

  const tip = mockTips[tipIndex];

  return (
    <div className="db-tip-card">
      <div className="db-tip-header">
        <div className="db-tip-title">আজকের আইনি টিপস</div>
        <button
          className={`db-tip-refresh${spinning ? ' spinning' : ''}`}
          onClick={handleRefresh}
          title="নতুন টিপস দেখুন"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className={`db-tip-body${fading ? ' fading' : ''}`} key={tipIndex}>
        <div className="db-tip-top">
          <Lightbulb size={20} color="#1D9E75" />
          <span className="db-tip-badge">টিপস</span>
        </div>
        <div className="db-tip-text">{tip.text}</div>
        <div className="db-tip-law">📖 {tip.law}</div>
      </div>
    </div>
  );
}

export { LegalTipCard };
