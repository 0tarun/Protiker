import { useState, useCallback } from 'react';

const chips = [
  { icon: '💰', text: 'বেতন পাচ্ছি না' },
  { icon: '🏠', text: 'বাড়িভাড়া সমস্যা' },
  { icon: '👩', text: 'পারিবারিক সহিংসতা' },
  { icon: '🛒', text: 'ভোক্তা অধিকার' },
  { icon: '👮', text: 'পুলিশ হয়রানি' },
  { icon: '🌾', text: 'জমি বিরোধ' },
  { icon: '💍', text: 'তালাক ও বিবাহ' },
  { icon: '⚙️', text: 'শ্রমিক অধিকার' },
];

export default function QuickChipsGrid({ onChipClick }) {
  const [pressed, setPressed] = useState(null);

  const handleClick = useCallback((text, idx) => {
    setPressed(idx);
    setTimeout(() => setPressed(null), 100);
    onChipClick(text);
  }, [onChipClick]);

  return (
    <div className="chips-zone">
      <div className="chips-label">সমস্যা বেছে নিন</div>
      <div className="chips-grid">
        {chips.map((c, i) => (
          <button
            key={i}
            className="chip"
            style={pressed === i ? { transform: 'scale(0.95)' } : undefined}
            onClick={() => handleClick(c.text, i)}
          >
            <span className="chip-icon">{c.icon}</span>
            {c.text}
          </button>
        ))}
      </div>
    </div>
  );
}
