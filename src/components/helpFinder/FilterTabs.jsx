import { useHelpFinder } from '../../context/HelpFinderContext';

export default function FilterTabs() {
  const { state, dispatch } = useHelpFinder();
  
  const tabs = [
    'সব ধরন',
    'সরকারি আইনি সহায়তা',
    'এনজিও',
    'আদালত',
    'পুলিশ স্টেশন',
    'সরকারি অফিস'
  ];

  return (
    <div style={{ 
      display: 'flex', gap: 8, overflowX: 'auto', 
      paddingBottom: 4, marginTop: 10,
      scrollbarWidth: 'none', msOverflowStyle: 'none'
    }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => dispatch({ type: 'SET_TYPE_FILTER', payload: tab })}
          style={{
            whiteSpace: 'nowrap',
            background: state.activeTypeFilter === tab ? '#1D9E75' : 'white',
            color: state.activeTypeFilter === tab ? 'white' : '#1C1B1A',
            border: `1px solid ${state.activeTypeFilter === tab ? '#1D9E75' : 'rgba(0,0,0,0.10)'}`,
            borderRadius: 100, padding: '6px 14px',
            fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12,
            cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
