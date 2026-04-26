import { useChatContext } from '../../context/ChatContext';

export default function ProtiAvatarZone() {
  const { state } = useChatContext();
  const hasSession = state.messages.length > 0;
  const category = state.messages.find((m) => m.structuredJson)?.structuredJson?.category;
  const severity = state.messages.find((m) => m.structuredJson)?.structuredJson?.severity;
  const msgCount = state.messages.length;

  const severityLabel = { low: 'সাধারণ', serious: 'গুরুতর', urgent: 'জরুরি' };
  const severityColor = { low: '#639922', serious: '#EF9F27', urgent: '#E24B4A' };

  return (
    <div className="avatar-zone">
      <div className="avatar-wrap">
        <div className="avatar-ring" />
        <div className="avatar-circle">প্র</div>
      </div>
      <div className="avatar-name">Proti</div>
      <div className="avatar-subtitle">আপনার আইনি বন্ধু</div>
      <div className="status-row">
        <div className="status-dot" />
        <span className="status-text">সক্রিয় আছি</span>
      </div>
      {hasSession && (
        <div className="session-card">
          {category && <span className="tag">{category}</span>}
          {severity && (
            <span className="pill" style={{ background: severityColor[severity] + '22', color: severityColor[severity] }}>
              {severityLabel[severity]}
            </span>
          )}
          <span className="msg-count">{msgCount} messages</span>
        </div>
      )}
    </div>
  );
}
