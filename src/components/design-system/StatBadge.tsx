import React from 'react';
import { cn } from '@/lib/utils';

interface StatBadgeProps {
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'brand' | 'success' | 'danger';
  className?: string;
}

const toneClasses: Record<NonNullable<StatBadgeProps['tone']>, string> = {
  default: 'border-surface-700 bg-surface-800/80 text-slate-100',
  brand: 'border-brand-500/40 bg-brand-700/20 text-brand-100',
  success: 'border-emerald-500/40 bg-emerald-700/20 text-emerald-200',
  danger: 'border-red-500/40 bg-red-700/20 text-red-200',
};

export function StatBadge({ label, value, tone = 'default', className }: StatBadgeProps) {
  return (
    <div className={cn('rounded-ds border px-ds3 py-ds2 text-center shadow-card', toneClasses[tone], className)}>
      <div className="text-xs uppercase tracking-widest text-slate-400">{label}</div>
      <div className="text-xl font-black">{value}</div>
    </div>
  );
}
