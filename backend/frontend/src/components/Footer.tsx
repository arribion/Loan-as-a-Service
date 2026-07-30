import Logo from './ui/Logo'

const SOCIALS: { label: string; path: string }[] = [
  {
    label: "X",
    path: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20z",
  },
  {
    label: "Facebook",
    path: "M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.4V14h2.7v8h3.4z",
  },
  {
    label: "Instagram",
    path: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.8.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4-1.3-.1-1.7-.1-4.8-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.2-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z",
  },
  {
    label: "LinkedIn",
    path: "M6.9 8.6H3.6V21h3.3V8.6zM5.3 3.4a1.9 1.9 0 1 0 0 3.9 1.9 1.9 0 0 0 0-3.9zM21 13.7c0-3.2-1.7-4.7-4-4.7-1.8 0-2.6 1-3.1 1.7V8.6H10.6c0 .9 0 12.4 0 12.4h3.3v-6.9c0-.4 0-.7.1-1 .3-.7.9-1.4 1.9-1.4 1.4 0 1.9 1 1.9 2.6V21H21v-7.3z",
  },
];

const Footer = () => {
  return (
      <footer className="bg-pine pb-8 pt-14 text-cream/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">The loan operating system for SACCOs, chamas and microfinance brands across Kenya.</p>
          </div>
          {[
            ["Quick Links", ["Home", "Features", "Pricing", "Contact"]],
            ["Legal", ["Terms of Service", "Privacy Policy", "Cookie Policy", "GDPR Compliance"]],
            ["Support", ["Help Center", "FAQs", "System Status"]],
          ].map(([h, links]) => (
            <div key={h as string}>
              <p className="mb-4 font-display text-sm font-bold text-cream">{h}</p>
              <ul className="space-y-2.5 text-sm">
                {(links as string[]).map((l) => (
                    <li key={l}><button
                        // onClick={() => scrollTo(l === "Features" ? "features" : l === "Pricing" ? "pricing" : "top")}
                        className="transition hover:text-gold">{l}</button></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="mb-4 font-display text-sm font-bold text-cream">Stay Connected</p>
            <div className="flex gap-2.5">
              {SOCIALS.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="grid h-9 w-9 place-items-center rounded-full border border-cream/15 text-cream/70 transition hover:border-gold hover:text-gold">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-cream/10 px-5 pt-6 text-xs text-cream/40 lg:px-8">
          <Logo light compact />
          <p>© {new Date().getFullYear()} MkopoOS Ltd · Nairobi, Kenya. Demo product — figures shown are illustrative.</p>
        </div>
      </footer>
  )
}

export default Footer