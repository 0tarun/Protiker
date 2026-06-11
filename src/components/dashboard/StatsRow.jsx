/**
 * StatsRow — 4 stat cards with count-up animation from 0 to value.
 * Fetches real user stats from the backend API.
 */
import { useState, useEffect } from 'react';
import { MessageCircle, FileText, FolderOpen, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserStats } from '../../services/chatService';

const toBengali = (n) => n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

function CountUp({ target, delay }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target <= 0) return;
    const timeout = setTimeout(() => {
      const duration = 800;
      const steps = target;
      const stepTime = Math.max(Math.floor(duration / steps), 40);
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setCount(current);
        if (current >= target) clearInterval(interval);
      }, stepTime);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay]);

  return toBengali(count);
}

export default function StatsRow() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getUserStats();
        if (data && typeof data === 'object') {
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statItems = [
    { icon: MessageCircle, bg: '#E1F5EE', color: '#1D9E75', value: stats?.totalSessions ?? 0, label: 'মোট কথোপকথন', route: '/chat' },
    { icon: FileText, bg: '#E6F1FB', color: '#378ADD', value: stats?.totalDocuments ?? 0, label: 'তৈরি দলিল', route: '/documents' },
    { icon: FolderOpen, bg: '#FAEEDA', color: '#EF9F27', value: stats?.savedCases ?? 0, label: 'সংরক্ষিত কেস', route: '/case-log' },
    { icon: Calendar, bg: '#EAF3DE', color: '#639922', value: stats?.daysActive ?? 0, label: 'দিন ধরে সক্রিয়', route: null },
  ];

  return (
    <div className="db-stats-section">
      <div className="db-section-label">আপনার পরিসংখ্যান · Your stats</div>
      <div className="db-stats-grid">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', gridColumn: '1 / -1' }}>
            <Loader2 className="animate-spin" color="#1D9E75" size={24} />
          </div>
        ) : (
          statItems.map((s, i) => (
            <div
              className="db-stat-card"
              key={s.label}
              onClick={() => s.route && navigate(s.route)}
              style={{ cursor: s.route ? 'pointer' : 'default' }}
            >
              <div className="db-stat-icon" style={{ background: s.bg }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div className="db-stat-val">
                  <CountUp target={s.value} delay={i * 100} />
                </div>
                <div className="db-stat-label">{s.label}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export { StatsRow };
