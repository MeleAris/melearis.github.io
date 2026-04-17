import { useEffect } from 'react';

export function useAnimateOnScroll() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.ftco-animate');
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add('ftco-animated');
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}
