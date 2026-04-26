import { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useVoiceInput } from '../../hooks/useVoiceInput';

const InputBar = forwardRef(function InputBar(_, ref) {
  const [text, setText] = useState('');
  const { sendMessage, isRecording } = useChat();
  const textareaRef = useRef(null);

  const handleTranscript = useCallback((t) => {
    setText(t);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const { toggleRecording } = useVoiceInput(handleTranscript);

  useImperativeHandle(ref, () => ({
    typeAndSend(chipText) {
      setText('');
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setText(chipText.slice(0, i));
        if (i >= chipText.length) {
          clearInterval(interval);
          setTimeout(() => {
            sendMessage(chipText, 'quick_chip');
            setText('');
          }, 200);
        }
      }, 20);
    },
  }));

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    sendMessage(text.trim(), 'text');
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [text, sendMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }
  }, []);

  useEffect(() => handleInput(), [text, handleInput]);

  return (
    <div className="input-area">
      <div className="input-inner">
        <div className="input-row">
          <button
            className={`voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            id="btn-voice"
            title="ভয়েস ইনপুট"
          >
            <Mic size={18} />
          </button>
          <textarea
            ref={textareaRef}
            className="chat-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="আপনার আইনি সমস্যা লিখুন... বাংলা বা ইংরেজিতে"
            rows={1}
            id="chat-input"
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!text.trim()}
            id="btn-send"
            title="পাঠান"
          >
            <Send size={20} />
          </button>
        </div>
        {isRecording ? (
          <div className="recording-label">🎙 রেকর্ড করছি...</div>
        ) : (
          <div className="input-hint">
            <kbd>Shift</kbd> + <kbd>Enter</kbd> নতুন লাইন · Bengali or English
          </div>
        )}
      </div>
    </div>
  );
});

export default InputBar;
