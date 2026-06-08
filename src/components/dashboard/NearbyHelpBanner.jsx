/**
 * NearbyHelpBanner — Full-width gradient banner promoting nearby legal aid orgs.
 * Animated with bannerIn on mount (delayed).
 */
import { MapPin } from 'lucide-react';

export default function NearbyHelpBanner() {
  return (
    <div className="db-banner">
      <div className="db-banner-circle" />
      <div className="db-banner-left">
        <div className="db-banner-row1">
          <MapPin size={22} color="#4ADE80" />
          <span className="db-banner-heading">কাছের আইনি সহায়তা</span>
        </div>
        <div className="db-banner-desc">
          আপনার এলাকায় BLAST, ASK, NLASO সহ বিনামূল্যে আইনি সংস্থা রয়েছে।
        </div>
        <div className="db-banner-orgs">
          <span className="db-banner-org">NLASO · 16699</span>
          <span className="db-banner-org">BLAST</span>
          <span className="db-banner-org">ASK</span>
        </div>
      </div>
      <button className="db-banner-btn">
        <MapPin size={16} /> ম্যাপে দেখুন
      </button>
    </div>
  );
}

export { NearbyHelpBanner };
