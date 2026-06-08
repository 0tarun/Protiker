import { useChatContext } from '../context/ChatContext';

export function useChat() {
  const {
    state,
    streamedText,
    sendMessage,
    resetChat,
    setLang,
    downloadPdf,
  } = useChatContext();

  return {
    ...state,
    streamedText,
    sendMessage,
    resetChat,
    setLang,
    downloadPdf,
  };
}
