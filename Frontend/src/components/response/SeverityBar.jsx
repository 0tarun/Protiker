export default function SeverityBar({ severity, category }) {
  const labels = { low: 'সাধারণ · Moderate', serious: 'গুরুতর · Serious', urgent: 'জরুরি · Urgent' };
  return (
    <div className={`severity-bar ${severity}`}>
      <span className="severity-pill">
        <span className="s-dot" />
        {labels[severity] || labels.serious}
      </span>
      <span className="cat-tag">{category}</span>
    </div>
  );
}
