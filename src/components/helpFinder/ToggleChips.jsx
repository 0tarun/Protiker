import { useHelpFinder } from '../../context/HelpFinderContext';
import { CheckCircle, Accessibility, Users, Globe, BadgeCheck } from 'lucide-react';

export default function ToggleChips() {
  const { state, dispatch } = useHelpFinder();
  
  const toggles = [
    { label: 'বিনামূল্যে', icon: CheckCircle },
    { label: 'হুইলচেয়ার', icon: Accessibility },
    { label: 'মহিলা ডেস্ক', icon: Users },
    { label: 'ইংরেজি', icon: Globe },
    { label: 'যাচাইকৃত', icon: BadgeCheck }
  ];

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
      {toggles.map(({ label, icon: Icon }) => {
        const isActive = state.activeToggles.includes(label);
        return (
          <button
            key={label}
            onClick={() => dispatch({ type: 'TOGGLE_FEATURE_FILTER', payload: label })}
            style={{
              background: isActive ? '#E1F5EE' : 'white',
              border: `1px solid ${isActive ? '#5DCAA5' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 8, padding: '6px 12px',
              color: isActive ? '#0F6E56' : '#4A4845',
              fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 6,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <Icon size={13} color={isActive ? '#1D9E75' : '#888780'} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
