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
        className="hf-phone-btn"
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
        className="hf-whatsapp-btn"
      >
        <MessageCircle size={14} /> WhatsApp
      </a>
    );
  }

  return null;
}
