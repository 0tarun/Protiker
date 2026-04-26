import { AlertTriangle } from 'lucide-react';

export default function WarningBox({ warnings, isStreaming }) {
  if (isStreaming || !warnings) return null;
  return (
    <div className="warning-box">
      <div className="wb-header">
        <AlertTriangle size={14} color="#E24B4A" />
        <span className="wb-title">যা করবেন না</span>
      </div>
      <p className="wb-content">{warnings}</p>
    </div>
  );
}
