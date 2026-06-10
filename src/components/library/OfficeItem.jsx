/**
 * OfficeItem.jsx — Office/location card for "কোথায় যাবেন?" section.
 */
import { MapPin } from 'lucide-react';

export default function OfficeItem({ office, category }) {
  return (
    <div
      className="article-office-item"
      style={{ background: category.light }}
    >
      <MapPin size={16} color={category.color} style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <div className="article-office-name" style={{ color: category.dark }}>
          {office.name}
        </div>
        <div className="article-office-address">{office.address}</div>
        <div className="article-office-note" style={{ color: category.color }}>
          {office.note}
        </div>
      </div>
    </div>
  );
}
