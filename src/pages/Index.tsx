import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { TutorialOverlay } from '@/components/TutorialOverlay';

const flow = [
  { label: 'Home', detail: 'Choose your path', cta: 'Go to collection', path: '/collection' },
  { label: 'Collection', detail: 'Discover cards', cta: 'Discover cards', path: '/collection' },
  { label: 'Deck Builder', detail: 'Assemble your deck', cta: 'Assemble deck', path: '/deck-builder' },
  { label: 'Battle', detail: 'Play against AI', cta: 'Start battle', path: '/battle' },
  { label: 'Results', detail: 'Choose your next action', cta: 'See results', path: '/results' },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <TutorialOverlay
        pageKey="home"
        title="Quick Tour"
        steps={[
          'Follow the flow from Collection → Deck Builder → Battle → Results.',
          'Use Add to deck in Collection to build your draft across pages.',
          'Use Use this deck before starting a deck battle.',
        ]}
      />
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-black">JJK Cursed Clash</h1>
        <p className="mb-8 text-slate-300">Home → Collection (discover) → Deck Builder (assemble) → Battle (play) → Results (next action)</p>

        <div className="grid gap-4 md:grid-cols-5">
          {flow.map((step, index) => (
            <Card key={step.label} className="border-slate-700 bg-slate-900 p-4">
              <p className="text-xs uppercase text-slate-400">Step {index + 1}</p>
              <h2 className="text-xl font-bold">{step.label}</h2>
              <p className="mb-4 text-sm text-slate-300">{step.detail}</p>
              <Button className="w-full" onClick={() => navigate(step.path)}>
                {step.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <Button onClick={() => navigate('/collection')}>Start journey <ArrowRight className="ml-2" size={16} /></Button>
          <Button variant="outline" onClick={() => navigate('/battle')}>Quick battle</Button>
        </div>
      </div>
    </main>
  );
}
