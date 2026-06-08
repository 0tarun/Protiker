import { Check } from 'lucide-react';
import '../../styles/auth.css';

export default function AuthLeftPanel() {
  return (
    <div className="auth-left-panel">
      {/* ── ZONE A: BRAND ── */}
      <div className="auth-brand">
        <div className="auth-brand-badge">প্র</div>
        <div className="auth-brand-text">
          <div className="auth-wordmark">Protiker</div>
          <div className="auth-brand-sub">প্রতিকার · Legal Aid Platform</div>
        </div>
      </div>

      {/* ── ZONE B: PROTI AVATAR ── */}
      <div className="auth-avatar-zone">
        <div className="auth-avatar-container">
          <div className="auth-avatar-ring" />
          <div className="auth-avatar-inner">প্র</div>
        </div>
        <div className="auth-avatar-info">
          <div className="auth-avatar-name">Proti</div>
          <div className="auth-avatar-subtitle">আপনার আইনি বন্ধু</div>
          <div className="auth-status-row">
            <div className="auth-status-dot" />
            <span className="auth-status-text">সর্বদা প্রস্তুত · Always ready</span>
          </div>
        </div>
      </div>

      {/* ── ZONE C: TRUST INDICATORS ── */}
      <div className="auth-trust-zone">
        <div className="auth-trust-label">আমাদের প্রতিশ্রুতি · Our promise</div>
        <div className="auth-trust-list">
          <div className="auth-trust-item">
            <div className="auth-trust-check">
              <Check size={11} />
            </div>
            <span className="auth-trust-text">১০+ বাংলাদেশ আইন অন্তর্ভুক্ত</span>
          </div>
          <div className="auth-trust-item">
            <div className="auth-trust-check">
              <Check size={11} />
            </div>
            <span className="auth-trust-text">সম্পূর্ণ বিনামূল্যে · Always free</span>
          </div>
          <div className="auth-trust-item">
            <div className="auth-trust-check">
              <Check size={11} />
            </div>
            <span className="auth-trust-text">আপনার তথ্য সুরক্ষিত · Data protected</span>
          </div>
        </div>
      </div>

      {/* ── ZONE D: QUOTE ── */}
      <div className="auth-quote-zone">
        <div className="auth-quote-card">
          <div className="auth-quote-text">
            "আইনি সুরক্ষা প্রতিটি মানুষের অধিকার।"
          </div>
          <div className="auth-quote-attr">— Protiker Mission</div>
        </div>
      </div>
    </div>
  );
}
