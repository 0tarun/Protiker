/**
 * DocumentDetailPage — View a single generated document with download, print, share actions.
 * Features: document viewer, action buttons, submission guide, status timeline, share link copy.
 * Route: /documents/:id
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Download, Printer, Share2, FileText,
  CheckCircle, Clock, Edit, MapPin, Phone, Check, Loader2
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import { docStatusConfig } from '../data/mockDocuments';
import documentService from '../services/documentService';
import '../styles/documents.css';

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  /* Fetch document details */
  useEffect(() => {
    async function loadDoc() {
      try {
        const res = await documentService.getDocumentDetails(id);
        if (res.success && res.data) {
          setDoc(res.data);
        } else {
          navigate('/documents');
        }
      } catch (e) {
        console.error('Failed to load document details', e);
        navigate('/documents');
      } finally {
        setLoading(false);
      }
    }
    loadDoc();
  }, [id, navigate]);

  /* Copy share link */
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/documents/${doc.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
    });
  };

  /* Download PDF */
  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Import html2pdf dynamically to avoid SSR issues and keep initial load fast
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.createElement('div');
      element.innerHTML = `<pre style="font-family: sans-serif; white-space: pre-wrap; font-size: 14px; padding: 40px; line-height: 1.6;">${doc.generatedContent}</pre>`;
      
      const opt = {
        margin:       10,
        filename:     `protiker-document-${doc.id}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();

      // Update status to downloaded locally if it was generated
      if (doc.status === 'generated') {
        try {
          await documentService.updateStatus(doc.id, 'downloaded');
        } catch (e) {
          console.error('Status update failed, but PDF was downloaded', e);
        }
        setDoc({ ...doc, status: 'downloaded' });
      }
    } catch (err) {
      console.error('Download failed', err);
      alert('PDF ডাউনলোড করতে সমস্যা হয়েছে।');
    } finally {
      setDownloading(false);
    }
  };

  /* Reset copied state after 2000ms */
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (loading || !doc) {
    return (
      <div className="doc-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" color="#1D9E75" size={48} />
      </div>
    );
  }

  const guide = doc.submissionGuide || {};
  const statusCfg = docStatusConfig[doc.status] || docStatusConfig.draft;

  /* Timeline items */
  const timeline = [
    { label: 'দলিল তৈরি হয়েছে', date: new Date(doc.createdAt).toLocaleString('bn-BD'), active: true, icon: FileText },
    {
      label: doc.status === 'downloaded' || doc.status === 'submitted' ? 'ডাউনলোড করা হয়েছে' : 'ডাউনলোড বাকি',
      date: doc.status === 'downloaded' || doc.status === 'submitted' ? '' : '', // Real dates if tracked
      active: doc.status === 'downloaded' || doc.status === 'submitted',
      icon: Download,
    },
    {
      label: doc.status === 'submitted' ? 'জমা দেওয়া হয়েছে' : 'জমা দেওয়া বাকি',
      date: doc.status === 'submitted' ? '' : '', // Real dates if tracked
      active: doc.status === 'submitted',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="doc-layout">
      <Sidebar activeItem="আমার দলিলপত্র" />
      <main className="doc-main">
        {/* Top Bar */}
        <div className="doc-topbar">
          <div>
            <button className="doc-back-link" onClick={() => navigate('/documents')}>
              <ChevronLeft size={20} /> সকল দলিল
            </button>
            <div className="doc-topbar-title" style={{ marginTop: 8 }}>{doc.name}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6 }}>
              <div
                className="doc-status-pill"
                style={{ background: statusCfg.bg, color: statusCfg.color, marginTop: 0 }}
              >
                {statusCfg.text}
              </div>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                color: '#888780',
              }}>
                {doc.legalBasis}
              </span>
            </div>
          </div>
        </div>

        <div className="doc-detail-grid">
          {/* Left — Document Viewer */}
          <div className="doc-detail-viewer">
            <div className="doc-preview-watermark">PROTIKER — প্রতিকার</div>
            <div className="doc-preview-doc-title">{doc.name}</div>
            <div className="doc-preview-law-ref">{doc.legalBasis}</div>
            <div className="doc-preview-divider" />

            <div className="doc-preview-section">
              <div className="doc-preview-value" style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {doc.generatedContent || 'দলিল এখনো তৈরি হয়নি।'}
              </div>
            </div>
          </div>

          {/* Right — Actions + Guide + Timeline */}
          <div className="doc-detail-aside">
            {/* Action buttons */}
            <div className="doc-detail-actions-card">
              <div className="doc-detail-actions-title">কার্যক্রম</div>
              <button 
                className="doc-detail-btn doc-detail-btn-download" 
                id="doc-detail-dl"
                onClick={handleDownload}
                disabled={downloading || !doc.generatedContent}
              >
                {downloading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>ডাউনলোড হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>PDF ডাউনলোড করুন</span>
                  </>
                )}
              </button>
              <button 
                className="doc-detail-btn doc-detail-btn-print" 
                id="doc-detail-print"
                disabled={!doc.generatedContent}
                onClick={() => {
                  const printWindow = window.open('', '', 'width=800,height=600');
                  printWindow.document.write(`<pre style="font-family: sans-serif; white-space: pre-wrap; font-size: 14px;">${doc.generatedContent}</pre>`);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                }}
              >
                <Printer size={16} /> প্রিন্ট করুন
              </button>
              <button className="doc-detail-btn doc-detail-btn-share" onClick={handleShare} id="doc-detail-share">
                <Share2 size={16} /> শেয়ার লিংক কপি করুন
              </button>
              {copied && (
                <div className="doc-copied-toast">
                  <Check size={14} /> কপি হয়েছে ✓
                </div>
              )}
            </div>

            {/* Submission guide */}
            {Object.keys(guide).length > 0 && (
              <div className="doc-guide-card">
                <div className="doc-guide-title">
                  <MapPin size={16} color="#1D9E75" /> জমা দেওয়ার নির্দেশনা
                </div>

                {guide.office_name_bn && (
                  <div className="doc-guide-item">
                    <div className="doc-guide-label">কোথায় জমা দিবেন</div>
                    <div className="doc-guide-value">{guide.office_name_bn}</div>
                  </div>
                )}

                {guide.bring_with_you_bn && (
                  <div className="doc-guide-item">
                    <div className="doc-guide-label">সাথে যা নিবেন</div>
                    <div className="doc-guide-value">{guide.bring_with_you_bn}</div>
                  </div>
                )}

                {guide.instructions_bn && (
                  <div className="doc-guide-item">
                    <div className="doc-guide-label">নির্দেশাবলী</div>
                    <div className="doc-guide-value">{guide.instructions_bn}</div>
                  </div>
                )}

                {guide.deadline_note_bn && (
                  <div className="doc-guide-item">
                    <div className="doc-guide-label">সময়সীমা</div>
                    <div className="doc-guide-value">{guide.deadline_note_bn}</div>
                  </div>
                )}

                {!guide.has_fee && guide.office_name_bn && (
                  <div className="doc-guide-item">
                    <div className="doc-guide-free">
                      <CheckCircle size={12} /> বিনামূল্যে
                    </div>
                  </div>
                )}

                {guide.free_aid_available && (
                  <div className="doc-guide-item">
                    <div className="doc-guide-label">বিনামূল্যে সহায়তা</div>
                    <div className="doc-guide-value">
                      <Phone size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {guide.free_aid_contact}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status timeline */}
            <div className="doc-timeline">
              <div className="doc-timeline-title">স্ট্যাটাস টাইমলাইন</div>
              {timeline.map((item, i) => (
                <div className="doc-timeline-item" key={i}>
                  <div className={`doc-timeline-dot ${item.active ? 'active' : 'inactive'}`}>
                    {item.active
                      ? <Check size={12} />
                      : <Clock size={12} />
                    }
                  </div>
                  <div>
                    <div className="doc-timeline-text">{item.label}</div>
                    {item.date && <div className="doc-timeline-date">{item.date}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export { DocumentDetailPage };
