import { Clock } from 'lucide-react';

export default function DeadlineBox({ deadline, isStreaming }) {
  if (isStreaming || !deadline) return null;
  return (
    <div className="deadline-box">
      <div className="db-header">
        <Clock size={14} color="#EF9F27" />
        <span className="db-title">সময়সীমা মনে রাখুন</span>
      </div>
      <p className="db-content">{deadline}</p>
    </div>
  );
}
