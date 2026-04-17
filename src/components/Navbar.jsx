import { useState } from "react";
import maAvatar from "../../img/ma.png";
import { HEADER_SCROLL_OFFSET } from "../constants/layout";
import { useScrollSpy } from "../hooks/useScrollSpy";

const NAV_LINKS = [
  { href: "#about-section", label: "À propos", id: "about-section" },
  { href: "#skills-section", label: "Compétences", id: "skills-section" },
  { href: "#services-section", label: "Réalisations", id: "services-section" },
  { href: "#services-section", label: "Services", id: "services-section" },
];

function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

const linkBase =
  "text-[13px] font-medium tracking-[0.06em] transition-colors duration-200 border-b border-transparent pb-0.5";

export default function Navbar() {
  const activeId = useScrollSpy(HEADER_SCROLL_OFFSET);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollToHash(href);
  };

  const onContactClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollToHash("#contact-section");
  };

  const navLinkClass = (id) => {
    const active = activeId === id;
    return [
      linkBase,
      active
        ? "text-primary border-primary px-2 py-1"
        : "text-body/85 hover:text-primary hover:border-primary/25 px-2 py-1",
    ].join(" ");
  };

  return (
    <header
      className="site-navbar-target sticky top-0 z-50 w-full border-b border-primary/8 bg-white"
      id="site-header"
    >
      <div className="mx-auto flex min-h-[68px] max-w-[1200px] items-center justify-between gap-4 px-3 sm:px-4 lg:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-6">
          <button
            type="button"
            className="shrink-0 transition-opacity hover:opacity-75"
            aria-label="Retour à l’accueil"
            onClick={(e) => onNavClick(e, "#home-section")}
          >
            <img
              src={maAvatar}
              alt=""
              width={36}
              height={36}
              className="block h-9 w-auto max-h-9 object-contain object-left"
              decoding="async"
            />
          </button>

          <nav
            className="hidden min-w-0 items-center gap-x-10 md:flex lg:gap-x-14"
            aria-label="Navigation"
          >
            {NAV_LINKS.map(({ href, label, id }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => onNavClick(e, href)}
                className={navLinkClass(id)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <a
            href="#contact-section"
            onClick={onContactClick}
            className={[
              linkBase,
              "hidden md:inline",
              activeId === "contact-section"
                ? "text-secondary border-secondary"
                : "text-body/85 hover:text-secondary hover:border-secondary/35",
            ].join(" ")}
          >
            Me contacter
          </a>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center border border-primary/15 text-primary transition-colors hover:border-primary/30 hover:text-secondary md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="fa fa-bars text-[14px]" aria-hidden="true" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="border-t border-primary/6 bg-white px-3 py-8 sm:px-4 md:hidden"
        >
          <nav className="flex flex-col gap-8" aria-label="Menu mobile">
            {NAV_LINKS.map(({ href, label, id }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => onNavClick(e, href)}
                className={navLinkClass(id)}
              >
                {label}
              </a>
            ))}
            <a
              href="#contact-section"
              onClick={onContactClick}
              className={[
                linkBase,
                activeId === "contact-section"
                  ? "text-secondary border-secondary"
                  : "text-body/85 hover:text-secondary hover:border-secondary/35",
              ].join(" ")}
            >
              Me contacter
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
