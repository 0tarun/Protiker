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
        style={{ animation: `cardSlideIn 250ms ease-out ${index * 60}ms backwards` }}
      >
        {/* Severity left bar */}
        <div 
          className="severity-bar" 
          style={{ background: severityColors[caseItem.severity] || '#D1D5DB' }} 
        />

        {/* Case Category Icon */}
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: catStyle.bg, color: catStyle.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <Scale size={22} />
        </div>

        {/* Info Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600, color: '#1C1B1A' }}>
              {caseItem.title}
            </span>
            <span style={{
              background: statusCfg.bg, color: statusCfg.color,
              borderRadius: 100, padding: '3px 12px',
              fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 500
            }}>
              {statusCfg.text}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <span style={{ background: '#F4F6F8', borderRadius: 100, padding: '2px 10px', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: '#888780' }}>
              {caseItem.category}
            </span>
            <span style={{ background: sevBadge.bg, color: sevBadge.color, borderRadius: 100, padding: '2px 10px', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 500 }}>
              {sevBadge.text}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780' }}>
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 4 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#378ADD' }}>
              <FileText size={12} />
              <span>{(caseItem.documents || []).length.toLocaleString('bn-BD')}টি দলিল</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780' }}>
              <Building2 size={12} />
              <span>{(caseItem.contacts || []).length.toLocaleString('bn-BD')}টি সংস্থা</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780' }}>
              <Activity size={12} />
              <span>{(caseItem.timeline || []).length.toLocaleString('bn-BD')}টি ঘটনা</span>
            </span>
            {deadlineInfo && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: deadlineInfo.color, fontWeight: deadlineInfo.weight }}>
                <Clock size={12} />
                <span>{deadlineInfo.text}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Arrow + Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={(e) => e.stopPropagation()}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888780', padding: 4 }}
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', background: 'white',
                border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 50, padding: '4px 0', minWidth: 140
              }}>
                <button onClick={handleCardClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#1C1B1A', textAlign: 'left' }}>
                  <Eye size={14} color="#888780" /> বিস্তারিত দেখুন
                </button>
                <button onClick={() => { onShare(caseItem); setShowMenu(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#1C1B1A', textAlign: 'left' }}>
                  <Share2 size={14} color="#888780" /> শেয়ার করুন
                </button>
                <button onClick={toggleStatus} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#1C1B1A', textAlign: 'left' }}>
                  <RefreshCw size={14} color="#888780" /> স্ট্যাটাস পরিবর্তন
                </button>
                <button onClick={handleDelete} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#E24B4A', textAlign: 'left' }}>
                  <Trash2 size={14} color="#E24B4A" /> কেস মুছুন
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
      style={{ animation: `cardSlideIn 250ms ease-out ${index * 60}ms backwards` }}
    >
      {/* Top severity band */}
      <div style={{ height: 8, background: severityColors[caseItem.severity] || '#D1D5DB' }} />

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: catStyle.bg, color: catStyle.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Scale size={20} />
          </div>
          <span style={{
            background: statusCfg.bg, color: statusCfg.color,
            borderRadius: 100, padding: '2px 10px',
            fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 500
          }}>
            {statusCfg.text}
          </span>
        </div>

        <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600, color: '#1C1B1A', margin: '12px 0 4px', lineHeight: 1.4, height: 42, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {caseItem.title}
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#888780' }}>
          <span>{caseItem.category}</span>
          <span>{formattedDate}</span>
        </div>

        {/* PROGRESS INDICATOR */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 4px' }}>
            {/* Background line */}
            <div style={{ position: 'absolute', top: 4, left: 10, right: 10, height: 2, background: '#E5E7EB', zIndex: 1 }} />
            
            {/* Filled progress line segment */}
            <div style={{
              position: 'absolute', top: 4, left: 10,
              width: `${(currentStatusIndex / (statusStages.length - 1)) * 100}%`,
              height: 2, background: '#1D9E75', zIndex: 2,
              animation: 'lineFill 600ms ease-out'
            }} />

            {statusStages.map((stage, idx) => {
              const completed = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              return (
                <div 
                  key={stage} 
                  style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: completed ? '#1D9E75' : isCurrent ? severityColors[caseItem.severity] : '#D1D5DB',
                    zIndex: 3,
                    animation: isCurrent ? 'nodePulse 2s infinite' : 'none'
                  }}
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, color: '#888780' }}>
            <span>চিহ্নিত</span>
            <span>নোটিশ</span>
            <span>অফিস</span>
            <span>আইনি</span>
            <span>সমাধান</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#378ADD' }}>
              <FileText size={11} />
              <span>{(caseItem.documents || []).length}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#888780' }}>
              <Building2 size={11} />
              <span>{(caseItem.contacts || []).length}</span>
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888780', padding: 2 }}
            >
              <MoreVertical size={14} />
            </button>
            {showMenu && (
              <div style={{
                position: 'absolute', right: 0, bottom: '100%', background: 'white',
                border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 50, padding: '4px 0', minWidth: 130
              }}>
                <button onClick={handleCardClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#1C1B1A', textAlign: 'left' }}>
                  <Eye size={12} color="#888780" /> বিস্তারিত
                </button>
                <button onClick={() => { onShare(caseItem); setShowMenu(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#1C1B1A', textAlign: 'left' }}>
                  <Share2 size={12} color="#888780" /> শেয়ার
                </button>
                <button onClick={toggleStatus} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#1C1B1A', textAlign: 'left' }}>
                  <RefreshCw size={12} color="#888780" /> স্ট্যাটাস
                </button>
                <button onClick={handleDelete} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#E24B4A', textAlign: 'left' }}>
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
