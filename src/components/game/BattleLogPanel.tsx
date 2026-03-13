import React, { useEffect, useRef } from 'react';
import { Waves } from 'lucide-react';
import { GlassPanel } from '@/components/design-system';

export const BattleLogPanel: React.FC<{ battleLog: string[] }> = ({ battleLog }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [battleLog]);

  return (
    <GlassPanel className="w-56 border-r border-slate-800 flex flex-col rounded-none">
      <div className="p-3 border-b border-slate-800 text-xs font-bold uppercase tracking-tighter text-slate-500 flex items-center gap-2">
        <Waves size={12} /> Battle Log
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-[10px] font-mono">
        {battleLog.slice(-50).map((log, i) => <div key={i} className="text-slate-500 border-l-2 border-slate-700 pl-2 py-0.5">{log}</div>)}
        <div ref={logEndRef} />
      </div>
    </GlassPanel>
  );
};
