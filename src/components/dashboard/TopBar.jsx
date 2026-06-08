/**
 * TopBar — Sticky top bar with BST-aware greeting, search, notifications, avatar.
 */
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function getGreeting() {
  const bstHour = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
  ).getHours();

  if (bstHour >= 5 && bstHour < 12) return 'শুভ সকাল';
  if (bstHour >= 12 && bstHour < 17) return 'শুভ বিকাল';
  if (bstHour >= 17 && bstHour < 20) return 'শুভ সন্ধ্যা';
  return 'শুভ রাত';
}

export default function TopBar() {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'ব্যবহারকারী';

  return (
    <div className="db-topbar">
      <div>
        <div className="db-greeting-text">
          {getGreeting()}, {firstName}! 👋
        </div>
        <div className="db-greeting-sub">আজ কোনো আইনি সমস্যা আছে?</div>
      </div>

      <div className="db-topbar-right">
        <div className="db-search-wrap">
          <span className="db-search-icon"><Search size={16} /></span>
          <input
            className="db-search"
            type="text"
            placeholder="সমস্যা খুঁজুন..."
            id="db-search"
          />
        </div>

        <button className="db-bell-btn" id="db-bell">
          <Bell size={18} />
          <span className="db-bell-dot" />
        </button>

        <button className="db-topbar-avatar" id="db-avatar">
          {firstName.charAt(0).toUpperCase()}
        </button>
      </div>
    </div>
  );
}

export { TopBar };
