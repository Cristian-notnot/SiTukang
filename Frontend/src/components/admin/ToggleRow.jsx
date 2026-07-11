import '../../assets/css/SettingsComponents.css';

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div className="toggle-row-info">
        <div className="toggle-row-title">{title}</div>
        {description && <div className="toggle-row-desc">{description}</div>}
      </div>
      <button
        className={`toggle-switch ${checked ? 'active' : ''}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={title}
      >
        <span className="toggle-switch-thumb" />
      </button>
    </div>
  );
}

export default ToggleRow;
