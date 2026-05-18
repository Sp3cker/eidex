type PokeballStatusIconProps = {
  state: "hidden" | "open" | "closed";
};

const stateClasses = {
  open: "pokeball-status-icon-open",
  closed: "pokeball-status-icon-closed",
};

export function PokeballStatusIcon({ state }: PokeballStatusIconProps) {
  if (state === "hidden") {
    return null;
  }

  const isOpen = state === "open";

  return (
    <span
      key={state}
      aria-hidden="true"
      className={`pokeball-status-icon ${stateClasses[state]}`}
    >
      <svg viewBox="0 0 32 32" role="img" focusable="false">
        <circle cx="16" cy="16" r="13" fill="#f8fafc" stroke="#1f2937" strokeWidth="2" />
        <path
          d={isOpen ? "M4 16c2-7 7-11 12-11s10 4 12 11" : "M4 16a13 13 0 0 1 24 0"}
          fill="#ef4444"
          stroke="#1f2937"
          strokeWidth="2"
        />
        <path d="M3 16h26" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <circle cx="16" cy="16" r={isOpen ? "4.5" : "5"} fill="#f8fafc" stroke="#1f2937" strokeWidth="2" />
        {isOpen && (
          <path
            d="M9 23c3 3 11 3 14 0"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </span>
  );
}
