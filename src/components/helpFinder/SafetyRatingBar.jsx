export default function SafetyRatingBar({ label, score }) {
  // Score is between 1 and 5
  const percentage = (score / 5) * 100;
  
  let color = '#E24B4A'; // red
  if (score >= 4.5) color = '#1D9E75'; // green
  else if (score >= 3.5) color = '#EF9F27'; // amber

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
      <div style={{ width: 120, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, color: '#4A4845' }}>
        {label}
      </div>
      <div style={{ flex: 1, background: '#F4F6F8', height: 8, borderRadius: 100, overflow: 'hidden', margin: '0 12px' }}>
        <div style={{ 
          width: `${percentage}%`, height: '100%', background: color, 
          borderRadius: 100, transition: 'width 800ms ease-out' 
        }} />
      </div>
      <div style={{ width: 24, fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#1C1B1A', textAlign: 'right' }}>
        {score.toFixed(1)}
      </div>
    </div>
  );
}
