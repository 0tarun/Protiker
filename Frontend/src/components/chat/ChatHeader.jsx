import { RefreshCw, Download } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

export default function ChatHeader() {
  const { messages, language, pdfLoading, resetChat, setLang, downloadPdf } = useChat();
  const hasResponses = messages.some((m) => m.sender === 'proti');

  return (
    <header className="chat-header">
      <div className="breadcrumb">
        Protiker <span className="sep">›</span> <span className="current">AI আইনি সহায়তা</span>
      </div>
      <div className="header-actions">
        <button className="header-btn" onClick={resetChat} id="btn-new-chat">
          <RefreshCw size={14} /> নতুন কথোপকথন
        </button>
        {hasResponses && (
          <button className="header-btn pdf" onClick={downloadPdf} id="btn-pdf">
            {pdfLoading ? <span className="spin" style={{ display: 'inline-block' }}>⏳</span> : <Download size={14} />}
            PDF ডাউনলোড
          </button>
        )}
        <div className="lang-toggle">
          <button className={language === 'bn' ? 'active' : ''} onClick={() => setLang('bn')}>বাং</button>
          <button className={language === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
      </div>
    </header>
  );
}
