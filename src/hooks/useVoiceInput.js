import { useCallback, useRef } from 'react';
import { useChatContext } from '../context/ChatContext';

export function useVoiceInput(onTranscript) {
  const { state, setRecording } = useChatContext();
  const recRef = useRef(null);

  const toggleRecording = useCallback(() => {
    const isEn = state.language === 'en';
    const speechLang = isEn ? 'en-US' : 'bn-BD';
    const mockText = isEn ? 'I have not received my salary for three months' : 'আমার তিন মাসের বেতন পাচ্ছি না';

    if (state.isRecording) {
      // Stop recording
      if (recRef.current) {
        recRef.current.stop();
        recRef.current = null;
      }
      setRecording(false);
      return;
    }

    // Check for browser support
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.lang = speechLang;
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const t = e.results[0][0].transcript;
        if (t) {
          onTranscript(t);
        }
        setRecording(false);
      };
      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setRecording(false);
      };
      rec.onend = () => {
        setRecording(false);
      };
      recRef.current = rec;
      rec.start();
      setRecording(true);
    } else {
      // No speech API — simulate
      setRecording(true);
      setTimeout(() => {
        setRecording(false);
        onTranscript(mockText);
      }, 2000);
    }
  }, [state.isRecording, state.language, setRecording, onTranscript]);

  return { isRecording: state.isRecording, toggleRecording };
}
