import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Activity, ArrowUpRight, Clock3, Cpu, FileUp, Gauge, ImagePlus, Info, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useAnalyzeImage, useGetCatalog, useGetEvaluation, useGetHistory, useGetModelInfo, useHealthCheck } from '@workspace/api-client-react';
import type { AnalysisResponse, CatalogEntry, Evaluation, ModelInfo } from '@workspace/api-client-react';
import { HistoryList, ModelStrip, PageHeading, QueryState, ResultPanel, StatusHud } from '@/components/mission-ui';

export function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const modelQuery = useGetModelInfo();
  const historyQuery = useGetHistory();
  const healthQuery = useHealthCheck();
  const analyze = useAnalyzeImage();

  useEffect(() => {
    if (!result || !success) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }));
  }, [result, success]);

  const selectFile = (next: File | undefined) => {
    if (!next || !next.type.startsWith('image/')) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
    setResult(null);
    setSuccess(false);
    setFailed(false);
  };
  const submit = () => {
    if (!file || analyze.isPending) return;
    setSuccess(false);
    setFailed(false);
    setResult(null);
    analyze.mutate({ data: { image: file } }, {
      onSuccess: (data) => {
        if (data?.prediction && Array.isArray(data.top_predictions)) {
          setResult(data);
          setSuccess(true);
        } else {
          setFailed(true);
        }
      },
      onError: () => setFailed(true),
    });
  };
  const history = historyQuery.data?.items ?? [];
  return <div>
    <PageHeading eyebrow="01 / Live analysis" title="Review the image. Keep the evidence." description="A transparent computer-vision desk for aircraft and defense imagery. Submit one image, inspect the model response, and see exactly where certainty ends." action={<div className="flex items-center gap-2 text-[10px] text-[hsl(var(--muted-foreground))]"><span className={`h-1.5 w-1.5 rounded-full ${healthQuery.data?.status === 'ok' ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--accent))]'}`} /><span className="font-mono uppercase tracking-[.12em]">{healthQuery.data?.status === 'ok' ? 'API online' : 'checking API'}</span></div>} />
    <ModelStrip model={modelQuery.data} />
    <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
      <div className="panel p-5 sm:p-7">
        <div className="mb-6 flex items-start justify-between"><div><p className="eyebrow">Input station</p><h2 className="mt-2 text-xl font-medium">Load an image for review</h2></div><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">MAX {modelQuery.data?.max_file_size_mb ?? '—'} MB</span></div>
        <label data-testid="dropzone-upload" htmlFor="image-upload" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]); }} className="group relative flex min-h-[290px] cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed border-[hsl(var(--primary)/.5)] bg-[hsl(var(--primary)/.035)] px-5 text-center transition-colors hover:bg-[hsl(var(--primary)/.08)]">
          {previewUrl ? <img src={previewUrl} alt="Selected aircraft imagery preview" data-testid="img-upload-preview" className="absolute inset-0 h-full w-full object-contain opacity-70" /> : <><div className="mb-5 grid h-14 w-14 place-items-center border border-[hsl(var(--primary)/.35)] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))]"><ImagePlus size={23} strokeWidth={1.5} /></div><p className="text-sm font-medium">Drop imagery here or browse files</p><p className="mt-2 max-w-xs text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Accepted {modelQuery.data?.input_formats.join(', ') || 'image formats'} · original input is preserved in results</p></>}
          {previewUrl && <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[hsl(var(--background)/.88)] px-4 py-3 text-left backdrop-blur-sm"><div><p className="text-xs font-medium">{file?.name}</p><p className="mt-1 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{file ? formatBytes(file.size) : ''}</p></div><span className="font-mono text-[10px] text-[hsl(var(--primary))]">CHANGE FILE</span></div>}
          <input ref={inputRef} id="image-upload" data-testid="input-image-upload" type="file" accept="image/*" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0])} />
        </label>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button type="button" data-testid="button-analyze" disabled={!file || analyze.isPending} onClick={submit} className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded bg-[hsl(var(--primary))] px-4 py-3 text-xs font-semibold uppercase tracking-[.1em] text-[hsl(var(--primary-foreground))] transition-transform hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-40"><FileUp size={15} />{analyze.isPending ? 'Analyzing response…' : 'Analyze image'}</button><button type="button" data-testid="button-browse-image" onClick={() => inputRef.current?.click()} className="focus-ring rounded border border-[hsl(var(--border))] px-5 py-3 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]">Browse</button></div>
        {failed && <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--destructive))]" data-testid="status-analysis-failed"><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--destructive))]" />ANALYSIS FAILED — unable to complete AI analysis.</span><button type="button" onClick={submit} className="focus-ring border border-[hsl(var(--destructive)/.45)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.1em] hover:bg-[hsl(var(--destructive)/.1)]">Try again</button></div>}
      </div>
      <div className="space-y-5">
        {(analyze.isPending || success || failed) && <StatusHud pending={analyze.isPending} success={success} failed={failed} />}
        <div className="panel p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Desk telemetry</p><p className="mt-2 text-lg font-medium">Current review context</p></div><Activity size={18} className="text-[hsl(var(--primary))]" /></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3"><Telemetry label="API" value={healthQuery.data?.status || (healthQuery.isError ? 'offline' : 'checking')} /><Telemetry label="Model" value={modelQuery.data?.classifier || 'loading'} /><Telemetry label="History" value={`${history.length} records`} /></div><div className="mt-5 flex items-start gap-3 border-t border-[hsl(var(--border)/.65)] pt-4"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" /><p className="text-xs leading-6 text-[hsl(var(--muted-foreground))]">No spatial boxes or Grad-CAM payloads are inferred by this desk. The response boundary stays visible.</p></div></div>
      </div>
    </div>
    <div ref={resultsRef} className="scroll-mt-24">{result && <div className="mt-8"><div className="mb-4 flex items-end gap-3"><div><span className="eyebrow">Analysis results</span><p className="mt-2 text-sm font-medium uppercase tracking-[.08em] text-[hsl(var(--primary))]">AI vision inference complete</p></div><span className="h-px flex-1 bg-[hsl(var(--border))]" /><span className="border border-[hsl(var(--primary)/.35)] px-2 py-1 font-mono text-[9px] uppercase tracking-[.1em] text-[hsl(var(--primary))]">Results ready</span><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{new Date(result.analyzed_at).toLocaleString()}</span></div><ResultPanel result={result} previewUrl={previewUrl} /></div>}</div>
    <section className="mt-12"><div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">Recent server records</p><h2 className="mt-2 text-xl font-medium">Review history</h2></div><Link href="/history" data-testid="link-view-history" className="focus-ring inline-flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline">Full audit trail <ArrowUpRight size={14} /></Link></div><QueryState loading={historyQuery.isLoading} error={historyQuery.isError} onRetry={() => historyQuery.refetch()} empty={!historyQuery.isLoading && history.length === 0}><div className="panel overflow-hidden"><div className="grid grid-cols-[1.5fr_1fr_.7fr] border-b border-[hsl(var(--border))] px-5 py-3 data-label max-sm:hidden"><span>Input</span><span>Classification</span><span>Confidence</span></div>{history.slice(0, 4).map((item) => <div key={item.id} data-testid={`row-recent-${item.id}`} className="grid gap-1 border-b border-[hsl(var(--border)/.55)] px-5 py-4 last:border-0 sm:grid-cols-[1.5fr_1fr_.7fr]"><span className="truncate text-sm">{item.file_name}</span><span className="capitalize text-xs text-[hsl(var(--muted-foreground))]">{item.category.replaceAll('-', ' ')}</span><span className="font-mono text-xs text-[hsl(var(--primary))]">{Math.round(item.confidence * 100)}%</span></div>)}</div></QueryState></section>
  </div>;
}

export function EvaluationPage() {
  const query = useGetEvaluation();
  const model = useGetModelInfo();
  return <div><PageHeading eyebrow="02 / Evaluation" title="Know what the model has not proven." description="Dataset composition and evaluation state, presented without smoothing over missing metrics or unsupported claims." action={<div className="flex items-center gap-2 border border-[hsl(var(--accent)/.45)] px-3 py-2 text-[10px] text-[hsl(var(--accent))]"><Info size={13} /> HONEST EVALUATION</div>} /><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}>{query.data && <EvaluationContent evaluation={query.data} model={model.data} />}</QueryState></div>;
}

function EvaluationContent({ evaluation, model }: { evaluation: Evaluation; model?: ModelInfo }) {
  const report = evaluation.dataset_report;
  const metrics = evaluation.metrics;
  const distribution = Object.entries(report.class_distribution || {});
  return <div className="space-y-5"><div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><div className="panel p-6"><div className="flex items-start justify-between"><div><p className="eyebrow">Evaluation status</p><h2 className="mt-3 text-2xl font-semibold">{evaluation.evaluated ? 'Evaluation available' : 'Not evaluated'}</h2></div><div className={`border px-2 py-1 font-mono text-[10px] uppercase ${evaluation.evaluated ? 'border-[hsl(var(--primary)/.45)] text-[hsl(var(--primary))]' : 'border-[hsl(var(--accent)/.45)] text-[hsl(var(--accent))]'}`}>{evaluation.evaluated ? 'reported' : 'pending'}</div></div><p className="mt-5 max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">{evaluation.note}</p><div className="mt-7 grid grid-cols-2 gap-4 border-t border-[hsl(var(--border)/.65)] pt-5 sm:grid-cols-4"><Metric label="Total images" value={report.total_images.toLocaleString()} /><Metric label="Classes" value={String(report.classes)} /><Metric label="Test split" value={report.test_images.toLocaleString()} /><Metric label="Invalid" value={report.invalid_images.toLocaleString()} /></div></div><div className="panel p-6"><p className="eyebrow">Split composition</p><div className="mt-6 space-y-4"><SplitBar label="Training" value={report.train_images} total={report.total_images} /><SplitBar label="Validation" value={report.validation_images} total={report.total_images} /><SplitBar label="Test" value={report.test_images} total={report.total_images} /></div><p className="mt-7 text-xs text-[hsl(var(--muted-foreground))]">Source: <span className="text-[hsl(var(--foreground))]">{report.source}</span> · Split definition: {report.split}</p></div></div><div className="grid gap-4 lg:grid-cols-2"><div className="panel p-6"><div className="flex items-center justify-between"><p className="eyebrow">Reported metrics</p><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">NULLS PRESERVED</span></div><div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">{[['Accuracy', metrics?.accuracy], ['Top-3 accuracy', metrics?.top3_accuracy], ['Precision', metrics?.precision], ['Recall', metrics?.recall], ['F1', metrics?.f1]].map(([label, value]) => <Metric key={String(label)} label={String(label)} value={value == null ? '—' : `${Math.round(Number(value) * 100)}%`} />)}</div><p className="mt-7 border-t border-[hsl(var(--border)/.65)] pt-4 text-xs leading-6 text-[hsl(var(--muted-foreground))]">A dash means the API has no metric to report. It does not mean a zero score.</p></div><div className="panel p-6"><p className="eyebrow">Class distribution</p><div className="mt-5 space-y-3">{distribution.length ? distribution.map(([label, value]) => <div key={label} className="flex items-center gap-3"><span className="w-28 truncate text-xs capitalize">{label.replaceAll('-', ' ')}</span><div className="h-2 flex-1 bg-[hsl(var(--secondary))]"><div className="h-full bg-[hsl(var(--accent))]" style={{ width: `${Math.max(2, (value / report.total_images) * 100)}%` }} /></div><span className="w-10 text-right font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{value}</span></div>) : <p className="text-sm text-[hsl(var(--muted-foreground))]">No class distribution reported.</p>}</div><p className="mt-6 text-xs text-[hsl(var(--muted-foreground))]">Catalog models available: {model?.catalog_models ?? '—'}</p></div></div></div>;
}

export function CatalogPage() {
  const query = useGetCatalog();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const entries = query.data?.entries ?? [];
  const categories = useMemo(() => ['all', ...Array.from(new Set(entries.map((entry) => entry.category)))], [entries]);
  const filtered = entries.filter((entry) => `${entry.exact_name} ${entry.source_title} ${entry.artist} ${entry.category}`.toLowerCase().includes(search.toLowerCase()) && (category === 'all' || entry.category === category));
  return <div><PageHeading eyebrow="03 / Reference catalog" title="Evidence-backed visual references." description="Search the catalog used to ground model responses. Every entry retains its source, license, and exact name." action={<span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{entries.length} ENTRIES INDEXED</span>} /><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()} empty={!query.isLoading && entries.length === 0}>{<><div className="mb-5 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" /><input data-testid="input-catalog-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search exact names, source titles, artists…" className="focus-ring h-11 w-full rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 text-sm placeholder:text-[hsl(var(--muted-foreground))]" /></label><div className="flex items-center gap-2 overflow-x-auto"><SlidersHorizontal size={15} className="shrink-0 text-[hsl(var(--muted-foreground))]" />{categories.map((item) => <button type="button" key={item} data-testid={`button-filter-${item}`} onClick={() => setCategory(item)} className={`focus-ring shrink-0 rounded border px-3 py-2 text-[10px] capitalize ${category === item ? 'border-[hsl(var(--primary)/.6)] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]'}`}>{item.replaceAll('-', ' ')}</button>)}</div></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((entry) => <CatalogCard key={entry.id} entry={entry} />)}</div>{filtered.length === 0 && <QueryState empty>{null}</QueryState>}</>}</QueryState></div>;
}

function CatalogCard({ entry }: { entry: CatalogEntry }) {
  return <article data-testid={`card-catalog-${entry.id}`} className="panel group overflow-hidden transition-transform hover:translate-y-[-2px]"><div className="relative aspect-[16/10] overflow-hidden bg-[hsl(var(--secondary))]"><img src={entry.image_url} alt={`${entry.exact_name} reference`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /><div className="absolute left-3 top-3 bg-[hsl(var(--background)/.82)] px-2 py-1 font-mono text-[9px] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{entry.category.replaceAll('-', ' ')}</div></div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-medium">{entry.exact_name}</h2><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{entry.source_title}</p></div><a href={entry.source_url} target="_blank" rel="noreferrer" data-testid={`link-catalog-source-${entry.id}`} aria-label={`Open source for ${entry.exact_name}`} className="focus-ring shrink-0 rounded p-1 text-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))]"><ArrowUpRight size={15} /></a></div><div className="mt-4 flex justify-between border-t border-[hsl(var(--border)/.6)] pt-3 text-[10px] text-[hsl(var(--muted-foreground))]"><span>{entry.artist}</span><span>{entry.license}</span></div></div></article>;
}

export function HistoryPage() {
  const query = useGetHistory();
  return <div><PageHeading eyebrow="04 / Audit trail" title="Every answer leaves a record." description="A server-side trail of prior predictions with timestamps, confidence, and the evidence status returned at analysis time." action={<div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]"><Clock3 size={14} /> RETAINED RECORDS</div>} /><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()} empty={!query.isLoading && (query.data?.items.length ?? 0) === 0}>{query.data && <HistoryList items={query.data.items} />}</QueryState><div className="mt-5 flex items-start gap-3 text-xs leading-6 text-[hsl(var(--muted-foreground))]"><Info size={15} className="mt-1 shrink-0 text-[hsl(var(--accent))]" />Records reflect the API response and are not a substitute for analyst notes or chain-of-custody documentation.</div></div>;
}

export function AboutPage() {
  const query = useGetModelInfo();
  return <div><PageHeading eyebrow="05 / Methodology" title="A clear view of the machine." description="ASTRA Vision is designed for reviewers who need a useful signal without losing track of what the system actually observed." action={<span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">MANIFEST / ACTIVE</span>} /><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}>{query.data && <AboutContent model={query.data} />}</QueryState></div>;
}

function AboutContent({ model }: { model: ModelInfo }) {
  return <div className="space-y-5"><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><div className="panel p-6"><p className="eyebrow">Active model manifest</p><div className="mt-5 flex items-start justify-between gap-4"><div><h2 className="text-2xl font-semibold">{model.name}</h2><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{model.classifier}</p></div><div className="border border-[hsl(var(--primary)/.4)] p-2 text-[hsl(var(--primary))]"><Cpu size={20} /></div></div><div className="mt-7 grid gap-5 border-t border-[hsl(var(--border)/.65)] pt-5 sm:grid-cols-2"><Manifest label="Task" value={model.task} /><Manifest label="Project attribution" value="Preetham Alawandimath" /><Manifest label="Dataset images" value={model.dataset_images.toLocaleString()} /><Manifest label="Catalog models" value={model.catalog_models.toLocaleString()} /><Manifest label="Input formats" value={model.input_formats.join(', ')} /><Manifest label="Max file size" value={`${model.max_file_size_mb} MB`} /></div></div><div className="panel p-6"><p className="eyebrow">Supported classes</p><div className="mt-5 grid grid-cols-2 gap-2">{model.supported_classes.map((item) => <div key={item} className="border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] px-3 py-3 text-xs capitalize">{item.replaceAll('-', ' ')}</div>)}</div><div className="mt-7 border-t border-[hsl(var(--border)/.65)] pt-5"><p className="data-label">Operating principle</p><p className="mt-2 text-sm leading-7 text-[hsl(var(--muted-foreground))]">A model output is a lead for review, not an autonomous determination. Source links and unavailable payloads stay visible beside the prediction.</p></div></div></div><div className="panel p-6"><div className="flex items-center justify-between"><p className="eyebrow">Known limitations</p><span className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--accent))]"><Gauge size={14} /> READ BEFORE USE</span></div><div className="mt-5 grid gap-3 md:grid-cols-2">{model.limitations.map((limitation, index) => <div key={`${index}-${limitation}`} className="flex gap-3 border-t border-[hsl(var(--border)/.6)] pt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]"><span className="font-mono text-[10px] text-[hsl(var(--accent))]">{String(index + 1).padStart(2, '0')}</span><span>{limitation}</span></div>)}</div></div><div className="panel p-6"><p className="eyebrow">Method in three passes</p><div className="mt-6 grid gap-6 md:grid-cols-3">{[['01', 'Classify', 'The active classifier ranks supported vehicle classes from the uploaded image.'], ['02', 'Ground', 'The service may return an evidence-backed reference match with source metadata.'], ['03', 'Bound', 'Reviewers see confidence, provenance, and missing spatial evidence before acting.']].map(([number, title, copy]) => <div key={number} className="border-l border-[hsl(var(--primary)/.5)] pl-4"><p className="font-mono text-xs text-[hsl(var(--primary))]">{number}</p><h3 className="mt-3 font-medium">{title}</h3><p className="mt-2 text-xs leading-6 text-[hsl(var(--muted-foreground))]">{copy}</p></div>)}</div></div><p className="text-right text-[10px] text-[hsl(var(--muted-foreground))]">ASTRA Vision · created by Preetham Alawandimath</p></div>;
}

function Telemetry({ label, value }: { label: string; value: string }) { return <div className="border border-[hsl(var(--border)/.7)] bg-[hsl(var(--secondary)/.3)] p-3"><p className="data-label">{label}</p><p data-testid={`text-telemetry-${label.toLowerCase()}`} className="mt-2 truncate font-mono text-xs text-[hsl(var(--foreground))]">{value}</p></div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div><p className="data-label">{label}</p><p className="mt-2 font-mono text-xl text-[hsl(var(--foreground))]">{value}</p></div>; }
function SplitBar({ label, value, total }: { label: string; value: number; total: number }) { return <div><div className="mb-2 flex justify-between text-xs"><span>{label}</span><span className="font-mono text-[hsl(var(--muted-foreground))]">{value.toLocaleString()}</span></div><div className="h-2 bg-[hsl(var(--secondary))]"><div className="h-full bg-[hsl(var(--primary))]" style={{ width: `${total ? (value / total) * 100 : 0}%` }} /></div></div>; }
function Manifest({ label, value }: { label: string; value: string }) { return <div><p className="data-label">{label}</p><p className="mt-2 break-words text-sm text-[hsl(var(--foreground)/.88)]">{value}</p></div>; }
function formatBytes(bytes: number) { if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`; return `${(bytes / 1024 / 1024).toFixed(1)} MB`; }