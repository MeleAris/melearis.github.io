import FadeIn from "./FadeIn";
import { useGallery } from "../hooks/useGallery";

export default function GalleryStrip() {
  const { items } = useGallery();

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="section-pad-sm"
      aria-label="Certifications"
      style={{ padding: "2rem 3rem 4rem", overflow: "hidden" }}
    >
      <div
        className="gallery-row"
        style={{
          display: "flex",
          gap: "1.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {items.map((item, index) => {
          const cardStyle = {
            borderRadius: "1.5rem",
            overflow: "hidden",
            aspectRatio: "4/3",
            background: item.imageUrl
              ? `${item.bg} url(${item.imageUrl}) center/cover no-repeat`
              : item.bg,
            position: "relative",
            cursor: item.href ? "pointer" : "default",
            display: "block",
            textDecoration: "none",
            color: "inherit",
          };

          const label = (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,.2) 0%, transparent 60%)",
                }}
              />
              {item.href ? (
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "var(--ink)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                  }}
                  aria-hidden="true"
                >
                  ↗
                </div>
              ) : null}
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  fontSize: ".75rem",
                  color: "rgba(0,0,0,.5)",
                }}
              >
                {item.label}
              </div>
            </>
          );

          return (
            <FadeIn
              key={item.id ?? `${item.label}-${index}`}
              delay={index * 0.15}
              style={{ flex: 1 }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  style={cardStyle}
                  aria-label={`Certification ${item.label}`}
                >
                  {label}
                </a>
              ) : (
                <div style={cardStyle} aria-label={`Certification ${item.label}`}>
                  {label}
                </div>
              )}
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
