import { useSiteProfileContext } from "../context/SiteProfileContext";
import { useContact } from "../hooks/useContact";
import ContactButton from "./ContactButton";
import FadeIn from "./FadeIn";

export default function Contact() {
  const { profile } = useSiteProfileContext();
  const { contact } = useContact();

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
          {contact.eyebrow}
        </p>
        <h2
          style={{
            fontFamily: "Playfair Display",
            fontSize: "clamp(1.8rem,4vw,3rem)",
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}
        >
          {contact.title}
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
          {profile.ctaLabel}
        </ContactButton>
      </FadeIn>
    </section>
  );
}
