import React from 'react';
import { cn } from '@/lib/utils';

interface CardFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function CardFrame({ className, interactive = false, ...props }: CardFrameProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-frame border border-surface-700/70 bg-gradient-to-b from-surface-700 to-surface-900 shadow-card',
        interactive && 'cursor-pointer transition-all duration-base hover:-translate-y-1 hover:border-brand-500/60 hover:shadow-elevated',
        className,
      )}
      {...props}
    />
  );
}
