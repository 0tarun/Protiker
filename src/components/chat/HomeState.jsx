import { MessageSquare, Scale, Heart } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';

export default function HomeState() {
  const { state } = useChatContext();
  const lang = state.language;

  const features = {
    bn: [
      { icon: <MessageSquare size={20} />, label: 'বাংলায় কথা বলুন' },
      { icon: <Scale size={20} />, label: 'অধিকার জানুন' },
      { icon: <Heart size={20} />, label: 'বিনামূল্যে সহায়তা' },
    ],
    en: [
      { icon: <MessageSquare size={20} />, label: 'Speak in English' },
      { icon: <Scale size={20} />, label: 'Know your rights' },
      { icon: <Heart size={20} />, label: 'Free assistance' },
    ]
  };
  const currentFeatures = features[lang] || features.bn;

  return (
    <div className="home-state">
      {/* <div className="home-avatar">প্রতি</div> */}
      <h1 className="home-heading">{lang === 'en' ? 'Describe your legal issue' : 'আপনার আইনি সমস্যা বলুন'}</h1>
      <p className="home-sub">
        {lang === 'en' 
          ? 'Write or speak. I will inform you about your rights, next steps, and free legal aid.' 
          : 'বাংলায় লিখুন বা বলুন। আমি আপনার অধিকার, পদক্ষেপ এবং বিনামূল্যে সহায়তা জানাবো।'}
      </p>
      <div className="feature-row">
        {currentFeatures.map((f, i) => (
          <div className="feature-card" key={i}>
            <span className="f-icon">{f.icon}</span>
            <span className="f-label">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
