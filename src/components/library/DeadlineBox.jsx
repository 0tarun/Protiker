/**
 * DeadlineBox.jsx — Amber deadline section box.
 */
import { Clock } from 'lucide-react';

export default function DeadlineBox({ heading, content }) {
  return (
    <div className="article-deadline-box">
      <div className="article-deadline-header">
        <Clock size={18} color="#EF9F27" />
        <span className="article-deadline-heading">{heading}</span>
      </div>
      <p className="article-deadline-content">{content}</p>
    </div>
  );
}
