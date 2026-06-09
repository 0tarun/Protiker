import { useState } from 'react';
import { X } from 'lucide-react';
import { useCaseLog } from '../../context/CaseLogContext';

export default function NewCaseModal() {
  const { dispatch } = useCaseLog();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('শ্রম অধিকার');
  const [severity, setSeverity] = useState('low');
  const [problem, setProblem] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineNote, setDeadlineNote] = useState('');

  const categories = [
    'শ্রম অধিকার',
    'বাড়িভাড়া',
    'পারিবারিক সহিংসতা',
    'ভোক্তা অধিকার',
    'জমি ও সম্পত্তি',
    'পুলিশ ও গ্রেফতার',
    'অন্যান্য'
  ];

  const severityLevels = [
    { value: 'low', label: 'সাধারণ', color: '#1D9E75', bg: '#E1F5EE' },
    { value: 'moderate', label: 'মাঝারি', color: '#EF9F27', bg: '#FAEEDA' },
    { value: 'serious', label: 'গুরুতর', color: '#E24B4A', bg: '#FCEBEB' },
    { value: 'urgent', label: 'জরুরি', color: '#7C3AED', bg: '#F3E8FF' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('কেসের শিরোনাম দিন');
      return;
    }

    const newCase = {
      id: `case-${Date.now()}`,
      title,
      category,
      categorySlug: getCategorySlug(category),
      severity,
      caseStatus: 'identified',
      problem,
      createdAt: new Date().toISOString(),
      deadlineDate: deadlineDate || null,
      deadlineNote: deadlineNote || null,
      shareToken: `share-${Math.random().toString(36).substr(2, 9)}`,
      documents: [],
      contacts: [],
      timeline: [
        {
          id: `evt-${Date.now()}`,
          type: 'chat_started',
          title: 'কেস ডায়েরি শুরু',
          description: 'ম্যানুয়ালি একটি নতুন কেস রেকর্ড তৈরি করা হয়েছে।',
          createdAt: new Date().toISOString()
        }
      ]
    };

    dispatch({ type: 'ADD_CASE', payload: newCase });
    dispatch({ type: 'CLOSE_NEW_CASE_MODAL' });
  };

  const getCategorySlug = (cat) => {
    const slugs = {
      'শ্রম অধিকার': 'labour',
      'বাড়িভাড়া': 'house-rent',
      'পারিবারিক সহিংসতা': 'family-violence',
      'ভোক্তা অধিকার': 'consumer-rights',
      'জমি ও সম্পত্তি': 'land-property',
      'পুলিশ ও গ্রেফতার': 'police-arrest'
    };
    return slugs[cat] || 'general';
  };

  return (
    <div className="cl-modal-overlay">
      <div className="cl-modal-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 20, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
            নতুন কেস তৈরি করুন
          </h2>
          <button 
            onClick={() => dispatch({ type: 'CLOSE_NEW_CASE_MODAL' })}
            style={{ background: '#F4F6F8', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#888780' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, color: '#4A4845' }}>
              কেসের শিরোনাম *
            </label>
            <input 
              type="text" 
              placeholder="যেমন: বকেয়া বেতন দাবি — ABC Garments"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ padding: '10px 14px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14 }}
            />
          </div>

          {/* Category */}
          <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, color: '#4A4845' }}>
              আইনি শ্রেণী *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '10px 14px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, background: 'white' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, color: '#4A4845' }}>
              গুরুত্বের মাত্রা *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {severityLevels.map(lvl => {
                const isSelected = severity === lvl.value;
                return (
                  <button
                    key={lvl.value}
                    type="button"
                    onClick={() => setSeverity(lvl.value)}
                    style={{
                      padding: '10px',
                      borderRadius: 10,
                      border: `1.5px solid ${isSelected ? lvl.color : 'rgba(0,0,0,0.06)'}`,
                      background: isSelected ? lvl.color : lvl.bg,
                      color: isSelected ? 'white' : lvl.color,
                      fontFamily: "'Hind Siliguri', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, color: '#4A4845' }}>
              সমস্যার বিবরণ (ঐচ্ছিক)
            </label>
            <textarea
              placeholder="সংক্ষেপে সমস্যাটা বলুন..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              style={{ padding: '10px 14px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, minHeight: 80, resize: 'vertical' }}
            />
          </div>

          {/* Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 12 }}>
            <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, color: '#4A4845' }}>
                সময়সীমা (ঐচ্ছিক)
              </label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                style={{ padding: '9px 12px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10, fontFamily: "'Inter', sans-serif", fontSize: 13 }}
              />
            </div>
            <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 500, color: '#4A4845' }}>
                সময়সীমার নোট (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: ১২ মাসের মধ্যে"
                value={deadlineNote}
                onChange={(e) => setDeadlineNote(e.target.value)}
                style={{ padding: '10px 12px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 10, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'CLOSE_NEW_CASE_MODAL' })}
              style={{ flex: 1, padding: '11px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, background: 'white', color: '#4A4845', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
            >
              বাতিল
            </button>
            <button
              type="submit"
              style={{ flex: 1.5, padding: '11px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg,#1D9E75,#0F6E56)', color: 'white', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 12px rgba(29,158,117,0.2)' }}
            >
              কেস তৈরি করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
