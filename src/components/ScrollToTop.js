import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Sayfa değişikliklerinde otomatik olarak sayfanın en üstüne kaydırır
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop; 