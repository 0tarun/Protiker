/**
 * RecentSessions — Shows 3 recent chat sessions with severity indicators.
 * Includes a "new conversation" button that navigates to /chat.
 */
import { Scale, MessageCircle, ChevronRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockSessions } from '../../data/mockDashboard';

export default function RecentSessions() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="db-col-header">
        <div className="db-col-title">সাম্প্রতিক কথোপকথন</div>
        <button className="db-col-link">সব দেখুন →</button>
      </div>
      <div className="db-list-card">
        {mockSessions.map((s) => (
          <div className="db-session-item" key={s.id}>
            <div className="db-session-icon" style={{ background: s.severityIconBg }}>
              <Scale size={16} color={s.severityIconColor} />
            </div>
            <div className="db-session-mid">
              <div className="db-session-top">
                <span className="db-session-tag" style={{ background: s.tagBg, color: s.tagColor }}>
                  {s.category}
                </span>
                <span className="db-session-date">{s.date}</span>
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
        ))}
        <button className="db-new-btn" onClick={() => navigate('/chat')}>
          <Plus size={16} /> নতুন কথোপকথন শুরু করুন
        </button>
      </div>
    </div>
  );
}

export { RecentSessions };
