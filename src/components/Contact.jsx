import FadeIn from "./FadeIn";

export default function Contact() {
  return (
    <section id="contact" style={{ padding: "6rem 3rem", textAlign: "center" }}>
      <FadeIn>
        <p
          style={{
            fontSize: ".75rem",
            letterSpacing: ".1em",
            color: "var(--ink-soft)",
            marginBottom: ".75rem",
          }}
        >
          I&apos;m always excited to collaborate on new and innovative projects.
        </p>
        <h2
          style={{
            fontFamily: "Playfair Display",
            fontSize: "clamp(1.8rem,4vw,3rem)",
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}
        >
          Got a Vision? Let&apos;s Bring It to Life!
        </h2>
        <a
          href="mailto:hello@dnova.com"
          style={{
            display: "inline-block",
            padding: ".85rem 2.5rem",
            background: "var(--ink)",
            color: "#fff",
            borderRadius: "2rem",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: ".85rem",
          }}
        >
          Book a Call ↗
        </a>
      </FadeIn>
    </section>
  );
}
