import { useEffect, useMemo, useState } from "react";
import { useSiteProfileContext } from "../context/SiteProfileContext";
import { usePortfolio } from "../hooks/usePortfolio";
import ContactButton from "./ContactButton";

const BASE_NAV_LINKS = ["A propos", "Experience", "Portfolio", "Services"];

export default function Nav() {
  const { profile } = useSiteProfileContext();
  const { hasWorks } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = useMemo(
    () =>
      hasWorks
        ? BASE_NAV_LINKS
        : BASE_NAV_LINKS.filter((label) => label !== "Portfolio"),
    [hasWorks],
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className="site-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.1rem 3rem",
          background: scrolled ? "rgba(245,244,240,.94)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,.07)" : "none",
          transition: "all .4s ease",
        }}
      >
        <button
          type="button"
          onClick={() => {
            const section = document.getElementById("acceuil");
            if (section) {
              section.scrollIntoView({ behavior: "smooth" });
              section.setAttribute("tabindex", "-1");
              section.focus({ preventScroll: true });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            closeMenu();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "Playfair Display",
            fontWeight: 700,
            fontSize: "1.25rem",
            letterSpacing: "-.01em",
            outline: "none",
            color: "inherit",
          }}
          aria-label="Retour à l'accueil"
          tabIndex={0}
        >
          {profile.brandName}
        </button>

        <div
          className="site-nav__links"
          style={{
            display: "flex",
            gap: "2.5rem",
            fontSize: ".875rem",
            color: "var(--ink-soft)",
          }}
        >
          {navLinks.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(" ", "-")}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                transition: "color .2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "var(--ink-soft)";
              }}
            >
              {label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ContactButton
            className="site-nav__cta"
            style={{
              padding: ".55rem 1.3rem",
              border: "1px solid var(--ink)",
              borderRadius: "2rem",
              fontSize: ".8rem",
              color: "var(--ink)",
              transition: "all .25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--ink)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--ink)";
            }}
          >
            {profile.ctaLabel}
          </ContactButton>

          <button
            type="button"
            className="site-nav__toggle"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="site-nav__mobile-menu">
          {navLinks.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(" ", "-")}`}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
          <ContactButton
            className="site-nav__mobile-cta"
            style={{
              marginTop: "0.5rem",
              textAlign: "center",
              border: "1px solid var(--ink)",
              borderRadius: "2rem",
              color: "var(--ink)",
              padding: "0.65rem 0.75rem",
              width: "100%",
            }}
            onClick={closeMenu}
          >
            {profile.ctaLabel}
          </ContactButton>
        </div>
      )}
    </>
  );
}
