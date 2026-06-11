/**
 * FeatureCards — 3 quick-action cards for AI Guidance, Document Automator, Legal Help Finder.
 * Staggered cardIn animation on mount.
 */
import { MessageCircle, FileEdit, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    accent: '#1D9E75',
    iconBg: '#E1F5EE',
    Icon: MessageCircle,
    title: 'AI আইনি পরামর্শ',
    desc: 'বাংলায় আপনার সমস্যা বলুন। Proti আপনার অধিকার ও পদক্ষেপ জানাবে।',
    action: 'Proti-র সাথে কথা বলুন',
    badge: 'সবচেয়ে জনপ্রিয়',
    route: '/chat',
  },
  {
    accent: '#378ADD',
    iconBg: '#E6F1FB',
    Icon: FileEdit,
    title: 'দলিল তৈরি করুন',
    desc: 'আপনার সমস্যা অনুযায়ী অভিযোগপত্র বা আইনি নোটিশ তৈরি করুন।',
    action: 'দলিল তৈরি শুরু করুন',
    badge: null,
    route: '/documents/new',
  },
  {
    accent: '#EF9F27',
    iconBg: '#FAEEDA',
    Icon: MapPin,
    title: 'সহায়তা খুঁজুন',
    desc: 'কাছের বিনামূল্যে আইনি সংস্থা, NGO ও সরকারি অফিস খুঁজুন।',
    action: 'কাছের সহায়তা দেখুন',
    badge: null,
    route: '/help-finder',
  },
];

export default function FeatureCards() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="db-section-label">দ্রুত শুরু করুন · Quick start</div>
      <div className="db-features-grid">
        {features.map((f) => (
          <div
            key={f.title}
            className="db-feature-card"
            onClick={() => f.route && navigate(f.route)}
          >
            <div className="db-feature-shape" style={{ background: f.accent }} />
            {f.badge && <div className="db-feature-badge">{f.badge}</div>}
            <div className="db-feature-icon" style={{ background: f.iconBg }}>
              <f.Icon size={24} color={f.accent} />
            </div>
            <div className="db-feature-title">{f.title}</div>
            <div className="db-feature-desc">{f.desc}</div>
            <span className="db-feature-action" style={{ color: f.accent }}>
              {f.action} <ArrowRight size={15} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { FeatureCards };
