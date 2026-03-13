import React from 'react';
import { cn } from '@/lib/utils';
import { GlassPanel } from './GlassPanel';

type FilterBarProps = React.HTMLAttributes<HTMLDivElement>;

export function FilterBar({ className, children, ...props }: FilterBarProps) {
  return (
    <GlassPanel
      className={cn('mb-ds6 flex flex-col gap-3 p-ds4 lg:flex-row lg:items-center', className)}
      {...props}
    >
      {children}
    </GlassPanel>
  );
}
