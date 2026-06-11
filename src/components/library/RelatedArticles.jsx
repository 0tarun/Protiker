/**
 * RelatedArticles.jsx — Shows related articles from relatedSlugs.
 */
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import libraryService from '../../services/libraryService';

export default function RelatedArticles({ relatedSlugs, category }) {
  const navigate = useNavigate();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        if (!relatedSlugs || relatedSlugs.length === 0) return;
        const res = await libraryService.getArticlesByCategory(category.slug);
        const allInCategory = res;
        const matched = relatedSlugs
          .map((slug) => allInCategory.find((a) => a.slug === slug))
          .filter(Boolean);
        setRelated(matched);
      } catch (err) {
        console.error("Failed to fetch related articles", err);
      }
    };
    if (category?.slug) {
      fetchRelated();
    }
  }, [relatedSlugs, category]);

  if (!related || related.length === 0) return null;

  return (
    <div className="article-sidebar-card">
      <div className="article-sidebar-card-title">সম্পর্কিত প্রবন্ধ</div>
      <div className="related-articles-list">
        {related.map((article) => (
          <div
            key={article.id}
            className="related-article-item"
            onClick={() =>
              article.sections
                ? navigate(`/library/${article.categorySlug}/${article.slug}`)
                : null
            }
            style={{ cursor: article.sections ? 'pointer' : 'default' }}
          >
            <BookOpen
              size={12}
              color={category.color || '#666'}
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <span className="related-article-title">{article.titleBn}</span>
          </div>
        ))}
      </div>
      <button
        className="related-more-link"
        onClick={() => navigate(`/library/${category.slug}`)}
      >
        আরো প্রবন্ধ →
      </button>
    </div>
  );
}
