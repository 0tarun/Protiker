const ROLES = [
  { value: 'citizen', icon: '👤', title: 'সাধারণ নাগরিক', subtitle: 'General citizen' },
  { value: 'ngo_worker', icon: '🏢', title: 'এনজিও কর্মী', subtitle: 'NGO worker' },
  { value: 'law_student', icon: '🎓', title: 'আইন শিক্ষার্থী', subtitle: 'Law student' },
  { value: 'researcher', icon: '🔬', title: 'গবেষক', subtitle: 'Researcher' },
];

export default function RoleSelector({ selectedRole, onSelect }) {
  return (
    <div>
      <div className="auth-role-label">আপনি কে? · Who are you?</div>
      <div className="auth-role-grid">
        {ROLES.map((role) => (
          <div
            key={role.value}
            className={`auth-role-card${selectedRole === role.value ? ' selected' : ''}`}
            onClick={() => onSelect(role.value)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(role.value);
              }
            }}
          >
            <div className="auth-role-icon">
              <span>{role.icon}</span>
            </div>
            <div className="auth-role-title">{role.title}</div>
            <div className="auth-role-subtitle">{role.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
