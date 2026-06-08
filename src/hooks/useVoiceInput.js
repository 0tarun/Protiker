import { useCallback, useRef } from 'react';
import { useChatContext } from '../context/ChatContext';

export function useVoiceInput(onTranscript) {
  const { state, setRecording } = useChatContext();
  const recRef = useRef(null);

  const toggleRecording = useCallback(() => {
    if (state.isRecording) {
      // Stop recording
      if (recRef.current) {
        recRef.current.stop();
        recRef.current = null;
      }
      setRecording(false);
      // Simulate transcription
      setTimeout(() => {
        onTranscript('আমার তিন মাসের বেতন পাচ্ছি না');
      }, 800);
      return;
    }

    // Check for browser support
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.lang = 'bn-BD';
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const t = e.results[0][0].transcript;
        onTranscript(t);
        setRecording(false);
      };
      rec.onerror = () => {
        setRecording(false);
        // Fallback: simulate transcript
        setTimeout(() => onTranscript('আমার তিন মাসের বেতন পাচ্ছি না'), 800);
      };
      rec.onend = () => setRecording(false);
      recRef.current = rec;
      rec.start();
      setRecording(true);
    } else {
      // No speech API — simulate
      setRecording(true);
      setTimeout(() => {
        setRecording(false);
        onTranscript('আমার তিন মাসের বেতন পাচ্ছি না');
      }, 2000);
    }
  }, [state.isRecording, setRecording, onTranscript]);

  return { isRecording: state.isRecording, toggleRecording };
}
