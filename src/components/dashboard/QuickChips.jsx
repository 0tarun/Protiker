/**
 * QuickChips — 10 problem chips. On click, saves chip text to localStorage
 * and navigates to /chat for pre-filling.
 */
import { useNavigate } from 'react-router-dom';
import { quickChips } from '../../data/mockDashboard';

export default function QuickChips() {
  const navigate = useNavigate();

  const handleClick = (text) => {
    localStorage.setItem('chipQuery', text);
    navigate('/chat');
  };

  return (
    <div className="db-chips-card">
      <div className="db-chips-title">দ্রুত সমস্যা বলুন · Quick problem</div>
      <div className="db-chips-sub">যেকোনো চিপে ক্লিক করলে সরাসরি Proti-র কাছে যাবেন</div>
      <div className="db-chips-grid">
        {quickChips.map((c) => (
          <button
            key={c.text}
            className="db-chip"
            onClick={() => handleClick(c.text)}
          >
            <span>{c.emoji}</span> {c.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export { QuickChips };
