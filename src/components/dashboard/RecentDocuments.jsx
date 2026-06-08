/**
 * RecentDocuments — Shows 3 recent generated documents with status and download.
 */
import { FileText, Download, FilePlus } from 'lucide-react';
import { mockDocuments } from '../../data/mockDashboard';

export default function RecentDocuments() {
  return (
    <div>
      <div className="db-col-header">
        <div className="db-col-title">সাম্প্রতিক দলিলপত্র</div>
        <button className="db-col-link">সব দেখুন →</button>
      </div>
      <div className="db-list-card">
        {mockDocuments.map((d) => (
          <div className="db-doc-item" key={d.id}>
            <div className="db-doc-icon" style={{ background: d.iconBg }}>
              <FileText size={18} color={d.iconColor} />
            </div>
            <div className="db-doc-mid">
              <div className="db-doc-name">{d.name}</div>
              <div className="db-doc-sub">
                <span className="db-doc-status" style={{ background: d.statusBg, color: d.statusColor }}>
                  {d.status}
                </span>
                <span className="db-doc-date">{d.date}</span>
              </div>
            </div>
            <button className="db-doc-dl">
              <Download size={14} />
            </button>
          </div>
        ))}
        <button className="db-new-btn">
          <FilePlus size={16} /> নতুন দলিল তৈরি করুন
        </button>
      </div>
    </div>
  );
}

export { RecentDocuments };
