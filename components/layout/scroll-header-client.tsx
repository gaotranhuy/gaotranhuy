'use client';

import * as React from 'react';

export function ScrollHeaderClient() {
  React.useEffect(() => {
    const header = document.querySelector('header.sticky');
    if (!header) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          header.classList.add(
            'shadow-md',
            'sm:bg-background/80',
            'sm:backdrop-blur'
          );
        } else {
          header.classList.remove(
            'shadow-md',
            'sm:bg-background/80',
            'sm:backdrop-blur'
          );
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
