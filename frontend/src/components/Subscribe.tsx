// NEWSLETTER 
import  { useState, type FormEvent } from 'react'
import { Reveal } from './ui/ScrollReveal';
import { useToast } from './ui/Toaster';
import { ArrowUpRight, BarChart3, BellRing, ShieldCheck } from 'lucide-react';
import { cn } from '../utils/cn';

const Subscribe = () => {
    const [email, setEmail] = useState("");
    const { push } = useToast();

    const subscribe = (e: FormEvent) => {
      e.preventDefault();
      if (!/^\S+@\S+\.\S+$/.test(email))
        return push("Please enter a valid email address.", "warn");
      push("You're on the list — tune in for product updates!");
      setEmail("");
    };
  return (
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-gold p-10 shadow-lift md:p-14">
            {[
              { I: BellRing, c: "right-10 top-8" },
              { I: BarChart3, c: "right-24 bottom-10" },
              { I: ShieldCheck, c: "right-8 bottom-24" },
            ].map(({ I, c }, i) => (
              <span
                key={i}
                className={cn(
                  "animate-float-slow absolute hidden h-12 w-12 place-items-center rounded-full bg-pine/10 text-pine md:grid",
                  c,
                )}
                style={{ animationDelay: `${i}s` }}>
                <I className="h-5 w-5" />
              </span>
            ))}
            <h2 className="max-w-md font-display text-4xl font-bold tracking-tight text-ink">
              Stay In The Loop
            </h2>
            <p className="mt-3 max-w-md text-ink/70">
              Get product updates, lending playbooks and Kenyan microfinance
              insights. No spam — unsubscribe anytime.
            </p>
            <form
              onSubmit={subscribe}
              className="mt-7 flex max-w-md items-center gap-2 rounded-full border-2 border-pine/15 bg-cream p-1.5 pl-5 shadow-card focus-within:border-pine/40">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
              />
              <button
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pine text-cream transition hover:rotate-45 hover:bg-forest"
                aria-label="Subscribe">
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </Reveal>
      </section>
  )
}

export default Subscribe