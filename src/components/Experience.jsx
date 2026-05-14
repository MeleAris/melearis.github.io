import { experiences } from "../constants/content";
import FadeIn from "./FadeIn";

export default function Experience() {
  return (
    <section
      id="experience"
      style={{ padding: "5rem 3rem", background: "var(--white)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: ".7rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: ".6rem",
              }}
            >
              ✦ Expérience
            </p>
            <h2
              style={{
                fontFamily: "Playfair Display",
                fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              Explorer mon parcours
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <p
              style={{
                color: "var(--ink-soft)",
                lineHeight: 1.7,
                fontSize: ".9rem",
                marginBottom: "1rem",
              }}
            >
              J&apos;ai travaillé sur des projets à fort enjeu : plateforme
              d&apos;identité biométrique nationale, système électoral,
              applications métier avec intégrations d&apos;API tierces.
              J&apos;apporte à chaque projet une rigueur et une capacité à
              collaborer avec différentes équipes.
            </p>
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                fontSize: ".82rem",
                fontWeight: 500,
                textDecoration: "none",
                color: "var(--ink)",
              }}
            >
              Contactez-moi →
            </a>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(0,0,0,.08)" }}>
          {experiences.map((experience, index) => (
            <FadeIn key={experience.company + index} delay={index * 0.1}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(200px, 26%) minmax(0, 1fr) minmax(140px, 220px)",
                  alignItems: "start",
                  gap: "2rem",
                  padding: "1.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                  cursor: "pointer",
                  transition: "background .2s, padding-left .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.paddingLeft = "1rem";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.paddingLeft = "0";
                }}
              >
                {/* Colonne gauche : entreprise, poste, période — ne rétrécit pas */}
                <div style={{ minWidth: 0, flexShrink: 0 }}>
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: ".95rem",
                      marginBottom: ".35rem",
                    }}
                  >
                    {experience.company}
                  </p>
                  <p
                    style={{
                      fontSize: ".82rem",
                      color: "var(--ink)",
                      lineHeight: 1.45,
                      marginBottom: ".35rem",
                    }}
                  >
                    {experience.role}
                  </p>
                  <p style={{ fontSize: ".72rem", color: "var(--ink-soft)" }}>
                    {experience.period}
                  </p>
                </div>

                {/* Milieu : description — prend l’espace restant, texte qui wrap */}
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: ".82rem",
                      color: "var(--ink-soft)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {experience.description}
                  </p>
                </div>

                {/* Droite : tags — colonne à largeur bornée, tags qui passent à la ligne sans comprimer le milieu */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".4rem",
                    justifyContent: "flex-end",
                    alignContent: "flex-start",
                    minWidth: 0,
                    maxWidth: "100%",
                    flexShrink: 0,
                  }}
                >
                  {experience.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: ".3rem .75rem",
                        borderRadius: "2rem",
                        fontSize: ".7rem",
                        background: tag.includes("**")
                          ? "var(--ink)"
                          : "var(--accent)",
                        color: "#fff",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {tag.replace("**", "")}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
