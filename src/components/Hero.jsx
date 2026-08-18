import { useSiteProfileContext } from "../context/SiteProfileContext";
import { HERO_PORTRAIT_FALLBACK } from "../constants/defaults/hero";
import { useHero } from "../hooks/useHero";
import FadeIn from "./FadeIn";
import HeroOrbit from "./HeroOrbit";

const HELLO_LETTERS = "Hello".split("");

export default function Hero() {
  const { profile } = useSiteProfileContext();
  const { hero } = useHero();
  const portraitSrc = hero.portraitUrl || HERO_PORTRAIT_FALLBACK;

  return (
    <section id="acceuil" className="hero-section">
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
                {profile.fullName}, {profile.jobTitle}
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
                aria-label="Scroll to About section"
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
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
