import { Info } from 'lucide-react';

export default function DisclaimerZone() {
  return (
    <div className="disclaimer-zone">
      <div className="disclaimer-card">
        <div className="disclaimer-header">
          <Info size={14} style={{ color: 'rgba(255,255,255,0.50)' }} />
          <span>দায়িত্বস্বীকার</span>
        </div>
        <p className="disclaimer-text">
          Proti সাধারণ আইনি তথ্য দেয়, ব্যক্তিগত আইনি পরামর্শ নয়।
        </p>
      </div>
    </div>
  );
}
