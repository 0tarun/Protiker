import { useState, useEffect } from 'react';
import ChatHeader from '../chat/ChatHeader';
import MessageList from '../chat/MessageList';
import InputBar from '../chat/InputBar';
import { BookOpen } from 'lucide-react';
import '../../styles/library.css';

export default function RightPanel({ inputRef }) {
  const [libraryBanner, setLibraryBanner] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('protiker_library_context');
    if (raw) {
      try {
        setLibraryBanner(JSON.parse(raw));
        localStorage.removeItem('protiker_library_context');
      } catch {}
    }
  }, []);

  return (
    <main className="right-panel">
      <ChatHeader />
      {libraryBanner && (
        <div className="library-banner">
          <BookOpen size={16} color="#1D9E75" />
          <span className="library-banner-text">
            লাইব্রেরি থেকে: {libraryBanner.articleTitle}
          </span>
          <button
            className="library-banner-close"
            onClick={() => setLibraryBanner(null)}
          >
            ×
          </button>
        </div>
      )}
      <MessageList />
      <InputBar ref={inputRef} />
    </main>
  );
}
