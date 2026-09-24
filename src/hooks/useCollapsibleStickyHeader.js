import { useState, useEffect, useCallback } from "react";

// Laptop width and up only. Below this (tablets) the form has almost no side
// margin, so the collapsed pill would sit on top of labels/inputs.
const COLLAPSIBLE_MEDIA_QUERY = "(min-width: 1024px)";

// Scroll distance after which the header is treated as "stuck" and the
// Minimize button appears. At the top of the page the header always shows in
// full — it's in normal flow there and isn't covering anything.
const STUCK_SCROLL_Y = 80;

// Collapsing is always an explicit user action: the choice is not remembered,
// and it resets once the user scrolls back to the top. That way the header
// never folds away on its own while the user is just scrolling.
export function useCollapsibleStickyHeader() {
  const [isStuck, setIsStuck] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(COLLAPSIBLE_MEDIA_QUERY);
    let frame = 0;

    const update = () => {
      frame = 0;
      const stuck = media.matches && window.scrollY > STUCK_SCROLL_Y;
      setIsStuck(stuck);
      if (!stuck) setIsCollapsed(false);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    media.addEventListener("change", scheduleUpdate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      media.removeEventListener("change", scheduleUpdate);
    };
  }, []);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return {
    canCollapse: isStuck,
    isCollapsed: isStuck && isCollapsed,
    toggleCollapsed,
  };
}
