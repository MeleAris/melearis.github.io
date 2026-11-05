import { useEffect, useRef, useState } from "react";

export default function WorkModal({ work, onClose }) {
  const images = work?.images ?? [];
  const [index, setIndex] = useState(0);
  const closeRef = useRef(null);
  const lastFocused = useRef(null);
  const hasCarousel = images.length > 1;

  useEffect(() => {
    lastFocused.current = document.activeElement;
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      if (lastFocused.current instanceof HTMLElement) {
        lastFocused.current.focus({ preventScroll: true });
      }
    };
  }, [onClose]);

  useEffect(() => {
    if (!hasCarousel) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasCarousel, images.length]);

  if (!work) return null;

  const goTo = (next) => {
    if (images.length === 0) return;
    setIndex((next + images.length) % images.length);
  };

  return (
    <div className="work-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="work-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="work-modal__close"
          onClick={onClose}
          aria-label="Fermer le projet"
        >
          ✕
        </button>

        <div className="work-modal__media">
          {images.length > 0 ? (
            <>
              <div className="work-modal__frame">
                <img
                  src={images[index]}
                  alt={`${work.title} — visuel ${index + 1} sur ${images.length}`}
                />
              </div>

              {hasCarousel ? (
                <>
                  <button
                    type="button"
                    className="work-modal__nav work-modal__nav--prev"
                    onClick={() => goTo(index - 1)}
                    aria-label="Image précédente"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="work-modal__nav work-modal__nav--next"
                    onClick={() => goTo(index + 1)}
                    aria-label="Image suivante"
                  >
                    →
                  </button>
                  <p className="work-modal__counter" aria-live="polite">
                    {index + 1} / {images.length}
                  </p>
                  <div className="work-modal__dots">
                    {images.map((url, dotIndex) => (
                      <button
                        key={`${url}-${dotIndex}`}
                        type="button"
                        className={
                          dotIndex === index
                            ? "work-modal__dot work-modal__dot--active"
                            : "work-modal__dot"
                        }
                        onClick={() => goTo(dotIndex)}
                        aria-label={`Aller à l'image ${dotIndex + 1}`}
                        aria-current={dotIndex === index}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <div
              className="work-modal__fallback"
              style={{ background: work.color }}
            >
              <span>{work.category || "Projet"}</span>
            </div>
          )}
        </div>

        <div className="work-modal__body">
          {work.category ? (
            <p className="work-modal__eyebrow">{work.category}</p>
          ) : null}
          <h2 id="work-modal-title" className="work-modal__title">
            {work.title}
          </h2>
          {work.description ? (
            <p className="work-modal__description">{work.description}</p>
          ) : null}

          {work.links?.length ? (
            <div className="work-modal__links">
              {work.links.map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  className="work-modal__link"
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
