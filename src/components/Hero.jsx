import FadeIn from "./FadeIn";
import HeroOrbit from "./HeroOrbit";

export default function Hero() {
  return (
    <section
      id="acceuil"
      className="hero-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 3rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="hero-blur-top"
        style={{
          position: "absolute",
          top: "10%",
          right: "15%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,169,110,.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="hero-blur-bottom"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(61,90,71,.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="hero-inner"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          paddingTop: "5rem",
        }}
      >
        <FadeIn delay={0.1}>
          <p
            style={{
              fontSize: ".8rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
              marginBottom: "1rem",
            }}
          >
            Aristide, Ingénieur full stack et DevOps
          </p>
        </FadeIn>

        <div
          className="hero-main-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <FadeIn delay={0.15}>
            <HeroOrbit />
          </FadeIn>

          <div
            className="hero-avatar"
            style={{
              width: 220,
              height: 280,
              borderRadius: "2rem",
              overflow: "hidden",
              background: "linear-gradient(135deg,#d4c8b8,#b8c0b0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 160,
                height: 200,
                borderRadius: "1.5rem",
                background: "linear-gradient(160deg,#c4bab0 0%,#9aad96 100%)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <svg
                viewBox="0 0 100 130"
                width="100%"
                style={{ marginBottom: -4 }}
              >
                <ellipse
                  cx="50"
                  cy="42"
                  rx="22"
                  ry="24"
                  fill="#8a7c6e"
                  opacity=".9"
                />
                <ellipse cx="50" cy="40" rx="18" ry="20" fill="#b8a898" />
                <path d="M20 130 Q50 90 80 130" fill="#6b5d4e" opacity=".8" />
                <circle cx="44" cy="38" r="2" fill="#5a4a3a" />
                <circle cx="56" cy="38" r="2" fill="#5a4a3a" />
                <path
                  d="M44 46 Q50 50 56 46"
                  stroke="#5a4a3a"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </div>
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "var(--accent)",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              ✦
            </div>
          </div>
        </div>

        <FadeIn delay={0.5}>
          <button
            onClick={() => {
              const section = document.getElementById("a-propos");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
                section.setAttribute("tabindex", "-1");
                section.focus({ preventScroll: true });
              }
            }}
            style={{
              marginTop: "3rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            aria-label="Scroll to About section"
          >
            <div
              style={{ width: 40, height: 1, background: "var(--ink-soft)" }}
            />
            <p
              style={{
                fontSize: ".78rem",
                color: "var(--ink-soft)",
                letterSpacing: ".05em",
              }}
            >
              Scroll down ↓
            </p>
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
