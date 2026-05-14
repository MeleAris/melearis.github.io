import FadeIn from "./FadeIn";

export default function CTA() {
  return (
    <section style={{ padding: "3rem" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          background: "var(--ink)",
          borderRadius: "2rem",
          padding: "4rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(200,169,110,.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(61,90,71,.3)",
          }}
        />
        <FadeIn>
          <p
            style={{
              fontSize: ".75rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "1rem",
            }}
          >
            Réservez votre consultation gratuite maintenant!
          </p>
          <h2
            style={{
              fontFamily: "Playfair Display",
              color: "#fff",
              fontSize: "clamp(1.5rem,4vw,2.8rem)",
              fontWeight: 700,
              marginBottom: "1rem",
              maxWidth: 560,
              margin: "0 auto 1rem",
            }}
          >
            Offre exclusive — Réservez votre consultation gratuite maintenant!
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,.55)",
              fontSize: ".85rem",
              marginBottom: "2rem",
            }}
          >
            Take advantage of this limited-time offer and let&apos;s create
            something extraordinary together.
          </p>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              padding: ".85rem 2.2rem",
              background: "var(--accent)",
              color: "var(--ink)",
              borderRadius: "2rem",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: ".85rem",
              letterSpacing: ".02em",
            }}
          >
            Get It ↗
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
