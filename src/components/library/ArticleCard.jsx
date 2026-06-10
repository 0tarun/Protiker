/**
 * ArticleCard.jsx — Article card for the CategoryPage.
 * Handles full articles and stub articles differently.
 */
import { Clock, Eye, Star, ChevronRight, BookOpen } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';

export default function ArticleCard({ article, category, index, onStubClick, onClick }) {
  const isStub = !article.sections;

  // The backend returns sections as JSON string, we might need to parse it if it's not already parsed by axios
  let parsedSections = article.sections;
  if (typeof parsedSections === 'string') {
    try {
      parsedSections = JSON.parse(parsedSections);
    } catch (e) {
      parsedSections = null;
    }
  }

  const summary = parsedSections?.[0]?.content?.slice(0, 140) || '';

  return (
    <div
      className={`cat-article-card${isStub ? ' stub' : ''}`}
      style={{
        animationDelay: `${index * 60}ms`,
        borderColor: 'rgba(0,0,0,0.07)',
      }}
      onClick={isStub ? onStubClick : onClick}
      onMouseEnter={(e) => {
        if (!isStub)
          e.currentTarget.style.borderColor = `${category.color}4D`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)';
      }}
    >
      {/* Left icon */}
      <div
        className="cat-article-icon-wrap"
        style={{ background: category.lightColor || '#f0f0f0' }}
      >
        <BookOpen size={20} color={category.color || '#666'} />
      </div>

      {/* Middle content */}
      <div className="cat-article-mid">
        {/* Top row */}
        <div className="cat-article-top">
          <span className="cat-article-title">
            {article.titleBn}
            {isStub && (
              <span className="cat-article-stub-badge">শীঘ্রই আসছে</span>
            )}
          </span>
          {article.difficulty && (
            <DifficultyBadge difficulty={article.difficulty} />
          )}
        </div>

        {/* Meta */}
        <div className="cat-article-meta">
          {article.readTimeMins && (
            <span className="cat-article-meta-item">
              <Clock size={12} />
              {article.readTimeMins} মিনিটে পড়া যায়
            </span>
          )}
          {article.viewCount !== undefined && (
            <span className="cat-article-meta-item">
              <Eye size={12} />
              {article.viewCount.toLocaleString('bn-BD')} বার পড়া হয়েছে
            </span>
          )}
          {article.avgRating > 0 && (
            <span className="cat-article-meta-item">
              <Star size={12} color="#EF9F27" fill="#EF9F27" />
              {article.avgRating}
            </span>
          )}
        </div>

        {/* Summary or stub message */}
        {!isStub && summary && (
          <p className="cat-article-summary">{summary}</p>
        )}
        {isStub && (
          <p className="cat-article-stub-text">এই প্রবন্ধটি শীঘ্রই যোগ হবে।</p>
        )}

        {/* Law tags */}
        {!isStub && article.lawsCited && article.lawsCited.length > 0 && (
          <div className="cat-article-law-tags">
            {(typeof article.lawsCited === 'string' ? JSON.parse(article.lawsCited) : article.lawsCited).map((law, i) => (
              <span
                key={i}
                className="cat-law-tag"
                style={{
                  background: category.lightColor || '#f0f0f0',
                  color: category.darkColor || '#333',
                }}
              >
                {law.section}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right chevron */}
      <ChevronRight
        size={18}
        className="cat-article-chevron"
        style={{ color: '#888780' }}
      />
    </div>
  );
}
