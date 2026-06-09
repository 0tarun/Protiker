/**
 * DocumentsPage — Lists all user-generated legal documents.
 * Features: filter tabs, search, sort, 3-dot menu, download/view actions.
 * Route: /documents
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, FilePlus, Download, Edit, CheckCircle, Search,
  MoreVertical, Eye, Share2, Trash2, Calendar, MessageCircle, FileX, Loader2
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import { docStatusConfig } from '../data/mockDocuments';
import documentService from '../services/documentService';
import '../styles/documents.css';

const filterTabs = [
  { key: 'all', label: 'সব দলিল' },
  { key: 'draft', label: 'খসড়া' },
  { key: 'generated', label: 'তৈরি হয়েছে' },
  { key: 'downloaded', label: 'ডাউনলোড' },
  { key: 'submitted', label: 'জমা দেওয়া' },
];

/**
 * Formats ISO date string to Bengali-friendly display.
 */
function formatDate(isoStr) {
  const d = new Date(isoStr);
  const today = new Date();
  const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'আজ';
  if (diffDays === 1) return 'গতকাল';
  return `${diffDays} দিন আগে`;
}

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [docStats, setDocStats] = useState({
    totalDocs: 0,
    downloaded: 0,
    drafts: 0,
    submitted: 0
  });
  const [loading, setLoading] = useState(true);

  /* Click outside handler for dropdown menus */
  const handleClickOutside = useCallback((e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenu(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  /* Fetch Documents from API */
  useEffect(() => {
    async function loadDocs() {
      setLoading(true);
      try {
        const res = await documentService.getUserDocuments(activeFilter);
        if (res.data) setDocuments(res.data);
        if (res.stats) {
          setDocStats({
            totalDocs: res.stats.total || 0,
            downloaded: res.stats.downloaded || 0,
            drafts: res.stats.drafts || 0,
            submitted: res.stats.submitted || 0
          });
        }
      } catch (e) {
        console.error('Failed to load documents', e);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, [activeFilter]);

  const stats = [
    { icon: FileText, bg: '#E1F5EE', color: '#1D9E75', val: docStats.totalDocs, label: 'মোট দলিল' },
    { icon: Download, bg: '#E6F1FB', color: '#378ADD', val: docStats.downloaded, label: 'ডাউনলোড' },
    { icon: Edit, bg: '#FAEEDA', color: '#EF9F27', val: docStats.drafts, label: 'খসড়া' },
    { icon: CheckCircle, bg: '#EAF3DE', color: '#639922', val: docStats.submitted, label: 'জমা দেওয়া' },
  ];

  /* Search logic locally on fetched data */
  let filtered = documents.filter((doc) => {
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  /* Sort logic */
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'name') return a.name.localeCompare(b.name, 'bn');
    return 0;
  });

  const handleDownload = async (id, e) => {
    e?.stopPropagation();
    try {
      const response = await documentService.downloadDocument(id);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `protiker-document-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Optionally refresh docs to update downloaded status
      const res = await documentService.getUserDocuments(activeFilter);
      if (res.data) setDocuments(res.data);
      if (res.stats) {
        setDocStats({
          totalDocs: res.stats.total || 0,
          downloaded: res.stats.downloaded || 0,
          drafts: res.stats.drafts || 0,
          submitted: res.stats.submitted || 0
        });
      }
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <div className="doc-layout">
      <Sidebar activeItem="আমার দলিলপত্র" />
      <main className="doc-main">
        {/* Top Bar */}
        <div className="doc-topbar">
          <div>
            <div className="doc-topbar-title">আমার দলিলপত্র</div>
            <div className="doc-topbar-sub">আপনার তৈরি সকল আইনি দলিল</div>
          </div>
          <div className="doc-topbar-right">
            <button
              className="doc-btn-primary"
              id="doc-new-btn"
              onClick={() => navigate('/documents/new')}
            >
              <FilePlus size={16} />
              + নতুন দলিল তৈরি
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="doc-stats-bar">
          {stats.map((s) => (
            <div className="doc-stat-card" key={s.label}>
              <div className="doc-stat-icon" style={{ background: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <div className="doc-stat-val">{s.val}</div>
                <div className="doc-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Row */}
        <div className="doc-filter-row">
          <div className="doc-filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                className={`doc-filter-tab${activeFilter === tab.key ? ' active' : ''}`}
                onClick={() => setActiveFilter(tab.key)}
                id={`doc-filter-${tab.key}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="doc-filter-right">
            <div className="doc-search-wrap">
              <span className="doc-search-icon"><Search size={16} /></span>
              <input
                className="doc-search"
                type="text"
                placeholder="দলিল খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="doc-search-input"
              />
            </div>
            <select
              className="doc-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="doc-sort"
            >
              <option value="latest">সর্বশেষ</option>
              <option value="oldest">পুরনো</option>
              <option value="name">নাম অনুযায়ী</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Loader2 className="animate-spin" color="#1D9E75" size={48} />
          </div>
        ) : (
          /* Document Cards */
          filtered.length > 0 ? (
            <div className="doc-cards-grid">
              {filtered.map((doc) => {
                const statusCfg = docStatusConfig[doc.status] || docStatusConfig.draft;
                return (
                  <div className="doc-card" key={doc.id}>
                    <div className="doc-card-top">
                      <div className="doc-card-icon" style={{ background: doc.iconBg || '#E6F1FB' }}>
                        <FileText size={20} color={doc.iconColor || '#378ADD'} />
                      </div>
                      <button
                        className="doc-card-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === doc.id ? null : doc.id);
                        }}
                        id={`doc-menu-${doc.id}`}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    {/* Dropdown */}
                    {openMenu === doc.id && (
                      <div className="doc-card-dropdown" ref={menuRef}>
                        <button className="doc-card-dropdown-item" onClick={(e) => handleDownload(doc.id, e)}>
                          <Download size={14} /> ডাউনলোড করুন
                        </button>
                        {doc.status === 'draft' ? (
                          <button
                            className="doc-card-dropdown-item"
                            onClick={() => navigate(`/documents/edit/${doc.id}`)}
                          >
                            <Edit size={14} /> এডিট করুন
                          </button>
                        ) : (
                          <button
                            className="doc-card-dropdown-item"
                            onClick={() => navigate(`/documents/${doc.id}`)}
                          >
                            <Eye size={14} /> দেখুন
                          </button>
                        )}
                        <button className="doc-card-dropdown-item">
                          <Share2 size={14} /> শেয়ার করুন
                        </button>
                        <button className="doc-card-dropdown-item danger">
                          <Trash2 size={14} /> মুছুন
                        </button>
                      </div>
                    )}

                    <div className="doc-card-name">{doc.name}</div>
                    <div
                      className="doc-status-pill"
                      style={{ background: statusCfg.bg, color: statusCfg.color }}
                    >
                      {statusCfg.text}
                    </div>

                    <div className="doc-card-meta">
                      <span className="doc-card-meta-item">
                        <Calendar size={12} /> {formatDate(doc.createdAt)}
                      </span>
                      {doc.generationMethod === 'chat_linked' && (
                        <span className="doc-card-meta-item chat-linked">
                          <MessageCircle size={12} /> চ্যাট থেকে তৈরি
                        </span>
                      )}
                    </div>

                    <div className="doc-card-divider" />

                    <div className="doc-card-bottom">
                      <button className="doc-card-download-btn" id={`doc-dl-${doc.id}`} onClick={(e) => handleDownload(doc.id, e)}>
                        <Download size={14} /> PDF ডাউনলোড
                      </button>
                      <button
                        className="doc-card-view-btn"
                        onClick={() => navigate(doc.status === 'draft' ? `/documents/edit/${doc.id}` : `/documents/${doc.id}`)}
                        id={`doc-view-${doc.id}`}
                      >
                        {doc.status === 'draft' ? <Edit size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="doc-empty">
              <div className="doc-empty-icon"><FileX size={64} /></div>
              <div className="doc-empty-title">এখনো কোনো দলিল তৈরি হয়নি</div>
              <div className="doc-empty-sub">
                প্রথম দলিল তৈরি করতে উপরের বোতামে ক্লিক করুন
              </div>
              <button className="doc-btn-primary" onClick={() => navigate('/documents/new')}>
                <FilePlus size={16} /> + নতুন দলিল তৈরি
              </button>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export { DocumentsPage };
