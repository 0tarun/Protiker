import { useRef, useCallback } from 'react';
import { ChatProvider } from './context/ChatContext';
import LeftPanel from './components/layout/LeftPanel';
import RightPanel from './components/layout/RightPanel';

function AppInner() {
  const inputRef = useRef(null);

  const handleChipClick = useCallback((text) => {
    inputRef.current?.typeAndSend(text);
  }, []);

  return (
    <div className="app-layout">
      <LeftPanel onChipClick={handleChipClick} />
      <RightPanel inputRef={inputRef} />
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <AppInner />
    </ChatProvider>
  );
}
