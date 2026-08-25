import ErrorBoundary from "@/components/ErrorBoundary";
import Business from "@/pages/Business";
import Company from "@/pages/Company";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import News from "@/pages/News";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import Projects from "@/pages/Projects";
import Quality from "@/pages/Quality";
import { Route, Router, Switch } from "wouter";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/company" component={Company} />
      <Route path="/company/philosophy" component={Company} />
      <Route path="/business" component={Business} />
      <Route path="/business/civil" component={Business} />
      <Route path="/business/architecture" component={Business} />
      <Route path="/business/field" component={Business} />
      <Route path="/projects" component={Projects} />
      <Route path="/quality" component={Quality} />
      <Route path="/quality/safety" component={Quality} />
      <Route path="/news" component={News} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />

      {/* Legacy URLs remain readable but render the new SITE 2 information architecture. */}
      <Route path="/services" component={Business} />
      <Route path="/services/scope" component={Business} />
      <Route path="/services/promise" component={Quality} />
      <Route path="/gallery" component={Projects} />
      <Route path="/consultation" component={Contact} />
      <Route path="/consultation/list" component={Contact} />
      <Route path="/notices" component={News} />
      <Route path="/notices/pre-check" component={Quality} />
      <Route path="/location" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
  return (
    <ErrorBoundary>
      <Router base={base}>
        <Routes />
      </Router>
    </ErrorBoundary>
  );
}
