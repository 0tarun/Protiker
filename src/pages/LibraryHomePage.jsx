/**
 * LibraryHomePage.jsx — Rights Library home page (/library)
 * Shows hero with search, category grid, most-read, and recent articles.
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Flame, Clock, ChevronRight, PenTool, ShieldCheck
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import CategoryCard from '../components/library/CategoryCard';
import SearchDropdown from '../components/library/SearchDropdown';
import libraryService from '../services/libraryService';
import { useAuth } from '../context/AuthContext';
import '../styles/library.css';
import '../styles/dashboard.css';

export default function LibraryHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ articles: [], categories: [] });
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [mostRead, setMostRead] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine role-based access
  const canWriteArticle = user && ['LAW_STUDENT', 'NGO_WORKER', 'RESEARCHER'].includes(user.role);
  const canModerate = user && user.role === 'RESEARCHER';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, mostReadRes, recentRes] = await Promise.all([
          libraryService.getCategories(),
          libraryService.getMostReadArticles(3),
          libraryService.getRecentArticles(5)
        ]);
        setCategories(catsRes || []);
        setMostRead(mostReadRes || []);
        setRecent(recentRes || []);
      } catch (error) {
        console.error("Failed to load library data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Use a debouncer in a real app, but for now simple async is fine
  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 0) {
      try {
        const res = await libraryService.search(q.trim());
        setSearchResults(res || { articles: [], categories: [] });
        setSearchOpen(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSearchResults({ articles: [], categories: [] });
      setSearchOpen(false);
    }
  };

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults({ articles: [], categories: [] });
  }, []);

  const getCategoryBySlug = (slug) => categories.find(c => c.slug === slug);

  return (
    <div className="lib-layout">
      <Sidebar activeItem="অধিকার লাইব্রেরি" />

      <main className="lib-main">
        {/* ── HERO ── */}
        <section className="lib-hero">
          <div className="lib-hero-circle-a" />
          <div className="lib-hero-circle-b" />

          <div className="lib-hero-content">
            {/* Left */}
            <div className="lib-hero-left">
              <div className="lib-hero-badge">
                <BookOpen size={24} color="#fff" />
              </div>
              <h1 className="lib-hero-heading">অধিকার লাইব্রেরি</h1>
              <p className="lib-hero-tagline">
                আপনার অধিকার জানুন — সহজ বাংলায়
              </p>

              {/* Action Buttons for Authorized Users */}
              <div className="lib-hero-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', zIndex: 2 }}>
                {canWriteArticle && (
                  <button 
                    onClick={() => navigate('/library/submit')}
                    style={{
                      background: '#fff', color: '#1D9E75', padding: '0.6rem 1.2rem', 
                      borderRadius: '8px', fontWeight: 'bold', border: 'none', 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <PenTool size={18} />
                    নতুন আর্টিকেল লিখুন
                  </button>
                )}
                {canModerate && (
                  <button 
                    onClick={() => navigate('/library/moderation')}
                    style={{
                      background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.6rem 1.2rem', 
                      borderRadius: '8px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.4)', 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <ShieldCheck size={18} />
                    মডারেশন প্যানেল
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="lib-search-wrap" ref={searchRef} style={{ marginTop: '2rem' }}>
                <span className="lib-search-icon">
                  <Search size={18} />
                </span>
                <input
                  id="library-search-input"
                  type="text"
                  className="lib-search-input"
                  placeholder="আইন বা বিষয় খুঁজুন..."
                  value={searchQuery}
                  onChange={handleSearch}
                  autoComplete="off"
                />
                {searchOpen && (
                  <SearchDropdown
                    results={searchResults}
                    categories={categories}
                    onClose={closeSearch}
                  />
                )}
              </div>
            </div>

            {/* Right — stats */}
            <div className="lib-hero-right">
              <div className="lib-hero-stats">
                <div className="lib-hero-stat">
                  <span className="lib-hero-stat-val">৬০+</span>
                  <span className="lib-hero-stat-label">প্রবন্ধ</span>
                </div>
                <div className="lib-hero-stat-div" />
                <div className="lib-hero-stat">
                  <span className="lib-hero-stat-val">{categories.length || '১০'}</span>
                  <span className="lib-hero-stat-label">বিভাগ</span>
                </div>
                <div className="lib-hero-stat-div" />
                <div className="lib-hero-stat">
                  <span className="lib-hero-stat-val" style={{ fontSize: 16 }}>
                    বিনামূল্যে
                  </span>
                  <span className="lib-hero-stat-label">সম্পূর্ণ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES GRID ── */}
        <section className="lib-categories-section">
          <div className="lib-section-header">
            <span className="lib-section-title">বিভাগ অনুযায়ী</span>
            <button className="lib-section-link">সব বিভাগ</button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>লোড হচ্ছে...</div>
          ) : (
            <div className="lib-categories-grid">
              {categories.map((cat, i) => (
                <CategoryCard
                  key={cat.slug}
                  category={cat}
                  index={i}
                  onClick={() => navigate(`/library/${cat.slug}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── MOST READ ── */}
        <section className="lib-most-read">
          <div className="lib-section-header">
            <span className="lib-section-title">
              <Flame size={20} color="#E24B4A" />
              সবচেয়ে বেশি পঠিত
            </span>
            <button
              className="lib-section-link"
              onClick={() => navigate('/library')}
            >
              সব প্রবন্ধ
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>লোড হচ্ছে...</div>
          ) : (
            <div className="lib-most-read-grid">
              {mostRead.map((article, i) => {
                const cat = getCategoryBySlug(article.categorySlug);
                return (
                  <div
                    key={article.id}
                    className="lib-most-read-card"
                    onClick={() =>
                      navigate(`/library/${article.categorySlug}/${article.slug}`)
                    }
                  >
                    <span
                      className="lib-rank-badge"
                      style={{ background: i === 0 ? '#1D9E75' : '#4A4845' }}
                    >
                      {['১', '২', '৩'][i] || i + 1}
                    </span>
                    <div
                      className="lib-most-read-dot"
                      style={{ background: cat?.color || '#ccc' }}
                    />
                    <p className="lib-most-read-title">{article.titleBn}</p>
                    <p className="lib-most-read-meta">
                      {cat?.nameBn || 'বিভাগ'} · {article.viewCount?.toLocaleString('bn-BD')} বার · {article.readTimeMins} মিনিট
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── RECENT ARTICLES ── */}
        <section className="lib-recent-section">
          <div className="lib-section-header">
            <span className="lib-section-title">
              <Clock size={18} color="#888780" />
              সাম্প্রতিক প্রবন্ধ
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>লোড হচ্ছে...</div>
          ) : (
            <div className="lib-recent-list">
              {recent.map((article) => {
                const cat = getCategoryBySlug(article.categorySlug);
                return (
                  <div
                    key={article.id}
                    className="lib-recent-item"
                    onClick={() =>
                      article.sections
                        ? navigate(`/library/${article.categorySlug}/${article.slug}`)
                        : navigate(`/library/${article.categorySlug}`)
                    }
                  >
                    <div
                      className="lib-recent-icon-wrap"
                      style={{ background: cat?.lightColor || '#f0f0f0' }}
                    >
                      <BookOpen size={16} color={cat?.color || '#666'} />
                    </div>
                    <div className="lib-recent-mid">
                      <div className="lib-recent-title">{article.titleBn}</div>
                      <div className="lib-recent-meta">
                        {cat?.nameBn || 'বিভাগ'} · {article.readTimeMins} মিনিট ·{' '}
                        {new Date(article.publishedAt).toLocaleDateString('bn-BD')}
                      </div>
                    </div>
                    <ChevronRight size={16} className="lib-recent-chevron" />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
