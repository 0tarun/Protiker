import { AlertCircle } from 'lucide-react';

export default function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  rightElement,
  hint,
  required = false,
  autoComplete,
}) {
  return (
    <div className="auth-field">
      <label className="auth-field-label" htmlFor={name}>
        {label}
        {required && <span className="auth-field-required">*</span>}
      </label>

      <div className="auth-input-wrapper">
        {Icon && (
          <span className="auth-input-icon">
            <Icon size={16} />
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          className={`auth-input${error ? ' has-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
        />
        {rightElement && rightElement}
      </div>

      {error && (
        <div className="auth-field-error">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}

      {hint && !error && (
        <div className="auth-field-hint">{hint}</div>
      )}
    </div>
  );
}
