import IconMedia from '../IconMedia';
import ImageUploadField from './ImageUploadField';

export default function IconField({
  iconUrl = '',
  iconSvg = '',
  onChange,
  folder,
  disabled = false,
  label = 'Icône',
}) {
  function handleFileUrl(url) {
    onChange({ iconUrl: url, iconSvg: '' });
  }

  function handleSvgChange(event) {
    onChange({ iconSvg: event.target.value, iconUrl: '' });
  }

  function handleClearAll() {
    onChange({ iconUrl: '', iconSvg: '' });
  }

  const hasIcon = Boolean(iconUrl?.trim() || iconSvg?.trim());

  return (
    <div className="admin-icon-field">
      <p className="admin-form__field">
        <span>{label}</span>
      </p>
      <div className="admin-icon-field__preview">
        {hasIcon ? (
          <IconMedia iconSvg={iconSvg} iconUrl={iconUrl} />
        ) : (
          <span className="admin-icon-field__empty">Aucune icône</span>
        )}
      </div>
      <ImageUploadField
        label="Images ou fichiers SVG"
        value={iconUrl}
        onChange={handleFileUrl}
        folder={folder}
        disabled={disabled}
      />
      <label className="admin-form__field">
        <span>Coller un SVG</span>
        <textarea
          value={iconSvg}
          onChange={handleSvgChange}
          disabled={disabled}
          rows={6}
          placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; …>"
        />
      </label>
      <button
        type="button"
        className="admin-btn admin-btn--ghost"
        onClick={handleClearAll}
        disabled={disabled || !hasIcon}
      >
        Effacer l&apos;icône
      </button>
    </div>
  );
}
