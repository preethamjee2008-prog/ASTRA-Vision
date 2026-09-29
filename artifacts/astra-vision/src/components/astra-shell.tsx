import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Activity, Archive, BookOpen, ClipboardCheck, Database, Info, Menu, Radar, X } from 'lucide-react';

const navigation = [
  { href: '/', label: 'Live analysis', hint: '01', icon: Radar },
  { href: '/evaluation', label: 'Evaluation', hint: '02', icon: ClipboardCheck },
  { href: '/catalog', label: 'Reference catalog', hint: '03', icon: Database },
  { href: '/history', label: 'Audit trail', hint: '04', icon: Archive },
  { href: '/about', label: 'Methodology', hint: '05', icon: Info },
];

export function AstraShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="astra-app flex min-h-[100dvh]">
      <aside className="side-shell hidden w-[250px] shrink-0 flex-col lg:flex">
        <ShellBrand />
        <nav aria-label="Primary" className="flex-1 px-3 py-5">
          <p className="data-label mb-3 px-3">Operations desk</p>
          <div className="space-y-1">
            {navigation.map((item) => <NavItem key={item.href} item={item} active={location === item.href} />)}
          </div>
        </nav>
        <div className="border-t border-[hsl(var(--sidebar-border))] p-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))]">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            <span className="font-mono uppercase tracking-[.12em]">review environment</span>
          </div>
          <div className="rounded border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)] p-3">
            <div className="flex items-center justify-between">
              <span className="data-label">ASTRA // v0.1</span>
              <Activity size={13} className="text-[hsl(var(--primary))]" />
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">Evidence boundaries are always shown.</p>
          </div>
          <p className="mt-4 text-[10px] text-[hsl(var(--muted-foreground))]">Built by <span className="text-[hsl(var(--foreground))]">Preetham Alawandimath</span></p>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-[hsl(var(--border)/.7)] bg-[hsl(var(--background)/.86)] px-5 backdrop-blur-md lg:hidden">
          <ShellBrand compact />
          <button type="button" data-testid="button-open-navigation" aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="focus-ring rounded border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))]">
            <Menu size={18} />
          </button>
        </header>
        {mobileOpen && <div className="fixed inset-0 z-30 bg-[hsl(222_40%_4%/.7)] lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
        <aside className={`side-shell fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col transition-transform lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4"><ShellBrand compact /><button type="button" data-testid="button-close-navigation" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="focus-ring rounded p-2 text-[hsl(var(--muted-foreground))]"><X size={18} /></button></div>
          <nav aria-label="Mobile primary" className="flex-1 px-3 py-5">
            <p className="data-label mb-3 px-3">Operations desk</p>
            <div className="space-y-1">{navigation.map((item) => <NavItem key={item.href} item={item} active={location === item.href} onNavigate={() => setMobileOpen(false)} />)}</div>
          </nav>
          <p className="border-t border-[hsl(var(--sidebar-border))] p-4 text-[10px] text-[hsl(var(--muted-foreground))]">Built by <span className="text-[hsl(var(--foreground))]">Preetham Alawandimath</span></p>
        </aside>
        <main className="mx-auto w-full max-w-[1480px] flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}

function ShellBrand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" data-testid="link-brand" className="flex items-center gap-3 px-1 py-1">
    <span className="relative grid h-9 w-9 place-items-center border border-[hsl(var(--primary)/.6)] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))]">
      <span className="absolute inset-[5px] border border-[hsl(var(--primary)/.35)]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
    </span>
    <span><strong className="block text-[15px] font-semibold tracking-[.12em] text-[hsl(var(--foreground))]">ASTRA</strong>{!compact && <span className="block text-[9px] font-medium uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">vision workspace</span>}</span>
  </Link>;
}

function NavItem({ item, active, onNavigate }: { item: typeof navigation[number]; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  return <Link href={item.href} onClick={onNavigate} data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`} data-active={active} className="nav-link flex items-center gap-3 rounded px-3 py-3 text-[13px] text-[hsl(var(--muted-foreground))]">
    <Icon size={16} strokeWidth={1.7} />
    <span className="flex-1">{item.label}</span>
    <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/.65)]">{item.hint}</span>
  </Link>;
}