import { experiences } from "../constants/content";
import FadeIn from "./FadeIn";
import ContactButton from "./ContactButton";

function ProjectCard({ project }) {
  return (
    <div className="experience-project">
      <div className="experience-project__header">
        <p
          className="experience-project__title"
          style={{
            fontWeight: 500,
            fontSize: ".88rem",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {project.title}
        </p>
        <div className="experience-project__tags">
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: ".25rem .65rem",
                borderRadius: "2rem",
                fontSize: ".68rem",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="experience-project__details">
        <div className="experience-project__details-inner">
          <p
            style={{
              fontSize: ".8rem",
              color: "var(--ink-soft)",
              lineHeight: 1.55,
              marginBottom: ".65rem",
            }}
          >
            {project.description}
          </p>
          {project.tasks?.length > 0 && (
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.1rem",
                display: "grid",
                gap: ".35rem",
              }}
            >
              {project.tasks.map((task) => (
                <li
                  key={task}
                  style={{
                    fontSize: ".75rem",
                    color: "var(--ink-soft)",
                    lineHeight: 1.5,
                  }}
                >
                  {task}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="section-pad"
      style={{ padding: "5rem 3rem", background: "var(--white)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          className="grid-2-col"
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
            <ContactButton
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                fontSize: ".82rem",
                fontWeight: 500,
                color: "var(--ink)",
              }}
            >
              Contactez-moi →
            </ContactButton>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(0,0,0,.08)" }}>
          {experiences.map((experience, index) => (
            <FadeIn key={experience.company + index} delay={index * 0.1}>
              <div
                className="experience-item"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(200px, 26%) minmax(0, 1fr)",
                  alignItems: "start",
                  gap: "2rem",
                  padding: "1.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
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
                  <p
                    style={{
                      fontSize: ".72rem",
                      color: "var(--ink-soft)",
                      marginBottom: ".75rem",
                    }}
                  >
                    {experience.period}
                  </p>
                  {experience.tags?.length > 0 && (
                    <div
                      className="experience-tags"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: ".35rem",
                        justifyContent: "flex-start",
                      }}
                    >
                      {experience.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: ".25rem .6rem",
                            borderRadius: "2rem",
                            fontSize: ".65rem",
                            background: tag.includes("**")
                              ? "var(--ink)"
                              : "var(--card-bg)",
                            color: tag.includes("**") ? "#fff" : "var(--ink-soft)",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {tag.replace("**", "")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    minWidth: 0,
                    display: "grid",
                    gap: ".75rem",
                  }}
                >
                  {experience.projects?.map((project) => (
                    <ProjectCard key={project.title + project.description} project={project} />
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
