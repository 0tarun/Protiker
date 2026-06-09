import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { useCaseLog } from '../context/CaseLogContext';
import { Search, Plus, FolderOpen, Activity, CheckCircle, FileText, LayoutList, LayoutGrid, AlertCircle } from 'lucide-react';
import CaseCard from '../components/caseLog/CaseCard';
import NewCaseModal from '../components/caseLog/NewCaseModal';
import ShareCaseModal from '../components/caseLog/ShareCaseModal';
import DeadlineAlertBanner from '../components/caseLog/DeadlineAlertBanner';
import '../styles/caselog.css';
import { useNavigate } from 'react-router-dom';

export default function CaseLogPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useCaseLog();
  const [sharingCase, setSharingCase] = useState(null);

  const filterTabs = [
    'সব কেস',
    'চলমান',
    'নোটিশ পাঠানো',
    'আইনি ব্যবস্থা',
    'সমাধান'
  ];

  // Helper to get count of documents
  const totalDocsCount = state.cases.reduce((sum, c) => sum + (c.documents || []).length, 0);
  const activeCasesCount = state.cases.filter(c => c.caseStatus !== 'resolved').length;
  const resolvedCasesCount = state.cases.filter(c => c.caseStatus === 'resolved').length;

  const handleSearchChange = (e) => {
    dispatch({ type: 'SET_SEARCH', payload: e.target.value });
  };

  const handleFilterChange = (tab) => {
    dispatch({ type: 'SET_FILTER', payload: tab });
  };

  const handleSortChange = (e) => {
    dispatch({ type: 'SET_SORT', payload: e.target.value });
  };

  return (
    <div className="cl-layout">
      <Sidebar activeItem="কেস লগ" />

      <main className="cl-main">
        {/* DEADLINE BANNER */}
        <DeadlineAlertBanner cases={state.cases} />

        {/* TOP BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 24, fontWeight: 600, color: '#1C1B1A', margin: 0 }}>
              আমার কেস লগ
            </h1>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, color: '#4A4845', margin: '4px 0 0' }}>
              আপনার সকল আইনি সমস্যার রেকর্ড ও ট্র্যাকিং
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="cl-search-input-wrap" style={{ position: 'relative' }}>
              <Search size={15} color="#888780" style={{ position: 'absolute', left: 14, top: 12 }} />
              <input 
                type="text" 
                placeholder="কেস খুঁজুন..."
                value={state.searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: 240, background: 'white', border: '1.5px solid rgba(0,0,0,0.1)',
                  borderRadius: 10, padding: '9px 14px 9px 38px', fontFamily: "'Hind Siliguri', sans-serif",
                  fontSize: 14, transition: 'all 0.2s'
                }}
              />
            </div>

            <button 
              onClick={() => dispatch({ type: 'OPEN_NEW_CASE_MODAL' })}
              style={{
                background: 'linear-gradient(135deg,#1D9E75,#0F6E56)', color: 'white', border: 'none',
                borderRadius: 10, padding: '9px 20px', fontFamily: "'Hind Siliguri', sans-serif",
                fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(29,158,117,0.3)', transition: 'all 0.2s'
              }}
              className="action-btn-hover"
            >
              <Plus size={16} />
              নতুন কেস
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
          {/* Stat 1 */}
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: '#E1F5EE', color: '#1D9E75' }}>
              <FolderOpen size={22} />
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 700, color: '#1C1B1A', lineHeight: 1.2 }}>
                {state.cases.length}
              </div>
              <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#4A4845', marginTop: 2 }}>
                মোট কেস
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: '#FAEEDA', color: '#EF9F27' }}>
              <Activity size={22} />
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 700, color: '#1C1B1A', lineHeight: 1.2 }}>
                {activeCasesCount}
              </div>
              <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#4A4845', marginTop: 2 }}>
                চলমান কেস
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: '#EAF3DE', color: '#639922' }}>
              <CheckCircle size={22} />
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 700, color: '#1C1B1A', lineHeight: 1.2 }}>
                {resolvedCasesCount}
              </div>
              <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#4A4845', marginTop: 2 }}>
                সমাধানকৃত কেস
              </div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: '#E6F1FB', color: '#378ADD' }}>
              <FileText size={22} />
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 700, color: '#1C1B1A', lineHeight: 1.2 }}>
                {totalDocsCount}
              </div>
              <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: '#4A4845', marginTop: 2 }}>
                মোট দলিল
              </div>
            </div>
          </div>
        </div>

        {/* FILTER + SORT ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          {/* Status Tabs */}
          <div style={{
            background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10,
            padding: 4, display: 'inline-flex', gap: 4
          }}>
            {filterTabs.map(tab => {
              const isActive = state.activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  style={{
                    background: isActive ? '#1D9E75' : 'transparent',
                    color: isActive ? 'white' : '#4A4845',
                    border: 'none',
                    borderRadius: 7,
                    padding: '6px 14px',
                    fontFamily: "'Hind Siliguri', sans-serif",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Sort & Toggle */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select
              value={state.sortBy}
              onChange={handleSortChange}
              style={{
                background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8,
                padding: '7px 12px', fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13,
                cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="সর্বশেষ">সর্বশেষ ▾</option>
              <option value="পুরনো">পুরনো ▾</option>
              <option value="গুরুত্ব">গুরুত্ব ▾</option>
              <option value="শ্রেণী">শ্রেণী ▾</option>
            </select>

            <div style={{ display: 'flex', gap: 4, background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: 2 }}>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_VIEW' })}
                style={{
                  width: 32, height: 32, borderRadius: 6, border: 'none',
                  background: state.viewMode === 'list' ? '#E1F5EE' : 'transparent',
                  color: state.viewMode === 'list' ? '#1D9E75' : '#888780',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <LayoutList size={16} />
              </button>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_VIEW' })}
                style={{
                  width: 32, height: 32, borderRadius: 6, border: 'none',
                  background: state.viewMode === 'cards' ? '#E1F5EE' : 'transparent',
                  color: state.viewMode === 'cards' ? '#1D9E75' : '#888780',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* LIST / GRID CONTENT */}
        {state.filteredCases.length > 0 ? (
          <div className={state.viewMode === 'list' ? 'cl-cases-list-container' : 'cl-cases-grid-container'}>
            {state.filteredCases.map((c, i) => (
              <CaseCard 
                key={c.id} 
                caseItem={c} 
                index={i} 
                viewMode={state.viewMode} 
                onShare={(item) => setSharingCase(item)}
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)' }}>
            <FolderOpen size={72} color="rgba(0,0,0,0.08)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 20, fontWeight: 500, color: '#888780', margin: '0 0 8px' }}>
              কোনো কেস লগ নেই
            </h3>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, color: '#888780', margin: '0 0 24px' }}>
              Proti-র সাথে কথা বলুন এবং কেস লগে সেভ করুন অথবা ম্যানুয়ালি তৈরি করুন
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/chat')}
                style={{
                  background: 'linear-gradient(135deg,#1D9E75,#0F6E56)', color: 'white', border: 'none',
                  borderRadius: 10, padding: '10px 24px', fontFamily: "'Hind Siliguri', sans-serif",
                  fontSize: 14, fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 12px rgba(29,158,117,0.2)'
                }}
              >
                Proti-র সাথে কথা বলুন
              </button>
              <button
                onClick={() => dispatch({ type: 'OPEN_NEW_CASE_MODAL' })}
                style={{
                  background: 'white', border: '1px solid rgba(0,0,0,0.12)', color: '#4A4845',
                  borderRadius: 10, padding: '10px 24px', fontFamily: "'Hind Siliguri', sans-serif",
                  fontSize: 14, fontWeight: 500, cursor: 'pointer'
                }}
              >
                + ম্যানুয়াল কেস তৈরি করুন
              </button>
            </div>
          </div>
        )}

        {/* MODALS */}
        {state.showNewCaseModal && <NewCaseModal />}
        {sharingCase && <ShareCaseModal caseItem={sharingCase} onClose={() => setSharingCase(null)} />}
      </main>
    </div>
  );
}
