import { useSiteProfileContext } from "../context/SiteProfileContext";
import { HERO_PORTRAIT_FALLBACK } from "../constants/defaults/hero";
import { useHero } from "../hooks/useHero";
import { useContactModal } from "../context/ContactModalContext";
import { usePortfolio } from "../hooks/usePortfolio";
import FadeIn from "./FadeIn";
import HeroOrbit from "./HeroOrbit";

const HELLO_LETTERS = "Hello".split("");

function HeroActions({ ctaLabel, cvUrl, hasWorks, onContact }) {
  return (
    <div className="hero-ctas">
      {hasWorks ? (
        <a className="hero-cta hero-cta--primary" href="#portfolio">
          Voir mes projets
        </a>
      ) : (
        <button type="button" className="hero-cta hero-cta--primary" onClick={onContact}>
          {ctaLabel}
        </button>
      )}

      {hasWorks ? (
        <button type="button" className="hero-cta hero-cta--ghost" onClick={onContact}>
          {ctaLabel}
        </button>
      ) : null}

      {cvUrl ? (
        <a
          className="hero-cta hero-cta--ghost"
          href={cvUrl}
          target="_blank"
          rel="noreferrer"
          download
        >
          Télécharger le CV
        </a>
      ) : null}
    </div>
  );
}

export default function Hero() {
  const { profile } = useSiteProfileContext();
  const { hero } = useHero();
  const { hasWorks } = usePortfolio();
  const { openContactModal } = useContactModal();
  const portraitSrc = hero.portraitUrl || HERO_PORTRAIT_FALLBACK;
  const cvUrl = hero.cvUrl?.trim() ?? "";

  return (
    <section id="accueil" className="hero-section">
      <div className="hero-blur-top" aria-hidden="true" />
      <div className="hero-blur-bottom" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-main-row">
          <FadeIn delay={0.2} className="hero-stack-col">
            <HeroOrbit placeOnHero className="hero-stack--vertical" />
          </FadeIn>

          <div className="hero-copy">
            <FadeIn delay={0.1} className="hero-desktop-only">
              <p className="hero-eyebrow">
                {profile.fullName} · {profile.jobTitle}
              </p>
            </FadeIn>

            <FadeIn delay={0.15} className="hero-desktop-only">
              <h1 className="hero-hello" aria-label="Hello">
                {HELLO_LETTERS.map((letter, index) => (
                  <span
                    key={index}
                    className="hero-hello__letter"
                    style={{ "--i": index }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
            </FadeIn>

            <FadeIn delay={0.3} className="hero-desktop-only">
              <p className="hero-tagline">{hero.tagline}</p>
            </FadeIn>

            <FadeIn delay={0.4} className="hero-desktop-only">
              <HeroActions
                ctaLabel={profile.ctaLabel}
                cvUrl={cvUrl}
                hasWorks={hasWorks}
                onContact={openContactModal}
              />
            </FadeIn>

            <FadeIn delay={0.5} className="hero-scroll-wrap">
              <button
                type="button"
                className="hero-scroll"
                onClick={() => {
                  const section = document.getElementById("a-propos");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                    section.setAttribute("tabindex", "-1");
                    section.focus({ preventScroll: true });
                  }
                }}
                aria-label="Aller à la section À propos"
              >
                <span className="hero-scroll__line" />
                <span className="hero-scroll__label">{hero.scrollLabel}</span>
              </button>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="hero-avatar-wrap">
            <div className="hero-avatar">
              <img
                className="hero-avatar__img"
                src={portraitSrc}
                alt={
                  profile.fullName ? `Portrait de ${profile.fullName}` : "Portrait"
                }
                width={1200}
                height={1600}
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.25} className="hero-mobile-meta">
            <p className="hero-mobile-nameplate">
              <span className="hero-mobile-name">{profile.fullName}</span>
              <span className="hero-mobile-title">{profile.jobTitle}</span>
            </p>
            <p className="hero-tagline hero-tagline--mobile">{hero.tagline}</p>
            <HeroActions
              ctaLabel={profile.ctaLabel}
              cvUrl={cvUrl}
              hasWorks={hasWorks}
              onContact={openContactModal}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
