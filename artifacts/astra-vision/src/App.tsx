import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { AstraShell } from '@/components/astra-shell';
import { AboutPage, CatalogPage, EvaluationPage, HistoryPage, HomePage } from '@/pages/mission-pages';
import NotFound from '@/pages/not-found';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';

const queryClient = new QueryClient();

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <AstraShell><RoutedErrorBoundary><Switch>
    <Route path="/" component={HomePage} />
    <Route path="/evaluation" component={EvaluationPage} />
    <Route path="/catalog" component={CatalogPage} />
    <Route path="/history" component={HistoryPage} />
    <Route path="/about" component={AboutPage} />
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary></AstraShell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;