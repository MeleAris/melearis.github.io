import { useSiteProfileContext } from "../context/SiteProfileContext";
import { useContact } from "../hooks/useContact";
import ContactButton from "./ContactButton";
import FadeIn from "./FadeIn";

export default function Contact() {
  const { profile } = useSiteProfileContext();
  const { contact, socialLinks } = useContact();
  const linkedin = socialLinks.find((link) =>
    /linkedin/i.test(link.label) || /linkedin\.com/i.test(link.href),
  );

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
            marginBottom: "1rem",
          }}
        >
          {contact.title}
        </h2>

        {contact.availability ? (
          <p className="contact-availability">
            <span className="contact-availability__dot" aria-hidden="true" />
            {contact.availability}
          </p>
        ) : null}

        <div className="contact-actions">
          <ContactButton
            className="contact-actions__cta"
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

          {contact.email ? (
            <a className="contact-link" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          ) : null}

          {linkedin ? (
            <a
              className="contact-link"
              href={linkedin.href}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
          ) : null}
        </div>
      </FadeIn>
    </section>
  );
}
