/**
 * RecentDocuments — Shows 3 most recent generated documents from real API data.
 * Includes navigation links for "সব দেখুন" and "নতুন দলিল তৈরি করুন".
 */
import { useState, useEffect } from 'react';
import { FileText, Download, FilePlus, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import documentService from '../../services/documentService';

// Status → color mapping
const statusColors = {
  DRAFT:       { bg: '#FAEEDA', color: '#854F0B', label: 'খসড়া' },
  GENERATED:   { bg: '#E6F1FB', color: '#185FA5', label: 'তৈরি হয়েছে' },
  DOWNLOADED:  { bg: '#E1F5EE', color: '#0F6E56', label: 'ডাউনলোড করা হয়েছে' },
  SUBMITTED:   { bg: '#F3E8FF', color: '#5B21B6', label: 'জমা দেওয়া হয়েছে' },
};

const iconColors = [
  { bg: '#E1F5EE', color: '#1D9E75' },
  { bg: '#E6F1FB', color: '#378ADD' },
  { bg: '#FAEEDA', color: '#EF9F27' },
];

export default function RecentDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const response = await documentService.getUserDocuments('all');
        // response may be { data: [...], stats: {...} } or just an array
        const docs = Array.isArray(response) ? response : (response?.data || []);
        // Take only the first 3 most recent
        setDocuments(docs.slice(0, 3));
      } catch (err) {
        console.error('Failed to load recent documents:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, []);

  const handleDownload = async (e, docId) => {
    e.stopPropagation();
    try {
      const blob = await documentService.downloadDocument(docId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document-${docId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div>
      <div className="db-col-header">
        <div className="db-col-title">সাম্প্রতিক দলিলপত্র</div>
        <button className="db-col-link" onClick={() => navigate('/documents')}>সব দেখুন →</button>
      </div>
      <div className="db-list-card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
            <Loader2 className="animate-spin" color="#378ADD" size={24} />
          </div>
        ) : documents.length > 0 ? (
          documents.map((d, idx) => {
            const statusInfo = statusColors[d.status] || statusColors.GENERATED;
            const iconStyle = iconColors[idx % iconColors.length];
            const docName = d.templateNameBn || d.templateName || d.name || 'দলিল';
            const docDate = d.updatedAt
              ? new Date(d.updatedAt).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })
              : d.createdAt
                ? new Date(d.createdAt).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })
                : '';

            return (
              <div
                className="db-doc-item"
                key={d.id}
                onClick={() => navigate(`/documents/${d.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="db-doc-icon" style={{ background: iconStyle.bg }}>
                  <FileText size={18} color={iconStyle.color} />
                </div>
                <div className="db-doc-mid">
                  <div className="db-doc-name">{docName}</div>
                  <div className="db-doc-sub">
                    <span className="db-doc-status" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                    <span className="db-doc-date">{docDate}</span>
                  </div>
                </div>
                <button className="db-doc-dl" onClick={(e) => handleDownload(e, d.id)}>
                  <Download size={14} />
                </button>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
            কোনো দলিল পাওয়া যায়নি।
          </div>
        )}
        <button className="db-new-btn" onClick={() => navigate('/documents/new')}>
          <FilePlus size={16} /> নতুন দলিল তৈরি করুন
        </button>
      </div>
    </div>
  );
}

export { RecentDocuments };
