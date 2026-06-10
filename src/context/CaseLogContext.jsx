import { createContext, useReducer, useContext, useEffect } from 'react';
import { mockCases } from '../data/mockCaseLogs';

const CaseLogContext = createContext();

const initialState = {
  cases: [],
  filteredCases: [],
  selectedCase: null,
  activeFilter: 'সব কেস',
  searchQuery: '',
  sortBy: 'সর্বশেষ',
  viewMode: 'list', // 'list' | 'cards'
  isLoading: true,
  showNewCaseModal: false,
  showShareModal: false
};

function caseLogReducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return {
        ...state,
        cases: action.payload,
        filteredCases: action.payload,
        isLoading: false
      };
    case 'SET_FILTER':
      return { ...state, activeFilter: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'TOGGLE_VIEW':
      return { ...state, viewMode: state.viewMode === 'list' ? 'cards' : 'list' };
    case 'OPEN_NEW_CASE_MODAL':
      return { ...state, showNewCaseModal: true };
    case 'CLOSE_NEW_CASE_MODAL':
      return { ...state, showNewCaseModal: false };
    case 'SELECT_CASE':
      return { ...state, selectedCase: action.payload };
    
    case 'ADD_CASE': {
      const newCases = [action.payload, ...state.cases];
      return { ...state, cases: newCases };
    }

    case 'DELETE_CASE': {
      const newCases = state.cases.filter(c => c.id !== action.payload);
      const selected = state.selectedCase?.id === action.payload ? null : state.selectedCase;
      return { ...state, cases: newCases, selectedCase: selected };
    }

    case 'UPDATE_CASE_STATUS': {
      const { caseId, oldStatus, newStatus } = action.payload;
      const updatedCases = state.cases.map(c => {
        if (c.id === caseId) {
          const statusEvent = {
            id: `evt-${Date.now()}`,
            type: 'status_changed',
            title: 'স্ট্যাটাস আপডেট',
            description: `অবস্থা পরিবর্তন: ${getStatusLabel(oldStatus)} → ${getStatusLabel(newStatus)}`,
            createdAt: new Date().toISOString(),
            oldStatus,
            newStatus
          };
          return {
            ...c,
            caseStatus: newStatus,
            timeline: [statusEvent, ...c.timeline]
          };
        }
        return c;
      });
      const selected = state.selectedCase?.id === caseId 
        ? updatedCases.find(c => c.id === caseId) 
        : state.selectedCase;
      return { ...state, cases: updatedCases, selectedCase: selected };
    }

    case 'ADD_TIMELINE_EVENT': {
      const { caseId, event } = action.payload;
      const updatedCases = state.cases.map(c => {
        if (c.id === caseId) {
          return { ...c, timeline: [event, ...c.timeline] };
        }
        return c;
      });
      const selected = state.selectedCase?.id === caseId 
        ? updatedCases.find(c => c.id === caseId) 
        : state.selectedCase;
      return { ...state, cases: updatedCases, selectedCase: selected };
    }

    case 'LINK_DOCUMENT_TO_CASE': {
      const { caseId, document, event } = action.payload;
      const updatedCases = state.cases.map(c => {
        if (c.id === caseId) {
          const currentDocs = c.documents || [];
          const updatedDocs = currentDocs.some(d => d.id === document.id)
            ? currentDocs
            : [...currentDocs, document];
          return {
            ...c,
            documents: updatedDocs,
            timeline: [event, ...c.timeline]
          };
        }
        return c;
      });
      const selected = state.selectedCase?.id === caseId 
        ? updatedCases.find(c => c.id === caseId) 
        : state.selectedCase;
      return { ...state, cases: updatedCases, selectedCase: selected };
    }

    case 'ADD_NOTE': {
      const { caseId, noteText } = action.payload;
      const noteEvent = {
        id: `evt-${Date.now()}`,
        type: 'note_added',
        title: 'নোট যোগ করা হয়েছে',
        description: noteText,
        createdAt: new Date().toISOString()
      };
      const updatedCases = state.cases.map(c => {
        if (c.id === caseId) {
          return { ...c, timeline: [noteEvent, ...c.timeline] };
        }
        return c;
      });
      const selected = state.selectedCase?.id === caseId 
        ? updatedCases.find(c => c.id === caseId) 
        : state.selectedCase;
      return { ...state, cases: updatedCases, selectedCase: selected };
    }

    case 'EDIT_NOTE': {
      const { caseId, eventId, noteText } = action.payload;
      const updatedCases = state.cases.map(c => {
        if (c.id === caseId) {
          const updatedTimeline = c.timeline.map(evt => {
            if (evt.id === eventId) {
              return { ...evt, description: noteText };
            }
            return evt;
          });
          return { ...c, timeline: updatedTimeline };
        }
        return c;
      });
      const selected = state.selectedCase?.id === caseId 
        ? updatedCases.find(c => c.id === caseId) 
        : state.selectedCase;
      return { ...state, cases: updatedCases, selectedCase: selected };
    }

    case 'DELETE_NOTE': {
      const { caseId, eventId } = action.payload;
      const updatedCases = state.cases.map(c => {
        if (c.id === caseId) {
          const updatedTimeline = c.timeline.filter(evt => evt.id !== eventId);
          return { ...c, timeline: updatedTimeline };
        }
        return c;
      });
      const selected = state.selectedCase?.id === caseId 
        ? updatedCases.find(c => c.id === caseId) 
        : state.selectedCase;
      return { ...state, cases: updatedCases, selectedCase: selected };
    }

    case 'SET_DEADLINE': {
      const { caseId, deadlineDate, deadlineNote } = action.payload;
      const deadlineEvent = {
        id: `evt-${Date.now()}`,
        type: 'deadline_set',
        title: 'সময়সীমা নির্ধারণ করা হয়েছে',
        description: `নতুন সময়সীমা: ${deadlineDate}${deadlineNote ? ` (${deadlineNote})` : ''}`,
        createdAt: new Date().toISOString()
      };
      const updatedCases = state.cases.map(c => {
        if (c.id === caseId) {
          return { 
            ...c, 
            deadlineDate, 
            deadlineNote,
            timeline: [deadlineEvent, ...c.timeline]
          };
        }
        return c;
      });
      const selected = state.selectedCase?.id === caseId 
        ? updatedCases.find(c => c.id === caseId) 
        : state.selectedCase;
      return { ...state, cases: updatedCases, selectedCase: selected };
    }

    case 'REMOVE_DEADLINE': {
      const { caseId } = action.payload;
      const updatedCases = state.cases.map(c => {
        if (c.id === caseId) {
          return { 
            ...c, 
            deadlineDate: null, 
            deadlineNote: null
          };
        }
        return c;
      });
      const selected = state.selectedCase?.id === caseId 
        ? updatedCases.find(c => c.id === caseId) 
        : state.selectedCase;
      return { ...state, cases: updatedCases, selectedCase: selected };
    }

    case 'ADD_ATTACHMENT': {
      const { caseId, attachment } = action.payload;
      const updatedCases = state.cases.map(c => {
        if (c.id === caseId) {
          const currentAttachments = c.attachments || [];
          const updatedAttachments = [...currentAttachments, attachment];
          const uploadEvent = {
            id: `evt-${Date.now()}`,
            type: 'document_created',
            title: `ফাইল যুক্ত করা হয়েছে: ${attachment.name}`,
            description: `${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB) ফাইলটি সংযুক্ত প্রমাণপত্র হিসেবে আপলোড করা হয়েছে।`,
            createdAt: new Date().toISOString()
          };
          return {
            ...c,
            attachments: updatedAttachments,
            timeline: [uploadEvent, ...c.timeline]
          };
        }
        return c;
      });
      const selected = state.selectedCase?.id === caseId 
        ? updatedCases.find(c => c.id === caseId) 
        : state.selectedCase;
      return { ...state, cases: updatedCases, selectedCase: selected };
    }

    case 'DELETE_ATTACHMENT': {
      const { caseId, attachmentId } = action.payload;
      const updatedCases = state.cases.map(c => {
        if (c.id === caseId) {
          const currentAttachments = c.attachments || [];
          const updatedAttachments = currentAttachments.filter(a => a.id !== attachmentId);
          return {
            ...c,
            attachments: updatedAttachments
          };
        }
        return c;
      });
      const selected = state.selectedCase?.id === caseId 
        ? updatedCases.find(c => c.id === caseId) 
        : state.selectedCase;
      return { ...state, cases: updatedCases, selectedCase: selected };
    }

    case 'APPLY_FILTERS': {
      let result = [...state.cases];

      // 1. Search Query (Title + Category + Problem)
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase();
        result = result.filter(c => 
          c.title?.toLowerCase().includes(query) ||
          c.category?.toLowerCase().includes(query) ||
          c.problem?.toLowerCase().includes(query)
        );
      }

      // 2. Filter tabs
      if (state.activeFilter !== 'সব কেস') {
        const filterMap = {
          'চলমান': ['identified', 'notice_sent', 'office_visited', 'legal_action'],
          'নোটিশ পাঠানো': ['notice_sent'],
          'আইনি ব্যবস্থা': ['legal_action'],
          'সমাধান': ['resolved']
        };
        const statuses = filterMap[state.activeFilter];
        if (statuses) {
          result = result.filter(c => statuses.includes(c.caseStatus));
        }
      }

      // 3. Sorting
      if (state.sortBy === 'সর্বশেষ') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (state.sortBy === 'পুরনো') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (state.sortBy === 'গুরুত্ব') {
        const severityWeight = { urgent: 4, serious: 3, moderate: 2, low: 1 };
        result.sort((a, b) => (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0));
      } else if (state.sortBy === 'শ্রেণী') {
        result.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
      }

      return { ...state, filteredCases: result };
    }

    default:
      return state;
  }
}

function getStatusLabel(status) {
  const labels = {
    identified: 'সমস্যা চিহ্নিত',
    notice_sent: 'নোটিশ পাঠানো হয়েছে',
    office_visited: 'অফিসে গেছি',
    legal_action: 'আইনি ব্যবস্থা নেওয়া হয়েছে',
    resolved: 'সমাধান হয়েছে'
  };
  return labels[status] || status;
}

export function CaseLogProvider({ children }) {
  const [state, dispatch] = useReducer(caseLogReducer, initialState);

  // Initialize from localStorage or fallback to mockCases
  useEffect(() => {
    const storedCases = localStorage.getItem('protiker_cases');
    if (storedCases) {
      try {
        const parsed = JSON.parse(storedCases);
        dispatch({ type: 'SET_INITIAL_DATA', payload: parsed });
        return;
      } catch (e) {
        console.error('Failed to parse protiker_cases from localStorage', e);
      }
    }
    dispatch({ type: 'SET_INITIAL_DATA', payload: mockCases });
  }, []);

  // Persist cases to localStorage when updated
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('protiker_cases', JSON.stringify(state.cases));
    }
  }, [state.cases, state.isLoading]);

  // Sync to re-apply filters
  useEffect(() => {
    if (!state.isLoading) {
      dispatch({ type: 'APPLY_FILTERS' });
    }
  }, [state.cases, state.searchQuery, state.activeFilter, state.sortBy, state.isLoading]);

  // Handle localStorage case saves from Chat
  useEffect(() => {
    const pendingSaveStr = localStorage.getItem('protiker_save_case');
    if (pendingSaveStr && !state.isLoading) {
      try {
        const pending = JSON.parse(pendingSaveStr);
        const newCase = {
          id: `case-${Date.now()}`,
          title: pending.title || `${pending.category} — সমস্যা`,
          category: pending.category || 'সাধারণ',
          categorySlug: getCategorySlug(pending.category),
          severity: pending.severity || 'low',
          caseStatus: 'identified',
          problem: pending.problem || '',
          createdAt: new Date().toISOString(),
          deadlineDate: null,
          deadlineNote: null,
          shareToken: `share-${Math.random().toString(36).substr(2, 9)}`,
          documents: [],
          contacts: [],
          timeline: [
            {
              id: `evt-${Date.now()}`,
              type: 'chat_started',
              title: 'Proti-র সাথে কথোপকথন শুরু',
              description: `${pending.category || 'আইনি'} পরামর্শ নেওয়া হয়েছে।`,
              createdAt: new Date().toISOString()
            }
          ]
        };
        dispatch({ type: 'ADD_CASE', payload: newCase });
        localStorage.removeItem('protiker_save_case');
      } catch (e) {
        console.error('Failed to parse protiker_save_case', e);
      }
    }
  }, [state.isLoading]);

  // Handle localStorage document connections
  useEffect(() => {
    // If a document is generated and we have a case context in localStorage:
    const activeContextStr = localStorage.getItem('protiker_case_context');
    const newlyGeneratedDocStr = localStorage.getItem('protiker_new_doc'); // Simple simulation hook
    if (activeContextStr && newlyGeneratedDocStr && !state.isLoading) {
      try {
        const activeContext = JSON.parse(activeContextStr);
        const newDoc = JSON.parse(newGeneratedDocStr);
        
        // Add timeline event to this case
        const docEvent = {
          id: `evt-${Date.now()}`,
          type: 'document_created',
          title: `${newDoc.name} তৈরি হয়েছে`,
          description: 'Document Automator দিয়ে আইনি নোটিশ তৈরি করা হয়েছে।',
          createdAt: new Date().toISOString(),
          documentId: newDoc.id
        };
        
        const docObject = {
          id: newDoc.id,
          name: newDoc.name,
          status: 'generated',
          format: 'pdf',
          iconBg: '#E6F1FB',
          iconColor: '#378ADD'
        };

        dispatch({
          type: 'LINK_DOCUMENT_TO_CASE',
          payload: {
            caseId: activeContext.caseId,
            document: docObject,
            event: docEvent
          }
        });
        
        localStorage.removeItem('protiker_new_doc');
      } catch(e) {
        console.error(e);
      }
    }
  }, [state.isLoading]);

  return (
    <CaseLogContext.Provider value={{ state, dispatch }}>
      {children}
    </CaseLogContext.Provider>
  );
}

function getCategorySlug(cat) {
  const slugs = {
    'শ্রম অধিকার': 'labour',
    'বাড়িভাড়া': 'house-rent',
    'পারিবারিক সহিংসতা': 'family-violence',
    'ভোক্তা অধিকার': 'consumer-rights',
    'জমি ও সম্পত্তি': 'land-property',
    'পুলিশ ও গ্রেফতার': 'police-arrest'
  };
  return slugs[cat] || 'general';
}

export const useCaseLog = () => useContext(CaseLogContext);
