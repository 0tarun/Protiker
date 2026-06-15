/**
 * TopBar — Sticky top bar with BST-aware greeting, search, notifications, avatar.
 */
import { useState, useEffect, useRef } from 'react';
import { Search, Bell, BookOpen, FileText, CheckCircle, User, LogOut } from 'lucide-react';
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
  const { user, logout } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'ব্যবহারকারী';

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const notifRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowAvatarMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerOpenProfile = () => {
    setShowAvatarMenu(false);
    window.dispatchEvent(new CustomEvent('protiker:open-profile'));
  };

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

        <div className="db-search-wrap" ref={notifRef}>
          <button
            className="db-bell-btn"
            id="db-bell"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            <span className="db-bell-dot" />
          </button>
          {showNotifications && (
            <div className="db-dropdown">
              <div className="db-dropdown-header">
                <div className="db-dropdown-title">সাম্প্রতিক বিজ্ঞপ্তি</div>
                <div className="db-dropdown-sub">আপনার জন্য ৩টি নতুন বিজ্ঞপ্তি</div>
              </div>
              <div className="db-dropdown-list">
                <div className="db-dropdown-item">
                  <FileText size={16} color="#378ADD" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div className="db-dropdown-item-title">দলিল তৈরি সম্পন্ন</div>
                    <div className="db-dropdown-item-desc">বকেয়া বেতন দাবি নোটিশ দলিলটি সফলভাবে তৈরি হয়েছে।</div>
                  </div>
                </div>
                <div className="db-dropdown-item">
                  <BookOpen size={16} color="#1D9E75" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div className="db-dropdown-item-title">নতুন প্রবন্ধ প্রকাশ</div>
                    <div className="db-dropdown-item-desc">শ্রম অধিকার ক্যাটাগরিতে নতুন ২ টি প্রবন্ধ যুক্ত করা হয়েছে।</div>
                  </div>
                </div>
                <div className="db-dropdown-item">
                  <CheckCircle size={16} color="#EF9F27" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div className="db-dropdown-item-title">সিস্টেম আপডেট</div>
                    <div className="db-dropdown-item-desc">প্রতিকার প্ল্যাটফর্মের সিকিউরিটি ও স্পিড অপ্টিমাইজেশন করা হয়েছে।</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="db-search-wrap" ref={avatarRef}>
          <button
            className="db-topbar-avatar"
            id="db-avatar"
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
          >
            {firstName.charAt(0).toUpperCase()}
          </button>
          {showAvatarMenu && (
            <div className="db-dropdown" style={{ right: 0 }}>
              <div className="db-dropdown-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="db-topbar-avatar" style={{ cursor: 'default', flexShrink: 0 }}>
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="db-dropdown-title">{user?.name || 'ব্যবহারকারী'}</div>
                  <div className="db-dropdown-sub" style={{ fontSize: '11px' }}>{user?.email || ''}</div>
                </div>
              </div>
              <div className="db-dropdown-list">
                <div className="db-dropdown-item" onClick={triggerOpenProfile}>
                  <User size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div className="db-dropdown-item-title">প্রোফাইল সেটিংস</div>
                    <div className="db-dropdown-item-desc">আপনার ব্যক্তিগত বিবরণ পরিবর্তন করুন</div>
                  </div>
                </div>
                <div className="db-dropdown-item" onClick={logout} style={{ color: 'var(--db-red)' }}>
                  <LogOut size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div className="db-dropdown-item-title" style={{ color: 'var(--db-red)' }}>লগআউট</div>
                    <div className="db-dropdown-item-desc">সেশন শেষ করে লগআউট করুন</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { TopBar };
