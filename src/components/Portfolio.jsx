import { useState } from "react";
import { usePortfolio } from "../hooks/usePortfolio";
import FadeIn from "./FadeIn";

export default function Portfolio() {
  const { works } = usePortfolio();
  const [expanded, setExpanded] = useState(false);

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
              color: "var(--accent)",
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
            <PortfolioCard key={work.id ?? work.title + index} work={work} index={index} />
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
    </section>
  );
}

function PortfolioCard({ work, index }) {
  const coverStyle =
    work.images?.[0]
      ? {
          background: `${work.color} url(${work.images[0]}) center/cover no-repeat`,
        }
      : { background: work.color };

  const inner = (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg,rgba(255,255,255,.3) 0%,transparent 50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "var(--ink)",
          color: "#fff",
          padding: ".3rem .75rem",
          borderRadius: "2rem",
          fontSize: ".7rem",
        }}
      >
        {work.category}
      </div>
      {work.href ? (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden="true"
        >
          ↗
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          fontSize: ".78rem",
          color: "rgba(0,0,0,.5)",
        }}
      >
        {work.title}
      </div>
    </>
  );

  const sharedStyle = {
    display: "block",
    borderRadius: "1.5rem",
    overflow: "hidden",
    aspectRatio: "4/3",
    position: "relative",
    cursor: work.href ? "pointer" : "default",
    textDecoration: "none",
    color: "inherit",
    ...coverStyle,
  };

  return (
    <FadeIn delay={index * 0.12}>
      {work.href ? (
        <a
          href={work.href}
          target="_blank"
          rel="noreferrer"
          style={sharedStyle}
          aria-label={`${work.title} — ouvrir le projet`}
        >
          {inner}
        </a>
      ) : (
        <div style={sharedStyle} aria-label={work.title}>
          {inner}
        </div>
      )}
    </FadeIn>
  );
}
