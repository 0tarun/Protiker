import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ShieldAlert, BookOpen, AlertCircle, FileText, User } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import libraryService from '../services/libraryService';
import { useAuth } from '../context/AuthContext';
import '../styles/library.css';
import '../styles/dashboard.css';
import '../styles/library-mod-submit.css';

export default function LibraryModerationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // States
  const [pendingList, setPendingList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Restrict access if not researcher
  useEffect(() => {
    if (user && user.role !== 'RESEARCHER') {
      showToast('মডারেশন প্যানেল শুধুমাত্র গবেষকদের (Researcher) জন্য সংরক্ষিত।');
      setTimeout(() => navigate('/library'), 2000);
    }
  }, [user, navigate]);

  // Load pending list & categories
  const loadPending = async () => {
    setLoading(true);
    try {
      const cats = await libraryService.getCategories();
      setCategories(cats || []);
      
      const list = await libraryService.getPendingArticles();
      const articles = list?.data || [];
      setPendingList(articles);
      
      // Auto select first
      if (articles && articles.length > 0) {
        setSelectedArticle(articles[0]);
      } else {
        setSelectedArticle(null);
      }
    } catch (err) {
      console.error(err);
      showToast('পেন্ডিং আর্টিকেল তালিকা লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  // Handle Approve
  const handleApprove = async (id) => {
    if (!window.confirm('আপনি কি এই আর্টিকেলটি অনুমোদন করতে চান? অনুমোদনের পর এটি চ্যাটবট এবং লাইব্রেরিতে লাইভ হয়ে যাবে।')) {
      return;
    }
    try {
      await libraryService.reviewArticle(id, true);
      showToast('আর্টিকেলটি সফলভাবে অনুমোদন করা হয়েছে এবং ইনডেক্সিং শুরু হয়েছে!');
      loadPending();
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || 'অনুমোদন ব্যর্থ হয়েছে।');
    }
  };

  // Handle Reject Submit
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      showToast('বাতিল করার কারণটি বাংলায় বিস্তারিত লিখুন!');
      return;
    }
    try {
      await libraryService.reviewArticle(selectedArticle.id, false, rejectionReason.trim());
      showToast('আর্টিকেলটি বাতিল করা হয়েছে এবং লেখককে ফিডব্যাক পাঠানো হয়েছে।');
      setRejecting(false);
      setRejectionReason('');
      loadPending();
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || 'বাতিলকরণ ব্যর্থ হয়েছে।');
    }
  };

  // Parse JSON safe
  const parseJsonSafe = (str, fallback = []) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
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

        <div className="mod-header-wrap">
          <div className="mod-header-left">
            <ShieldAlert size={26} color="#0F6E56" />
            <h1 className="lib-hero-heading" style={{ color: '#1C1B1A', margin: 0, fontSize: 26 }}>
              লাইব্রেরি মডারেশন প্যানেল
            </h1>
          </div>
          <span className="mod-count-badge">{pendingList.length}টি পেন্ডিং রিভিউ</span>
        </div>

        {loading ? (
          <p className="history-loading" style={{ marginTop: 40 }}>লোড হচ্ছে...</p>
        ) : pendingList.length === 0 ? (
          <div className="mod-empty-state">
            <AlertCircle size={48} color="#888780" />
            <p className="mod-empty-text">পর্যালোচনার জন্য এই মুহূর্তে কোনো আর্টিকেল নেই।</p>
          </div>
        ) : (
          <div className="mod-grid">
            {/* Left Queue */}
            <div className="mod-queue-card">
              <h3>পেন্ডিং সাবমিশন কিউ</h3>
              <div className="mod-queue-list">
                {pendingList.map((art) => (
                  <div
                    key={art.id}
                    className={`mod-queue-item ${selectedArticle?.id === art.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedArticle(art);
                      setRejecting(false);
                    }}
                  >
                    <FileText size={16} className="mod-queue-icon" />
                    <div className="mod-queue-mid">
                      <div className="mod-queue-title">{art.titleBn}</div>
                      <div className="mod-queue-meta">
                        বিভাগ: {categories.find(c => c.slug === art.categorySlug)?.nameBn || art.categorySlug} ·{' '}
                        {new Date(art.createdAt).toLocaleDateString('bn-BD')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Preview & Action Panel */}
            {selectedArticle && (
              <div className="mod-preview-card">
                <div className="mod-preview-header">
                  <div>
                    <span className="mod-preview-cat">
                      বিভাগ: {categories.find(c => c.slug === selectedArticle.categorySlug)?.nameBn || selectedArticle.categorySlug}
                    </span>
                    <h2 className="mod-preview-title">{selectedArticle.titleBn}</h2>
                    <div className="mod-preview-meta">
                      <span><User size={12} className="inline-icon" /> লেখক: {selectedArticle.author?.name || 'অজ্ঞাত'} ({selectedArticle.author?.email})</span>
                      <span>পড়তে সময়: {selectedArticle.readTimeMins} মিনিট</span>
                      <span>মাত্রা: {selectedArticle.difficulty === 'easy' ? 'সহজ' : selectedArticle.difficulty === 'medium' ? 'মধ্যম' : 'উচ্চতর'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mod-action-buttons">
                    <button
                      className="btn-mod-approve"
                      onClick={() => handleApprove(selectedArticle.id)}
                    >
                      <Check size={16} /> অনুমোদন করুন
                    </button>
                    <button
                      className="btn-mod-reject"
                      onClick={() => setRejecting(true)}
                    >
                      <X size={16} /> বাতিল করুন
                    </button>
                  </div>
                </div>

                {/* Reject Input Form */}
                {rejecting && (
                  <form onSubmit={handleRejectSubmit} className="mod-reject-form">
                    <label>বাতিল করার কারণ লিখুন (এটি লেখকের কাছে পাঠানো হবে): *</label>
                    <textarea
                      rows="3"
                      placeholder="উদা: অনুগ্রহ করে ২নং সেকশনে আইনের ভুল ধারাটি সংশোধন করে পুনরায় সাবমিট করুন..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                    />
                    <div className="form-actions-sm">
                      <button type="submit" className="btn-primary-sm-submit">জমা দিন</button>
                      <button type="button" className="btn-secondary-sm-cancel" onClick={() => setRejecting(false)}>বাতিল</button>
                    </div>
                  </form>
                )}

                {/* Laws Cited Preview */}
                <div className="preview-laws-cited">
                  <h4>উল্লেখিত আইনসমূহ</h4>
                  {parseJsonSafe(selectedArticle.lawsCited).length === 0 ? (
                    <p className="no-laws">কোনো আইনের উল্লেখ নেই।</p>
                  ) : (
                    <div className="laws-tag-list">
                      {parseJsonSafe(selectedArticle.lawsCited).map((law, i) => (
                        <span key={i} className="law-tag-preview">
                          {law.name} · {law.section}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sections Preview */}
                <div className="preview-sections">
                  <h4>আর্টিকেলের সেকশনসমূহ</h4>
                  {parseJsonSafe(selectedArticle.sections).map((sec, i) => (
                    <div key={i} className="preview-section-item">
                      <h5>{sec.heading}</h5>
                      {sec.content && <p className="sec-desc">{sec.content}</p>}
                      
                      {sec.checklist && sec.checklist.length > 0 && (
                        <div className="preview-list">
                          <strong>চেকলিস্ট:</strong>
                          <ul>
                            {sec.checklist.map((item, idx) => (
                              <li key={idx}>✓ {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.steps && sec.steps.length > 0 && (
                        <div className="preview-list">
                          <strong>ধাপসমূহ:</strong>
                          <ol>
                            {sec.steps.map((item, idx) => (
                              <li key={idx}>{idx + 1}. {item}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Toast message */}
      {toast && <div className="lib-toast">{toast}</div>}
    </div>
  );
}
