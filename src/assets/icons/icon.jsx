export function BaseplateIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Plate */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Bolt holes */}
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
      <circle cx="17" cy="7" r="1.5" fill="currentColor" />
      <circle cx="7" cy="17" r="1.5" fill="currentColor" />
      <circle cx="17" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function OpeningIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer panel */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Opening cut */}
      <rect
        x="8"
        y="7"
        width="8"
        height="10"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Handle / latch */}
      <circle cx="14.5" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function FoundationIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Center line (dashed) */}
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />

      {/* Pole */}
      <rect
        x="10"
        y="2"
        width="4"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Foundation block */}
      <rect
        x="3"
        y="8"
        width="18"
        height="10"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Hatching (diagonal lines) */}
      <line
        x1="4"
        y1="17"
        x2="9"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="7"
        y1="17"
        x2="12"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="10"
        y1="17"
        x2="15"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="13"
        y1="17"
        x2="18"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
