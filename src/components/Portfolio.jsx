import { useState } from "react";
import { usePortfolio } from "../hooks/usePortfolio";
import FadeIn from "./FadeIn";
import WorkModal from "./WorkModal";

export default function Portfolio() {
  const { works } = usePortfolio();
  const [expanded, setExpanded] = useState(false);
  const [activeWork, setActiveWork] = useState(null);

  if (works.length === 0) {
    return null;
  }

  const visibleWorks = expanded ? works : works.slice(0, 3);
  const showMoreButton = works.length > 3;

  return (
    <section id="portfolio" className="section-pad" style={{ padding: "5rem 3rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <p
            style={{
              fontSize: ".7rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--accent-ink)",
              marginBottom: ".5rem",
              textAlign: "center",
            }}
          >
            ✦ Portfolio
          </p>
          <h2
            style={{
              fontFamily: "Playfair Display",
              fontSize: "clamp(1.8rem,4vw,3rem)",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "2.5rem",
            }}
          >
            Réalisations récentes
          </h2>
        </FadeIn>
        <div
          className="grid-3-col"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "1.5rem",
            marginBottom: showMoreButton ? "1.5rem" : 0,
          }}
        >
          {visibleWorks.map((work, index) => (
            <FadeIn key={work.id ?? work.title + index} delay={index * 0.12}>
              <PortfolioCard work={work} onOpen={() => setActiveWork(work)} />
            </FadeIn>
          ))}
        </div>
        {showMoreButton ? (
          <div className="portfolio-btns" style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              style={{
                padding: ".6rem 1.8rem",
                background: "var(--ink)",
                color: "#fff",
                border: "none",
                borderRadius: "2rem",
                fontSize: ".82rem",
                cursor: "pointer",
              }}
            >
              {expanded ? "Voir moins" : "Voir plus →"}
            </button>
          </div>
        ) : null}
      </div>

      {activeWork ? (
        <WorkModal work={activeWork} onClose={() => setActiveWork(null)} />
      ) : null}
    </section>
  );
}

function PortfolioCard({ work, onOpen }) {
  const cover = work.images?.[0];

  return (
    <button
      type="button"
      className="work-card"
      onClick={onOpen}
      aria-label={`${work.title} — voir les détails du projet`}
    >
      <span className="work-card__media">
        {cover ? (
          <img className="work-card__img" src={cover} alt="" loading="lazy" />
        ) : (
          <span
            className="work-card__placeholder"
            style={{ background: work.color }}
          />
        )}
      </span>

      <span className="work-card__shade" aria-hidden="true" />

      {work.category ? (
        <span className="work-card__badge">{work.category}</span>
      ) : null}

      <span className="work-card__footer">
        <span className="work-card__title">{work.title}</span>
        <span className="work-card__hint" aria-hidden="true">
          Voir le projet ↗
        </span>
      </span>
    </button>
  );
}
