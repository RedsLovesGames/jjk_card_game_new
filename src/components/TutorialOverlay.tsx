import React, { useEffect, useState } from 'react';
import { Button } from '@/components/design-system';
import { Card } from '@/components/design-system';

interface TutorialOverlayProps {
  pageKey: string;
  title: string;
  steps: string[];
}

const STORAGE_KEY = 'jjk_tutorial_seen_pages';

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ pageKey, title, steps }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const seenPages: string[] = raw ? JSON.parse(raw) : [];
    if (!seenPages.includes(pageKey)) {
      setOpen(true);
    }
  }, [pageKey]);

  const dismiss = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const seenPages: string[] = raw ? JSON.parse(raw) : [];
    if (!seenPages.includes(pageKey)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...seenPages, pageKey]));
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-xl border-slate-700 bg-slate-900 p-6 text-white">
        <h2 className="mb-3 text-2xl font-bold">{title}</h2>
        <ul className="mb-5 list-disc space-y-2 pl-5 text-sm text-slate-200">
          {steps.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={dismiss}>Got it</Button>
        </div>
      </Card>
    </div>
  );
};
