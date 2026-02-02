export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* HCS Logo - recreating the interlocking hearts design */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent"
      >
        {/* Top left heart */}
        <path
          d="M25 35 Q25 20 40 20 Q55 20 55 35 Q55 50 40 65 Q25 50 25 35"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Top right heart */}
        <path
          d="M75 35 Q75 20 60 20 Q45 20 45 35 Q45 50 60 65 Q75 50 75 35"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom left heart */}
        <path
          d="M25 65 Q25 50 40 50 Q55 50 55 65 Q55 80 40 95 Q25 80 25 65"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom right heart */}
        <path
          d="M75 65 Q75 50 60 50 Q45 50 45 65 Q45 80 60 95 Q75 80 75 65"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Center connecting lines */}
        <circle cx="50" cy="50" r="8" fill="currentColor" />
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-foreground">HABAEB</span>
        <span className="text-[10px] tracking-[0.2em] text-muted uppercase">Creative Solutions</span>
      </div>
    </div>
  );
}
