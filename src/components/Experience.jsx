import { experiences } from "../constants/content";
import FadeIn from "./FadeIn";

export default function Experience() {
  return (
    <section
      id="services"
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
              ✦ Experience
            </p>
            <h2
              style={{
                fontFamily: "Playfair Display",
                fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              Explore My Design Journey
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
              Over the past 4+ years, I&apos;ve had the opportunity to work on a
              wide range of design projects, collaborating with diverse teams
              and clients to bring creative visions to life.
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
              Book a Call →
            </a>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(0,0,0,.08)" }}>
          {experiences.map((experience, index) => (
            <FadeIn key={experience.company + index} delay={index * 0.1}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 1fr auto",
                  alignItems: "center",
                  gap: "2rem",
                  padding: "1.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                  cursor: "pointer",
                  transition: "background .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.paddingLeft = "1rem";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.paddingLeft = "0";
                }}
              >
                <div>
                  <p style={{ fontWeight: 500, fontSize: ".95rem" }}>
                    {experience.company}
                  </p>
                  <p style={{ fontSize: ".75rem", color: "var(--ink-soft)" }}>
                    {experience.location}
                  </p>
                  <p
                    style={{
                      fontSize: ".72rem",
                      color: "var(--ink-soft)",
                      marginTop: ".25rem",
                    }}
                  >
                    {experience.period}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: ".82rem",
                    color: "var(--ink-soft)",
                    lineHeight: 1.55,
                  }}
                >
                  {experience.role}
                </p>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  {experience.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: ".3rem .75rem",
                        borderRadius: "2rem",
                        fontSize: ".7rem",
                        background:
                          tag === "UX" ? "var(--ink)" : "var(--accent)",
                        color: "#fff",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
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
