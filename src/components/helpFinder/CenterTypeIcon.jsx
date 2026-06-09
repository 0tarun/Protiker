import { Scale, Heart, Gavel, Shield, Building2, Briefcase } from 'lucide-react';

export default function CenterTypeIcon({ type, size = 18 }) {
  const map = {
    government_legal_aid: { icon: Scale, bg: '#E1F5EE', color: '#1D9E75' },
    ngo: { icon: Heart, bg: '#FCEBEB', color: '#E24B4A' },
    court: { icon: Gavel, bg: '#E6F1FB', color: '#378ADD' },
    police_station: { icon: Shield, bg: '#FAEEDA', color: '#EF9F27' },
    government_office: { icon: Building2, bg: '#EAF3DE', color: '#639922' },
    law_chamber: { icon: Briefcase, bg: '#F3E8FF', color: '#7C3AED' }
  };
  
  const config = map[type] || map.ngo;
  const Icon = config.icon;

  return (
    <div style={{
      width: 40, height: 40, borderRadius: 12, 
      background: config.bg, color: config.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon size={size} />
    </div>
  );
}
