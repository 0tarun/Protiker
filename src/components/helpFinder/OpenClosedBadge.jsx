import { isOpenNow } from '../../utils/helpFinderUtils';

export default function OpenClosedBadge({ hours }) {
  if (!hours || hours.length === 0) return null;

  const open = isOpenNow(hours);

  if (open) {
    return (
      <div style={{
        background: '#E1F5EE', color: '#0F6E56', borderRadius: 100,
        padding: '3px 10px', fontFamily: "'Inter', sans-serif",
        fontSize: 11, fontWeight: 600, display: 'inline-block'
      }}>
        ● খোলা আছে
      </div>
    );
  }

  return (
    <div style={{
      background: '#F4F6F8', color: '#888780', borderRadius: 100,
      padding: '3px 10px', fontFamily: "'Inter', sans-serif",
      fontSize: 11, fontWeight: 600, display: 'inline-block'
    }}>
      বন্ধ
    </div>
  );
}
