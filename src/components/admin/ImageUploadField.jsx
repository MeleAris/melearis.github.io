import { useId, useRef, useState } from 'react';
import { uploadImage } from '../../services/uploadService';

export default function ImageUploadField({
  label,
  value = '',
  onChange,
  folder,
  disabled = false,
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Envoi impossible.');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  function handleClear() {
    onChange('');
    setError(null);
  }

  return (
    <div className="admin-image-upload">
      <label className="admin-form__field" htmlFor={inputId}>
        <span>{label}</span>
        {value ? (
          <div className="admin-image-upload__preview">
            <img src={value} alt="" />
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-image-upload__clear"
              onClick={handleClear}
              disabled={disabled || uploading}
            >
              Supprimer
            </button>
          </div>
        ) : null}
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/*,.svg"
          onChange={handleFileChange}
          disabled={disabled || uploading}
        />
        {uploading ? <span className="admin-image-upload__status">Envoi…</span> : null}
        {error ? <span className="admin-form__error">{error}</span> : null}
      </label>
    </div>
  );
}
