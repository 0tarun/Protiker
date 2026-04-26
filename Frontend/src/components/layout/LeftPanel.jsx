import BrandZone from '../left/BrandZone';
import ProtiAvatarZone from '../left/ProtiAvatarZone';
import QuickChipsGrid from '../left/QuickChipsGrid';
import DisclaimerZone from '../left/DisclaimerZone';

export default function LeftPanel({ onChipClick }) {
  return (
    <aside className="left-panel">
      <BrandZone />
      <ProtiAvatarZone />
      <QuickChipsGrid onChipClick={onChipClick} />
      <DisclaimerZone />
    </aside>
  );
}
