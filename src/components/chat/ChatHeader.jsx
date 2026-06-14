import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Download, LogOut, User } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ChatHeader() {
  const { messages, language, pdfLoading, resetChat, setLang, downloadPdf } = useChat();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const hasResponses = messages.some((m) => m.sender === 'proti');

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="chat-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', position: 'relative' }}>
      <div className="breadcrumb" style={{ flex: 1 }}>
        Protiker <span className="sep">›</span> <span className="current">{language === 'en' ? 'AI Legal Assistance' : 'AI আইনি সহায়তা'}</span>
      </div>
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="header-btn" onClick={resetChat} id="btn-new-chat">
          <RefreshCw size={14} /> {language === 'en' ? 'New Chat' : 'নতুন কথোপকথন'}
        </button>
        {hasResponses && (
          <button className="header-btn pdf" onClick={downloadPdf} id="btn-pdf">
            {pdfLoading ? <span className="spin" style={{ display: 'inline-block' }}>⏳</span> : <Download size={14} />}
            {language === 'en' ? 'Download PDF' : 'PDF ডাউনলোড'}
          </button>
        )}
        {isAuthenticated && (
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'transparent', border: '1px solid #1D9E75', color: '#1D9E75',
            borderRadius: '8px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif"
          }}>
            ড্যাশবোর্ড
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px', paddingLeft: '12px', borderLeft: '1px solid rgba(0,0,0,0.1)' }} ref={profileRef}>
          {isAuthenticated ? (
            <>
              <button
                className="header-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: '#1D9E75',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '600', fontSize: '14px'
                }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, color: '#1C1B1A' }}>
                  {user?.name?.length > 14 ? user.name.slice(0, 14) + '...' : user?.name}
                </span>
              </button>
              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: '64px', right: '24px', width: '250px',
                  background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '12px 0', zIndex: 1200
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ fontWeight: 600 }}>{user?.name || 'ব্যবহারকারী'}</div>
                    <div style={{ fontSize: '12px', color: '#6B6A6A' }}>{user?.email || ''}</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      window.dispatchEvent(new CustomEvent('protiker:open-profile'));
                    }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: '14px', color: '#1C1B1A'
                    }}
                  >
                    প্রোফাইল সেটিংস
                  </button>
                  <button
                    onClick={logout}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: '14px', color: '#D92D20'
                    }}
                  >
                    লগআউট
                  </button>
                </div>
              )}
            </>
          ) : (
            <button onClick={() => navigate('/login')} style={{
              background: '#1D9E75',
              border: '1px solid #0F6E56',
              borderRadius: '8px', padding: '7px 16px',
              color: 'white', fontFamily: "'Hind Siliguri', sans-serif", fontSize: '13px', cursor: 'pointer'
            }}>
              লগইন করুন
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
