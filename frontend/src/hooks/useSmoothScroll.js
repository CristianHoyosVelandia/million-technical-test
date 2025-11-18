import { useCallback } from 'react';

// Custom Hook - Smooth Scroll Optimizado
// Proporciona scroll suave optimizado usando requestAnimationFrame
// para mejor rendimiento que CSS scroll-behavior.
export const useSmoothScroll = () => {
  const scrollToTop = useCallback((duration = 300) => {
    const start = window.pageYOffset;
    const startTime = performance.now();

    const scroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutCubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, start * (1 - easeOut));

      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  }, []);

  return { scrollToTop };
};
