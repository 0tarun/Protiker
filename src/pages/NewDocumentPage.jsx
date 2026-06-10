/**
 * NewDocumentPage — Document type picker page.
 * User selects a template category and then a specific document template.
 * Features: category filter pills, template cards, chat banner, sticky bottom bar.
 * Route: /documents/new
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, FileText, ArrowRight, Building, ListChecks, Sparkles, Loader2
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import documentService from '../services/documentService';
import '../styles/documents.css';

export default function NewDocumentPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('সব ধরন');
  const [categories, setCategories] = useState(['সব ধরন']);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Check for chat session link */
  const hasSession = !!localStorage.getItem('protiker_chat_session');

  /* Fetch categories on mount */
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await documentService.getCategories();
        if (res.success && res.data) {
          const catNames = res.data.map(c => c.nameBn);
          setCategories(['সব ধরন', ...catNames]);
        }
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    }
    loadCategories();
  }, []);

  /* Fetch templates when category changes */
  useEffect(() => {
    async function loadTemplates() {
      setLoading(true);
      try {
        const res = await documentService.getTemplates(activeCategory);
        if (res.success && res.data) {
          setTemplates(res.data);
        }
      } catch (e) {
        console.error('Failed to load templates', e);
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, [activeCategory]);

  return (
    <div className="doc-layout">
      <Sidebar activeItem="আমার দলিলপত্র" />
      <main className="doc-main">
        {/* Back link */}
        <button className="doc-back-link" onClick={() => navigate('/documents')}>
          <ChevronLeft size={20} /> ফিরে যান
        </button>

        {/* Page header */}
        <div className="doc-page-title">কোন ধরনের দলিল চাই?</div>
        <div className="doc-page-subtitle">সমস্যা অনুযায়ী দলিলের ধরন বেছে নিন</div>

        {/* Chat linked banner */}
        {hasSession && (
          <div className="doc-chat-banner">
            <div className="doc-chat-banner-icon">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="doc-chat-banner-title">
                চ্যাট থেকে তথ্য স্বয়ংক্রিয়ভাবে পূরণ হবে
              </div>
              <div className="doc-chat-banner-sub">
                Proti আপনার কথোপকথন থেকে দলিলের তথ্য নিজেই ভরে দেবে।
              </div>
            </div>
            <button className="doc-chat-banner-link" onClick={() => navigate('/chat')}>
              চ্যাটে ফিরুন
            </button>
          </div>
        )}

        {/* Category pills */}
        <div className="doc-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`doc-category-pill${activeCategory === cat ? ' active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedTemplate(null);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" color="#1D9E75" size={32} />
          </div>
        )}

        {/* Template cards grid */}
        {!loading && (
          <div className="doc-template-grid">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className={`doc-template-card${selectedTemplate?.id === tpl.id ? ' selected' : ''}`}
                onClick={() => setSelectedTemplate(tpl)}
                id={`tpl-${tpl.slug}`}
              >
                {tpl.mvp && <div className="doc-mvp-badge">MVP</div>}

                <div className="doc-template-icon" style={{ background: tpl.iconBg || '#E6F1FB' }}>
                  <FileText size={22} color={tpl.iconColor || '#378ADD'} />
                </div>
                <div className="doc-template-title">{tpl.nameBn}</div>
                <div className="doc-template-law">{tpl.legalBasis}</div>
                <div className="doc-template-desc">{tpl.description}</div>

                <div className="doc-template-divider" />

                <div className="doc-template-bottom">
                  <div className="doc-template-meta">
                    <Building size={13} /> বরাবর: {tpl.addressedTo}
                  </div>
                  <div className="doc-template-meta">
                    <ListChecks size={13} /> {tpl.fieldCount}টি তথ্য
                  </div>
                </div>
              </div>
            ))}
            {templates.length === 0 && (
              <div style={{ padding: '20px', color: '#666' }}>কোনো টেমপ্লেট পাওয়া যায়নি।</div>
            )}
          </div>
        )}

        {/* Sticky bottom bar — shown when template is selected */}
        {selectedTemplate && (
          <div className="doc-sticky-bar">
            <div className="doc-sticky-bar-info">
              <div className="doc-sticky-bar-name">{selectedTemplate.nameBn}</div>
              <div className="doc-sticky-bar-law">{selectedTemplate.legalBasis}</div>
            </div>
            <div className="doc-sticky-bar-actions">
              <button
                className="doc-btn-cancel"
                onClick={() => setSelectedTemplate(null)}
              >
                বাতিল করুন
              </button>
              <button
                className="doc-btn-proceed"
                onClick={() => {
                  const searchParams = new URLSearchParams(window.location.search);
                  const caseId = searchParams.get('caseId');
                  navigate(`/documents/create/${selectedTemplate.slug}${caseId ? `?caseId=${caseId}` : ''}`);
                }}
                id="doc-proceed-btn"
              >
                এই দলিল তৈরি করুন <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export { NewDocumentPage };
