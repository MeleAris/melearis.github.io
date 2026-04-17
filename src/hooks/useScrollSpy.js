import { useEffect, useState } from 'react';

const SECTION_IDS = [
  'home-section',
  'about-section',
  'skills-section',
  'services-section',
  'contact-section',
];

export function useScrollSpy(offset = 100) {
  const [activeId, setActiveId] = useState('home-section');

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + offset;
      let current = 'home-section';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= y) {
          current = id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [offset]);

  return activeId;
}
