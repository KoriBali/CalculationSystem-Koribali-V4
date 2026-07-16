import { useState, useEffect } from 'react';

let globalScrollDirection = "up";
const listeners = new Set();
let lastScrollY = 0;
let isListening = false;

export const resetScrollDirection = () => {
  globalScrollDirection = "up";
  lastScrollY = window.scrollY > 0 ? window.scrollY : 0;
  listeners.forEach(listener => listener("up"));
};

const updateScrollDirection = () => {
  const scrollY = window.scrollY;
  const direction = scrollY > lastScrollY ? "down" : "up";
  
  // Update state only if direction changed and scrolled past threshold (prevent jitter)
  if (direction !== globalScrollDirection && Math.abs(scrollY - lastScrollY) > 5) {
    globalScrollDirection = direction;
    listeners.forEach(listener => listener(globalScrollDirection));
  }
  
  // Always show header at the very top of the page
  if (scrollY < 20 && globalScrollDirection !== "up") {
    globalScrollDirection = "up";
    listeners.forEach(listener => listener(globalScrollDirection));
  }
  
  lastScrollY = scrollY > 0 ? scrollY : 0;
};

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState(globalScrollDirection);

  useEffect(() => {
    listeners.add(setScrollDirection);
    
    if (!isListening) {
      window.addEventListener("scroll", updateScrollDirection, { passive: true });
      isListening = true;
    }
    
    return () => {
      listeners.delete(setScrollDirection);
      if (listeners.size === 0) {
        window.removeEventListener("scroll", updateScrollDirection);
        isListening = false;
      }
    };
  }, []);

  return scrollDirection;
}
