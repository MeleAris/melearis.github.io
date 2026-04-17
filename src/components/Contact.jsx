import { useState } from 'react';

const FORMSPREE_ACTION = 'https://formspree.io/f/xzbopavr';

export default function Contact() {
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setFeedback('');

    const form = e.currentTarget;

    try {
      const res = await fetch(FORMSPREE_ACTION, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('success');
        setFeedback('Message envoyé. Merci !');
        form.reset();
        return;
      }

      setStatus('error');
      const msg =
        Array.isArray(data.errors) && data.errors.length > 0
          ? data.errors.map((err) => err.message).filter(Boolean).join(' ')
          : typeof data.error === 'string'
            ? data.error
            : "L'envoi a échoué. Vérifiez les champs ou réessayez.";
      setFeedback(msg);
    } catch {
      setStatus('error');
      setFeedback('Erreur réseau. Réessayez plus tard.');
    }
  };

  return (
    <section className="ftco-section contact-section ftco-no-pb font-sans" id="contact-section">
      <div className="container">
        <div className="row justify-content-center mb-5 pb-3">
          <div className="col-md-7 heading-section text-center ftco-animate">
            <span className="subheading">Contact</span>
            <h2 className="mb-4">Laisser moi un message</h2>
          </div>
        </div>

        <div className="row block-9">
          <div className="col-md-8">
            <form
              action={FORMSPREE_ACTION}
              className="bg-light p-4 p-md-5 contact-form position-relative"
              method="POST"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-5000px',
                  height: '1px',
                  width: '1px',
                  overflow: 'hidden',
                }}
              />

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Votre nom"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Votre Email"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      type="text"
                      name="_subject"
                      className="form-control"
                      placeholder="Objet"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <textarea
                      name="message"
                      id="contact-message"
                      cols={30}
                      rows={7}
                      className="form-control"
                      placeholder="Message"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary py-3 px-5"
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? 'Envoi…' : 'Envoyer'}
                    </button>
                  </div>
                </div>
              </div>

              {(status === 'success' || status === 'error') && feedback && (
                <p
                  className={`mt-3 mb-0 small ${status === 'success' ? 'text-success' : 'text-danger'}`}
                  role="status"
                  aria-live="polite"
                >
                  {feedback}
                </p>
              )}
            </form>
          </div>

          <div className="col-md-4 d-flex pl-md-5">
            <div className="row">
              <div className="dbox w-100 d-flex">
                <div className="icon d-flex align-items-center justify-content-center">
                  <span className="fa fa-map-marker" />
                </div>
                <div className="text">
                  <p>
                    <span>Adresse:</span>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="https://goo.gl/maps/PiyXmRw2cTNE8gNT8"
                    >
                      {' '}
                      Sagbado, Lomé - TOGO
                    </a>
                  </p>
                </div>
              </div>
              <div className="dbox w-100 d-flex">
                <div className="icon d-flex align-items-center justify-content-center">
                  <span className="fa fa-phone" />
                </div>
                <div className="text">
                  <p>
                    <span>Téléphone:</span>{' '}
                    <a href="tel:+22899626391">+228 99626391 / 93567127</a>
                  </p>
                </div>
              </div>
              <div className="dbox w-100 d-flex">
                <div className="icon d-flex align-items-center justify-content-center">
                  <span className="fa fa-paper-plane" />
                </div>
                <div className="text">
                  <p>
                    <span>Email:</span>{' '}
                    <a href="mailto:amelesusu@gmail.com">amelesusu@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
