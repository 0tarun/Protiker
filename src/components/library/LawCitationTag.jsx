/**
 * LawCitationTag.jsx — Inline law citation chip with hover tooltip.
 */
import { Scale } from 'lucide-react';

export default function LawCitationTag({ law, category }) {
  return (
    <span
      className="lib-law-citation-tag"
      style={{
        background: category.light,
        color: category.dark,
        border: `1px solid ${category.color}40`,
      }}
      title={`${law.name} — ${law.section}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = category.color;
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = category.light;
        e.currentTarget.style.color = category.dark;
      }}
    >
      <Scale size={11} />
      {law.section}
    </span>
  );
}
