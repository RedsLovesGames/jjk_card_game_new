import React from 'react';
import { cn } from '@/lib/utils';

interface CardFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  buttonLabel?: string;
}

export function CardFrame({ className, interactive = false, buttonLabel, children, ...props }: CardFrameProps) {
  if (interactive) {
    return (
      <button
        type="button"
        aria-label={buttonLabel}
        className={cn(
          'relative w-full overflow-hidden rounded-frame border border-surface-700/70 bg-gradient-to-b from-surface-700 to-surface-900 text-left shadow-card transition-all duration-base',
          'hover:-translate-y-1 hover:border-brand-500/60 hover:shadow-elevated',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-frame border border-surface-700/70 bg-gradient-to-b from-surface-700 to-surface-900 shadow-card',
        className,
      )}
      {...props}
    />
  );
}
