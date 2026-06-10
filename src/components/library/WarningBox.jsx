/**
 * WarningBox.jsx — Red warning section box.
 */
import { AlertTriangle } from 'lucide-react';

export default function WarningBox({ heading, content }) {
  return (
    <div className="article-warning-box">
      <div className="article-warning-header">
        <AlertTriangle size={18} color="#E24B4A" />
        <span className="article-warning-heading">{heading}</span>
      </div>
      <p className="article-warning-content">{content}</p>
    </div>
  );
}
