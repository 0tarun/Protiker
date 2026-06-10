/**
 * SearchDropdown.jsx — Real-time search results dropdown.
 * Appears in the LibraryHomePage hero search bar.
 */
import { useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchDropdown({ results, categories: allCategories = [], onClose }) {
  const navigate = useNavigate();
  const ref = useRef(null);

  const { articles, categories } = results;
  const hasResults = articles.length > 0 || categories.length > 0;

  const getCategoryBySlug = (slug) => allCategories.find((c) => c.slug === slug);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleArticleClick = (article) => {
    onClose();
    navigate(`/library/${article.categorySlug}/${article.slug}`);
  };

  const handleCategoryClick = (category) => {
    onClose();
    navigate(`/library/${category.slug}`);
  };

  return (
    <div className="lib-search-dropdown" ref={ref}>
      {!hasResults && (
        <p className="lib-search-no-result">কোনো ফলাফল পাওয়া যায়নি</p>
      )}

      {articles.length > 0 && (
        <>
          <div className="lib-search-section-label">প্রবন্ধ</div>
          {articles.map((article) => {
            const cat = getCategoryBySlug(article.categorySlug);
            return (
              <div
                key={article.id}
                className="lib-search-result-item"
                onClick={() => handleArticleClick(article)}
              >
                <BookOpen
                  size={14}
                  color={cat?.color || '#1D9E75'}
                  style={{ flexShrink: 0 }}
                />
                <div className="lib-search-result-mid">
                  <div className="lib-search-result-title">{article.titleBn}</div>
                  <div className="lib-search-result-meta">{cat?.nameBn || ''}</div>
                </div>
                <span className="lib-search-read-link">পড়ুন →</span>
              </div>
            );
          })}
        </>
      )}

      {articles.length > 0 && categories.length > 0 && (
        <div className="lib-search-divider" />
      )}

      {categories.length > 0 && (
        <>
          <div className="lib-search-section-label">বিভাগ</div>
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="lib-search-result-item"
              onClick={() => handleCategoryClick(cat)}
            >
              <BookOpen size={14} color={cat.color} style={{ flexShrink: 0 }} />
              <div className="lib-search-result-mid">
                <div className="lib-search-result-title">{cat.nameBn}</div>
                <div className="lib-search-result-meta">{cat.descriptionBn}</div>
              </div>
              <span className="lib-search-read-link">দেখুন →</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
