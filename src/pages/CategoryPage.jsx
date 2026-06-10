/**
 * CategoryPage.jsx — Rights Library category page (/library/:categorySlug)
 * Shows category hero, filter pills, sort, and article list.
 */
import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Briefcase, Home, Heart, ShoppingCart, Mountain,
  Shield, Users, Baby, Vote, Accessibility, ArrowLeft, BookOpen
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import ArticleCard from '../components/library/ArticleCard';
import libraryService from '../services/libraryService';
import '../styles/library.css';
import '../styles/dashboard.css';

const ICON_MAP = {
  Briefcase, Home, Heart, ShoppingCart, Mountain,
  Shield, Users, Baby, Vote, Accessibility,
};

// Simple toast hook
function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
  return { toast, showToast };
}

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const [category, setCategory] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTag, setActiveTag] = useState('সব');
  const [sortBy, setSortBy] = useState('views');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, articlesRes] = await Promise.all([
          libraryService.getCategoryBySlug(categorySlug),
          libraryService.getArticlesByCategory(categorySlug)
        ]);
        setCategory(catRes || null);
        setAllArticles(articlesRes || []);
      } catch (err) {
        console.error("Failed to load category data", err);
      } finally {
        setLoading(false);
      }
    };
    if (categorySlug) {
      fetchData();
    }
  }, [categorySlug]);

  const filtered = useMemo(() => {
    let list = [...allArticles];

    // Tag filter (subTags are comma separated from backend)
    if (activeTag !== 'সব') {
      list = list.filter((a) => {
        if (!a.tags) return false;
        const tagArray = a.tags.split(',').map(t => t.trim());
        return tagArray.includes(activeTag);
      });
    }

    // Sort
    if (sortBy === 'views') {
      list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else if (sortBy === 'date') {
      list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
    } else if (sortBy === 'easy') {
      const order = { easy: 0, medium: 1, advanced: 2 };
      list.sort((a, b) => (order[a.difficulty] ?? 9) - (order[b.difficulty] ?? 9));
    }

    return list;
  }, [allArticles, activeTag, sortBy]);

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

  if (!category) {
    return (
      <div className="lib-layout">
        <Sidebar activeItem="অধিকার লাইব্রেরি" />
        <main className="lib-main">
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", color: '#888780', padding: '2rem' }}>
            বিভাগ পাওয়া যায়নি।
          </p>
        </main>
      </div>
    );
  }

  const Icon = ICON_MAP[category.iconKey] || BookOpen;
  
  // Parse subTags from comma separated string
  const subTags = category.subTags ? category.subTags.split(',').map(t => t.trim()) : [];

  return (
    <div className="lib-layout">
      <Sidebar activeItem="অধিকার লাইব্রেরি" />

      <main className="lib-main">
        {/* Back */}
        <button className="cat-back-link" onClick={() => navigate('/library')}>
          <ArrowLeft size={16} />
          লাইব্রেরি হোম
        </button>

        {/* Category hero */}
        <div
          className="cat-hero-card"
          style={{
            background: `linear-gradient(135deg, ${category.color}1A 0%, #fff 70%)`,
            border: `1px solid ${category.color}33`,
          }}
        >
          <div
            className="cat-hero-icon-wrap"
            style={{ background: category.lightColor || '#f0f0f0' }}
          >
            <Icon size={28} color={category.color || '#666'} />
          </div>
          <div>
            <h1 className="cat-hero-name">{category.nameBn}</h1>
            <p className="cat-hero-law">প্রযোজ্য আইন: {category.lawBn}</p>
            <p className="cat-hero-desc">{category.descriptionBn}</p>
            <span
              className="cat-hero-pill"
              style={{ background: category.lightColor || '#f0f0f0', color: category.darkColor || '#333' }}
            >
              {category.articleCount || 0}টি প্রবন্ধ
            </span>
          </div>
        </div>

        {/* Filter row */}
        <div className="cat-filter-row">
          <div className="cat-filter-pills">
            {['সব', ...subTags].map((tag) => (
              <button
                key={tag}
                className="cat-filter-pill"
                style={
                  activeTag === tag
                    ? {
                        background: category.color || '#333',
                        color: '#fff',
                        borderColor: category.color || '#333',
                      }
                    : {}
                }
                onClick={() => setActiveTag(tag)}
                onMouseEnter={(e) => {
                  if (activeTag !== tag)
                    e.currentTarget.style.borderColor = category.color || '#333';
                }}
                onMouseLeave={(e) => {
                  if (activeTag !== tag)
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)';
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <select
            className="cat-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="views">সর্বাধিক পঠিত ▾</option>
            <option value="date">সর্বশেষ ▾</option>
            <option value="easy">সহজ প্রথমে ▾</option>
          </select>
        </div>

        {/* Articles */}
        <div className="cat-articles-list">
          {filtered.length === 0 && (
            <p
              style={{
                fontFamily: "'Hind Siliguri', sans-serif",
                color: '#888780',
                padding: '20px 0',
                textAlign: 'center',
              }}
            >
              কোনো প্রবন্ধ পাওয়া যায়নি।
            </p>
          )}
          {filtered.map((article, i) => (
            <ArticleCard
              key={article.id}
              article={article}
              category={category}
              index={i}
              onClick={() =>
                navigate(`/library/${categorySlug}/${article.slug}`)
              }
              onStubClick={() => showToast('শীঘ্রই আসছে!')}
            />
          ))}
        </div>
      </main>

      {/* Toast */}
      {toast && <div className="lib-toast">{toast}</div>}
    </div>
  );
}
