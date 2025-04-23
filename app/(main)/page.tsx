import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Lightbulb, Pencil, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-8">
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
          <Sparkles className="mr-1 h-3 w-3" />
          <span>AI-Powered Note Taking</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-3xl">
          Capture ideas and get AI-powered insights
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          NoteBuddy helps you take notes and uses artificial intelligence to summarize and organize your thoughts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">
              Sign In
            </Link>
          </Button>
        </div>
      </section>

      <section className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card">
          <div className="p-2 rounded-full bg-primary/10">
            <Pencil className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Simple Note Taking</h3>
          <p className="text-muted-foreground">
            Create, edit, and organize your notes with our intuitive interface. No distractions, just pure focus.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">AI Summarization</h3>
          <p className="text-muted-foreground">
            Let AI create concise summaries of your notes, helping you extract key insights and save time.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border bg-card">
          <div className="p-2 rounded-full bg-primary/10">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Smart Organization</h3>
          <p className="text-muted-foreground">
            Keep your thoughts organized and accessible across all your devices, whenever inspiration strikes.
          </p>
        </div>
      </section>

      <section className="container py-12 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Why Choose NoteBuddy?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Built for productivity and enhanced with AI, NoteBuddy helps you capture and process information more effectively.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold">Privacy-Focused</h3>
                <p className="text-muted-foreground">
                  Your notes are yours alone. We use strong encryption and never share your data with third parties.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold">Fast & Responsive</h3>
                <p className="text-muted-foreground">
                  Works seamlessly across all your devices with real-time updates and offline capabilities.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold">AI-Enhanced</h3>
                <p className="text-muted-foreground">
                  Harness the power of AI to get more from your notes with automatic summarization.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold">Simple & Beautiful</h3>
                <p className="text-muted-foreground">
                  Clean, intuitive interface that stays out of your way, letting you focus on your thoughts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container space-y-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join thousands of users who trust NoteBuddy with their ideas, projects, and thoughts.
          </p>
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Sign up for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}