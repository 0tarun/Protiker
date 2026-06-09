/**
 * Sidebar — Fixed left navigation for the citizen dashboard.
 * Contains brand, user card, nav items, and helpline card.
 * Accepts `activeItem` prop to highlight the current page's nav item.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageCircle, FileText, MapPin,
  BookOpen, FolderOpen, Settings, HelpCircle, LogOut, Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserStats } from '../../services/chatService';
import { mockStats } from '../../data/mockDashboard';

const mainNav = [
  { icon: LayoutDashboard, label: 'ড্যাশবোর্ড', path: '/dashboard' },
  { icon: MessageCircle, label: 'AI পরামর্শ', badge: 'নতুন', path: '/chat' },
  { icon: FileText, label: 'আমার দলিলপত্র', path: '/documents' },
  { icon: MapPin, label: 'সহায়তা খুঁজুন', path: '/help-finder' },
  { icon: BookOpen, label: 'অধিকার লাইব্রেরি', path: null },
  { icon: FolderOpen, label: 'কেস লগ', path: '/case-log' },
];

const settingsNav = [
  { icon: Settings, label: 'প্রোফাইল সেটিংস', path: null },
  { icon: HelpCircle, label: 'সাহায্য ও সহায়তা', path: null },
  { icon: LogOut, label: 'লগআউট', isLogout: true },
];

export default function Sidebar({ activeItem = 'ড্যাশবোর্ড' }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dbStats, setDbStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getUserStats();
        if (data && typeof data === 'object') {
          setDbStats(data);
        }
      } catch (err) {
        console.error('Failed to load sidebar stats', err);
      }
    }
    if (user) {
      loadStats();
    }
  }, [user]);

  const activeStats = dbStats || mockStats;

  const handleNavClick = (item) => {
    if (item.isLogout) {
      logout();
      return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const userName = user?.name || 'ব্যবহারকারী';

  return (
    <aside className="db-sidebar">
      {/* Zone A — Brand */}
      <div className="db-brand">
        <div className="db-brand-row">
          <div className="db-brand-badge">প্র</div>
          <div>
            <div className="db-brand-name">Protiker</div>
            <div className="db-brand-sub">প্রতিকার</div>
          </div>
        </div>
        <div className="db-brand-sep" />
      </div>

      {/* Zone B — User Card */}
      <div className="db-user-card-wrap">
        <div className="db-user-card">
          <div className="db-user-top">
            <div className="db-user-avatar">{userName.charAt(0).toUpperCase()}</div>
            <div>
              <div className="db-user-name">{userName}</div>
              <div className="db-user-role">{user?.role || 'সাধারণ নাগরিক'}</div>
            </div>
          </div>
          <div className="db-user-stats">
            <div className="db-user-stat">
              <div className="db-user-stat-val">{activeStats.totalSessions}</div>
              <div className="db-user-stat-label">কথোপকথন</div>
            </div>
            <div className="db-user-stat-div" />
            <div className="db-user-stat">
              <div className="db-user-stat-val">{activeStats.totalDocuments}</div>
              <div className="db-user-stat-label">দলিল</div>
            </div>
            <div className="db-user-stat-div" />
            <div className="db-user-stat">
              <div className="db-user-stat-val">{activeStats.savedCases}</div>
              <div className="db-user-stat-label">কেস লগ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone C — Navigation */}
      <div className="db-nav-section">
        <div className="db-nav-label">প্রধান মেনু · Menu</div>
        <div className="db-nav-list">
          {mainNav.map((item) => (
            <div
              key={item.label}
              className={`db-nav-item${item.label === activeItem ? ' active' : ''}`}
              onClick={() => handleNavClick(item)}
              style={{ cursor: item.path ? 'pointer' : 'default' }}
            >
              <item.icon size={18} />
              {item.label}
              {item.badge && <span className="db-nav-badge">{item.badge}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="db-nav-section">
        <div className="db-nav-label">সেটিংস · Settings</div>
        <div className="db-nav-list">
          {settingsNav.map((item) => (
            <div
              key={item.label}
              className={`db-nav-item${item.isLogout ? ' logout' : ''}`}
              onClick={() => handleNavClick(item)}
              style={{ cursor: (item.path || item.isLogout) ? 'pointer' : 'default' }}
            >
              <item.icon size={18} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Zone D — Helpline Card */}
      <div className="db-helpline-wrap">
        <div className="db-helpline">
          <div className="db-helpline-label">বিনামূল্যে হেল্পলাইন</div>
          <div className="db-helpline-number">16699</div>
          <div className="db-helpline-sub">NLASO · সার্বক্ষণিক</div>
          <button className="db-helpline-btn">
            <Phone size={13} />
            এখনই কল করুন
          </button>
        </div>
      </div>
    </aside>
  );
}

export { Sidebar };
