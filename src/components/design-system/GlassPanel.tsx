import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function GlassPanel({ className, elevated, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        'rounded-panel border border-surface-700/70 bg-surface-800/55 backdrop-blur-xl shadow-glass',
        elevated && 'shadow-elevated',
        className,
      )}
      {...props}
    />
  );
}
