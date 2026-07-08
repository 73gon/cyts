interface LogoProps {
  className?: string;
  /** Hide the wordmark, show only the mark. */
  markOnly?: boolean;
}

export function Logo({ className = '', markOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/blackboard.png"
        alt="Blackboard"
        className="h-9 w-9 shrink-0 object-contain"
        draggable={false}
      />
      {!markOnly && (
        <span className="font-display text-[20px] font-semibold tracking-tight text-ink">
          Blackboard
        </span>
      )}
    </div>
  );
}
