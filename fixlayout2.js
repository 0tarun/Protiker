const fs = require('fs');

const path = 'C:/app/Protiker/Frontend/src/pages/SignupPage.jsx';
let text = fs.readFileSync(path, 'utf8');

// The class name fix
if (!text.includes('auth-form-card ${formVisible ?')) {
  text = text.replace(
    '<form className="auth-form-card" onSubmit={handleSubmit} noValidate>',
    '<form className={`auth-form-card ${formVisible ? "expanded" : ""}`} onSubmit={handleSubmit} noValidate>'
  );
}

const startMarker = '{/* ── Step 1: Role Selector ── */}';
if (text.includes(startMarker)) {
  const parts = text.split(startMarker);
  let top = parts[0];
  let bottom = parts[1];
  
  const step2Marker = '{/* ── Step 2: Form Fields (appear after role) ── */}';
  const dividerMarker = '{/* ── Divider ── */}';
  
  let bParts = bottom.split(step2Marker);
  let roleSection = bParts[0]; 
  
  let remainder = bParts[1].split(dividerMarker);
  let formSection = remainder[0];
  let bottomSection = remainder[1];
  
  // Update the class wrapper
  formSection = formSection.replace('<div className="auth-form-fields">', ''); // remove old
  formSection = formSection.replace('<div className="auth-divider" />', ''); // remove extra divider
  
  // wrap it right
  formSection = formSection.replace('{formVisible && (', '{formVisible && (\n              <div className="auth-signup-right">');
  
  let newFormInner = 
    '<div className="auth-signup-content">\n' +
    '  <div className="auth-signup-left">\n' +
    '    ' + startMarker + roleSection +
    '\n    <div style={{ marginTop: "30px" }}>\n' +
    '      ' + dividerMarker + bottomSection.replace('</form>', '</div>\n  </div>\n') +
    '    </div>\n' +
    '  {/* Step 2 in right panel */}\n' +
    '  ' + step2Marker + formSection +
    '</div>\n</form>'; 
    
  text = top + newFormInner;

  fs.writeFileSync(path, text, 'utf8');
  console.log('Done!');
}
