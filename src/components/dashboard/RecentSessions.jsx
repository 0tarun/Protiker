import { useState, useEffect } from 'react';
import { Scale, MessageCircle, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserSessions } from '../../services/chatService';

export default function RecentSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await getUserSessions();
        if (Array.isArray(data)) {
          // Only show top 3
          setSessions(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load recent sessions', err);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  return (
    <div>
      <div className="db-col-header">
        <div className="db-col-title">সাম্প্রতিক কথোপকথন</div>
        <button className="db-col-link" onClick={() => navigate('/chat')}>সব দেখুন →</button>
      </div>
      <div className="db-list-card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
            <Loader2 className="animate-spin" color="#1D9E75" size={24} />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((s) => (
            <div className="db-session-item" key={s.id} onClick={() => navigate(`/chat/${s.id}`)}>
              <div className="db-session-icon" style={{ background: s.severityIconBg || '#FAEEDA' }}>
                <Scale size={16} color={s.severityIconColor || '#EF9F27'} />
              </div>
              <div className="db-session-mid">
                <div className="db-session-top">
                  <span className="db-session-tag" style={{ background: s.tagBg || '#FAEEDA', color: s.tagColor || '#854F0B' }}>
                    {s.category}
                  </span>
                  <span className="db-session-date">
                    {s.date ? new Date(s.date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </div>
                <div className="db-session-preview">{s.preview}</div>
                <div className="db-session-msgs">
                  <MessageCircle size={12} /> {s.messages}
                </div>
              </div>
              <div className="db-session-arrow">
                <ChevronRight size={16} />
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
            কোনো কথোপকথন পাওয়া যায়নি।
          </div>
        )}
        <button className="db-new-btn" onClick={() => navigate('/chat')}>
          <Plus size={16} /> নতুন কথোপকথন শুরু করুন
        </button>
      </div>
    </div>
  );
}

export { RecentSessions };
