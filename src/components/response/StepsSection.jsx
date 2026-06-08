export default function StepsSection({ steps, isStreaming }) {
  if (isStreaming) return null;
  return (
    <div className="steps-section">
      <div className="section-header">
        <span className="sh-dot" />
        <span className="sh-label">এখনই যা করবেন</span>
      </div>
      {steps.map((step, i) => (
        <div className="step-item" key={i} style={{ animationDelay: `${i * 80}ms` }}>
          <div className="step-num">{i + 1}</div>
          <div className="step-text">{step}</div>
        </div>
      ))}
    </div>
  );
}
