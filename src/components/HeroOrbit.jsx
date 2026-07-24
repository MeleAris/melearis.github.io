import { useMemo } from "react";
import { stackLogos } from "../constants/stackLogos";

const SQRT3 = Math.sqrt(3);
const BADGE_W = 52;
const BADGE_H = 60;
const HEX_VERTEX_R = BADGE_H / 2;
const GAP = 8;
const AXIAL_SCALE = HEX_VERTEX_R + GAP / 2;
const PADDING = 10;

function hexCellCount(radius) {
  if (radius <= 1) return 1;
  return 1 + 3 * (radius - 1) * radius;
}

function minRadiusForCount(count) {
  let radius = 1;
  while (hexCellCount(radius) < count) radius += 1;
  return radius;
}

function hexDistance(q, r) {
  const s = -q - r;
  return (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2;
}

function generateHexCoords(count) {
  const radius = minRadiusForCount(count);
  const coords = [];

  for (let q = -(radius - 1); q <= radius - 1; q += 1) {
    for (let r = -(radius - 1); r <= radius - 1; r += 1) {
      const s = -q - r;
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) < radius) {
        coords.push({ q, r, dist: hexDistance(q, r) });
      }
    }
  }

  coords.sort((a, b) => a.dist - b.dist || a.r - b.r || a.q - b.q);

  return { coords: coords.slice(0, count), radius };
}

function axialToPixel(q, r) {
  return {
    x: AXIAL_SCALE * (SQRT3 * q + (SQRT3 / 2) * r),
    y: AXIAL_SCALE * ((3 / 2) * r),
  };
}

export function layoutHexCluster(logos) {
  if (logos.length === 0) {
    return { items: [], width: 0, height: 0 };
  }

  const { coords } = generateHexCoords(logos.length);
  const pixels = coords.map((coord) => axialToPixel(coord.q, coord.r));

  const xs = pixels.map((p) => p.x);
  const ys = pixels.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const clusterPad = HEX_VERTEX_R + GAP + PADDING;
  const width = Math.ceil(maxX - minX + clusterPad * 2);
  const height = Math.ceil(maxY - minY + clusterPad * 2);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const items = logos.map((logo, index) => ({
    ...logo,
    x: pixels[index].x - centerX + width / 2,
    y: pixels[index].y - centerY + height / 2,
    delay: index * 0.1,
  }));

  return { items, width, height };
}

function HexBadge({ children }) {
  return (
    <div className="hero-hex__badge">
      <svg
        className="hero-hex__badge-shape"
        viewBox="0 0 52 60"
        aria-hidden="true"
      >
        <path
          d="M26 5 L42.5 14 Q47 17 47 22 L47 38 Q47 43 42.5 46 L26 55 L9.5 46 Q5 43 5 38 L5 22 Q5 17 9.5 14 Z"
          className="hero-hex__badge-path"
        />
      </svg>
      <div className="hero-hex__badge-icon">{children}</div>
    </div>
  );
}

export default function HeroOrbit() {
  const { items, width, height } = useMemo(
    () => layoutHexCluster(stackLogos),
    [],
  );

  if (items.length === 0) return null;

  return (
    <div
      className="hero-hex"
      aria-label="Stack technique"
      style={{
        "--hex-width": width,
        "--hex-height": height,
        "--badge-w": BADGE_W,
        "--badge-h": BADGE_H,
      }}
    >
      <div className="hero-hex__grid">
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="hero-hex__node"
            title={item.name}
            style={{
              "--delay": `${item.delay}s`,
              "--x": `${item.x}px`,
              "--y": `${item.y}px`,
              left: item.x,
              top: item.y,
            }}
          >
            <HexBadge>{item.icon}</HexBadge>
          </div>
        ))}
      </div>
    </div>
  );
}
