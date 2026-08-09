import { useServices } from "../hooks/useServices";
import FadeIn from "./FadeIn";

export default function Service() {
  const { services } = useServices();

  return (
    <section
      id="services"
      className="section-pad"
      style={{ padding: "5rem 3rem", background: "var(--white)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <p
            style={{
              fontSize: ".7rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: ".5rem",
              textAlign: "center",
            }}
          >
            ✦ Services
          </p>
          <h2
            style={{
              fontFamily: "Playfair Display",
              fontSize: "clamp(1.8rem,4vw,3rem)",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: ".75rem",
            }}
          >
            Services IT que je peux assurer
          </h2>
          <p
            style={{
              maxWidth: 760,
              margin: "0 auto 2.5rem",
              textAlign: "center",
              color: "var(--ink-soft)",
              fontSize: ".9rem",
              lineHeight: 1.7,
            }}
          >
            De la conception à la production, j&apos;interviens sur les briques
            clées d&apos;un produit digital : architecture, developpement,
            deploiement, securite et exploitation.
          </p>
        </FadeIn>
        <div
          className="grid-3-col"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "1.5rem",
          }}
        >
          {services.map((service, index) => (
            <FadeIn key={service.id ?? service.title} delay={index * 0.1}>
              <div
                style={{
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  transition: "transform .3s",
                  border: "1px solid rgba(0,0,0,.06)",
                  background: "#fff",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="service-card__media"
                  style={{ background: service.color }}
                >
                  {service.imageUrl ? (
                    <img
                      className="service-card__illustration"
                      src={service.imageUrl}
                      alt=""
                    />
                  ) : null}
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      display: "flex",
                      gap: ".5rem",
                      zIndex: 1,
                    }}
                  >
                    <span
                      style={{
                        background: "var(--ink)",
                        color: "#fff",
                        padding: ".25rem .65rem",
                        borderRadius: "2rem",
                        fontSize: ".65rem",
                      }}
                    >
                      {service.category}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: "1.25rem",
                    background: "var(--card-bg)",
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: ".95rem",
                      lineHeight: 1.45,
                      marginBottom: ".5rem",
                    }}
                  >
                    {service.title}
                  </p>
                  <p
                    style={{
                      color: "var(--ink-soft)",
                      fontSize: ".8rem",
                      lineHeight: 1.6,
                      marginBottom: ".9rem",
                    }}
                  >
                    {service.summary}
                  </p>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 1rem",
                      display: "grid",
                      gap: ".4rem",
                    }}
                  >
                    {service.bullets.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontSize: ".75rem",
                          color: "var(--ink)",
                          display: "flex",
                          alignItems: "center",
                          gap: ".45rem",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--accent)",
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: ".35rem" }}
                  >
                    {service.stack.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: ".68rem",
                          padding: ".25rem .55rem",
                          borderRadius: "2rem",
                          border: "1px solid rgba(0,0,0,.15)",
                          color: "var(--ink-soft)",
                          background: "rgba(255,255,255,.7)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
