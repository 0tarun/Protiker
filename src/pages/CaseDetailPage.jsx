import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import { useCaseLog } from '../context/CaseLogContext';
import { 
  ChevronLeft, Share2, Scale, Calendar, Clock, 
  FolderOpen, Send, Building2, CheckCircle, 
  MessageCircle, FilePlus, MapPin, Download, 
  Link as LinkIcon, Archive, Trash2, PenLine, 
  FileText, Plus, X, Trash, RefreshCw,
  Paperclip, Image, Music, Video
} from 'lucide-react';
import ShareCaseModal from '../components/caseLog/ShareCaseModal';
import '../styles/caselog.css';

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useCaseLog();

  const [cItem, setCItem] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState('');
  
  // Inline edit state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState('');

  // Status stage configurations
  const statusStages = ['identified', 'notice_sent', 'office_visited', 'legal_action', 'resolved'];
  
  const statusLabels = {
    identified: 'সমস্যা চিহ্নিত',
    notice_sent: 'নোটিশ পাঠানো',
    office_visited: 'অফিসে গেছি',
    legal_action: 'আইনি ব্যবস্থা',
    resolved: 'সমাধান হয়েছে'
  };

  const statusConfigs = {
    identified: { label: 'সমস্যা চিহ্নিত', bg: '#F4F6F8', color: '#4A4845', icon: FolderOpen },
    notice_sent: { label: 'নোটিশ পাঠানো', bg: '#E6F1FB', color: '#185FA5', icon: Send },
    office_visited: { label: 'অফিসে গেছি', bg: '#FAEEDA', color: '#854F0B', icon: Building2 },
    legal_action: { label: 'আইনি ব্যবস্থা', bg: '#F3E8FF', color: '#5B21B6', icon: Scale },
    resolved: { label: '✓ সমাধান হয়েছে', bg: '#E1F5EE', color: '#0F6E56', icon: CheckCircle }
  };

  const severityColors = {
    low: '#1D9E75',
    moderate: '#EF9F27',
    serious: '#E24B4A',
    urgent: '#7C3AED'
  };

  const severityGradients = {
    low: 'linear-gradient(135deg,#1D9E75,#0F6E56)',
    moderate: 'linear-gradient(135deg,#EF9F27,#B45309)',
    serious: 'linear-gradient(135deg,#E24B4A,#991B1B)',
    urgent: 'linear-gradient(135deg,#7C3AED,#4C1D95)'
  };

  const getSeverityLabel = (sev) => {
    const labels = {
      low: 'সাধারণ',
      moderate: 'মাঝারি',
      serious: 'গুরুতর',
      urgent: 'জরুরি'
    };
    return labels[sev] || sev;
  };

  const getSeverityBadgeStyles = (sev) => {
    const styles = {
      low: { bg: '#EAF3DE', color: '#3B6D11' },
      moderate: { bg: '#FAEEDA', color: '#854F0B' },
      serious: { bg: '#FCEBEB', color: '#A32D2D' },
      urgent: { bg: '#F3E8FF', color: '#5B21B6' }
    };
    return styles[sev] || { bg: '#F4F6F8', color: '#4A4845' };
  };

  useEffect(() => {
    if (!state.isLoading) {
      const found = state.cases.find(c => c.id === caseId);
      if (found) {
        setCItem(found);
      } else {
        navigate('/case-log');
      }
    }
  }, [caseId, state.cases, state.isLoading, navigate]);

  if (!cItem) {
    return (
      <div className="cl-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16 }}>কেসের তথ্য লোড হচ্ছে...</div>
      </div>
    );
  }

  const currentStatusIndex = statusStages.indexOf(cItem.caseStatus);
  const hasNextStep = currentStatusIndex < statusStages.length - 1;
  const nextStatus = hasNextStep ? statusStages[currentStatusIndex + 1] : null;

  const handleStatusChange = (status) => {
    dispatch({
      type: 'UPDATE_CASE_STATUS',
      payload: {
        caseId: cItem.id,
        oldStatus: cItem.caseStatus,
        newStatus: status
      }
    });
  };

  const handleNextStep = () => {
    if (hasNextStep && nextStatus) {
      handleStatusChange(nextStatus);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    dispatch({
      type: 'ADD_NOTE',
      payload: {
        caseId: cItem.id,
        noteText
      }
    });

    setNoteText('');
    setShowNoteForm(false);
  };

  const handleSaveEdit = (eventId) => {
    if (!editText.trim()) return;
    dispatch({
      type: 'EDIT_NOTE',
      payload: {
        caseId: cItem.id,
        eventId,
        noteText: editText
      }
    });
    setEditingNoteId(null);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('নোটটি মুছে ফেলতে চান?')) {
      dispatch({
        type: 'DELETE_NOTE',
        payload: {
          caseId: cItem.id,
          eventId
        }
      });
    }
  };

  const handleAskProti = () => {
    localStorage.setItem('protiker_case_context', JSON.stringify({
      caseId: cItem.id,
      title: cItem.title,
      category: cItem.category,
      problem: cItem.problem
    }));
    navigate('/chat');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const MAX_SIZE = 1.5 * 1024 * 1024; // 1.5 MB limit
    
    const oversizedFiles = files.filter(f => f.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`ব্রাউজারের ধারণক্ষমতার সীমাবদ্ধতার কারণে ১.৫ MB এর চেয়ে বড় ফাইল আপলোড করা যাবে না।\nনিম্নের ফাইলটি বড়:\n${oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join('\n')}`);
      e.target.value = '';
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAttachment = {
          id: `attach-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'unknown',
          dataUrl: reader.result,
          uploadedAt: new Date().toISOString()
        };
        dispatch({
          type: 'ADD_ATTACHMENT',
          payload: {
            caseId: cItem.id,
            attachment: newAttachment
          }
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset file input value so that the user can upload the same file again if they delete it
    e.target.value = '';
  };

  const getFileIcon = (type, name = '') => {
    const typeLower = type.toLowerCase();
    const nameLower = name.toLowerCase();

    if (typeLower.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/.test(nameLower)) return Image;
    if (typeLower.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac)$/.test(nameLower)) return Music;
    if (typeLower.startsWith('video/') || /\.(mp4|webm|ogg|avi|mov)$/.test(nameLower)) return Video;
    
    // Document types (PDF, Word, Text, Excel, PowerPoint)
    if (
      typeLower.includes('pdf') || 
      typeLower.includes('document') || 
      typeLower.includes('word') || 
      typeLower.includes('text') || 
      typeLower.includes('excel') || 
      typeLower.includes('sheet') || 
      typeLower.includes('msword') ||
      /\.(pdf|doc|docx|txt|xls|xlsx|ppt|pptx|rtf|odt|csv)$/.test(nameLower)
    ) {
      return FileText;
    }

    return Paperclip;
  };

  const getTimelineEventStyles = (type) => {
    const config = {
      chat_started: { icon: MessageCircle, color: '#1D9E75' },
      document_created: { icon: FileText, color: '#378ADD' },
      center_contacted: { icon: Building2, color: '#EF9F27' },
      status_changed: { icon: RefreshCw, color: '#7C3AED' },
      note_added: { icon: PenLine, color: '#888780' },
      pdf_downloaded: { icon: Download, color: '#1D9E75' },
      deadline_set: { icon: Clock, color: '#E24B4A' }
    };
    return config[type] || { icon: Paperclip, color: '#888780' };
  };

  const getNextStepDescription = () => {
    const category = cItem.category || '';
    
    if (cItem.caseStatus === 'identified') {
      if (category === 'বাড়িভাড়া') {
        return "মালিককে লিখিত নোটিশ পাঠান। দলিল তৈরি করতে ক্লিক করুন।";
      } else if (category === 'শ্রম অধিকার') {
        return "নিয়োগকর্তাকে লিখিত নোটিশ পাঠান। দলিল তৈরি করতে ক্লিক করুন।";
      } else if (category === 'ভোক্তা অধিকার') {
        return "বিক্রেতা বা সেবা প্রদানকারীকে লিখিত নোটিশ পাঠান। দলিল তৈরি করতে ক্লিক করুন।";
      } else if (category === 'পারিবারিক সহিংসতা') {
        return "সহায়তা সংস্থা বা থানায় অভিযোগ জানানোর জন্য প্রয়োজনীয় আবেদনপত্র তৈরি করতে ক্লিক করুন।";
      } else {
        return "সংশ্লিষ্ট পক্ষকে লিখিত নোটিশ পাঠান। দলিল তৈরি করতে ক্লিক করুন।";
      }
    }

    if (cItem.caseStatus === 'notice_sent') {
      if (category === 'বাড়িভাড়া') {
        return "মালিকের জবাবের জন্য অপেক্ষা করুন। নির্দিষ্ট সময়ের মধ্যে সমাধান না হলে আইনি পদক্ষেপের প্রস্তুতি নিন।";
      } else if (category === 'শ্রম অধিকার') {
        return "নিয়োগকর্তার জবাবের জন্য অপেক্ষা করুন। ৭ কার্যদিবসের মধ্যে জবাব না পেলে শ্রম আদালতে বা দপ্তরে অভিযোগ করুন।";
      } else if (category === 'ভোক্তা অধিকার') {
        return "বিক্রেতার জবাবের জন্য অপেক্ষা করুন। সমাধান না হলে ভোক্তা অধিকার অধিদপ্তরে অভিযোগ করুন।";
      } else {
        return "অপর পক্ষের জবাবের জন্য অপেক্ষা করুন। নির্দিষ্ট সময়ের মধ্যে সমাধান না হলে পরবর্তী আইনি পদক্ষেপ নিন।";
      }
    }

    if (cItem.caseStatus === 'office_visited') {
      if (category === 'বাড়িভাড়া' || category === 'শ্রম অধিকার' || category === 'ভোক্তা অধিকার') {
        return "আদালত বা সংশ্লিষ্ট অধিদপ্তরে আবেদনপত্র দাখিল করুন।";
      }
      return "সংশ্লিষ্ট অফিসে আবেদনপত্র দাখিল করুন বা পরবর্তী পদক্ষেপ নিন।";
    }

    if (cItem.caseStatus === 'legal_action') {
      return "আইনি প্রক্রিয়ার পরবর্তী তারিখ বা শুনানির সময় মনে রাখুন এবং আইনজীবীর পরামর্শ নিন।";
    }

    if (cItem.caseStatus === 'resolved') {
      return "আপনার সমস্যা সমাধান হয়েছে! 🎉";
    }

    return '';
  };

  // Get Deadline status
  const getDeadlineStatus = () => {
    if (!cItem.deadlineDate) return null;
    const diffTime = new Date(cItem.deadlineDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let bg = 'white';
    let border = 'rgba(0,0,0,0.08)';
    let color = '#888780';
    let text = `${diffDays.toLocaleString('bn-BD')} দিন বাকি`;

    if (diffDays < 0) {
      bg = '#FFF5F5';
      border = '#E24B4A';
      color = '#E24B4A';
      text = 'মেয়াদ শেষ!';
    } else if (diffDays <= 7) {
      bg = '#FFF5F5';
      border = '#E24B4A';
      color = '#E24B4A';
      text = `${diffDays.toLocaleString('bn-BD')} দিন বাকি!`;
    } else if (diffDays <= 30) {
      bg = '#FFFBF0';
      border = '#EF9F27';
      color = '#EF9F27';
    }

    return { bg, border, color, text, diffDays };
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <div className="cl-layout">
      <Sidebar activeItem="কেস লগ" />

      <main className="cl-main">
        {/* BACK ROW */}
        <div 
          onClick={() => navigate('/case-log')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 20, color: '#4A4845' }}
          className="action-btn-hover"
        >
          <ChevronLeft size={16} />
          <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500 }}>
            কেস লগে ফিরুন
          </span>
        </div>

        {/* DETAILS GRID */}
        <div className="cl-detail-grid">
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* CASE HEADER CARD */}
            <div className="cl-modal-card" style={{ width: '100%', padding: 0, overflow: 'hidden', animation: 'none' }}>
              <div style={{ height: 56, background: severityGradients[cItem.severity] || '#D1D5DB', position: 'relative' }}>
                {/* Decorative shape */}
                <div style={{
                  position: 'absolute', top: -20, right: -20, width: 100, height: 100,
                  background: 'rgba(255,255,255,0.08)', borderRadius: '50%'
                }} />
              </div>

              <div style={{ padding: '20px 24px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: '#E1F5EE', color: '#1D9E75',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <Scale size={20} />
                    </div>
                    <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 20, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
                      {cItem.title}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {/* Status Dropdown */}
                    <select
                      value={cItem.caseStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      style={{
                        padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)',
                        fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, fontWeight: 600,
                        background: statusConfigs[cItem.caseStatus]?.bg, color: statusConfigs[cItem.caseStatus]?.color,
                        cursor: 'pointer', outline: 'none'
                      }}
                    >
                      {statusStages.map(stage => (
                        <option key={stage} value={stage}>{statusLabels[stage]}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => setShowShare(true)}
                      style={{
                        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', background: 'white', cursor: 'pointer', color: '#4A4845'
                      }}
                      className="action-btn-hover"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginTop: 14 }}>
                  <span style={{ background: '#F4F6F8', borderRadius: 100, padding: '2px 10px', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: '#888780' }}>
                    {cItem.category}
                  </span>
                  <span style={{
                    background: getSeverityBadgeStyles(cItem.severity).bg,
                    color: getSeverityBadgeStyles(cItem.severity).color,
                    borderRadius: 100, padding: '2px 10px', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 500
                  }}>
                    {getSeverityLabel(cItem.severity)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780' }}>
                    <Calendar size={12} />
                    <span>{new Date(cItem.createdAt).toLocaleDateString('bn-BD')} তৈরি</span>
                  </div>
                </div>

                {/* Problem Description Preview */}
                {cItem.problem && (
                  <div style={{
                    background: '#F8F9FA', borderRadius: 10, padding: '14px 16px',
                    borderLeft: `3px solid ${severityColors[cItem.severity] || '#1D9E75'}`, marginTop: 14
                  }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: '#888780', fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>
                      সমস্যার বিবরণ:
                    </div>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#1C1B1A', lineHeight: 1.6 }}>
                      {cItem.problem}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PROGRESS TRACKER */}
            <div className="cl-modal-card" style={{ width: '100%', padding: 24, overflow: 'visible', animation: 'none' }}>
              <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, fontWeight: 600, color: '#1C1B1A', margin: '0 0 16px' }}>
                কেসের অগ্রগতি
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: 24, padding: '0 12px' }}>
                {/* Horizontal progress background lines */}
                <div style={{ position: 'absolute', top: 15, left: 20, right: 20, height: 2, background: '#E5E7EB', zIndex: 1 }} />
                <div style={{
                  position: 'absolute', top: 15, left: 20,
                  width: `${(currentStatusIndex / (statusStages.length - 1)) * 100}%`,
                  height: 2, background: '#1D9E75', zIndex: 2,
                  animation: 'lineFill 600ms ease-out'
                }} />

                {statusStages.map((stage, idx) => {
                  const completed = idx < currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  const cfg = statusConfigs[stage];
                  const IconComponent = cfg.icon;
                  const color = completed ? '#1D9E75' : isCurrent ? getSeverityBadgeStyles(cItem.severity).color : '#888780';

                  return (
                    <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: 60 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: completed ? '#1D9E75' : isCurrent ? 'white' : '#F4F6F8',
                        border: `2px solid ${color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: completed ? 'white' : color,
                        animation: isCurrent ? 'nodePulse 2s infinite' : 'none'
                      }}>
                        <IconComponent size={14} />
                      </div>
                      <span style={{
                        fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11,
                        color: isCurrent ? getSeverityBadgeStyles(cItem.severity).color : completed ? '#0F6E56' : '#888780',
                        fontWeight: isCurrent || completed ? 600 : 400,
                        marginTop: 8, whiteSpace: 'nowrap', textAlign: 'center'
                      }}>
                        {statusLabels[stage]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Current action help card */}
              <div style={{
                background: `${statusConfigs[cItem.caseStatus]?.bg}aa`,
                borderRadius: 10, padding: 14, marginTop: 24, border: `1px solid ${statusConfigs[cItem.caseStatus]?.color}22`
              }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#888780', fontWeight: 600 }}>
                  পরবর্তী পদক্ষেপ:
                </div>
                <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#1C1B1A', marginTop: 4 }}>
                  {getNextStepDescription()}
                </div>
              </div>

              {/* Transition to next stage button */}
              {hasNextStep && (
                <button
                  onClick={handleNextStep}
                  style={{
                    width: '100%', background: 'white',
                    border: `1.5px solid ${statusConfigs[nextStatus]?.color || '#1D9E75'}`,
                    color: statusConfigs[nextStatus]?.color || '#1D9E75',
                    borderRadius: 10, padding: '11px', fontFamily: "'Hind Siliguri', sans-serif",
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 14,
                    transition: 'all 0.2s'
                  }}
                  className="action-btn-hover"
                >
                  পরবর্তী ধাপে যান ({statusLabels[nextStatus]}) →
                </button>
              )}
            </div>

            {/* TIMELINE EVENTS HISTORY */}
            <div className="cl-modal-card" style={{ width: '100%', padding: 24, animation: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
                  ঘটনার ইতিহাস
                </h3>
                <button 
                  onClick={() => setShowNoteForm(true)}
                  style={{
                    background: 'none', border: 'none', color: '#1D9E75', cursor: 'pointer',
                    fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 4
                  }}
                >
                  <PenLine size={14} />
                  নোট যোগ করুন
                </button>
              </div>

              {/* Note inline add form */}
              {showNoteForm && (
                <form 
                  onSubmit={handleAddNote}
                  style={{
                    background: '#F8F9FA', borderRadius: 12, padding: 14,
                    border: '1.5px solid rgba(0,0,0,0.1)', marginBottom: 20,
                    animation: 'noteFormIn 200ms ease-out'
                  }}
                >
                  <textarea
                    placeholder="আপনার আপডেট বা নোট লিখুন..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    required
                    autoFocus
                    style={{
                      width: '100%', background: 'white', border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 8, padding: '10px 12px', fontFamily: "'Hind Siliguri', sans-serif",
                      fontSize: 13, minHeight: 70, outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => setShowNoteForm(false)}
                      style={{ background: 'none', border: 'none', color: '#888780', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, cursor: 'pointer' }}
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      style={{
                        background: '#1D9E75', color: 'white', border: 'none',
                        borderRadius: 6, padding: '6px 12px', fontFamily: "'Hind Siliguri', sans-serif",
                        fontSize: 12, fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      সেভ করুন
                    </button>
                  </div>
                </form>
              )}

              {/* Timeline Container */}
              <div style={{ position: 'relative', minHeight: 100 }}>
                {/* Vertical gradient bar */}
                <div className="cl-timeline-line" />

                {(cItem.timeline || []).map((evt, idx) => {
                  const evCfg = getTimelineEventStyles(evt.type);
                  const EvIcon = evCfg.icon;
                  const formattedEvDate = new Date(evt.createdAt).toLocaleString('bn-BD', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  });

                  const isEditing = editingNoteId === evt.id;

                  return (
                    <div 
                      key={evt.id} 
                      style={{
                        display: 'flex', gap: 16, marginBottom: 20, position: 'relative',
                        animation: `timelineEventIn 250ms ease-out ${idx * 80}ms backwards`
                      }}
                    >
                      {/* Node circle */}
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%', background: 'white',
                        border: `2px solid ${evCfg.color}`, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: evCfg.color, zIndex: 3, flexShrink: 0
                      }}>
                        <EvIcon size={16} />
                      </div>

                      {/* Content Card */}
                      <div style={{
                        flex: 1, background: 'white', borderRadius: 12,
                        border: '1px solid rgba(0,0,0,0.07)', padding: '12px 16px',
                        display: 'flex', flexDirection: 'column'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 600, color: '#1C1B1A' }}>
                            {evt.title}
                          </span>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: '#888780' }}>
                            {formattedEvDate}
                          </span>
                        </div>

                        {/* Inline Editing */}
                        {isEditing ? (
                          <div style={{ marginTop: 8 }}>
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              style={{ width: '100%', minHeight: 60, padding: 8, border: '1.5px solid #1D9E75', borderRadius: 8, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, outline: 'none' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                              <button onClick={() => setEditingNoteId(null)} style={{ background: 'none', border: 'none', color: '#888780', fontSize: 11, cursor: 'pointer' }}>
                                বাতিল
                              </button>
                              <button onClick={() => handleSaveEdit(evt.id)} style={{ background: '#1D9E75', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>
                                সেভ
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#4A4845', margin: '6px 0 0', lineHeight: 1.6 }}>
                              {evt.description}
                            </p>

                            {/* Additional Actions for Editable Notes */}
                            {evt.type === 'note_added' && (
                              <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => {
                                    setEditingNoteId(evt.id);
                                    setEditText(evt.description);
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#1D9E75', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}
                                >
                                  সম্পাদনা
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(evt.id)}
                                  style={{ background: 'none', border: 'none', color: '#E24B4A', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}
                                >
                                  মুছুন
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* QUICK ACTIONS CARD */}
            <div className="cl-modal-card" style={{ width: '100%', padding: 20, animation: 'none' }}>
              <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600, color: '#1C1B1A', margin: '0 0 16px' }}>
                দ্রুত অ্যাকশন
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Action 1 */}
                <button
                  onClick={handleAskProti}
                  style={{
                    background: '#E1F5EE', color: '#0F6E56', border: 'none',
                    borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                    fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s', textAlign: 'left'
                  }}
                  className="action-btn-hover"
                >
                  <MessageCircle size={18} color="#1D9E75" />
                  Proti-কে জিজ্ঞেস করুন
                </button>

                {/* Action 2 */}
                <button
                  onClick={() => {
                    localStorage.setItem('protiker_case_context', JSON.stringify({
                      caseId: cItem.id,
                      title: cItem.title,
                      category: cItem.category,
                      problem: cItem.problem
                    }));
                    navigate(`/documents/new?caseId=${cItem.id}`);
                  }}
                  style={{
                    background: '#E6F1FB', color: '#185FA5', border: 'none',
                    borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                    fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s', textAlign: 'left'
                  }}
                  className="action-btn-hover"
                >
                  <FilePlus size={18} color="#378ADD" />
                  নতুন দলিল তৈরি করুন
                </button>

                {/* Action 3 */}
                <button
                  onClick={() => navigate('/help-finder')}
                  style={{
                    background: '#FAEEDA', color: '#854F0B', border: 'none',
                    borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                    fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s', textAlign: 'left'
                  }}
                  className="action-btn-hover"
                >
                  <MapPin size={18} color="#EF9F27" />
                  সংস্থা খুঁজুন
                </button>

                <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />

                {/* Action 4 */}
                <button
                  onClick={() => setShowShare(true)}
                  style={{
                    background: 'white', border: '1px solid rgba(0,0,0,0.08)', color: '#4A4845',
                    borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
                    fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.15s', textAlign: 'left'
                  }}
                  className="action-btn-hover"
                >
                  <LinkIcon size={14} color="#888780" />
                  শেয়ার লিংক কপি করুন
                </button>
              </div>
            </div>

            {/* DEADLINE CARD */}
            {deadlineStatus && (
              <div 
                className="cl-modal-card" 
                style={{ 
                  width: '100%', padding: 20, animation: 'none',
                  background: deadlineStatus.bg, border: `1.5px solid ${deadlineStatus.border}`,
                  borderLeft: `4px solid ${deadlineStatus.color}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Clock size={16} color={deadlineStatus.color} />
                    <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 600, color: '#1C1B1A' }}>
                      সময়সীমা
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm('সময়সীমা সরাতে চান?')) {
                        dispatch({ type: 'REMOVE_DEADLINE', payload: { caseId: cItem.id } });
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: '#888780', cursor: 'pointer', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11 }}
                  >
                    সরান
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '14px 0 8px' }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 700, color: deadlineStatus.color, lineHeight: 1 }}>
                    {Math.abs(deadlineStatus.diffDays).toLocaleString('bn-BD')}
                  </span>
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, color: '#1C1B1A', fontWeight: 500 }}>
                    {deadlineStatus.diffDays < 0 ? 'দিন পার হয়ে গেছে' : 'দিন বাকি'}
                  </span>
                </div>

                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#888780', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} />
                  <span>{new Date(cItem.deadlineDate).toLocaleDateString('bn-BD')}</span>
                </div>

                {cItem.deadlineNote && (
                  <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#4A4845', margin: '8px 0 0', background: 'rgba(0,0,0,0.02)', padding: 8, borderRadius: 6 }}>
                    {cItem.deadlineNote}
                  </p>
                )}
              </div>
            )}

            {/* CONNECTED DOCUMENTS CARD */}
            <div className="cl-modal-card" style={{ width: '100%', padding: 20, animation: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
                  সংযুক্ত দলিল
                </h3>
                <span 
                  onClick={() => navigate('/documents')}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#1D9E75', cursor: 'pointer', fontWeight: 500 }}
                >
                  সব দেখুন
                </span>
              </div>

              {cItem.documents && cItem.documents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cItem.documents.map(doc => (
                    <div 
                      key={doc.id}
                      onClick={() => navigate(`/documents/${doc.id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, background: '#F8F9FA',
                        borderRadius: 10, padding: '10px 14px', cursor: 'pointer', transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E1F5EE'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8F9FA'}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: doc.iconBg || '#E1F5EE',
                        color: doc.iconColor || '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <FileText size={15} />
                      </div>
                      <span style={{
                        fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, color: '#1C1B1A',
                        flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {doc.name}
                      </span>
                      <Download size={14} color="#888780" />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#888780' }}>
                    কোনো দলিল নেই
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.setItem('protiker_case_context', JSON.stringify({
                        caseId: cItem.id,
                        title: cItem.title,
                        category: cItem.category,
                        problem: cItem.problem
                      }));
                      navigate(`/documents/new?caseId=${cItem.id}`);
                    }}
                    style={{ background: 'none', border: 'none', color: '#1D9E75', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 6 }}
                  >
                    + দলিল তৈরি করুন
                  </button>
                </div>
              )}
            </div>

            {/* EVIDENCE & FILE PORTAL CARD */}
            <div className="cl-modal-card" style={{ width: '100%', padding: 20, animation: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
                  প্রমাণপত্র ও ফাইল পোর্টাল
                </h3>
                <label 
                  style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#1D9E75', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Plus size={14} /> আপলোড
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileUpload} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>

              {cItem.attachments && cItem.attachments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cItem.attachments.map(file => {
                    const FileIcon = getFileIcon(file.type, file.name);
                    return (
                      <div 
                        key={file.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, background: '#F8F9FA',
                          borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', background: '#F4F6F8',
                          color: '#4A4845', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <FileIcon size={16} />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                          <span style={{
                            fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, color: '#1C1B1A',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'
                          }} title={file.name}>
                            {file.name}
                          </span>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: '#888780' }}>
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <a 
                            href={file.dataUrl} 
                            download={file.name}
                            style={{ display: 'flex', alignItems: 'center', color: '#1D9E75' }}
                          >
                            <Download size={15} />
                          </a>
                          <button 
                            onClick={() => {
                              if (window.confirm('ফাইলটি মুছে ফেলতে চান?')) {
                                dispatch({ type: 'DELETE_ATTACHMENT', payload: { caseId: cItem.id, attachmentId: file.id } });
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#E24B4A', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#888780' }}>
                    কোনো ফাইল সংযুক্ত নেই (অডিও, ভিডিও, ছবি ইত্যাদি আপলোড করতে পারেন)
                  </div>
                </div>
              )}
            </div>

            {/* NGO CONTACTS CARD */}
            <div className="cl-modal-card" style={{ width: '100%', padding: 20, animation: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
                  যোগাযোগ করা সংস্থা
                </h3>
              </div>

              {cItem.contacts && cItem.contacts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cItem.contacts.map(contact => (
                    <div 
                      key={contact.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 10,
                        borderBottom: '1px solid rgba(0,0,0,0.06)'
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: '#FCEBEB',
                        color: '#E24B4A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Building2 size={15} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, color: '#1C1B1A' }}>
                          {contact.name}
                        </span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: '#888780' }}>
                          {new Date(contact.contactedAt).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                      <a href={`tel:${contact.method === 'phone' ? '0170000000' : '16699'}`} style={{ color: '#1D9E75' }}>
                        <Clock size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#888780' }}>
                    এখনো কোনো সংস্থায় যোগাযোগ করা হয়নি
                  </div>
                  <button 
                    onClick={() => navigate('/help-finder')}
                    style={{ background: 'none', border: 'none', color: '#1D9E75', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 6 }}
                  >
                    সংস্থা খুঁজুন
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* MODALS */}
        {showShare && <ShareCaseModal caseItem={cItem} onClose={() => setShowShare(false)} />}
      </main>
    </div>
  );
}
