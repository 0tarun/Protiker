export default function LanguageToggle({ value, onChange }) {
  return (
    <div className="auth-field">
      <div className="auth-lang-label">পছন্দের ভাষা · Preferred language</div>
      <div className="auth-lang-container">
        <button
          type="button"
          className={`auth-lang-pill${value === 'bn' ? ' active' : ''}`}
          onClick={() => onChange('bn')}
        >
          বাংলা
        </button>
        <button
          type="button"
          className={`auth-lang-pill${value === 'en' ? ' active' : ''}`}
          onClick={() => onChange('en')}
        >
          English
        </button>
      </div>
    </div>
  );
}
