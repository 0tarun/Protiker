import { createContext, useContext, useReducer, useCallback, useState, useRef } from 'react';
import { sendMessage as apiSend } from '../services/api';

const ChatContext = createContext(null);

const initial = {
  sessionId: null,
  messages: [],
  isLoading: false,
  isRecording: false,
  language: 'bn',
  sessionSaved: false,
  pdfLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_USER_MSG':
      return {
        ...state,
        sessionId: state.sessionId || 'ses-' + Date.now(),
        messages: [...state.messages, action.payload],
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_PROTI_MSG':
      return { ...state, messages: [...state.messages, action.payload], isLoading: false };
    case 'UPDATE_MSG':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload } : m
        ),
      };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_PDF_LOADING':
      return { ...state, pdfLoading: action.payload };
    case 'RESET':
      return { ...initial };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [streamedText, setStreamedText] = useState({});
  const streamRef = useRef(null);

  const sendMessage = useCallback(async (text, inputMode = 'text') => {
    if (!text.trim()) return;
    const userMsg = {
      id: 'u-' + Date.now(),
      sender: 'user',
      content: text.trim(),
      inputMode,
      structuredJson: null,
      timestamp: new Date(),
      isStreaming: false,
    };
    dispatch({ type: 'ADD_USER_MSG', payload: userMsg });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const res = await apiSend(text.trim());
      const protiMsg = { ...res, id: 'p-' + Date.now(), isStreaming: true };
      dispatch({ type: 'ADD_PROTI_MSG', payload: protiMsg });

      // Simulate streaming word by word
      const words = protiMsg.structuredJson?.rights?.split(' ') || protiMsg.content.split(' ');
      let i = 0;
      setStreamedText((p) => ({ ...p, [protiMsg.id]: '' }));

      streamRef.current = setInterval(() => {
        i++;
        setStreamedText((p) => ({ ...p, [protiMsg.id]: words.slice(0, i).join(' ') }));
        if (i >= words.length) {
          clearInterval(streamRef.current);
          dispatch({ type: 'UPDATE_MSG', payload: { id: protiMsg.id, isStreaming: false } });
        }
      }, 40);
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const resetChat = useCallback(() => {
    if (streamRef.current) clearInterval(streamRef.current);
    setStreamedText({});
    dispatch({ type: 'RESET' });
  }, []);

  const setLang = useCallback((l) => dispatch({ type: 'SET_LANGUAGE', payload: l }), []);
  const setRecording = useCallback((v) => dispatch({ type: 'SET_RECORDING', payload: v }), []);
  const setPdfLoading = useCallback((v) => dispatch({ type: 'SET_PDF_LOADING', payload: v }), []);

  const downloadPdf = useCallback(() => {
    setPdfLoading(true);
    setTimeout(() => setPdfLoading(false), 1500);
  }, [setPdfLoading]);

  return (
    <ChatContext.Provider
      value={{
        state,
        streamedText,
        sendMessage,
        resetChat,
        setLang,
        setRecording,
        downloadPdf,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be inside ChatProvider');
  return ctx;
}
