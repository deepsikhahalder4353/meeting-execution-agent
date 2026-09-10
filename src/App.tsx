import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import LandingPage from '@/pages/landing';
import Overview from '@/pages/overview';
import Projects from '@/pages/projects';
import ProjectDetailPage from '@/pages/project-detail';
import Inbox from '@/pages/inbox';
import Workload from '@/pages/workload';
import TimePage from '@/pages/time';
import Notifications from '@/pages/notifications';
import Settings from '@/pages/settings';
import { Shell } from '@/components/shell';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/:rest*">
          <Shell>
            <Switch>
              <Route path="/app" component={Overview} />
              <Route path="/overview" component={Overview} />
              <Route path="/projects" component={Projects} />
              <Route path="/projects/:projectId" component={ProjectDetailPage} />
              <Route path="/inbox" component={Inbox} />
              <Route path="/workload" component={Workload} />
              <Route path="/time" component={TimePage} />
              <Route path="/notifications" component={Notifications} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </Shell>
        </Route>
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
