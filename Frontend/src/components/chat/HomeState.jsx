import { MessageSquare, Scale, Heart } from 'lucide-react';

export default function HomeState() {
  const features = [
    { icon: <MessageSquare size={20} />, label: 'বাংলায় কথা বলুন' },
    { icon: <Scale size={20} />, label: 'অধিকার জানুন' },
    { icon: <Heart size={20} />, label: 'বিনামূল্যে সহায়তা' },
  ];

  return (
    <div className="home-state">
      <div className="home-avatar">প্র</div>
      <h1 className="home-heading">আপনার আইনি সমস্যা বলুন</h1>
      <p className="home-sub">
        বাংলায় লিখুন বা বলুন। আমি আপনার অধিকার, পদক্ষেপ এবং বিনামূল্যে সহায়তা জানাবো।
      </p>
      <div className="feature-row">
        {features.map((f, i) => (
          <div className="feature-card" key={i}>
            <span className="f-icon">{f.icon}</span>
            <span className="f-label">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
