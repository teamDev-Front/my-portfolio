import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionTitle({ title, subtitle, centered = true, className = '' }: SectionTitleProps) {
  return (
    <div className={cn(centered && 'text-center', 'mb-12 lg:mb-16', className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
