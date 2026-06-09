import { Phone, MessageCircle } from 'lucide-react';

export default function ContactButton({ contact }) {
  if (!contact) return null;

  const isPhone = contact.type === 'phone' || contact.type === 'toll_free';
  const isWhatsapp = contact.type === 'whatsapp';

  if (isPhone) {
    const text = contact.type === 'toll_free' 
      ? `বিনামূল্যে: ${contact.value}` 
      : `কল করুন · ${contact.value}`;
      
    return (
      <a 
        href={`tel:${contact.value}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1D9E75', color: 'white', border: 'none',
          borderRadius: 10, padding: '8px 16px', flex: 1,
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, 
          fontWeight: 500, textDecoration: 'none', justifyContent: 'center'
        }}
      >
        <Phone size={14} /> {text}
      </a>
    );
  }

  if (isWhatsapp) {
    return (
      <a 
        href={`https://wa.me/${contact.value}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#25D366', color: 'white', border: 'none',
          borderRadius: 10, padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: "'Inter', sans-serif", fontSize: 12, 
          fontWeight: 500, textDecoration: 'none'
        }}
      >
        <MessageCircle size={14} /> WhatsApp
      </a>
    );
  }

  return null;
}
