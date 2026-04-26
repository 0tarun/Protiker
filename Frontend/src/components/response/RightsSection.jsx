export default function RightsSection({ rights, laws, streamedText, isStreaming }) {
  const displayText = isStreaming && streamedText !== undefined ? streamedText : rights;
  return (
    <div className="rights-section">
      <div className="section-header">
        <span className="sh-dot" />
        <span className="sh-label">আপনার অধিকার</span>
      </div>
      <p className="rights-content">
        {displayText}
        {isStreaming && <span className="streaming-cursor" />}
      </p>
      {(!isStreaming || streamedText === rights) && laws && laws.length > 0 && (
        <div className="law-tags">
          {laws.map((law, i) => (
            <span className="law-tag" key={i} style={{ animationDelay: `${i * 80}ms` }}>
              <span className="law-icon">📖</span>
              {law.name} · {law.section}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
