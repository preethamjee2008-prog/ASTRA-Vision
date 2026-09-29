import { Check, Circle, FileImage, LoaderCircle, AlertTriangle, ExternalLink, ScanSearch } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AnalysisResponse, HistoryItem, ModelInfo } from '@workspace/api-client-react';

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[hsl(var(--border)/.65)] pb-7 sm:flex-row sm:items-end">
    <div><p className="eyebrow mb-3">{eyebrow}</p><h1 className="text-3xl font-semibold tracking-[-.03em] text-[hsl(var(--foreground))] sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{description}</p></div>
    {action}
  </div>;
}

export function QueryState({ loading, error, onRetry, empty, children }: { loading?: boolean; error?: boolean; onRetry?: () => void; empty?: boolean; children: ReactNode }) {
  if (loading) return <div className="space-y-3" data-testid="state-loading"><div className="skeleton h-24 rounded panel" /><div className="skeleton h-48 rounded panel" /></div>;
  if (error) return <div className="panel flex flex-col items-center justify-center px-6 py-14 text-center" data-testid="state-error"><AlertTriangle className="mb-3 text-[hsl(var(--destructive))]" size={25} /><p className="font-medium">Signal unavailable</p><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">The service did not return a readable response.</p>{onRetry && <button type="button" data-testid="button-retry" onClick={onRetry} className="focus-ring mt-5 rounded border border-[hsl(var(--border))] px-4 py-2 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]">Retry request</button>}</div>;
  if (empty) return <div className="panel flex flex-col items-center justify-center px-6 py-14 text-center" data-testid="state-empty"><ScanSearch className="mb-3 text-[hsl(var(--muted-foreground))]" size={25} /><p className="font-medium">No records in this view</p><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Evidence will appear here once the workspace has something to report.</p></div>;
  return <>{children}</>;
}

export function StatusHud({ pending, success, failed }: { pending: boolean; success: boolean; failed: boolean }) {
  const stages = ['Image preprocessing', 'Object detection', 'Aircraft classification', 'Confidence analysis', 'Grad-CAM explanation', 'Finalizing results'];
  const completed = success ? stages.length : 0;
  return <div className={`panel hairline-grid relative overflow-hidden p-5 ${failed ? 'border-[hsl(var(--destructive)/.6)]' : ''}`} data-testid="status-processing-hud">
    {pending && <div className="scan-line absolute inset-x-0 top-1/2 h-px bg-[hsl(var(--primary)/.7)] shadow-[0_0_22px_hsl(var(--primary)/.5)]" />}
    <div className="relative flex items-center justify-between gap-4"><div><p className={`eyebrow ${failed ? 'text-[hsl(var(--destructive))]' : ''}`}>{failed ? 'ANALYSIS FAILED' : success ? 'PROCESSING COMPLETED' : 'AI ANALYSIS IN PROGRESS'}</p><p className="mt-2 text-lg font-medium">{failed ? 'Unable to complete AI analysis' : success ? 'AI analysis successfully completed' : 'Live response from the inference service'}</p></div><div className={`grid h-11 w-11 place-items-center border ${failed ? 'border-[hsl(var(--destructive)/.5)] text-[hsl(var(--destructive))]' : 'border-[hsl(var(--primary)/.5)] text-[hsl(var(--primary))]'}`}>{pending ? <LoaderCircle size={19} className="animate-spin" /> : failed ? <AlertTriangle size={19} /> : <Check size={19} />}</div></div>
    <div className="relative mt-6 grid gap-2 sm:grid-cols-6">
      {stages.map((stage, index) => { const done = index < completed; const active = pending && index === completed; return <div key={stage} className="flex items-center gap-2 text-[10px] sm:block"><div className="mb-1 flex items-center gap-2"><span className={`${done ? 'text-[hsl(var(--primary))]' : active ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted-foreground)/.55)]'}`}>{done ? <Check size={13} /> : active ? <LoaderCircle size={13} className="animate-spin" /> : <Circle size={11} />}</span><span className="data-label">{String(index + 1).padStart(2, '0')}</span></div><p className={`${active ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'} sm:pl-5`}>{stage}</p></div>; })}
    </div>
  </div>;
}

export function ResultPanel({ result, previewUrl }: { result: AnalysisResponse; previewUrl: string | null }) {
  const confidence = Math.round(result.prediction.confidence * 100);
  return <div className="space-y-4 soft-in" data-testid="analysis-results">
    <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-[hsl(var(--border)/.65)] px-5 py-4"><div><p className="eyebrow">Primary classification</p><h2 className="mt-2 text-2xl font-semibold capitalize">{result.prediction.label.replaceAll('-', ' ')}</h2></div><ConfidenceBadge status={result.confidence_status} /></div>
        <div className="grid gap-5 p-5 md:grid-cols-[.8fr_1.2fr]">
          <div className="relative min-h-[220px] overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)]">
            {previewUrl ? <img src={previewUrl} alt="Original uploaded analysis input" data-testid="img-original-upload" className="h-full min-h-[220px] w-full object-contain" /> : <div className="grid h-full min-h-[220px] place-items-center"><FileImage size={34} className="text-[hsl(var(--muted-foreground))]" /></div>}
            <span className="absolute left-3 top-3 bg-[hsl(var(--background)/.85)] px-2 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">original input</span>
          </div>
          <div className="flex flex-col justify-between">
            <div><p className="data-label">Model explanation</p><p className="mt-3 text-sm leading-7 text-[hsl(var(--foreground)/.86)]" data-testid="text-analysis-explanation">{result.explanation}</p></div>
            <div className="mt-6 flex items-end justify-between border-t border-[hsl(var(--border)/.65)] pt-4"><div><p className="data-label">Confidence</p><p className="mt-1 font-mono text-3xl text-[hsl(var(--primary))]">{confidence}<span className="text-sm">%</span></p></div><div className="text-right"><p className="data-label">Inference</p><p className="mt-1 font-mono text-sm">{result.inference_time_ms} ms</p></div></div>
          </div>
        </div>
      </div>
      <div className="panel p-5"><div className="flex items-center justify-between"><p className="eyebrow">Ranked outputs</p><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">TOP {result.top_predictions.length}</span></div><div className="mt-5 space-y-4">{result.top_predictions.map((prediction) => <div key={`${prediction.rank}-${prediction.label}`} data-testid={`row-prediction-${prediction.rank}`}><div className="mb-2 flex justify-between text-xs"><span className="capitalize">{prediction.label.replaceAll('-', ' ')}</span><span className="font-mono text-[hsl(var(--muted-foreground))]">{Math.round(prediction.confidence * 100)}%</span></div><div className="h-1.5 bg-[hsl(var(--secondary))]"><div className="h-full bg-[hsl(var(--primary))] transition-all" style={{ width: `${Math.max(3, prediction.confidence * 100)}%` }} /></div></div>)}</div><div className="mt-6 border-t border-[hsl(var(--border)/.65)] pt-4"><p className="data-label">Preprocessing</p><p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">{result.preprocessing.applied ? result.preprocessing.summary : 'No preprocessing reported.'}</p></div></div>
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <ReferenceEvidence result={result} />
      <div className="panel p-5"><p className="eyebrow">Detection boundary</p><div className="mt-5 flex items-start gap-3"><div className="mt-0.5 rounded-full border border-[hsl(var(--accent)/.5)] p-1.5 text-[hsl(var(--accent))]"><AlertTriangle size={14} /></div><div><p className="text-sm font-medium">Class-level detection only</p><p className="mt-2 text-xs leading-6 text-[hsl(var(--muted-foreground))]">The service returned {result.detections.length} detection record{result.detections.length === 1 ? '' : 's'}, but no spatial box payload. Localization and Grad-CAM are unavailable for this response.</p></div></div>{result.detections.length > 0 && <div className="mt-5 space-y-2">{result.detections.map((d, i) => <div key={`${d.class_name}-${i}`} className="flex justify-between border-t border-[hsl(var(--border)/.55)] pt-2 text-xs"><span className="capitalize">{d.class_name.replaceAll('-', ' ')}</span><span className="font-mono text-[hsl(var(--muted-foreground))]">{Math.round(d.confidence * 100)}% · box unavailable</span></div>)}</div>}</div>
    </div>
  </div>;
}

function ConfidenceBadge({ status }: { status: string }) {
  const tone = status === 'high' ? 'text-[hsl(var(--primary))] border-[hsl(var(--primary)/.4)]' : status === 'unsupported' ? 'text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/.4)]' : 'text-[hsl(var(--accent))] border-[hsl(var(--accent)/.4)]';
  return <span data-testid="status-confidence" className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-[.1em] ${tone}`}>{status}</span>;
}

function ReferenceEvidence({ result }: { result: AnalysisResponse }) {
  const match = result.reference_match;
  return <div className="panel p-5"><div className="flex items-center justify-between"><p className="eyebrow">Evidence link</p><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">TRACE / {match ? 'FOUND' : 'NONE'}</span></div>{match ? <div className="mt-5"><h3 className="text-lg font-medium">{match.exact_name}</h3><div className="mt-4 grid grid-cols-2 gap-4 text-xs"><div><p className="data-label">Evidence level</p><p className="mt-1 capitalize">{match.evidence_level.replaceAll('-', ' ')}</p></div><div><p className="data-label">Similarity</p><p className="mt-1 font-mono text-[hsl(var(--primary))]">{Math.round(match.similarity * 100)}%</p></div><div><p className="data-label">Reference file</p><p className="mt-1 break-all text-[hsl(var(--muted-foreground))]">{match.reference_file}</p></div><div><p className="data-label">License</p><p className="mt-1 text-[hsl(var(--muted-foreground))]">{match.license}</p></div></div><a href={match.source_url} target="_blank" rel="noreferrer" data-testid="link-reference-source" className="focus-ring mt-5 inline-flex items-center gap-2 text-xs text-[hsl(var(--primary))] hover:underline">Open source record <ExternalLink size={13} /></a></div> : <div className="mt-5 border border-dashed border-[hsl(var(--border))] px-4 py-7 text-center"><p className="text-sm">No reference match returned</p><p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">Absence of evidence is kept explicit; this is not a visual similarity claim.</p></div>}</div>;
}

export function HistoryList({ items }: { items: HistoryItem[] }) {
  return <div className="panel overflow-hidden" data-testid="list-history"><div className="grid grid-cols-[1.35fr_.8fr_.6fr_.7fr] border-b border-[hsl(var(--border))] px-5 py-3 data-label max-sm:hidden"><span>Input</span><span>Class</span><span>Confidence</span><span>Recorded</span></div>{items.map((item) => <div key={item.id} data-testid={`row-history-${item.id}`} className="grid gap-2 border-b border-[hsl(var(--border)/.55)] px-5 py-4 last:border-0 sm:grid-cols-[1.35fr_.8fr_.6fr_.7fr] sm:items-center"><div className="flex items-center gap-3"><FileImage size={15} className="text-[hsl(var(--muted-foreground))]" /><div><p className="truncate text-sm">{item.file_name}</p><p className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">{item.evidence}</p></div></div><span className="capitalize text-xs text-[hsl(var(--muted-foreground))] sm:text-[hsl(var(--foreground))]">{item.category.replaceAll('-', ' ')}</span><span className="font-mono text-xs text-[hsl(var(--primary))]">{Math.round(item.confidence * 100)}%</span><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{new Date(item.analyzed_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span></div>)}</div>;
}

export function ModelStrip({ model }: { model?: ModelInfo }) {
  if (!model) return null;
  return <div className="grid gap-3 border-y border-[hsl(var(--border)/.65)] py-4 sm:grid-cols-4" data-testid="strip-model-summary"><div><p className="data-label">Active model</p><p className="mt-1 text-xs">{model.name}</p></div><div><p className="data-label">Task</p><p className="mt-1 text-xs">{model.task}</p></div><div><p className="data-label">Training images</p><p className="mt-1 font-mono text-xs">{model.dataset_images.toLocaleString()}</p></div><div><p className="data-label">Accepted inputs</p><p className="mt-1 text-xs">{model.input_formats.join(', ')}</p></div></div>;
}