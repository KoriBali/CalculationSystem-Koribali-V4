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

export function EmptyReport({ width = 160, height = 120 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Folder base */}
      <rect x="20" y="45" width="120" height="70" rx="6" fill="#e2e8f0" />
      <rect x="20" y="38" width="55" height="14" rx="4" fill="#cbd5e1" />
      {/* Document 1 */}
      <rect
        x="45"
        y="30"
        width="52"
        height="68"
        rx="4"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      <rect x="53" y="44" width="36" height="3" rx="1.5" fill="#e2e8f0" />
      <rect x="53" y="52" width="28" height="3" rx="1.5" fill="#e2e8f0" />
      <rect x="53" y="60" width="32" height="3" rx="1.5" fill="#e2e8f0" />
      <rect x="53" y="68" width="20" height="3" rx="1.5" fill="#e2e8f0" />
      {/* Document 2 slightly behind */}
      <rect
        x="62"
        y="24"
        width="52"
        height="68"
        rx="4"
        fill="white"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      <rect x="70" y="38" width="36" height="3" rx="1.5" fill="#e2e8f0" />
      <rect x="70" y="46" width="28" height="3" rx="1.5" fill="#e2e8f0" />
      <rect x="70" y="54" width="32" height="3" rx="1.5" fill="#e2e8f0" />
      {/* Dashed circle — empty state indicator */}
      <circle
        cx="118"
        cy="32"
        r="16"
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <line
        x1="113"
        y1="32"
        x2="123"
        y2="32"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="118"
        y1="27"
        x2="118"
        y2="37"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
