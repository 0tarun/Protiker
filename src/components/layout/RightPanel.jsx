import ChatHeader from '../chat/ChatHeader';
import MessageList from '../chat/MessageList';
import InputBar from '../chat/InputBar';

export default function RightPanel({ inputRef }) {
  return (
    <main className="right-panel">
      <ChatHeader />
      <MessageList />
      <InputBar ref={inputRef} />
    </main>
  );
}
