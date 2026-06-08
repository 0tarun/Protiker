import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Lock,
  Eye, EyeOff, ArrowRight,
  CheckCircle, XCircle, AlertCircle, Check,
} from 'lucide-react';
import InputField from '../components/auth/InputField';
import RoleSelector from '../components/auth/RoleSelector';
import PasswordStrength, { calcPasswordStrength } from '../components/auth/PasswordStrength';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^01\d{9}$/;

const DIVISIONS = [
  'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা',
  'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ',
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, continueAnonymously } = useAuth();

  const [selectedRole, setSelectedRole] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    division: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'bn',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [buttonState, setButtonState] = useState('idle');
  const [toast, setToast] = useState(null);
  const [confirmTouched, setConfirmTouched] = useState(false);

  /* ── Role selection ── */
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (!formVisible) {
      setFormVisible(true);
    }
  };

  /* ── Input change ── */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setApiError(null);

    if (field === 'password') {
      setPasswordStrength(calcPasswordStrength(value));
    }
  };

  /* ── Validation ── */
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'নাম দিতে হবে';
        if (value.trim().length < 2) return 'কমপক্ষে ২ অক্ষর প্রয়োজন';
        if (value.trim().length > 100) return 'সর্বোচ্চ ১০০ অক্ষর';
        return null;
      case 'email':
        if (!value.trim()) return 'ইমেইল দিতে হবে';
        if (!EMAIL_REGEX.test(value)) return 'সঠিক ইমেইল দিন';
        return null;
      case 'phone':
        if (!value) return 'মোবাইল নম্বর দিতে হবে';
        if (!PHONE_REGEX.test(value)) return '১১ ডিজিট, 01 দিয়ে শুরু';
        return null;
      case 'password':
        if (!value) return 'পাসওয়ার্ড দিতে হবে';
        if (value.length < 6) return 'কমপক্ষে ৬ অক্ষর প্রয়োজন';
        return null;
      case 'confirmPassword':
        if (!value) return 'পাসওয়ার্ড নিশ্চিত করুন';
        if (value !== formData.password) return 'পাসওয়ার্ড মিলেনি';
        return null;
      default:
        return null;
    }
  };

  const handleBlur = (name) => {
    const err = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: err }));
    if (name === 'confirmPassword') setConfirmTouched(true);
  };

  const validateAll = () => {
    const fields = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    const newErrors = {};
    for (const f of fields) {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Can submit? ── */
  const isFormValid = () => {
    return (
      selectedRole &&
      formData.name.trim().length >= 2 &&
      EMAIL_REGEX.test(formData.email) &&
      PHONE_REGEX.test(formData.phone) &&
      formData.division !== '' &&
      formData.password.length >= 6 &&
      formData.confirmPassword === formData.password &&
      termsAccepted
    );
  };

  const isFirstPartFilled = 
    formData.name.trim().length >= 2 &&
    EMAIL_REGEX.test(formData.email) &&
    PHONE_REGEX.test(formData.phone) &&
    formData.division !== '';

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validateAll() || !termsAccepted || !selectedRole) return;

    setIsLoading(true);
    setButtonState('loading');

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      division: formData.division,
      role: selectedRole,
    });
    
    if (!result.success) {
      setApiError(result.message);
      setButtonState('idle');
      setIsLoading(false);
    } else {
      setButtonState('success');
      setToast('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
      // Navigation is handled inside AuthContext.signup()
    }
  };

  /* ── Confirm password match indicator ── */
  const getConfirmIcon = () => {
    if (!confirmTouched || !formData.confirmPassword) return null;
    if (formData.confirmPassword === formData.password) {
      return (
        <span className="auth-match-icon match">
          <CheckCircle size={16} />
        </span>
      );
    }
    return (
      <span className="auth-match-icon mismatch">
        <XCircle size={16} />
      </span>
    );
  };

  return (
    <div className="auth-right-panel">
      <form className={`auth-form-card${formVisible ? ' expanded' : ''}`} onSubmit={handleSubmit} noValidate>
        {/* ── Header ── */}
        <div className="auth-badge">নতুন অ্যাকাউন্ট · Create account</div>
        <h1 className="auth-heading">Protiker-এ যোগ দিন</h1>
        <p className="auth-subheading">বিনামূল্যে আইনি সহায়তা পান</p>
        <div className="auth-divider" />

        {/* ── API Error ── */}
        {apiError && (
          <div className="auth-api-error">
            <AlertCircle className="auth-api-error-icon" size={16} />
            <span className="auth-api-error-text">{apiError}</span>
          </div>
        )}

        <div className="auth-signup-content">
          <div className="auth-signup-left">
            {/* ── Step 1: Role Selector or Remaining Fields ── */}
            {!isFirstPartFilled ? (
              <RoleSelector selectedRole={selectedRole} onSelect={handleRoleSelect} />
            ) : (
              <div className="auth-form-fields" style={{ animation: 'authFormReveal 300ms ease-out forwards' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 className="auth-role-label" style={{ fontSize: '15px', color: 'var(--auth-primary-dark)' }}>অ্যাকাউন্টের নিরাপত্তা</h3>
                  <p style={{ fontSize: '12px', color: 'var(--auth-text-muted)', marginTop: '4px' }}>পাসওয়ার্ড সেট করুন এবং শর্তাবলীতে সম্মত হন</p>
                </div>
                
                {/* Password */}
                <InputField
                  label="পাসওয়ার্ড"
                  name="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={errors.password}
                  icon={Lock}
                  required
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
                <PasswordStrength strength={passwordStrength} />

                {/* Confirm Password */}
                <div style={{ marginTop: '16px' }}>
                  <InputField
                    label="পাসওয়ার্ড নিশ্চিত করুন"
                    name="signup-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    error={errors.confirmPassword}
                    icon={Lock}
                    required
                    rightElement={getConfirmIcon()}
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="auth-terms" style={{ marginTop: '24px' }}>
                  <div className="auth-checkbox-wrapper">
                    <input
                      type="checkbox"
                      id="signup-terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <div className="auth-checkbox-visual">
                      <Check className="auth-check-icon" size={10} />
                    </div>
                  </div>
                  <label className="auth-terms-text" htmlFor="signup-terms">
                    আমি Protiker-এর{' '}
                    <a href="#terms" className="auth-terms-link">ব্যবহারের শর্তাবলী</a>
                    {' '}এবং{' '}
                    <a href="#privacy" className="auth-terms-link">গোপনীয়তা নীতি</a>
                    -তে সম্মত
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`auth-submit-btn${buttonState === 'loading' ? ' loading' : ''}${buttonState === 'success' ? ' success' : ''}`}
                  disabled={!isFormValid() || isLoading || buttonState === 'success'}
                  style={{ marginTop: '24px' }}
                >
                  {buttonState === 'loading' && <span className="auth-spinner" />}
                  {buttonState === 'success' && <CheckCircle size={18} />}
                  {buttonState === 'idle' && 'অ্যাকাউন্ট তৈরি করুন'}
                  {buttonState === 'loading' && 'অ্যাকাউন্ট তৈরি হচ্ছে...'}
                  {buttonState === 'success' && 'সফল হয়েছে!'}
                </button>
              </div>
            )}
          </div>

          {/* ── Step 2: Form Fields (appear after role) ── */}
          {formVisible && (
            <div className="auth-signup-right">

              {/* Name */}
              <InputField
                label="পূর্ণ নাম"
                name="signup-name"
                type="text"
                placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                error={errors.name}
                icon={User}
                required
              />

              {/* Email */}
              <InputField
                label="ইমেইল ঠিকানা"
                name="signup-email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={errors.email}
                icon={Mail}
                required
                autoComplete="email"
              />

              {/* Phone */}
              <InputField
                label="মোবাইল নম্বর"
                name="signup-phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                error={errors.phone}
                icon={Phone}
                hint="বাংলাদেশি নম্বর"
                required
              />

              {/* Division */}
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="signup-division">
                  বিভাগ · Division
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <MapPin size={16} />
                  </span>
                  <select
                    id="signup-division"
                    className="auth-select"
                    value={formData.division}
                    onChange={(e) => handleChange('division', e.target.value)}
                  >
                    <option value="">বিভাগ নির্বাচন করুন</option>
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="auth-text-divider">
          <span className="auth-text-divider-line" />
          <span className="auth-text-divider-text">অথবা · or</span>
          <span className="auth-text-divider-line" />
        </div>

        {/* ── Google Sign Up ── */}
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
          Google দিয়ে অ্যাকাউন্ট তৈরি করুন
        </button>

        {/* ── Bottom link ── */}
        <div className="auth-bottom-link">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
          <button type="button" onClick={() => navigate('/login')}>
            লগইন করুন
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
