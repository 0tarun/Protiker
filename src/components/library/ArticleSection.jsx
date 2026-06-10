/**
 * ArticleSection.jsx — Renders a single section of an article.
 * Supports: content, checklist, steps, offices, aids, warning, deadline.
 */
import LawCitationTag from './LawCitationTag';
import ChecklistItem from './ChecklistItem';
import StepItem from './StepItem';
import OfficeItem from './OfficeItem';
import FreeAidItem from './FreeAidItem';
import WarningBox from './WarningBox';
import DeadlineBox from './DeadlineBox';

export default function ArticleSection({ section, category, index }) {
  const isWarning = section.id === 'warning';
  const isDeadline = section.id === 'deadline';

  return (
    <div
      className="article-section-item"
      id={section.id}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Heading — not shown inside the special boxes (they render their own) */}
      {!isWarning && !isDeadline && (
        <h2
          className="article-section-heading"
          style={{ borderBottom: `2px solid ${category.color || '#ccc'}` }}
        >
          {section.heading}
        </h2>
      )}

      {/* Content with optional law tags */}
      {section.content && !isWarning && !isDeadline && (
        <>
          <p className="article-section-content">{section.content}</p>
          {section.lawTags && section.lawTags.length > 0 && (
            <div className="article-law-inline-tags">
              {section.lawTags.map((law, i) => (
                <LawCitationTag key={i} law={law} category={category} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Checklist */}
      {section.checklist && (
        <div className="article-checklist">
          {section.checklist.map((item, i) => (
            <ChecklistItem key={i} text={item} category={category} />
          ))}
        </div>
      )}

      {/* Steps */}
      {section.steps && (
        <div className="article-steps">
          {section.steps.map((step, i) => (
            <StepItem key={i} step={step} index={i} category={category} />
          ))}
        </div>
      )}

      {/* Offices */}
      {section.offices && (
        <div className="article-offices">
          {section.offices.map((office, i) => (
            <OfficeItem key={i} office={office} category={category} />
          ))}
        </div>
      )}

      {/* Free aid */}
      {section.aids && (
        <div className="article-aids">
          {section.aids.map((aid, i) => (
            <FreeAidItem key={i} aid={aid} />
          ))}
        </div>
      )}

      {/* Warning special box */}
      {isWarning && section.content && (
        <WarningBox heading={section.heading} content={section.content} />
      )}

      {/* Deadline special box */}
      {isDeadline && section.content && (
        <DeadlineBox heading={section.heading} content={section.content} />
      )}
    </div>
  );
}
