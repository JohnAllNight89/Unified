import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Sample from "@/pages/Sample";
import FAQ from "@/pages/FAQ";
import Connect from "@/pages/Connect";
import Privacy from "@/pages/Privacy";
import Portal from "@/pages/Portal";
import Admin from "@/pages/Admin";
import Discover from "@/pages/Discover";
import DiscoverNumerology from "@/pages/DiscoverNumerology";
import DiscoverAstrology from "@/pages/DiscoverAstrology";
import DiscoverHumanDesign from "@/pages/DiscoverHumanDesign";
import DiscoverGeneKeys from "@/pages/DiscoverGeneKeys";
import NumerologyPage from "@/pages/Numerology";
import AstroChartPage from "@/pages/AstroChart";
import AstroInterpretationPage from "@/pages/AstroInterpretation";
import Membership from "@/pages/Membership";
import DrWernerReferral from "@/pages/DrWernerReferral";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

function SignInPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--dark, #06040f)", position: "relative" }}>
      <Starfield fixed />
      <Nav />
      <div className="auth-page">
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
          forceRedirectUrl={`${basePath}/portal`}
        />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--dark, #06040f)", position: "relative" }}>
      <Starfield fixed />
      <Nav />
      <div className="auth-page">
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
          forceRedirectUrl={`${basePath}/portal`}
        />
      </div>
    </div>
  );
}


function PortalRoute() {
  return (
    <>
      <Show when="signed-in">
        <Portal />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function NumerologyRoute() {
  return (
    <>
      <Show when="signed-in">
        <NumerologyPage />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function AstroChartRoute() {
  return (
    <>
      <Show when="signed-in">
        <AstroChartPage />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function AstroInterpretationRoute() {
  return (
    <>
      <Show when="signed-in">
        <AstroInterpretationPage />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function AdminRoute() {
  return (
    <>
      <Show when="signed-in">
        <Admin />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsub = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsub;
  }, [addListener, qc]);
  return null;
}

function AppRouter() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/portal" component={PortalRoute} />
            <Route path="/portal/numerology" component={NumerologyRoute} />
            <Route path="/portal/astro" component={AstroChartRoute} />
            <Route path="/portal/astro-interpretation" component={AstroInterpretationRoute} />
            <Route path="/admin" component={AdminRoute} />
            <Route path="/discover" component={Discover} />
            <Route path="/discover/numerology" component={DiscoverNumerology} />
            <Route path="/discover/astrology" component={DiscoverAstrology} />
            <Route path="/discover/human-design" component={DiscoverHumanDesign} />
            <Route path="/discover/gene-keys" component={DiscoverGeneKeys} />
            <Route path="/about" component={About} />
            <Route path="/sample" component={Sample} />
            <Route path="/faq" component={FAQ} />
            <Route path="/connect" component={Connect} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/membership" component={Membership} />
            <Route path="/dr-werner" component={DrWernerReferral} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  if (!clerkPubKey) {
    return <div style={{ color: "white", padding: 40 }}>Clerk key not configured.</div>;
  }
  return (
    <WouterRouter base={basePath}>
      <AppRouter />
    </WouterRouter>
  );
}

export default App;
