import '../../assets/css/SettingsComponents.css';

function Section({ title, description, children }) {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h3 className="settings-section-title">{title}</h3>
        {description && <p className="settings-section-desc">{description}</p>}
      </div>
      <div className="settings-section-body">
        {children}
      </div>
    </div>
  );
}

export default Section;
