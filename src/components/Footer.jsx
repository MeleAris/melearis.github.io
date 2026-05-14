export default function Footer() {
  return (
    <footer
      style={{ background: "var(--ink)", color: "#fff", padding: "3rem" }}
    >
      <div
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
          style={{
            display: "flex",
            gap: "2rem",
            fontSize: ".8rem",
            color: "rgba(255,255,255,.5)",
          }}
        >
          {["Acceuil", "A propos", "Experience", "Portfolio", "Services"].map(
            (label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(" ", "-")}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {label}
              </a>
            ),
          )}
        </div>
        <a
          href="mailto:amelesusu@gmail.com"
          style={{
            fontFamily: "Playfair Display",
            fontWeight: 700,
            fontSize: "clamp(1.5rem,3vw,2.2rem)",
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "-.01em",
          }}
        >
          amelesusu@gmail.com
        </a>
      </div>
    </footer>
  );
}
