import FadeIn from "./FadeIn";
import HeroOrbit from "./HeroOrbit";
import RichText from "./RichText";
import { useAbout } from "../hooks/useAbout";

export default function About() {
  const { about, stats } = useAbout();

  return (
    <section
      id="a-propos"
      className="section-pad-lg"
      style={{ padding: "6rem 3rem", maxWidth: 1100, margin: "0 auto" }}
    >
      <div
        className="grid-2-col"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        <FadeIn>
          <p
            style={{
              fontSize: ".7rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: ".75rem",
            }}
          >
            {about.eyebrow}
          </p>
          <h2
            style={{
              fontFamily: "Playfair Display",
              fontSize: "clamp(1.8rem,4vw,3rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}
          >
            {about.title}
          </h2>
          <RichText
            html={about.intro}
            className="rich-text--soft"
            style={{
              color: "var(--ink-soft)",
              lineHeight: 1.75,
              fontSize: ".95rem",
              marginBottom: "1.5rem",
            }}
          />
          <div className="about-stats" style={{ display: "flex", gap: "2rem" }}>
            {stats.map((stat) => (
              <div
                key={stat.id ?? `${stat.value}-${stat.label}`}
                style={{
                  padding: "1.2rem 1.5rem",
                  background: "var(--card-bg)",
                  borderRadius: "1rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "Playfair Display",
                    fontWeight: 700,
                    fontSize: "1.7rem",
                    color: "var(--accent)",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: ".75rem",
                    color: "var(--ink-soft)",
                    marginTop: ".25rem",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div
              style={{
                gridColumn: "1/-1",
                padding: "1.5rem",
                background: "var(--ink)",
                color: "#fff",
                borderRadius: "1.5rem",
              }}
            >
              <RichText
                html={about.cardPrimary}
                className="rich-text--on-dark"
                style={{ fontSize: ".85rem", lineHeight: 1.65 }}
              />
            </div>
            <div
              style={{
                padding: "1.5rem",
                background: "var(--accent)",
                borderRadius: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>✦</span>
            </div>
            <div
              style={{
                padding: "1.5rem",
                background: "var(--card-bg)",
                borderRadius: "1.5rem",
              }}
            >
              <RichText
                html={about.cardSecondary}
                className="rich-text--soft"
                style={{
                  fontSize: ".82rem",
                  color: "var(--ink-soft)",
                  lineHeight: 1.65,
                }}
              />
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <HeroOrbit placeOnHero={false} className="about-stack" />
      </FadeIn>
    </section>
  );
}
