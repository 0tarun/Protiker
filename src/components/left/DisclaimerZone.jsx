import { Info } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';

export default function DisclaimerZone() {
  const { state } = useChatContext();
  const lang = state.language;

  return (
    <div className="disclaimer-zone">
      <div className="disclaimer-card">
        <div className="disclaimer-header">
          <Info size={14} style={{ color: 'rgba(255,255,255,0.50)' }} />
          <span>{lang === 'en' ? 'Disclaimer' : 'দায়িত্বস্বীকার'}</span>
        </div>
        <p className="disclaimer-text">
          {lang === 'en' ? 'Proti provides general legal info, not personal legal advice.' : 'Proti সাধারণ আইনি তথ্য দেয়, ব্যক্তিগত আইনি পরামর্শ নয়।'}
        </p>
      </div>
    </div>
  );
}
