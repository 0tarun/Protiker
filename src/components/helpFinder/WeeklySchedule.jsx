import { toBengaliTime } from '../../utils/helpFinderUtils';

export default function WeeklySchedule({ hours }) {
  if (!hours || hours.length === 0) return null;

  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  
  const bst = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
  const todayDay = bst.getDay();

  return (
    <div style={{ marginTop: 16 }}>
      {hours.map((h) => {
        const isToday = h.day === todayDay;
        
        return (
          <div key={h.day} style={{
            display: 'flex', justifyContent: 'space-between', padding: '8px 12px',
            background: isToday ? '#E1F5EE' : 'transparent',
            borderLeft: isToday ? '3px solid #1D9E75' : '3px solid transparent',
            marginBottom: 4, borderRadius: '0 6px 6px 0'
          }}>
            <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, color: isToday ? '#0F6E56' : '#4A4845', fontWeight: isToday ? 600 : 400 }}>
              {days[h.day]}
              {isToday && <span style={{ marginLeft: 6, fontSize: 11, color: '#1D9E75' }}>(আজ)</span>}
            </div>
            <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, color: h.closed ? '#E24B4A' : '#1C1B1A', fontWeight: h.closed ? 500 : 400 }}>
              {h.closed ? 'বন্ধ' : `${toBengaliTime(h.opens)} – ${toBengaliTime(h.closes)}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
