import { useEffect, useState } from 'react';
import { FORMSPREE_ACTION } from '../constants/contact';
import { useContactModal } from '../context/ContactModalContext';

export default function ContactModal() {
  const { isOpen, closeContactModal } = useContactModal();
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeContactModal();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeContactModal]);

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setFeedback('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setFeedback('');

    if (!FORMSPREE_ACTION) {
      setStatus('error');
      setFeedback('Formspree n\'est pas encore configuré. Ajoutez votre endpoint dans src/constants/contact.js');
      return;
    }

    const form = event.currentTarget;

    try {
      const response = await fetch(FORMSPREE_ACTION, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus('success');
        setFeedback('Message envoyé. Merci !');
        form.reset();
        return;
      }

      setStatus('error');
      const message =
        Array.isArray(data.errors) && data.errors.length > 0
          ? data.errors.map((err) => err.message).filter(Boolean).join(' ')
          : typeof data.error === 'string'
            ? data.error
            : "L'envoi a échoué. Vérifiez les champs ou réessayez.";
      setFeedback(message);
    } catch {
      setStatus('error');
      setFeedback('Erreur réseau. Réessayez plus tard.');
    }
  };

  return (
    <div
      className="contact-modal-overlay"
      role="presentation"
      onClick={closeContactModal}
    >
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="contact-modal__close"
          onClick={closeContactModal}
          aria-label="Fermer"
        >
          ✕
        </button>

        <p
          style={{
            fontSize: '.7rem',
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '.5rem',
          }}
        >
          Contact
        </p>
        <h2
          id="contact-modal-title"
          style={{
            fontFamily: 'Playfair Display',
            fontSize: 'clamp(1.4rem,3vw,1.9rem)',
            fontWeight: 700,
            marginBottom: '1.25rem',
          }}
        >
          Contactez-moi
        </h2>

        <form
          className="contact-modal__form"
          action={FORMSPREE_ACTION || undefined}
          method="POST"
          onSubmit={handleSubmit}
        >
          <label className="contact-modal__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="votre@email.com"
            />
          </label>

          <label className="contact-modal__field">
            <span>Objet</span>
            <input
              type="text"
              name="_subject"
              required
              placeholder="Objet de votre message"
            />
          </label>

          <label className="contact-modal__field">
            <span>Contenu</span>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Votre message..."
            />
          </label>

          <button
            type="submit"
            className="contact-modal__submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Envoi…' : 'Envoyer'}
          </button>

          {(status === 'success' || status === 'error') && feedback && (
            <p
              className={`contact-modal__feedback contact-modal__feedback--${status}`}
              role="status"
              aria-live="polite"
            >
              {feedback}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
