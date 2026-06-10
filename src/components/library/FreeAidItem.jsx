/**
 * FreeAidItem.jsx — Free legal aid contact card.
 */
import { Phone } from 'lucide-react';

export default function FreeAidItem({ aid }) {
  return (
    <div className="article-aid-item">
      {aid.type === 'phone' && <Phone size={16} color="#1D9E75" style={{ flexShrink: 0 }} />}
      <div className="article-aid-content">
        <div className="article-aid-name">{aid.name}</div>
        <a
          href={`tel:${aid.contact}`}
          className="article-aid-contact"
        >
          {aid.contact}
        </a>
      </div>
      <a href={`tel:${aid.contact}`} className="article-aid-call">
        কল করুন
      </a>
    </div>
  );
}
