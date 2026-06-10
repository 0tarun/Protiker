/**
 * ShareCard.jsx — WhatsApp share + copy link card.
 */
import { useState } from 'react';
import { MessageCircle, Link } from 'lucide-react';

export default function ShareCard({ article, category }) {
  const [copied, setCopied] = useState(false);

  const pageUrl = window.location.href;
  const whatsappText = encodeURIComponent(`${article.titleBn} - protiker.app\n${pageUrl}`);
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="share-card"
      style={{
        background: category.lightColor || '#f0f0f0',
        border: `1px solid ${category.color || '#ccc'}26`,
      }}
    >
      <p className="share-card-text" style={{ color: category.darkColor || '#333' }}>
        এই তথ্য শেয়ার করুন
      </p>
      <div className="share-btns">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn whatsapp"
        >
          <MessageCircle size={13} />
          WhatsApp
        </a>
        <button className="share-btn copy-link" onClick={handleCopy}>
          <Link size={13} />
          {copied ? 'কপি হয়েছে ✓' : 'লিংক কপি'}
        </button>
      </div>
    </div>
  );
}
