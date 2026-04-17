import { useLayoutEffect } from 'react';

function percentageToDegrees(percentage) {
  return (percentage / 100) * 360;
}

export function useProgressCircles() {
  useLayoutEffect(() => {
    document.querySelectorAll('.progress').forEach((progressEl) => {
      const raw = progressEl.getAttribute('data-value');
      const value = raw != null ? parseInt(raw, 10) : 0;
      const left = progressEl.querySelector('.progress-left .progress-bar');
      const right = progressEl.querySelector('.progress-right .progress-bar');
      if (!left || !right) return;

      if (value > 0) {
        if (value <= 50) {
          right.style.transform = `rotate(${percentageToDegrees(value)}deg)`;
        } else {
          right.style.transform = 'rotate(180deg)';
          left.style.transform = `rotate(${percentageToDegrees(value - 50)}deg)`;
        }
      }
    });
  }, []);
}
