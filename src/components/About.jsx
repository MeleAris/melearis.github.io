import FadeIn from "./FadeIn";

export default function About() {
  return (
    <section
      id="about-me"
      style={{ padding: "6rem 3rem", maxWidth: 1100, margin: "0 auto" }}
    >
      <div
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
            About Me
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
            I turn ideas into impactful digital experiences
          </h2>
          <p
            style={{
              color: "var(--ink-soft)",
              lineHeight: 1.75,
              fontSize: ".95rem",
              marginBottom: "1.5rem",
            }}
          >
            I&apos;m a specialist in turning complex problems into elegant
            solutions. My approach blends creativity with strategic thinking to
            deliver designs that not only look great but work seamlessly. Ready
            to start your own project?
          </p>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[
              ["10+", "Years experience"],
              ["120%", "Avg. client engagement increase"],
            ].map(([value, label]) => (
              <div
                key={value}
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
                  {value}
                </p>
                <p
                  style={{
                    fontSize: ".75rem",
                    color: "var(--ink-soft)",
                    marginTop: ".25rem",
                  }}
                >
                  {label}
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
              <p style={{ fontSize: ".85rem", lineHeight: 1.65 }}>
                With 4+ years of experience, I specialize in creating intuitive,
                user-focused designs that solve real-world problems and deliver
                seamless digital experiences.
              </p>
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
              <p
                style={{
                  fontSize: ".82rem",
                  color: "var(--ink-soft)",
                  lineHeight: 1.65,
                }}
              >
                I thrive on working closely with clients, blending creativity
                and strategy to bring their vision to life through thoughtful,
                impactful design solutions.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
