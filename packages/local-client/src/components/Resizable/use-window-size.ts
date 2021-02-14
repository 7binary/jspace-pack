import { useEffect, useState } from 'react';

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let timer: any;

    const handleResize = () => {
      // Debouncing - механизм предотвращения повторного срабатывания в интервале 100мс
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}
