import { Link } from 'wouter';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return <div className="flex min-h-[70dvh] items-center justify-center"><div className="panel max-w-md p-8 text-center"><div className="mx-auto grid h-12 w-12 place-items-center border border-[hsl(var(--accent)/.45)] text-[hsl(var(--accent))]"><AlertTriangle size={22} /></div><p className="eyebrow mt-6">Signal not found / 404</p><h1 className="mt-3 text-2xl font-semibold">This desk position is empty.</h1><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">The route is not part of the current review workspace.</p><Link href="/" data-testid="link-return-home" className="focus-ring mt-6 inline-flex items-center gap-2 rounded border border-[hsl(var(--border))] px-4 py-2 text-xs font-medium hover:bg-[hsl(var(--secondary))]"><ArrowLeft size={14} /> Return to live analysis</Link></div></div>;
}