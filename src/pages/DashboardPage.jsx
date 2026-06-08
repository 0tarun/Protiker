/**
 * DashboardPage — Main dashboard page assembling all dashboard components.
 * Layout: fixed sidebar (260px) + scrollable main content area.
 */
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import FeatureCards from '../components/dashboard/FeatureCards';
import StatsRow from '../components/dashboard/StatsRow';
import RecentSessions from '../components/dashboard/RecentSessions';
import RecentDocuments from '../components/dashboard/RecentDocuments';
import QuickChips from '../components/dashboard/QuickChips';
import LegalTipCard from '../components/dashboard/LegalTipCard';
import NearbyHelpBanner from '../components/dashboard/NearbyHelpBanner';
import '../styles/dashboard.css';

export default function DashboardPage() {
  return (
    <div className="db-layout">
      <Sidebar />
      <main className="db-main">
        <TopBar />
        <FeatureCards />
        <StatsRow />
        <div className="db-two-col">
          <RecentSessions />
          <RecentDocuments />
        </div>
        <div className="db-bottom-row">
          <QuickChips />
          <LegalTipCard />
        </div>
        <NearbyHelpBanner />
      </main>
    </div>
  );
}

export { DashboardPage };
