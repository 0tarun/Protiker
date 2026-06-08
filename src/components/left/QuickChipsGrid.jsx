import { useState, useCallback } from 'react';
import { useChatContext } from '../../context/ChatContext';

const chips = {
  bn: [
    { icon: '💰', text: 'বেতন পাচ্ছি না' },
    { icon: '🏠', text: 'বাড়িভাড়া সমস্যা' },
    { icon: '👩', text: 'পারিবারিক সহিংসতা' },
    { icon: '🛒', text: 'ভোক্তা অধিকার' },
    { icon: '👮', text: 'পুলিশ হয়রানি' },
    { icon: '🌾', text: 'জমি বিরোধ' },
    { icon: '💍', text: 'তালাক ও বিবাহ' },
    { icon: '⚙️', text: 'শ্রমিক অধিকার' },
  ],
  en: [
    { icon: '💰', text: 'Unpaid salary' },
    { icon: '🏠', text: 'House rent issue' },
    { icon: '👩', text: 'Domestic violence' },
    { icon: '🛒', text: 'Consumer rights' },
    { icon: '👮', text: 'Police harassment' },
    { icon: '🌾', text: 'Land dispute' },
    { icon: '💍', text: 'Divorce & Marriage' },
    { icon: '⚙️', text: 'Labor rights' },
  ]
};

export default function QuickChipsGrid({ onChipClick }) {
  const { state } = useChatContext();
  const lang = state.language;
  const currentChips = chips[lang] || chips.bn;
  const [pressed, setPressed] = useState(null);

  const handleClick = useCallback((text, idx) => {
    setPressed(idx);
    setTimeout(() => setPressed(null), 100);
    onChipClick(text);
  }, [onChipClick]);

  return (
    <div className="chips-zone">
      <div className="chips-label">{lang === 'en' ? 'Choose an issue' : 'সমস্যা বেছে নিন'}</div>
      <div className="chips-grid">
        {currentChips.map((c, i) => (
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
