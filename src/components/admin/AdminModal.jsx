import { useEffect } from 'react';

export default function AdminModal({ open, title, onClose, children, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="presentation">
      <div
        className={`admin-modal${wide ? ' admin-modal--wide' : ''}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <div className="admin-modal__head">
          <h2 id="admin-modal-title" className="admin-modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="admin-modal__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>
  );
}
