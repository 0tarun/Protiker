import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import InputField from '../components/auth/InputField';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, continueAnonymously } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [buttonState, setButtonState] = useState('idle'); // idle | loading | success
  const [toast, setToast] = useState(null);

  /* ── Validation helpers ── */
  const validateField = (name, value) => {
    if (name === 'email') {
      if (!value.trim()) return 'ইমেইল দিতে হবে';
      if (!EMAIL_REGEX.test(value)) return 'সঠিক ইমেইল দিন';
    }
    if (name === 'password') {
      if (!value) return 'পাসওয়ার্ড দিতে হবে';
      if (value.length < 6) return 'কমপক্ষে ৬ অক্ষর প্রয়োজন';
    }
    return null;
  };

  const handleBlur = (name, value) => {
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validateAll = () => {
    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);
    const newErrors = {};
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validateAll()) return;

    setIsLoading(true);
    setButtonState('loading');

    const result = await login(email, password);
    if (!result.success) {
      setApiError(result.message);
      setButtonState('idle');
      setIsLoading(false);
    } else {
      setButtonState('success');
      setToast('সফলভাবে লগইন হয়েছে!');
      // Navigation is handled inside AuthContext.login()
    }
  };

  return (
    <div className="auth-right-panel">
        <form className="auth-form-card" onSubmit={handleSubmit} noValidate>
          {/* ── Header ── */}
          <div className="auth-badge">স্বাগতম · Welcome back</div>
          <h1 className="auth-heading">আবার প্রবেশ করুন</h1>
          <p className="auth-subheading">আপনার অ্যাকাউন্টে লগইন করুন</p>
          <div className="auth-divider" />

          {/* ── API Error ── */}
          {apiError && (
            <div className="auth-api-error">
              <AlertCircle className="auth-api-error-icon" size={16} />
              <span className="auth-api-error-text">{apiError}</span>
            </div>
          )}

          {/* ── Email ── */}
          <InputField
            label="ইমেইল ঠিকানা"
            name="login-email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setApiError(null); }}
            onBlur={() => handleBlur('email', email)}
            error={errors.email}
            icon={Mail}
            required
            autoComplete="email"
          />

          {/* ── Password ── */}
          <InputField
            label="পাসওয়ার্ড"
            name="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setApiError(null); }}
            onBlur={() => handleBlur('password', password)}
            error={errors.password}
            icon={Lock}
            required
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                className="auth-input-right"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {/* ── Forgot password ── */}
          <button type="button" className="auth-forgot-link" tabIndex={0}>
            পাসওয়ার্ড ভুলে গেছেন?
          </button>

          {/* ── Submit ── */}
          <button
            type="submit"
            className={`auth-submit-btn${buttonState === 'loading' ? ' loading' : ''}${buttonState === 'success' ? ' success' : ''}`}
            disabled={isLoading || buttonState === 'success'}
          >
            {buttonState === 'loading' && <span className="auth-spinner" />}
            {buttonState === 'success' && <CheckCircle size={18} />}
            {buttonState === 'idle' && 'লগইন করুন'}
            {buttonState === 'loading' && 'লগইন হচ্ছে...'}
            {buttonState === 'success' && 'সফল হয়েছে!'}
          </button>

          {/* ── Divider ── */}
          <div className="auth-text-divider">
            <span className="auth-text-divider-line" />
            <span className="auth-text-divider-text">অথবা · or</span>
            <span className="auth-text-divider-line" />
          </div>

          {/* ── Google Login ── */}
          <button
            type="button"
            className="auth-anon-btn"
            style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
            onClick={() => { window.location.href = '/dashboard'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google দিয়ে লগইন করুন
          </button>

          {/* ── Bottom link ── */}
          <div className="auth-bottom-link">
            নতুন ব্যবহারকারী?{' '}
            <button type="button" onClick={() => navigate('/signup')}>
              অ্যাকাউন্ট তৈরি করুন
            </button>
          </div>
        </form>

      {/* ── Toast ── */}
      {toast && (
        <div className="auth-toast">
          <CheckCircle size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
