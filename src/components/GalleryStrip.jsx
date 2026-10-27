import FadeIn from "./FadeIn";
import { useGallery } from "../hooks/useGallery";
import { formatBadgePeriod } from "../services/badgeService";

const CARD_BASE = {
  borderRadius: "1.5rem",
  overflow: "hidden",
  aspectRatio: "4/3",
  position: "relative",
  display: "block",
  textDecoration: "none",
  color: "inherit",
  height: "100%",
};

const INNER_FILL = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
};

const CLAMP_2 = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

function ArrowLink({ show }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        right: 12,
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "var(--ink)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
      }}
      aria-hidden="true"
    >
      ↗
    </div>
  );
}

function ImageCard({ item }) {
  return (
    <div
      style={{
        ...INNER_FILL,
        background: item.mediaUrl
          ? `${item.bg} url(${item.mediaUrl}) center/cover no-repeat`
          : item.bg,
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
      <ArrowLink show={Boolean(item.href)} />
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          right: item.href ? 56 : 12,
          fontSize: ".75rem",
          lineHeight: 1.4,
          color: "rgba(0,0,0,.55)",
        }}
      >
        {item.label}
      </div>
    </div>
  );
}

function BadgeCard({ item }) {
  const period = formatBadgePeriod(item.badge);

  return (
    <div
      style={{
        ...INNER_FILL,
        background: "#fff",
        border: "1px solid rgba(0,0,0,.07)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.85rem 0.85rem 0.15rem",
        }}
      >
        {item.badge?.imageUrl ? (
          <img
            src={item.badge.imageUrl}
            alt={item.badge.title || item.label}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <span
            style={{
              fontSize: ".7rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,.35)",
            }}
          >
            Badge
          </span>
        )}
      </div>
      <div
        style={{
          padding: "0 .9rem .85rem",
          display: "flex",
          flexDirection: "column",
          gap: ".1rem",
          paddingRight: item.href ? 52 : undefined,
        }}
      >
        <span style={{ fontSize: ".78rem", lineHeight: 1.3, ...CLAMP_2 }}>
          {item.label}
        </span>
        {item.badge?.issuer ? (
          <span style={{ fontSize: ".68rem", color: "rgba(0,0,0,.5)", ...CLAMP_2 }}>
            {item.badge.issuer}
          </span>
        ) : null}
        {period ? (
          <span style={{ fontSize: ".66rem", color: "rgba(0,0,0,.4)" }}>{period}</span>
        ) : null}
      </div>
      <ArrowLink show={Boolean(item.href)} />
    </div>
  );
}

function PdfCard({ item }) {
  return (
    <div style={{ ...INNER_FILL, background: "#fff", border: "1px solid rgba(0,0,0,.07)" }}>
      <iframe
        src={`${item.mediaUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
        title={`Aperçu PDF — ${item.label}`}
        loading="lazy"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          pointerEvents: "none",
          background: "#fff",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          padding: ".15rem .45rem",
          borderRadius: ".35rem",
          background: "var(--ink)",
          color: "#fff",
          fontSize: ".58rem",
          letterSpacing: ".08em",
        }}
      >
        PDF
      </span>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "2.2rem .8rem .7rem",
          paddingRight: item.href ? 56 : ".8rem",
          background:
            "linear-gradient(to top, rgba(255,255,255,.96) 45%, rgba(255,255,255,0))",
          fontSize: ".72rem",
          lineHeight: 1.35,
          color: "rgba(0,0,0,.6)",
          ...CLAMP_2,
        }}
      >
        {item.label}
      </div>
      <ArrowLink show={Boolean(item.href)} />
    </div>
  );
}

function CardContent({ item }) {
  if (item.mediaType === "badge") return <BadgeCard item={item} />;
  if (item.mediaType === "pdf" && item.mediaUrl) return <PdfCard item={item} />;
  return <ImageCard item={item} />;
}

export default function GalleryStrip() {
  const { items } = useGallery();

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="certifications"
      className="section-pad"
      aria-label="Certifications"
      style={{ padding: "4rem 3rem", scrollMarginTop: "5rem" }}
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
            ✦ Certifications
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
            Mes certifications
          </h2>
        </FadeIn>

        <div className="gallery-grid">
          {items.map((item, index) => {
            const key = item.id ?? `${item.label}-${index}`;
            const content = <CardContent item={item} />;

            return (
              <FadeIn key={key} delay={index * 0.1}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    style={CARD_BASE}
                    aria-label={`Certification ${item.label}`}
                  >
                    {content}
                  </a>
                ) : (
                  <div style={CARD_BASE} aria-label={`Certification ${item.label}`}>
                    {content}
                  </div>
                )}
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
