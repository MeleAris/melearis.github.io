import { useMemo } from "react";
import IconMedia from "./IconMedia";
import { useSiteProfileContext } from "../context/SiteProfileContext";
import { useContact } from "../hooks/useContact";
import { useGallery } from "../hooks/useGallery";
import { usePortfolio } from "../hooks/usePortfolio";

const FOOTER_LINKS = [
  { label: "Accueil", id: "accueil" },
  { label: "À propos", id: "a-propos" },
  { label: "Certifications", id: "certifications", requires: "certifications" },
  { label: "Expérience", id: "experience" },
  { label: "Portfolio", id: "portfolio", requires: "works" },
  { label: "Services", id: "services" },
];

export default function Footer() {
  const { profile } = useSiteProfileContext();
  const { socialLinks } = useContact();
  const { hasWorks } = usePortfolio();
  const { hasCertifications } = useGallery();

  const footerLinks = useMemo(
    () =>
      FOOTER_LINKS.filter(
        (link) =>
          (link.requires !== "works" || hasWorks) &&
          (link.requires !== "certifications" || hasCertifications),
      ),
    [hasWorks, hasCertifications],
  );

  return (
    <footer
      className="section-pad"
      style={{ background: "var(--ink)", color: "#fff", padding: "3rem" }}
    >
      <div
        className="footer-row"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <div
          className="footer-nav"
          style={{
            display: "flex",
            gap: "2rem",
            fontSize: ".8rem",
            color: "rgba(255,255,255,.5)",
          }}
        >
          {footerLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div
          className="footer-social"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {socialLinks.map((social) => (
            <a
              key={social.id ?? social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              title={social.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,.2)",
                color: "#fff",
                textDecoration: "none",
                transition: "background .2s, border-color .2s, color .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.2)";
                e.currentTarget.style.color = "#fff";
              }}
            >
              {social.iconSvg || social.iconUrl ? (
                <IconMedia iconSvg={social.iconSvg} iconUrl={social.iconUrl} alt={social.label} />
              ) : (
                social.label.charAt(0)
              )}
            </a>
          ))}
        </div>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} {profile.fullName || "Aristide Melesusu"}
      </p>
    </footer>
  );
}
