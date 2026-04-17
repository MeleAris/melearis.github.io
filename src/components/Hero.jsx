import poseImg from "../../img/pose.png";
import { HEADER_SCROLL_OFFSET } from "../constants/layout";

function scrollToAbout() {
  const el = document.querySelector("#about-section");
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

/** Aligné sur la barre du header (largeur max + gouttières). */
const shellClass = "mx-auto w-full max-w-[1200px] px-3 sm:px-4 lg:px-5";

/** Légendes des stats : même famille que le sous-titre central. */
const captionClass = "text-body/85 text-xs font-medium tracking-wide";

export default function Hero() {
  return (
    <section
      id="home-section"
      className="font-sans relative flex min-h-0 w-full flex-1 flex-col bg-tertiary/35 text-body"
      aria-label="Accueil"
    >
      <div
        className={`${shellClass} relative z-10 flex h-screen flex-1 flex-col gap-8 pb-16 pt-6 sm:pt-8 lg:flex-row lg:items-stretch lg:gap-10 lg:pb-20 lg:pt-10`}
      >
        {/* Colonne gauche : stats + titre */}
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col lg:max-w-[48%] lg:pr-2">
          <div className="flex shrink-0 gap-10 sm:gap-12 lg:gap-14">
            <div>
              <p className="text-primary text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold leading-none tracking-tight">
                +200
              </p>
              <p className={`${captionClass} mt-1.5`}>Project completed</p>
            </div>
            <div>
              <p className="text-primary text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold leading-none tracking-tight">
                +50
              </p>
              <p className={`${captionClass} mt-1.5`}>Startup raised</p>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-center py-6 sm:py-8 lg:py-4">
            <h1
              className="text-primary m-0 font-bold leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(3.25rem, 10vw, 6.5rem)" }}
            >
              Hello
            </h1>
            <p className="text-body/85 mt-4 max-w-xl text-[clamp(0.95rem,2.2vw,1.2rem)] font-medium leading-snug tracking-wide">
              — Aristide MELESUSU, Développeur Full Stack
            </p>
          </div>
        </div>

        {/* Image — remplit la colonne droite dans la grille max-width */}
        <div className="relative min-h-[42vh] w-full min-w-0 flex-1 overflow-hidden bg-primary/6 lg:min-h-0">
          <img
            src={poseImg}
            alt="Aristide"
            fetchPriority="high"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top select-none"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>

      {/* Scroll : bas de section, aligné icône header, sans survol */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className={shellClass}>
          <button
            type="button"
            onClick={scrollToAbout}
            className="text-primary/80 pointer-events-auto mb-5 mt-2 inline-flex items-center gap-2 border-0 bg-transparent p-0 text-left text-[12px] font-normal tracking-wide sm:mb-6 lg:mb-7"
            aria-label="Descendre vers la présentation"
          >
            <span>scroll</span>
            <span
              className="fa fa-long-arrow-down translate-y-px text-[10px] leading-none text-primary/80"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
