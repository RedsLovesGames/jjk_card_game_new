import React from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function HeroSection({ title, subtitle, children, className }: HeroSectionProps) {
  return (
    <section className={cn('relative mb-ds12 text-center', className)}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="relative">
        <h1 className="text-6xl font-black uppercase tracking-tight text-transparent md:text-8xl bg-gradient-to-r from-red-500 via-white to-brand-400 bg-clip-text">
          {title}
        </h1>
        {subtitle && <p className="mt-4 text-sm uppercase tracking-[0.3em] text-slate-300">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
