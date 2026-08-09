import { useMemo } from "react";
import IconMedia from "./IconMedia";
import { useStackLogos } from "../hooks/useStackLogos";

export default function HeroOrbit({
  logos: logosProp,
  placeOnHero = true,
  className = "",
}) {
  const { logos: fetchedLogos } = useStackLogos();
  const logos = logosProp ?? fetchedLogos;

  const displayLogos = useMemo(
    () =>
      logos.filter(
        (logo) =>
          Boolean(logo.placeOnHero) === placeOnHero &&
          (logo.iconSvg || logo.iconUrl),
      ),
    [logos, placeOnHero],
  );

  if (displayLogos.length === 0) return null;

  return (
    <div
      className={["hero-stack", className].filter(Boolean).join(" ")}
      aria-label={placeOnHero ? "Stack technique" : "Compétences techniques"}
    >
      <ul className="hero-stack__list">
        {displayLogos.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="hero-stack__item"
            title={item.name}
            style={{ "--delay": `${index * 0.06}s` }}
          >
            <span className="hero-stack__badge">
              <IconMedia
                iconSvg={item.iconSvg}
                iconUrl={item.iconUrl}
                alt={item.name}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
