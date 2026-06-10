import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Send, History, CheckCircle, Clock, XCircle, Info } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import libraryService from '../services/libraryService';
import { useAuth } from '../context/AuthContext';
import '../styles/library.css';
import '../styles/dashboard.css';
import '../styles/library-mod-submit.css';

export default function LibrarySubmitPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // States
  const [categories, setCategories] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Form States
  const [categorySlug, setCategorySlug] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [readTimeMins, setReadTimeMins] = useState(5);
  const [tags, setTags] = useState('');
  
  // Laws Cited list
  const [lawsCited, setLawsCited] = useState([{ name: '', section: '' }]);
  
  // Sections list
  const [sections, setSections] = useState([
    { id: 'intro', heading: 'ভূমিকা', content: '', checklist: '', steps: '' }
  ]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Restrict access if citizen
  useEffect(() => {
    if (user && user.role === 'CITIZEN') {
      showToast('আর্টিকেল লেখার অনুমতি শুধুমাত্র স্টুডেন্ট ও রিসার্চারদের আছে।');
      setTimeout(() => navigate('/library'), 2000);
    }
  }, [user, navigate]);

  // Load Categories & Submissions
  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await libraryService.getCategories();
        setCategories(cats || []);
        if (cats && cats.length > 0) {
          setCategorySlug(cats[0].slug);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }

      setHistoryLoading(true);
      try {
        const subs = await libraryService.getMySubmissions();
        setSubmissions(subs?.data || []);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setHistoryLoading(false);
      }
    };
    loadData();
  }, []);

  // Handlers for Laws Cited
  const addLawRow = () => {
    setLawsCited([...lawsCited, { name: '', section: '' }]);
  };

  const removeLawRow = (index) => {
    const updated = [...lawsCited];
    updated.splice(index, 1);
    setLawsCited(updated);
  };

  const updateLawRow = (index, field, value) => {
    const updated = [...lawsCited];
    updated[index][field] = value;
    setLawsCited(updated);
  };

  // Handlers for Sections
  const addSection = () => {
    const newId = `section-${sections.length + 1}`;
    setSections([...sections, { id: newId, heading: '', content: '', checklist: '', steps: '' }]);
  };

  const removeSection = (index) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  const updateSection = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleBn.trim()) {
      showToast('আর্টিকেলের শিরোনাম লিখুন!');
      return;
    }

    setLoading(true);
    try {
      // Format lawsCited
      const filteredLaws = lawsCited.filter(l => l.name.trim() && l.section.trim());
      
      // Format sections
      const formattedSections = sections.map((sec, index) => {
        const item = {
          id: sec.id || `section-${index + 1}`,
          heading: sec.heading.trim(),
          content: sec.content.trim() || undefined,
        };

        if (sec.checklist.trim()) {
          item.checklist = sec.checklist.split('\n').map(s => s.trim()).filter(Boolean);
        }
        if (sec.steps.trim()) {
          item.steps = sec.steps.split('\n').map(s => s.trim()).filter(Boolean);
        }
        return item;
      });

      const payload = {
        categorySlug,
        titleBn: titleBn.trim(),
        difficulty,
        readTimeMins: parseInt(readTimeMins) || 5,
        tags: tags.trim(),
        lawsCited: JSON.stringify(filteredLaws),
        sections: JSON.stringify(formattedSections),
        relatedSlugs: ''
      };

      await libraryService.submitArticle(payload);
      showToast('আর্টিকেলটি পর্যালোচনার জন্য সফলভাবে জমা দেওয়া হয়েছে!');
      
      // Reset form
      setTitleBn('');
      setTags('');
      setLawsCited([{ name: '', section: '' }]);
      setSections([{ id: 'intro', heading: 'ভূমিকা', content: '', checklist: '', steps: '' }]);
      
      // Reload history
      const subs = await libraryService.getMySubmissions();
      setSubmissions(subs?.data || []);
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || 'আর্টিকেল জমা দিতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, rejectionReason) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="sub-badge approved">
            <CheckCircle size={12} /> অনুমোদন করা হয়েছে
          </span>
        );
      case 'REJECTED':
        return (
          <div className="sub-badge-wrap">
            <span className="sub-badge rejected">
              <XCircle size={12} /> বাতিল করা হয়েছে
            </span>
            {rejectionReason && (
              <span className="rejection-tip" title={rejectionReason}>
                <Info size={12} className="inline-info" /> {rejectionReason}
              </span>
            )}
          </div>
        );
      default:
        return (
          <span className="sub-badge pending">
            <Clock size={12} /> পর্যালোচনায় রয়েছে
          </span>
        );
    }
  };

  return (
    <div className="lib-layout">
      <Sidebar activeItem="অধিকার লাইব্রেরি" />

      <main className="lib-main">
        {/* Back Link */}
        <button className="cat-back-link" onClick={() => navigate('/library')}>
          <ArrowLeft size={16} />
          ← লাইব্রেরি হোম
        </button>

        <h1 className="lib-hero-heading" style={{ color: '#1C1B1A', marginBottom: 24, fontSize: 28 }}>
          নতুন আইনি আর্টিকেল লিখুন
        </h1>

        <div className="submit-grid">
          {/* Left Form */}
          <div className="submit-card-form">
            <form onSubmit={handleSubmit}>
              <h2 className="form-section-title">১. আর্টিকেলের সাধারণ তথ্য</h2>
              
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>আর্টিকেলের শিরোনাম (বাংলায়) *</label>
                  <input
                    type="text"
                    placeholder="উদা: বেতন না পেলে শ্রমিকের করণীয় কী?"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ক্যাটাগরি *</label>
                  <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>পাঠযোগ্যতার মাত্রা (Difficulty)</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">সহজ (Easy)</option>
                    <option value="medium">মধ্যম (Medium)</option>
                    <option value="advanced">উচ্চতর (Advanced)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>পড়তে আনুমানিক সময় (মিনিট)</label>
                  <input
                    type="number"
                    min="1"
                    value={readTimeMins}
                    onChange={(e) => setReadTimeMins(e.target.value)}
                  />
                </div>
                <div className="form-group flex-2">
                  <label>ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)</label>
                  <input
                    type="text"
                    placeholder="উদা: বেতন, শ্রম আইন, ক্ষতিপূরণ"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>

              {/* Laws Cited */}
              <h2 className="form-section-title" style={{ marginTop: 24 }}>
                ২. আইনের উল্লেখসমূহ (Laws Cited)
              </h2>
              {lawsCited.map((law, index) => (
                <div key={index} className="form-row law-row">
                  <div className="form-group flex-2">
                    <input
                      type="text"
                      placeholder="আইনের নাম (উদা: বাংলাদেশ শ্রম আইন ২০০৬)"
                      value={law.name}
                      onChange={(e) => updateLawRow(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group flex-2">
                    <input
                      type="text"
                      placeholder="সংশ্লিষ্ট ধারা (উদা: ধারা ১২৩)"
                      value={law.section}
                      onChange={(e) => updateLawRow(index, 'section', e.target.value)}
                    />
                  </div>
                  {lawsCited.length > 1 && (
                    <button
                      type="button"
                      className="btn-icon-delete"
                      onClick={() => removeLawRow(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn-secondary-sm" onClick={addLawRow}>
                <Plus size={14} /> আরও আইন যুক্ত করুন
              </button>

              {/* Content Sections */}
              <h2 className="form-section-title" style={{ marginTop: 32 }}>
                ৩. আর্টিকেলের কন্টেন্ট ও সেকশন
              </h2>
              
              {sections.map((sec, index) => (
                <div key={index} className="section-form-card">
                  <div className="section-form-header">
                    <span>সেকশন #{index + 1}</span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon-delete"
                        onClick={() => removeSection(index)}
                      >
                        <Trash2 size={16} /> মুছুন
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label>সেকশন হেডিং / শিরোনাম (বাংলায়) *</label>
                    <input
                      type="text"
                      placeholder="উদা: আপনার অধিকার বা কী করবেন"
                      value={sec.heading}
                      onChange={(e) => updateSection(index, 'heading', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>সেকশন কন্টেন্ট / বর্ণনা</label>
                    <textarea
                      rows="4"
                      placeholder="এখানে সেকশনের মূল প্যারাগ্রাফের বিবরণ বাংলায় লিখুন..."
                      value={sec.content}
                      onChange={(e) => updateSection(index, 'content', e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>চেকলিস্ট (ঐচ্ছিক - প্রতি লাইনে একটি আইটেম)</label>
                      <textarea
                        rows="3"
                        placeholder="আইটেম ১&#10;আইটেম ২"
                        value={sec.checklist}
                        onChange={(e) => updateSection(index, 'checklist', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>ধাপসমূহ / Steps (ঐচ্ছিক - প্রতি লাইনে একটি ধাপ)</label>
                      <textarea
                        rows="3"
                        placeholder="ধাপ ১&#10;ধাপ ২"
                        value={sec.steps}
                        onChange={(e) => updateSection(index, 'steps', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn-secondary-sm"
                style={{ marginTop: 12 }}
                onClick={addSection}
              >
                <Plus size={14} /> নতুন সেকশন যুক্ত করুন
              </button>

              <div className="form-actions" style={{ marginTop: 40 }}>
                <button type="submit" className="btn-primary-submit" disabled={loading}>
                  <Send size={16} /> {loading ? 'সাবমিট হচ্ছে...' : 'পর্যালোচনার জন্য পাঠান'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar - Submission History */}
          <div className="submit-card-history">
            <div className="history-header">
              <History size={18} />
              <h3>আমার সাবমিশন হিস্ট্রি</h3>
            </div>

            {historyLoading ? (
              <p className="history-loading">লোড হচ্ছে...</p>
            ) : submissions.length === 0 ? (
              <p className="history-empty">আপনি এখনও কোনো আর্টিকেল লিখেননি।</p>
            ) : (
              <div className="history-list">
                {submissions.map((sub) => (
                  <div key={sub.id} className="history-item">
                    <h4 className="history-title">{sub.titleBn}</h4>
                    <p className="history-meta">
                      বিভাগ: {categories.find(c => c.slug === sub.categorySlug)?.nameBn || sub.categorySlug} ·{' '}
                      {new Date(sub.createdAt).toLocaleDateString('bn-BD')}
                    </p>
                    <div className="history-status">
                      {getStatusBadge(sub.status, sub.rejectionReason)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Toast message */}
      {toast && <div className="lib-toast">{toast}</div>}
    </div>
  );
}
