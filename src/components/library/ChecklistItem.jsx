/**
 * ChecklistItem.jsx — A single checklist item with CheckCircle2 icon.
 */
import { CheckCircle2 } from 'lucide-react';

export default function ChecklistItem({ text, category }) {
  return (
    <div className="article-checklist-item">
      <CheckCircle2 size={18} color={category.color} style={{ flexShrink: 0, marginTop: 2 }} />
      <span className="article-checklist-text">{text}</span>
    </div>
  );
}
