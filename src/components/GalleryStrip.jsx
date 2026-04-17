import FadeIn from "./FadeIn";

export default function GalleryStrip() {
  const items = [
    { bg: "#d4c4a8", label: "Halo Digital Agency website" },
    { bg: "#c0cac0", label: "Halo Digital Agency website" },
    { bg: "#ccc4b8", label: "Digital Agency website" },
  ];

  return (
    <section style={{ padding: "2rem 3rem 4rem", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {items.map((item, index) => (
          <FadeIn
            key={item.label + index}
            delay={index * 0.15}
            style={{ flex: 1 }}
          >
            <div
              style={{
                borderRadius: "1.5rem",
                overflow: "hidden",
                aspectRatio: "4/3",
                background: item.bg,
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,.2) 0%, transparent 60%)",
                }}
              />
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
              >
                ↗
              </div>
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
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
