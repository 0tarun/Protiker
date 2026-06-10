/**
 * ArticlePage.jsx — Full article reader page (/library/:categorySlug/:articleSlug)
 * Features: reading progress bar, sticky TOC, engagement, share, quick actions.
 */
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock, Eye, Star, Printer, FilePlus, MessageCircle, Phone,
  Briefcase, Home, Heart, ShoppingCart, Mountain,
  Shield, Users, Baby, Vote, Accessibility, ThumbsUp, BookOpen
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import ArticleSection from '../components/library/ArticleSection';
import DifficultyBadge from '../components/library/DifficultyBadge';
import TableOfContents from '../components/library/TableOfContents';
import RelatedArticles from '../components/library/RelatedArticles';
import EngagementSection from '../components/library/EngagementSection';
import ShareCard from '../components/library/ShareCard';
import libraryService from '../services/libraryService';
import '../styles/library.css';
import '../styles/dashboard.css';

const ICON_MAP = {
  Briefcase, Home, Heart, ShoppingCart, Mountain,
  Shield, Users, Baby, Vote, Accessibility,
};

export default function ArticlePage() {
  const { categorySlug, articleSlug } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const [article, setArticle] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch article and category
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, artRes] = await Promise.all([
          libraryService.getCategoryBySlug(categorySlug),
          libraryService.getArticleDetail(categorySlug, articleSlug)
        ]);
        setCategory(catRes || null);
        
        const fetchedArticle = artRes || {};
        // Parse sections and related_slugs if they are strings
        if (typeof fetchedArticle.sections === 'string') {
          try {
            fetchedArticle.sections = JSON.parse(fetchedArticle.sections);
          } catch (e) {
            fetchedArticle.sections = null;
          }
        }
        if (typeof fetchedArticle.relatedSlugs === 'string') {
          fetchedArticle.relatedSlugs = fetchedArticle.relatedSlugs.split(',').map(s => s.trim()).filter(Boolean);
        }
        setArticle(fetchedArticle);
      } catch (err) {
        console.error("Failed to load article detail:", err);
      } finally {
        setLoading(false);
      }
    };
    if (categorySlug && articleSlug) {
      fetchData();
    }
  }, [categorySlug, articleSlug]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const p = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, p));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="lib-layout">
        <Sidebar activeItem="অধিকার লাইব্রেরি" />
        <main className="lib-main">
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", color: '#888780', padding: '2rem' }}>
            লোড হচ্ছে...
          </p>
        </main>
      </div>
    );
  }

  if (!article || !category) {
    return (
      <div className="lib-layout">
        <Sidebar activeItem="অধিকার লাইব্রেরি" />
        <main className="lib-main">
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", color: '#888780', padding: '2rem' }}>
            প্রবন্ধ পাওয়া যায়নি।
          </p>
        </main>
      </div>
    );
  }

  // Stub article
  if (!article.sections) {
    return (
      <div className="lib-layout">
        <Sidebar activeItem="অধিকার লাইব্রেরি" />
        <main className="lib-main">
          <button className="cat-back-link" onClick={() => navigate(`/library/${categorySlug}`)}>
            ← {category.nameBn}
          </button>
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 40,
              textAlign: 'center',
              border: '1px solid rgba(0,0,0,0.07)',
              marginTop: 20,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: category.lightColor || '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Clock size={28} color={category.color || '#666'} />
            </div>
            <h1
              style={{
                fontFamily: "'Hind Siliguri', sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: '#1C1B1A',
                marginBottom: 8,
              }}
            >
              {article.titleBn}
            </h1>
            <p
              style={{
                fontFamily: "'Hind Siliguri', sans-serif",
                fontSize: 15,
                color: '#888780',
              }}
            >
              এই প্রবন্ধটি শীঘ্রই যোগ হবে। আমরা কাজ করছি।
            </p>
          </div>
        </main>
      </div>
    );
  }

  const CategoryIcon = ICON_MAP[category.iconKey] || BookOpen;

  const handleProtiChat = () => {
    localStorage.setItem(
      'protiker_library_context',
      JSON.stringify({
        articleSlug: article.slug,
        articleTitle: article.titleBn,
        categorySlug: article.categorySlug,
        categoryName: category.nameBn,
      })
    );
    navigate('/chat');
  };

  // Render stars
  const renderStars = (rating) => {
    const filled = Math.round(rating || 0);
    return (
      <span className="star-rating">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={12}
            color="#EF9F27"
            fill={i < filled ? '#EF9F27' : 'none'}
          />
        ))}
      </span>
    );
  };

  return (
    <div className="lib-layout">
      {/* Reading progress bar */}
      <div className="lib-progress-bar">
        <div className="lib-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <Sidebar activeItem="অধিকার লাইব্রেরি" />

      <main className="article-page-wrap" style={{ marginLeft: 260, minHeight: '100vh', background: '#F4F6F8' }}>
        {/* Breadcrumb */}
        <nav className="article-breadcrumb">
          <span onClick={() => navigate('/library')}>লাইব্রেরি</span>
          <span className="sep">→</span>
          <span onClick={() => navigate(`/library/${categorySlug}`)}>
            {category.nameBn}
          </span>
          <span className="sep">→</span>
          <span style={{ color: '#1C1B1A', cursor: 'default' }}>
            এই প্রবন্ধ
          </span>
        </nav>

        {/* Main layout */}
        <div className="article-layout">
          {/* Left column */}
          <div>
            {/* Article header */}
            <div
              className="article-header-card"
              style={{
                background: `linear-gradient(135deg, ${category.lightColor || '#f0f0f0'} 0%, rgba(255,255,255,0) 60%)`,
                border: `1px solid ${category.color || '#ccc'}26`,
              }}
            >
              <div
                className="article-header-blob"
                style={{ background: category.color || '#666' }}
              />

              {/* Category badge */}
              <div
                className="article-category-badge"
                style={{ background: category.lightColor || '#f0f0f0', color: category.darkColor || '#333' }}
              >
                {CategoryIcon && <CategoryIcon size={14} />}
                {category.nameBn}
              </div>

              {/* Title */}
              <h1 className="article-title">{article.titleBn}</h1>

              {/* Meta */}
              <div className="article-meta-row">
                {article.difficulty && <DifficultyBadge difficulty={article.difficulty} />}
                <span className="article-meta-item">
                  <Clock size={13} />
                  {article.readTimeMins} মিনিটে পড়া যায়
                </span>
                <span className="article-meta-item">
                  <Eye size={13} />
                  {article.viewCount?.toLocaleString('bn-BD')} বার পড়া হয়েছে
                </span>
                <span className="article-meta-item">
                  {renderStars(article.avgRating)}
                  {article.avgRating}
                </span>
                <span className="article-meta-item">
                  <Clock size={13} />
                  {new Date(article.publishedAt || Date.now()).toLocaleDateString('bn-BD')}
                </span>
              </div>
            </div>

            {/* Article sections */}
            <div className="article-sections-wrap">
              {Array.isArray(article.sections) && article.sections.map((section, i) => (
                <ArticleSection
                  key={section.id || i}
                  section={section}
                  category={category}
                  index={i}
                />
              ))}
            </div>

            {/* Engagement */}
            <EngagementSection article={article} />
          </div>

          {/* Right sidebar */}
          <div className="article-sidebar">
            {/* Quick actions */}
            <div className="article-sidebar-card">
              <div className="article-sidebar-card-title">দ্রুত পদক্ষেপ</div>

              <button className="qa-btn primary" onClick={handleProtiChat}>
                <MessageCircle size={16} color="#fff" />
                Proti-কে জিজ্ঞেস করুন
              </button>

              <button
                className="qa-btn secondary"
                style={{ background: category.lightColor || '#f0f0f0', color: category.darkColor || '#333' }}
                onClick={() => navigate('/documents/new')}
              >
                <FilePlus size={16} />
                দলিল তৈরি করুন
              </button>

              <button
                className="qa-btn tertiary"
                onClick={() => window.print()}
              >
                <Printer size={14} />
                প্রিন্ট করুন
              </button>
            </div>

            {/* Table of contents */}
            <TableOfContents sections={Array.isArray(article.sections) ? article.sections : []} />

            {/* Article stats */}
            <div className="article-sidebar-card">
              <div className="article-sidebar-card-title" style={{ marginBottom: 12 }}>
                প্রবন্ধের তথ্য
              </div>
              <div className="article-stats-list">
                <div className="article-stat-item">
                  <Eye size={14} color="#888780" />
                  {article.viewCount?.toLocaleString('bn-BD')} বার পড়া হয়েছে
                </div>
                <div className="article-stat-item">
                  {renderStars(article.avgRating)}
                  {article.avgRating}/৫ রেটিং
                </div>
                <div className="article-stat-item" style={{ color: '#1D9E75' }}>
                  <ThumbsUp size={14} color="#1D9E75" />
                  {article.helpfulCount || 0} জন সাহায্যকর বলেছেন
                </div>
              </div>
            </div>

            {/* Related articles */}
            {article.relatedSlugs && article.relatedSlugs.length > 0 && (
              <RelatedArticles
                relatedSlugs={article.relatedSlugs}
                category={category}
              />
            )}

            {/* Share */}
            <ShareCard article={article} category={category} />
          </div>
        </div>
      </main>
    </div>
  );
}
