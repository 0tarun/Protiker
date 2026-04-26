export default function UserMessage({ message }) {
  const time = new Date(message.timestamp).toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div className="user-msg">
      <div className="user-bubble">{message.content}</div>
      <div className="msg-time">{time}</div>
    </div>
  );
}
