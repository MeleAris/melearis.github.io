import FadeIn from "./FadeIn";

export default function About() {
  return (
    <section
      id="a-propos"
      className="section-pad-lg"
      style={{ padding: "6rem 3rem", maxWidth: 1100, margin: "0 auto" }}
    >
      <div
        className="grid-2-col"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        <FadeIn>
          <p
            style={{
              fontSize: ".7rem",
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: ".75rem",
            }}
          >
            A propos
          </p>
          <h2
            style={{
              fontFamily: "Playfair Display",
              fontSize: "clamp(1.8rem,4vw,3rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}
          >
            Je livre des solutions qui tiennent en prod
          </h2>
          <p
            style={{
              color: "var(--ink-soft)",
              lineHeight: 1.75,
              fontSize: ".95rem",
              marginBottom: "1.5rem",
            }}
          >
            Ingénieur Full-Stack & DevOps. Applications mobiles, APIs robustes,
            pipelines CI/CD, orchestration Kubernetes — je couvre l'ensemble du
            cycle de vie logiciel, du code à la production.
          </p>
          <div className="about-stats" style={{ display: "flex", gap: "2rem" }}>
            {[
              ["3+", "Années d'expérience"],
              ["5+", "Stack techniques maîtrisées"],
            ].map(([value, label]) => (
              <div
                key={value}
                style={{
                  padding: "1.2rem 1.5rem",
                  background: "var(--card-bg)",
                  borderRadius: "1rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "Playfair Display",
                    fontWeight: 700,
                    fontSize: "1.7rem",
                    color: "var(--accent)",
                  }}
                >
                  {value}
                </p>
                <p
                  style={{
                    fontSize: ".75rem",
                    color: "var(--ink-soft)",
                    marginTop: ".25rem",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div
              style={{
                gridColumn: "1/-1",
                padding: "1.5rem",
                background: "var(--ink)",
                color: "#fff",
                borderRadius: "1.5rem",
              }}
            >
              <p style={{ fontSize: ".85rem", lineHeight: 1.65 }}>
                Ingénieur logiciel avec une double expertise développement et
                infrastructure, je conçois des applications scalables,
                sécurisées et maintenables sur l'ensemble de la stack — mobile
                Flutter, backend NestJS/Spring Boot et déploiements
                conteneurisés sur Kubernetes.
              </p>
            </div>
            <div
              style={{
                padding: "1.5rem",
                background: "var(--accent)",
                borderRadius: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>✦</span>
            </div>
            <div
              style={{
                padding: "1.5rem",
                background: "var(--card-bg)",
                borderRadius: "1.5rem",
              }}
            >
              <p
                style={{
                  fontSize: ".82rem",
                  color: "var(--ink-soft)",
                  lineHeight: 1.65,
                }}
              >
                Au-delà du code, je pilote des projets, encadre des développeurs
                juniors et m'assure que la livraison technique s'aligne avec les
                objectifs métier.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
