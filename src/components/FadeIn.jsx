import { useEffect, useRef, useState } from 'react';

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold },
    );

    if (ref.current) {
      obs.observe(ref.current);
    }

    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
};

export default function FadeIn({ children, delay = 0, y = 32, style = {}, className = '' }) {
  const [ref, visible] = useInView();

  return (
    <div
      ref={ref}
      className={className || undefined}
      style={{
        transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
