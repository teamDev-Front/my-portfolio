import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image src="/images/habaeb-creative-solutions-logo.svg" alt="HABAEB Logo" width={40} height={40} />
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight  text-foreground">HABAEB</span>
        <span className="text-[11px] tracking-[0.2em] text-muted uppercase">Creative Solutions</span>
      </div>
    </div>
  );
}
