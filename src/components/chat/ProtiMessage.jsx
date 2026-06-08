import StructuredResponse from '../response/StructuredResponse';
import { useChat } from '../../hooks/useChat';

export default function ProtiMessage({ message }) {
  const { streamedText } = useChat();
  const time = new Date(message.timestamp).toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const st = streamedText[message.id];

  return (
    <div className="proti-msg">
      <div className="proti-avatar-sm">প্র</div>
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
        <div style={{ padding: '0 20px 10px', textAlign: 'right' }}>
          <span className="msg-time">{time}</span>
        </div>
      </div>
    </div>
  );
}
