import { useState, useEffect, useRef } from 'react';
import StructuredResponse from '../response/StructuredResponse';
import { useChat } from '../../hooks/useChat';
import { Volume2, VolumeX } from 'lucide-react';

export default function ProtiMessage({ message }) {
  const { streamedText } = useChat();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cancelRef = useRef(false);

  const time = new Date(message.timestamp).toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const st = streamedText[message.id];

  // Clean up synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      // Get initial voices
      updateVoices();
      
      // Listen for async loading of voices
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const getSpeakText = () => {
    let rawText = "";
    if (message.structuredJson) {
      const data = message.structuredJson;
      let parts = ["আপনার সমস্যাটা আমি বুঝেছি।"];
      if (data.rights) {
        parts.push(data.rights);
      }
      if (data.steps && data.steps.length > 0) {
        parts.push("আপনার জন্য পরবর্তী পদক্ষেপগুলো হলো:");
        data.steps.forEach((step, idx) => {
          parts.push(`${idx + 1}. ${step}`);
        });
      }
      if (data.office) {
        parts.push(`কোথায় যাবেন: ${data.office}`);
      }
      if (data.freeAid) {
        parts.push(`বিনামূল্যে সহায়তা: ${data.freeAid}`);
      }
      if (data.warnings) {
        parts.push("যা করবেন না বা সতর্কতা:");
        parts.push(data.warnings);
      }
      if (data.deadline) {
        parts.push(`সময়সীমা মনে রাখুন: ${data.deadline}`);
      }
      rawText = parts.join("\n");
    } else if (message.content) {
      rawText = message.content;
    }
    
    // Clean up markdown formatting
    return rawText
      .replace(/\*\*+/g, "")
      .replace(/#+/g, "")
      .replace(/`+/g, "")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  };

  const handleSpeak = (e) => {
    e.stopPropagation();

    if (isSpeaking) {
      cancelRef.current = true;
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any active speech synthesis
    cancelRef.current = false;
    window.speechSynthesis.cancel();

    const textToSpeak = getSpeakText();
    if (!textToSpeak) return;

    // Detect if text contains Bengali characters
    const isBengali = /[\u0980-\u09FF]/.test(textToSpeak);

    // Split text into sentences based on language
    const sentences = isBengali
      ? textToSpeak.split(/[।!?\n]/).map(s => s.trim()).filter(s => s.length > 0)
      : textToSpeak.split(/[.!?\n]/).map(s => s.trim()).filter(s => s.length > 0);

    if (sentences.length === 0) return;

    const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    console.log("Loaded TTS Voices:", currentVoices.map(v => `${v.name} (${v.lang})`));

    // Choose appropriate voice based on detected language
    const selectedVoice = isBengali
      ? (currentVoices.find(v => v.lang === 'bn-BD') || 
         currentVoices.find(v => v.lang === 'bn-IN') || 
         currentVoices.find(v => v.lang.startsWith('bn')))
      : (currentVoices.find(v => v.lang === 'en-US') || 
         currentVoices.find(v => v.lang === 'en-GB') || 
         currentVoices.find(v => v.lang.startsWith('en')));

    if (!selectedVoice) {
      console.warn(`No explicit voice found for language: ${isBengali ? 'Bengali' : 'English'}. Using browser defaults.`);
    }

    setIsSpeaking(true);

    const speakSentence = (index) => {
      if (cancelRef.current) {
        setIsSpeaking(false);
        return;
      }

      if (index >= sentences.length) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentences[index]);
      utterance.lang = isBengali ? 'bn-BD' : 'en-US';
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (!cancelRef.current) {
          speakSentence(index + 1);
        }
      };

      utterance.onerror = (err) => {
        console.error("Speech synthesis error", err);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakSentence(0);
  };

  return (
    <div className="proti-msg">
      <div className="proti-avatar-sm">প্রতি</div>
      <div className="proti-bubble">
        {message.structuredJson ? (
          <StructuredResponse
            data={message.structuredJson}
            streamedText={st}
            isStreaming={message.isStreaming}
          />
        ) : (
          <div className="proti-text">
            {message.isStreaming ? (st || '') : message.content}
            {message.isStreaming && <span className="streaming-cursor" />}
          </div>
        )}
        <div style={{ padding: '0 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleSpeak}
            style={{
              background: isSpeaking ? 'rgba(29, 158, 117, 0.1)' : 'transparent',
              border: '1.5px solid rgba(29, 158, 117, 0.2)',
              borderRadius: '20px',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              color: '#0F6E56',
              fontSize: '11px',
              fontWeight: 500,
              fontFamily: "'Hind Siliguri', sans-serif",
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29, 158, 117, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isSpeaking ? 'rgba(29, 158, 117, 0.1)' : 'transparent';
            }}
          >
            {isSpeaking ? (
              <>
                <VolumeX size={13} />
                <span>ভয়েস বন্ধ করুন</span>
              </>
            ) : (
              <>
                <Volume2 size={13} />
                <span>উত্তরের ভয়েস শুনুন</span>
              </>
            )}
          </button>
          <span className="msg-time">{time}</span>
        </div>
      </div>
    </div>
  );
}
