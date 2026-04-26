import { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import HomeState from './HomeState';
import UserMessage from './UserMessage';
import ProtiMessage from './ProtiMessage';
import TypingIndicator from './TypingIndicator';

export default function MessageList() {
  const { messages, isLoading } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="messages-area">
        <HomeState />
      </div>
    );
  }

  return (
    <div className="messages-area">
      <div className="messages-inner">
        {messages.map((msg) =>
          msg.sender === 'user' ? (
            <UserMessage key={msg.id} message={msg} />
          ) : (
            <ProtiMessage key={msg.id} message={msg} />
          )
        )}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
