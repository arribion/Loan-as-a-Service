import { useState } from 'react'
import { Link } from 'react-router-dom';
import { Reveal } from './ui/ScrollReveal';
import { ArrowRight, Check, Pill } from 'lucide-react';
import { cn } from '../utils/cn';

import { PLANS } from '../data/mock';

const Pricing = () => {
      const [annual, setAnnual] = useState(false);
  return (
          <section id="pricing" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <Reveal className="text-center">
              <Pill>Pricing</Pill>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">Simple, Transparent Pricing</h2>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/8 bg-cream p-1.5 text-sm font-semibold shadow-card">
                <button onClick={() => setAnnual(false)} className={cn("rounded-full px-4 py-1.5 transition", !annual ? "bg-pine text-cream" : "text-ink/55")}>Monthly</button>
                <button onClick={() => setAnnual(true)} className={cn("rounded-full px-4 py-1.5 transition", annual ? "bg-pine text-cream" : "text-ink/55")}>Annual <span className={annual ? "text-gold" : "text-golddeep"}>−20%</span></button>
              </div>
            </Reveal>
            <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
              {PLANS.map((p, i) => {
                const price = p.monthly === null ? null : annual ? Math.round(p.monthly * 0.8) : p.monthly;
                return (
                  <Reveal key={p.id} delay={i * 100} className="h-full">
                    <div className={cn(
                      "relative flex h-full flex-col rounded-2xl bg-cream p-7 transition duration-300 hover:-translate-y-1.5",
                      p.highlight ? "border-2 border-pine shadow-lift lg:-translate-y-2" : "border border-ink/8 shadow-card hover:shadow-lift"
                    )}>
                      {p.highlight && (
                        <span className="absolute -top-3.5 left-7 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink shadow-card">Most Popular</span>
                      )}
                      <span className="w-fit rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">{p.name}</span>
                      <div className="mt-5 flex items-baseline gap-1 rounded-xl bg-gold/25 px-4 py-3">
                        {price === null ? (
                          <span className="font-display text-2xl font-bold text-ink">Custom Pricing</span>
                        ) : (
                          <>
                            <span className="font-display text-3xl font-bold tabular-nums text-ink">KES {price.toLocaleString()}</span>
                            <span className="text-sm font-semibold text-ink/55">/Month</span>
                          </>
                        )}
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-ink/55">{p.tagline}. {p.memberCap === Infinity ? "Unlimited members." : `Up to ${p.memberCap} members.`}</p>
                      <ul className="mt-5 flex-1 space-y-2.5 text-sm text-ink/70">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={3} /> {f}</li>
                        ))}
                      </ul>
                      <Link
                        to={`/register?plan=${p.id}`}
                        className={cn(
                          "mt-7 inline-flex items-center justify-center gap-2 rounded-full py-3 font-bold transition",
                          p.highlight ? "bg-pine text-cream hover:bg-forest" : "border-2 border-ink/12 text-ink hover:border-forest hover:text-forest"
                        )}
                      >
                        {p.id === "enterprise" ? "Contact Sales" : `Choose ${p.name}`} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <p className="mt-8 text-center text-sm text-ink/45">All plans include M-Pesa integration, unlimited loans and free spreadsheet migration. Prices exclude 16% VAT.</p>
          </section>
  )
}

export default Pricing