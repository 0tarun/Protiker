/**
 * StatsRow — 4 stat cards with count-up animation from 0 to value.
 */
import { useState, useEffect } from 'react';
import { MessageCircle, FileText, FolderOpen, Calendar } from 'lucide-react';
import { mockStats } from '../../data/mockDashboard';

const toBengali = (n) => n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

const stats = [
  { icon: MessageCircle, bg: '#E1F5EE', color: '#1D9E75', value: mockStats.totalSessions, label: 'মোট কথোপকথন' },
  { icon: FileText, bg: '#E6F1FB', color: '#378ADD', value: mockStats.totalDocuments, label: 'তৈরি দলিল' },
  { icon: FolderOpen, bg: '#FAEEDA', color: '#EF9F27', value: mockStats.savedCases, label: 'সংরক্ষিত কেস' },
  { icon: Calendar, bg: '#EAF3DE', color: '#639922', value: mockStats.daysActive, label: 'দিন ধরে সক্রিয়' },
];

function CountUp({ target, delay }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
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
  return (
    <div className="db-stats-section">
      <div className="db-section-label">আপনার পরিসংখ্যান · Your stats</div>
      <div className="db-stats-grid">
        {stats.map((s, i) => (
          <div className="db-stat-card" key={s.label}>
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
        ))}
      </div>
    </div>
  );
}

export { StatsRow };
