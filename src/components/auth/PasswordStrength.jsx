const STRENGTH_LABELS = [
  '',
  'দুর্বল · Weak',
  'মোটামুটি · Fair',
  'ভালো · Good',
  'শক্তিশালী · Strong',
];

export function calcPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score = 2;          // Fair: ≥ 6 chars
  else if (password.length >= 1) score = 1;       // Weak: < 6 chars
  if (score >= 2 && /[A-Z]/.test(password)) score = 3; // Good: + uppercase
  if (score >= 3 && /[^A-Za-z0-9]/.test(password)) score = 4; // Strong: + special
  return score;
}

export default function PasswordStrength({ strength }) {
  return (
    <div>
      <div className="auth-strength-bar">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`auth-strength-segment${level <= strength ? ` active strength-${strength}` : ''}`}
          />
        ))}
      </div>
      {strength > 0 && (
        <div className="auth-strength-info">
          <span className={`auth-strength-label strength-${strength}`}>
            {STRENGTH_LABELS[strength]}
          </span>
        </div>
      )}
    </div>
  );
}
