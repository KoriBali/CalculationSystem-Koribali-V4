import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

// Small clickable warning badge for inputs overlaid on a diagram, where a
// permanent error message would overlap the diagram's lines/arrows. Tap or
// click reveals the reason instead of relying on native `title` tooltips,
// which only trigger on mouse hover-and-wait and never on touch devices.
export function FieldErrorHint({ message }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!message) return null;

  return (
    <div ref={ref} className="absolute -top-2.5 -right-2.5 z-20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-5 h-5 rounded-full bg-white"
      >
        <AlertCircle className="w-5 h-5 text-red-500" />
      </button>
      {open && (
        <div className="absolute right-0 top-6 w-max max-w-[180px] bg-red-600 text-white text-xs leading-snug px-2.5 py-1.5 rounded-md shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
}
