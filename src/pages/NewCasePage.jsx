/**
 * NewCasePage.jsx — Dedicated page for creating a new legal case.
 * Renders a full form in a card container with a sidebar.
 * Route: /case-log/new
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Shield, HelpCircle, PhoneCall, CheckCircle } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import { useCaseLog } from '../context/CaseLogContext';
import '../styles/caselog.css';
import '../styles/dashboard.css';

export default function NewCasePage() {
  const navigate = useNavigate();
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
    navigate('/case-log');
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
    <div className="cl-layout">
      <Sidebar activeItem="কেস লগ" />

      <main className="cl-main">
        {/* Back link */}
        <button className="doc-back-link" onClick={() => navigate('/case-log')} style={{ border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: '#888780', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 20 }}>
          <ArrowLeft size={18} /> কেস লগ-এ ফিরে যান
        </button>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="cl-header-title" style={{ fontSize: 24, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
            নতুন কেস ফাইল করুন
          </h1>
          <p className="cl-header-subtitle" style={{ fontSize: 14, color: '#4A4845', margin: '4px 0 0' }}>
            আপনার আইনি সমস্যার রেকর্ড তৈরি করতে নিচের তথ্যগুলো পূরণ করুন
          </p>
        </div>

        {/* Two-Column Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32, alignItems: 'start' }}>
          
          {/* Left Column - Form Container */}
          <div className="cl-page-form-container" style={{ background: '#ffffff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Title */}
              <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, color: '#1C1B1A' }}>
                  কেসের শিরোনাম *
                </label>
                <input 
                  type="text" 
                  placeholder="যেমন: বকেয়া বেতন দাবি — ABC Garments"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ padding: '12px 16px', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 10, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Category & Severity Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
                {/* Category */}
                <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, color: '#1C1B1A' }}>
                    আইনি শ্রেণী *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ padding: '12px 16px', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 10, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, background: 'white', outline: 'none', width: '100%', boxSizing: 'border-box', cursor: 'pointer' }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Severity */}
                <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, color: '#1C1B1A' }}>
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
                            padding: '10px 6px',
                            borderRadius: 8,
                            border: `1.5px solid ${isSelected ? lvl.color : 'rgba(0,0,0,0.05)'}`,
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
              </div>

              {/* Description */}
              <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, color: '#1C1B1A' }}>
                  সমস্যার বিবরণ (ঐচ্ছিক)
                </label>
                <textarea
                  placeholder="সংক্ষেপে সমস্যাটা বলুন..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  style={{ padding: '12px 16px', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 10, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, minHeight: 120, resize: 'vertical', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Deadline */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
                <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, color: '#1C1B1A' }}>
                    সময়সীমা (ঐচ্ছিক)
                  </label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    style={{ padding: '11px 14px', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 10, fontFamily: "'Inter', sans-serif", fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div className="cl-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, color: '#1C1B1A' }}>
                    সময়সীমার নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ১২ মাসের মধ্যে"
                    value={deadlineNote}
                    onChange={(e) => setDeadlineNote(e.target.value)}
                    style={{ padding: '12px 14px', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 10, fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => navigate('/case-log')}
                  style={{ flex: 1, padding: '12px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, background: 'white', color: '#4A4845', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.target.style.background = '#F4F6F8'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  style={{ flex: 1.5, padding: '12px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg,#1D9E75,#0F6E56)', color: 'white', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 12px rgba(29,158,117,0.2)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(29,158,117,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(29,158,117,0.2)';
                  }}
                >
                  কেস তৈরি করুন
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Legal Guide & Help Center */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Guide Card */}
            <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#E1F5EE', color: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={18} />
                </div>
                <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
                  কেস ট্র্যাকিং গাইড
                </h3>
              </div>
              <ul style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#4A4845', margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12, lineHeight: 1.5 }}>
                <li><strong>সংক্ষিপ্ত শিরোনাম দিন:</strong> এমন একটি নাম ব্যবহার করুন যা দেখে সহজেই আপনার কেসটি চেনা যায় (যেমন: বাসা থেকে উচ্ছেদ সমস্যা)।</li>
                <li><strong>সঠিক আইনি শ্রেণী সিলেক্ট করুন:</strong> ক্যাটাগরি নির্বাচনের মাধ্যমে প্রোতি আপনার কেসের জন্য সঠিক আইন বিষয়ক তথ্য অনুসন্ধান করতে পারে।</li>
                <li><strong>সময়সীমা নির্ধারণ করুন:</strong> আইনি পদক্ষেপের জন্য একটি ডেডলাইন দিলে অ্যাপ্লিকেশনটি আপনাকে সময়মতো অ্যালার্ট ব্যানার দিয়ে মনে করিয়ে দেবে।</li>
              </ul>
            </div>

            {/* Helpline Card */}
            <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#E6F1FB', color: '#378ADD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhoneCall size={18} />
                </div>
                <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
                  জরুরি আইনি সহায়তার হেল্পলাইন
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(0,0,0,0.08)', paddingBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 600, color: '#1C1B1A' }}>জাতীয় আইনগত সহায়তা (NLASO)</div>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: '#888780' }}>সরকারি আইনি সহায়তা হেল্পলাইন</div>
                  </div>
                  <a href="tel:16699" style={{ textDecoration: 'none', background: '#E1F5EE', color: '#1D9E75', fontWeight: 600, fontSize: 12, padding: '4px 10px', borderRadius: 6, fontFamily: "'Inter', sans-serif" }}>16699</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(0,0,0,0.08)', paddingBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 600, color: '#1C1B1A' }}>জাতীয় মানবাধিকার কমিশন</div>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: '#888780' }}>অধিকার লঙ্ঘন সংক্রান্ত অভিযোগ</div>
                  </div>
                  <a href="tel:16108" style={{ textDecoration: 'none', background: '#E1F5EE', color: '#1D9E75', fontWeight: 600, fontSize: 12, padding: '4px 10px', borderRadius: 6, fontFamily: "'Inter', sans-serif" }}>16108</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 600, color: '#1C1B1A' }}>জাতীয় জরুরি সেবা (পুলিশ/অ্যাম্বুলেন্স)</div>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: '#888780' }}>যেকোনো জরুরি পুলিশি সহায়তায়</div>
                  </div>
                  <a href="tel:999" style={{ textDecoration: 'none', background: '#F3E8FF', color: '#7C3AED', fontWeight: 600, fontSize: 12, padding: '4px 10px', borderRadius: 6, fontFamily: "'Inter', sans-serif" }}>999</a>
                </div>
              </div>
            </div>

            {/* Proti Tip */}
            <div style={{ background: '#E1F5EE', borderRadius: 16, border: '1px solid rgba(29, 158, 117, 0.15)', padding: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Shield size={20} color="#1D9E75" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 600, color: '#0F6E56' }}>প্রোতি টিপস</div>
                <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: '#0F6E56', margin: '4px 0 0', lineHeight: 1.4 }}>
                  আপনার কেসের যাবতীয় রসিদ, উচ্ছেদ নোটিশ বা কোনো ডকুমেন্টের স্ক্যানড ছবি আমাদের <strong>আমার দলিলপত্র</strong> সেকশনে সেভ করে রাখতে পারেন। প্রয়োজনে কেস শেয়ারিং লিংক তৈরি করে আপনার উকিল বা সহায়তাকারী NGO-কে পাঠাতে পারেন।
                </p>
              </div>
            </div>

          </div>
          
        </div>
      </main>
    </div>
  );
}
