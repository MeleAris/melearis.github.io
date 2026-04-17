import { posts } from "../constants/content";
import FadeIn from "./FadeIn";

export default function Blog() {
  return (
    <section
      id="blog"
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
            ✦ Blogs
          </p>
          <h2
            style={{
              fontFamily: "Playfair Display",
              fontSize: "clamp(1.8rem,4vw,3rem)",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "2.5rem",
            }}
          >
            Design Insights & Trends
          </h2>
        </FadeIn>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "1.5rem",
          }}
        >
          {posts.map((post, index) => (
            <FadeIn key={post.title} delay={index * 0.12}>
              <div
                style={{
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform .3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    height: 200,
                    background: post.color,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg,rgba(255,255,255,.4) 0%,transparent 60%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      display: "flex",
                      gap: ".5rem",
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
                      {post.tag}
                    </span>
                    <span
                      style={{
                        background: "rgba(255,255,255,.8)",
                        color: "var(--ink-soft)",
                        padding: ".25rem .65rem",
                        borderRadius: "2rem",
                        fontSize: ".65rem",
                      }}
                    >
                      {post.read}
                    </span>
                  </div>
                </div>
                <div
                  style={{ padding: "1.25rem", background: "var(--card-bg)" }}
                >
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: ".9rem",
                      lineHeight: 1.45,
                    }}
                  >
                    {post.title}
                  </p>
                  <a
                    href="#"
                    style={{
                      display: "inline-block",
                      marginTop: ".75rem",
                      fontSize: ".78rem",
                      color: "var(--accent)",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
