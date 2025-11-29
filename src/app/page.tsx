import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, TrendingUp, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6 lg:px-12">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Activity className="h-6 w-6" />
          <span>GigLens</span>
        </div>
        <nav className="hidden gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium hover:text-primary">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">How it Works</Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/api/auth/signin">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center py-24 text-center lg:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            See Your Financial Future <span className="text-primary">Clearly</span>.
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
            A smart stability system for India’s gig workforce. Understand earnings, detect leakage, and forecast cashflow with GigLens.
          </p>
          <div className="mt-10 flex gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </section>

        <section id="features" className="container mx-auto py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <Activity className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-bold">GigLens Scorecard</h3>
              <p className="text-muted-foreground">
                Get a comprehensive financial health score based on margin, liquidity, and stability.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <ShieldCheck className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-bold">LeakShield Guardrails</h3>
              <p className="text-muted-foreground">
                Detect budget leaks and get smart alerts to stay within safe EMI limits.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <TrendingUp className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-bold">FlowForward</h3>
              <p className="text-muted-foreground">
                Behavioral cashflow forecasting to predict safe days and savings targets.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 text-center text-sm text-muted-foreground">
        <p>&copy; 2024 GigLens. All rights reserved.</p>
      </footer>
    </div>
  );
}
