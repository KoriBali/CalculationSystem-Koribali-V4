import { useLayoutEffect, useRef } from "react";

// Textarea that grows with its text, from `rows` lines up to `maxHeight` px;
// past that it stops growing and scrolls instead. Any other textarea prop
// (onChange, placeholder, aria-*, …) is passed through.
export function AutoGrowTextarea({
  value,
  rows = 3,
  maxHeight = 240,
  className = "",
  ...rest
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Measure from scratch so it can also shrink when text is removed.
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value, maxHeight]);

  return (
    <textarea
      ref={ref}
      rows={rows}
      value={value}
      className={`${className} resize-none leading-relaxed`}
      {...rest}
    />
  );
}
