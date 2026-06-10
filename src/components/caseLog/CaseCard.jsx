import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, ChevronRight, FileText, Building2, Activity, Calendar, Clock, Scale, Eye, Share2, RefreshCw, Archive, Trash2 } from 'lucide-react';
import { useCaseLog } from '../../context/CaseLogContext';

export default function CaseCard({ caseItem, index, viewMode, onShare }) {
  const navigate = useNavigate();
  const { dispatch } = useCaseLog();
  const [showMenu, setShowMenu] = useState(false);

  const severityColors = {
    low: '#1D9E75',
    moderate: '#EF9F27',
    serious: '#E24B4A',
    urgent: '#7C3AED'
  };

  const getSeverityLabel = (sev) => {
    const labels = {
      low: { text: 'সাধারণ', bg: '#EAF3DE', color: '#3B6D11' },
      moderate: { text: 'মাঝারি', bg: '#FAEEDA', color: '#854F0B' },
      serious: { text: 'গুরুতর', bg: '#FCEBEB', color: '#A32D2D' },
      urgent: { text: 'জরুরি', bg: '#F3E8FF', color: '#5B21B6' }
    };
    return labels[sev] || { text: sev, bg: '#F4F6F8', color: '#4A4845' };
  };

  const getStatusConfig = (status) => {
    const configs = {
      identified: { text: 'সমস্যা চিহ্নিত', bg: '#F4F6F8', color: '#4A4845' },
      notice_sent: { text: 'নোটিশ পাঠানো', bg: '#E6F1FB', color: '#185FA5' },
      office_visited: { text: 'অফিসে গেছি', bg: '#FAEEDA', color: '#854F0B' },
      legal_action: { text: 'আইনি ব্যবস্থা', bg: '#F3E8FF', color: '#5B21B6' },
      resolved: { text: '✓ সমাধান হয়েছে', bg: '#E1F5EE', color: '#0F6E56' }
    };
    return configs[status] || { text: status, bg: '#F4F6F8', color: '#4A4845' };
  };

  const getCategoryStyles = (cat) => {
    const styles = {
      'শ্রম অধিকার': { bg: '#E1F5EE', color: '#1D9E75' },
      'বাড়িভাড়া': { bg: '#E6F1FB', color: '#378ADD' },
      'পারিবারিক সহিংসতা': { bg: '#FCEBEB', color: '#E24B4A' },
      'ভোক্তা অধিকার': { bg: '#FAEEDA', color: '#EF9F27' },
      'জমি ও সম্পত্তি': { bg: '#EAF3DE', color: '#639922' },
      'পুলিশ ও গ্রেফতার': { bg: '#F3E8FF', color: '#7C3AED' }
    };
    return styles[cat] || { bg: '#F4F6F8', color: '#888780' };
  };

  const getDeadlineTextAndColor = () => {
    if (!caseItem.deadlineDate) return null;
    const diffTime = new Date(caseItem.deadlineDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'মেয়াদ শেষ!', color: '#E24B4A', weight: '600' };
    }
    if (diffDays <= 7) {
      return { text: `${diffDays.toLocaleString('bn-BD')} দিন বাকি!`, color: '#E24B4A', weight: '500' };
    }
    if (diffDays <= 30) {
      return { text: `${diffDays.toLocaleString('bn-BD')} দিন বাকি`, color: '#EF9F27', weight: '500' };
    }
    return { text: `${diffDays.toLocaleString('bn-BD')} দিন বাকি`, color: '#888780', weight: '500' };
  };

  const formattedDate = new Date(caseItem.createdAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const deadlineInfo = getDeadlineTextAndColor();
  const sevBadge = getSeverityLabel(caseItem.severity);
  const statusCfg = getStatusConfig(caseItem.caseStatus);
  const catStyle = getCategoryStyles(caseItem.category);

  // Status mapping for progress dots
  const statusStages = ['identified', 'notice_sent', 'office_visited', 'legal_action', 'resolved'];
  const currentStatusIndex = statusStages.indexOf(caseItem.caseStatus);

  const handleCardClick = () => {
    navigate(`/case-log/${caseItem.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('আপনি কি সত্যিই এই কেসটি মুছে ফেলতে চান?')) {
      dispatch({ type: 'DELETE_CASE', payload: caseItem.id });
    }
    setShowMenu(false);
  };

  const toggleStatus = (e) => {
    e.stopPropagation();
    const nextIndex = (currentStatusIndex + 1) % statusStages.length;
    const nextStatus = statusStages[nextIndex];
    dispatch({
      type: 'UPDATE_CASE_STATUS',
      payload: {
        caseId: caseItem.id,
        oldStatus: caseItem.caseStatus,
        newStatus: nextStatus
      }
    });
    setShowMenu(false);
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="cl-case-card list-mode"
        style={{ animation: `clCardSlideIn 250ms ease-out ${index * 60}ms backwards` }}
      >
        {/* Severity left bar */}
        <div 
          className="cl-list-severity-bar" 
          style={{ background: severityColors[caseItem.severity] || '#D1D5DB' }} 
        />

        {/* Case Category Icon */}
        <div 
          className="cl-list-icon-wrap"
          style={{ background: catStyle.bg, color: catStyle.color }}
        >
          <Scale size={22} />
        </div>

        {/* Info Area */}
        <div className="cl-list-info-area">
          <div className="cl-list-top-row">
            <span className="cl-list-title">
              {caseItem.title}
            </span>
            <span 
              className="cl-status-badge"
              style={{ background: statusCfg.bg, color: statusCfg.color }}
            >
              {statusCfg.text}
            </span>
          </div>

          <div className="cl-list-tags-row">
            <span className="cl-list-tag">{caseItem.category}</span>
            <span 
              className="cl-list-tag severity"
              style={{ background: sevBadge.bg, color: sevBadge.color }}
            >
              {sevBadge.text}
            </span>
            <div className="cl-list-date">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="cl-list-meta-stats">
            <span className="cl-list-stat-item docs">
              <FileText size={12} />
              <span>{(caseItem.documents || []).length.toLocaleString('bn-BD')}টি দলিল</span>
            </span>
            <span className="cl-list-stat-item contacts">
              <Building2 size={12} />
              <span>{(caseItem.contacts || []).length.toLocaleString('bn-BD')}টি সংস্থা</span>
            </span>
            <span className="cl-list-stat-item events">
              <Activity size={12} />
              <span>{(caseItem.timeline || []).length.toLocaleString('bn-BD')}টি ঘটনা</span>
            </span>
            {deadlineInfo && (
              <span 
                className="cl-list-stat-item deadline"
                style={{ color: deadlineInfo.color }}
              >
                <Clock size={12} />
                <span>{deadlineInfo.text}</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="cl-list-actions" onClick={(e) => e.stopPropagation()}>
          <div className="cl-card-menu-container">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="cl-list-menu-btn"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div className="cl-card-menu-dropdown list-pos">
                <button onClick={handleCardClick} className="cl-dropdown-item">
                  <Eye size={13} color="#888780" /> বিস্তারিত দেখুন
                </button>
                <button onClick={() => { onShare(caseItem); setShowMenu(false); }} className="cl-dropdown-item">
                  <Share2 size={13} color="#888780" /> শেয়ার করুন
                </button>
                <button onClick={toggleStatus} className="cl-dropdown-item">
                  <RefreshCw size={13} color="#888780" /> স্ট্যাটাস পরিবর্তন
                </button>
                <button onClick={handleDelete} className="cl-dropdown-item danger">
                  <Trash2 size={13} color="#E24B4A" /> কেস মুছুন
                </button>
              </div>
            )}
          </div>
          <ChevronRight size={16} color="#888780" />
        </div>
      </div>
    );
  }

  // Grid View (Cards Mode)
  return (
    <div 
      onClick={handleCardClick}
      className="cl-case-card grid-mode"
      style={{ animation: `clCardSlideIn 350ms ease-out ${index * 60}ms both` }}
    >
      {/* Top severity band */}
      <div 
        className="cl-card-severity-band" 
        style={{ background: severityColors[caseItem.severity] || '#D1D5DB' }} 
      />

      <div className="cl-card-body">
        <div className="cl-card-top">
          <div 
            className="cl-card-icon-wrap"
            style={{ background: catStyle.bg, color: catStyle.color }}
          >
            <Scale size={20} />
          </div>
          <span 
            className="cl-status-badge"
            style={{ background: statusCfg.bg, color: statusCfg.color }}
          >
            {statusCfg.text}
          </span>
        </div>

        <h3 className="cl-card-title">
          {caseItem.title}
        </h3>

        <div className="cl-card-meta-row">
          <span className="cl-card-category">{caseItem.category}</span>
          <span className="cl-card-date">{formattedDate}</span>
        </div>

        {/* PROGRESS INDICATOR */}
        <div className="cl-progress-track-wrap">
          <div className="cl-progress-track">
            {/* Background line */}
            <div className="cl-progress-line-bg" />
            
            {/* Filled progress line segment */}
            <div 
              className="cl-progress-line-fill"
              style={{
                width: `${(currentStatusIndex / (statusStages.length - 1)) * 100}%`,
              }}
            />

            {statusStages.map((stage, idx) => {
              const completed = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              return (
                <div 
                  key={stage} 
                  className={`cl-progress-node${isCurrent ? ' active-pulse' : ''}`}
                  style={{
                    background: completed ? '#1D9E75' : isCurrent ? severityColors[caseItem.severity] : '#D1D5DB',
                  }}
                />
              );
            })}
          </div>
          <div className="cl-progress-labels">
            <span>চিহ্নিত</span>
            <span>নোটিশ</span>
            <span>অফিস</span>
            <span>আইনি</span>
            <span>সমাধান</span>
          </div>
        </div>

        <div className="cl-card-divider" />

        <div className="cl-card-footer">
          <div className="cl-card-footer-stats">
            <span className="cl-card-stat-item docs">
              <FileText size={12} />
              <span>{(caseItem.documents || []).length}</span>
            </span>
            <span className="cl-card-stat-item contacts">
              <Building2 size={12} />
              <span>{(caseItem.contacts || []).length}</span>
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="cl-card-menu-container">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="cl-list-menu-btn"
            >
              <MoreVertical size={14} />
            </button>
            {showMenu && (
              <div className="cl-card-menu-dropdown grid-pos">
                <button onClick={handleCardClick} className="cl-dropdown-item">
                  <Eye size={12} color="#888780" /> বিস্তারিত
                </button>
                <button onClick={() => { onShare(caseItem); setShowMenu(false); }} className="cl-dropdown-item">
                  <Share2 size={12} color="#888780" /> শেয়ার
                </button>
                <button onClick={toggleStatus} className="cl-dropdown-item">
                  <RefreshCw size={12} color="#888780" /> স্ট্যাটাস
                </button>
                <button onClick={handleDelete} className="cl-dropdown-item danger">
                  <Trash2 size={12} color="#E24B4A" /> মুছুন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
