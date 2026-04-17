import { useEffect, useRef, useState } from 'react';

export function useNavbarScroll() {
  const [scrolled, setScrolled] = useState(false);
  const [awake, setAwake] = useState(false);
  const [sleep, setSleep] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const st = window.scrollY;
      const wasAbove350 = lastY.current > 350;
      lastY.current = st;

      setScrolled(st > 150);
      if (st < 150) {
        setSleep(false);
      }
      if (st > 350) {
        setAwake(true);
        setSleep(false);
      } else if (st < 350 && wasAbove350) {
        setAwake(false);
        setSleep(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrolled, awake, sleep };
}
