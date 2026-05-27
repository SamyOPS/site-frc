type Props = {
  className?: string;
  label?: string;
  variant?: "light" | "dark";
  fill?: boolean;
  showGrid?: boolean;
};

export function Placeholder({
  className = "",
  label,
  variant = "light",
  fill = false,
  showGrid = false,
}: Props) {
  const isDark = variant === "dark";
  const bgClass = isDark ? "bg-ink" : "bg-light";
  const borderClass = isDark ? "border-white/10" : "border-rule";
  const iconClass = isDark ? "text-white/25" : "text-gray/50";
  const labelClass = isDark ? "text-white/40" : "text-gray/70";

  return (
    <div
      aria-hidden="true"
      className={`${
        fill ? "absolute inset-0" : ""
      } ${bgClass} border ${borderClass} relative flex items-center justify-center overflow-hidden ${className}`}
    >
      {showGrid && (
        <div className="absolute inset-0 grid-bg opacity-40" />
      )}
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        className={`${iconClass} relative`}
      >
        <rect x="3" y="3" width="18" height="18" />
        <circle cx="9" cy="9" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      {label && (
        <span
          className={`absolute bottom-3 left-3 right-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] ${labelClass}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
