import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { useCaseLog } from '../context/CaseLogContext';
import { Search, Plus, FolderOpen, Activity, CheckCircle, FileText, LayoutList, LayoutGrid, AlertCircle } from 'lucide-react';
import CaseCard from '../components/caseLog/CaseCard';
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
        <div className="cl-header-container">
          <div>
            <h1 className="cl-header-title">
              আমার কেস লগ
            </h1>
            <p className="cl-header-subtitle">
              আপনার সকল আইনি সমস্যার রেকর্ড ও ট্র্যাকিং
            </p>
          </div>

          <div className="cl-header-right">
            <div className="cl-search-box-wrap">
              <span className="cl-search-box-icon"><Search size={14} /></span>
              <input 
                type="text" 
                placeholder="কেস খুঁজুন..."
                value={state.searchQuery}
                onChange={handleSearchChange}
                className="cl-search-box-input"
              />
            </div>

            <button 
              onClick={() => navigate('/case-log/new')}
              className="cl-btn-primary"
            >
              <Plus size={16} />
              নতুন কেস
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="cl-stats-grid">
          {/* Stat 1 */}
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: '#E1F5EE', color: '#1D9E75' }}>
              <FolderOpen size={22} />
            </div>
            <div>
              <div className="cl-stat-val">
                {state.cases.length}
              </div>
              <div className="cl-stat-label">
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
              <div className="cl-stat-val">
                {activeCasesCount}
              </div>
              <div className="cl-stat-label">
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
              <div className="cl-stat-val">
                {resolvedCasesCount}
              </div>
              <div className="cl-stat-label">
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
              <div className="cl-stat-val">
                {totalDocsCount}
              </div>
              <div className="cl-stat-label">
                মোট দলিল
              </div>
            </div>
          </div>
        </div>

        {/* FILTER + SORT ROW */}
        <div className="cl-controls-row">
          {/* Status Tabs */}
          <div className="cl-filter-tabs">
            {filterTabs.map(tab => {
              const isActive = state.activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={`cl-filter-tab-btn${isActive ? ' active' : ''}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Sort & Toggle */}
          <div className="cl-controls-right">
            <select
              value={state.sortBy}
              onChange={handleSortChange}
              className="cl-sort-select"
            >
              <option value="সর্বশেষ">সর্বশেষ ▾</option>
              <option value="পুরনো">পুরনো ▾</option>
              <option value="গুরুত্ব">গুরুত্ব ▾</option>
              <option value="শ্রেণী">শ্রেণী ▾</option>
            </select>

            <div className="cl-view-mode-toggle">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_VIEW' })}
                className={`cl-toggle-btn${state.viewMode === 'list' ? ' active' : ''}`}
              >
                <LayoutList size={16} />
              </button>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_VIEW' })}
                className={`cl-toggle-btn${state.viewMode === 'cards' ? ' active' : ''}`}
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
          <div className="cl-empty-card">
            <FolderOpen size={72} className="cl-empty-icon" />
            <h3 className="cl-empty-title">
              কোনো কেস লগ নেই
            </h3>
            <p className="cl-empty-text">
              Proti-র সাথে কথা বলুন এবং কেস লগে সেভ করুন অথবা ম্যানুয়ালি তৈরি করুন
            </p>
            <div className="cl-empty-actions">
              <button
                onClick={() => navigate('/chat')}
                className="cl-empty-btn-chat"
              >
                Proti-র সাথে কথা বলুন
              </button>
              <button
                onClick={() => navigate('/case-log/new')}
                className="cl-empty-btn-manual"
              >
                + ম্যানুয়াল কেস তৈরি করুন
              </button>
            </div>
          </div>
        )}

        {/* MODALS */}
        {sharingCase && <ShareCaseModal caseItem={sharingCase} onClose={() => setSharingCase(null)} />}
      </main>
    </div>
  );
}
