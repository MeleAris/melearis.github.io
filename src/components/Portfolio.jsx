import { works } from "../constants/content";
import FadeIn from "./FadeIn";

export default function Portfolio() {
  return (
    <section id="portfolio" style={{ padding: "5rem 3rem" }}>
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
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {works.map((work, index) => (
            <FadeIn key={work.title + index} delay={index * 0.12}>
              <div
                style={{
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  background: work.color,
                  aspectRatio: "4/3",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
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
                >
                  ↗
                </div>
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
              </div>
            </FadeIn>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <a
            href="#"
            style={{
              padding: ".6rem 1.8rem",
              border: "1px solid var(--ink)",
              borderRadius: "2rem",
              fontSize: ".82rem",
              textDecoration: "none",
              color: "var(--ink)",
            }}
          >
            Check our More →
          </a>
          <a
            href="#"
            style={{
              padding: ".6rem 1.8rem",
              background: "var(--ink)",
              color: "#fff",
              borderRadius: "2rem",
              fontSize: ".82rem",
              textDecoration: "none",
            }}
          >
            → View More
          </a>
        </div>
      </div>
    </section>
  );
}
