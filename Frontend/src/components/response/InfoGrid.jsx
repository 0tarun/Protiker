import { MapPin, Phone } from 'lucide-react';

export default function InfoGrid({ office, freeAid, isStreaming }) {
  if (isStreaming) return null;
  return (
    <div className="info-grid">
      <div className="info-card">
        <MapPin className="ic-icon" size={16} />
        <div className="ic-label">কোথায় যাবেন</div>
        <div className="ic-value">{office}</div>
      </div>
      <div className="info-card">
        <Phone className="ic-icon" size={16} />
        <div className="ic-label">বিনামূল্যে সহায়তা</div>
        <div className="ic-value">
          {freeAid.includes('16699') ? (
            <a href="tel:16699">{freeAid}</a>
          ) : freeAid.includes('999') ? (
            <a href="tel:999">{freeAid}</a>
          ) : (
            freeAid
          )}
        </div>
      </div>
    </div>
  );
}
