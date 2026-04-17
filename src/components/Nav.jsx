import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
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
      <span
        style={{
          fontFamily: "Playfair Display",
          fontWeight: 700,
          fontSize: "1.25rem",
          letterSpacing: "-.01em",
        }}
      >
        D&apos;Nova
      </span>
      <div
        style={{
          display: "flex",
          gap: "2.5rem",
          fontSize: ".875rem",
          color: "var(--ink-soft)",
        }}
      >
        {["About Me", "Portfolio", "Services", "Blog"].map((label) => (
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
      <a
        href="#contact"
        style={{
          padding: ".55rem 1.3rem",
          border: "1px solid var(--ink)",
          borderRadius: "2rem",
          fontSize: ".8rem",
          textDecoration: "none",
          color: "var(--ink)",
          transition: "all .25s",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "var(--ink)";
          e.target.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "var(--ink)";
        }}
      >
        Book A Call ↗
      </a>
    </nav>
  );
}
