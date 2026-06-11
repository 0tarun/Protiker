/**
 * Sidebar — Fixed left navigation for the citizen dashboard.
 * Contains brand, user card, nav items, and helpline card.
 * Accepts `activeItem` prop to highlight the current page's nav item.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageCircle, FileText, MapPin,
  BookOpen, FolderOpen, Settings, HelpCircle, LogOut, Phone, X, ShieldCheck, Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserStats } from '../../services/chatService';

const mainNav = [
  { icon: LayoutDashboard, label: 'ড্যাশবোর্ড', path: '/dashboard' },
  { icon: MessageCircle, label: 'AI পরামর্শ', badge: 'নতুন', path: '/chat' },
  { icon: FileText, label: 'আমার দলিলপত্র', path: '/documents' },
  { icon: MapPin, label: 'সহায়তা খুঁজুন', path: '/help-finder' },
  { icon: BookOpen, label: 'অধিকার লাইব্রেরি', path: '/library' },
  { icon: FolderOpen, label: 'কেস লগ', path: '/case-log' },
];

const settingsNav = [
  { icon: Settings, label: 'প্রোফাইল সেটিংস', path: null },
  { icon: HelpCircle, label: 'সাহায্য ও সহায়তা', path: null },
  { icon: LogOut, label: 'লগআউট', isLogout: true },
];

export default function Sidebar({ activeItem = 'ড্যাশবোর্ড' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dbStats, setDbStats] = useState(null);

  // Modal States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Form Fields
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileDivision, setProfileDivision] = useState(user?.division || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileDivision(user.division || '');
    }
  }, [user]);

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

  // Listen for global open profile events
  useEffect(() => {
    const handleOpenProfile = () => setShowProfileModal(true);
    window.addEventListener('protiker:open-profile', handleOpenProfile);
    return () => window.removeEventListener('protiker:open-profile', handleOpenProfile);
  }, []);

  const activeStats = dbStats || { totalSessions: 0, totalDocuments: 0, savedCases: 0 };

  const handleNavClick = (item) => {
    if (item.isLogout) {
      logout();
      return;
    }
    if (item.label === 'প্রোফাইল সেটিংস') {
      setShowProfileModal(true);
      return;
    }
    if (item.label === 'সাহায্য ও সহায়তা') {
      setShowHelpModal(true);
      return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      setShowProfileModal(false);
    }, 1500);
  };

  const userName = user?.name || 'ব্যবহারকারী';

  return (
    <aside className="db-sidebar">
      {/* Zone A — Brand */}
      <div className="db-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
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
            <div className="db-user-stat" style={{ cursor: 'pointer' }} onClick={() => navigate('/chat')}>
              <div className="db-user-stat-val">{activeStats.totalSessions}</div>
              <div className="db-user-stat-label">কথোপকথন</div>
            </div>
            <div className="db-user-stat-div" />
            <div className="db-user-stat" style={{ cursor: 'pointer' }} onClick={() => navigate('/documents')}>
              <div className="db-user-stat-val">{activeStats.totalDocuments}</div>
              <div className="db-user-stat-label">দলিল</div>
            </div>
            <div className="db-user-stat-div" />
            <div className="db-user-stat" style={{ cursor: 'pointer' }} onClick={() => navigate('/case-log')}>
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
          {mainNav.map((item) => {
            const isLibrary = item.label === 'অধিকার লাইব্রেরি';
            const isActive = isLibrary
              ? location.pathname.startsWith('/library')
              : item.label === activeItem;
            return (
              <div
                key={item.label}
                className={`db-nav-item${isActive ? ' active' : ''}`}
                onClick={() => handleNavClick(item)}
                style={{ cursor: item.path ? 'pointer' : 'default' }}
              >
                <item.icon size={18} />
                {item.label}
                {item.badge && <span className="db-nav-badge">{item.badge}</span>}
              </div>
            );
          })}
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
              style={{ cursor: 'pointer' }}
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
          <a
            href="tel:16699"
            className="db-helpline-btn"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Phone size={13} />
            এখনই কল করুন
          </a>
        </div>
      </div>

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <div className="db-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="db-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="db-modal-header">
              <span className="db-modal-title">প্রোফাইল সেটিংস · Profile Settings</span>
              <button className="db-modal-close" onClick={() => setShowProfileModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="db-modal-body">
              {showSavedToast && (
                <div className="db-modal-toast">
                  <ShieldCheck size={16} /> প্রোফাইল সফলভাবে সংরক্ষণ করা হয়েছে!
                </div>
              )}
              <div className="db-modal-field">
                <label>সম্পূর্ণ নাম / Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                />
              </div>
              <div className="db-modal-field">
                <label>ইমেইল ঠিকানা / Email (পরিবর্তনযোগ্য নয়)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              <div className="db-modal-field">
                <label>ফোন নম্বর / Phone Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="আপনার ফোন নম্বর"
                />
              </div>
              <div className="db-modal-field">
                <label>বিভাগ / Division</label>
                <select
                  value={profileDivision}
                  onChange={(e) => setProfileDivision(e.target.value)}
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="Dhaka">ঢাকা (Dhaka)</option>
                  <option value="Chattogram">চট্টগ্রাম (Chattogram)</option>
                  <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                  <option value="Khulna">খুলনা (Khulna)</option>
                  <option value="Barishal">বরিশাল (Barishal)</option>
                  <option value="Sylhet">সিলেট (Sylhet)</option>
                  <option value="Rangpur">রংপুর (Rangpur)</option>
                  <option value="Mymensingh">ময়মনসিংহ (Mymensingh)</option>
                </select>
              </div>
              <button type="submit" className="db-helpline-btn" style={{ background: 'var(--db-primary)', color: '#fff', border: 'none', margin: '20px 0 0', width: '100%' }}>
                সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="db-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="db-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="db-modal-header">
              <span className="db-modal-title">সাহায্য ও সহায়তা · Help & Support</span>
              <button className="db-modal-close" onClick={() => setShowHelpModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="db-modal-body">
              <div className="db-faq-list">
                <div className="db-faq-item">
                  <div className="db-faq-q">১. কীভাবে Proti-র সাথে কথা বলব?</div>
                  <div className="db-faq-a">
                    ড্যাশবোর্ডের "AI আইনি পরামর্শ" কার্ডে ক্লিক করুন অথবা প্রধান মেনুর "AI পরামর্শ" ট্যাবে যান।
                  </div>
                </div>
                <div className="db-faq-item">
                  <div className="db-faq-q">২. দলিল কীভাবে তৈরি করব?</div>
                  <div className="db-faq-a">
                    "দলিল তৈরি করুন" কার্ডে ক্লিক করে আপনার প্রয়োজন অনুযায়ী টেমপ্লেট নির্বাচন করে সহজ ফর্মটি পূরণ করুন।
                  </div>
                </div>
                <div className="db-faq-item">
                  <div className="db-faq-q">৩. সেবাটি কি সম্পূর্ণ বিনামূল্যে?</div>
                  <div className="db-faq-a">
                    হ্যাঁ, প্রতিকার প্ল্যাটফর্মের সকল আইনি সহায়তা এবং তথ্য সম্পূর্ণ বিনামূল্যে প্রদান করা হয়।
                  </div>
                </div>
              </div>
              <div className="db-support-footer">
                <strong>যোগাযোগের তথ্য:</strong>
                <div className="db-support-row">
                  <Phone size={14} style={{ flexShrink: 0 }} /> सरकारी আইনি সেবা হেল্পライン: 16699
                </div>
                <div className="db-support-row">
                  <Mail size={14} style={{ flexShrink: 0 }} /> ইমেইল: support@protiker.gov.bd
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export { Sidebar };
