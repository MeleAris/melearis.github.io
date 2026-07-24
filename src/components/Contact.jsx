import ContactButton from "./ContactButton";
import FadeIn from "./FadeIn";

export default function Contact() {
  return (
    <section
      id="contact"
      className="section-pad-lg"
      style={{ padding: "6rem 3rem", textAlign: "center" }}
    >
      <FadeIn>
        <p
          style={{
            fontSize: ".75rem",
            letterSpacing: ".1em",
            color: "var(--ink-soft)",
            marginBottom: ".75rem",
          }}
        >
          Je suis toujours enthousiaste à collaborer sur des projets innovants.
        </p>
        <h2
          style={{
            fontFamily: "Playfair Display",
            fontSize: "clamp(1.8rem,4vw,3rem)",
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}
        >
          Vous avez une idée? Faisons-la vivre!
        </h2>
        <ContactButton
          style={{
            display: "inline-block",
            padding: ".85rem 2.5rem",
            background: "var(--ink)",
            color: "#fff",
            borderRadius: "2rem",
            fontWeight: 500,
            fontSize: ".85rem",
          }}
        >
          Contactez-moi ↗
        </ContactButton>
      </FadeIn>
    </section>
  );
}
