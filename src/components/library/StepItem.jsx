/**
 * StepItem.jsx — A numbered step with optional Document Automator link.
 */
import { useNavigate } from 'react-router-dom';

export default function StepItem({ step, index, category }) {
  const navigate = useNavigate();
  const hasDocLink = step.includes('Document Automator');

  return (
    <div className="article-step-item">
      <div
        className="article-step-num"
        style={{ background: category.color }}
      >
        {index + 1}
      </div>
      <div
        className="article-step-content"
        style={{ borderLeftColor: category.color }}
      >
        <p className="article-step-text">{step}</p>
        {hasDocLink && (
          <button
            className="article-doc-link"
            style={{ color: category.color }}
            onClick={() => navigate('/documents/new')}
          >
            দলিল তৈরি করুন →
          </button>
        )}
      </div>
    </div>
  );
}
