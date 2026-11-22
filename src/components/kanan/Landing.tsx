import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X, ArrowDown, Check, ShieldCheck, HeartPulse, Languages, Camera, Shield, Sun as SunI, Moon, Stars, PartyPopper, Home, Plane, Plus, MessageCircle } from "lucide-react";
import { useLang } from "@/content/i18n";
import { services, team, waLink, type Tone } from "@/content/data";
import { cn } from "@/lib/utils";

export function SunMark({ className }: { className?: string }) {
  const rays = Array.from({ length: 16 });
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      {rays.map((_, i) => (
        <line key={i} x1="50" y1="6" x2="50" y2="16" strokeWidth="4" transform={`rotate(${i * 22.5} 50 50)`} />
      ))}
      <path d="M50 50 m0 -2 a2 2 0 1 1 -2 2 a5 5 0 0 1 5 -5 a8 8 0 0 1 8 8 a11 11 0 0 1 -11 11 a14 14 0 0 1 -14 -14 a17 17 0 0 1 17 -17 a20 20 0 0 1 20 20" strokeWidth="4" />
    </svg>
  );
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={cn("fade-up", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function SectionHead({ title, label }: { title: string; label: string }) {
  return (
    <Reveal className="mb-8 flex items-end justify-between gap-4 lg:mb-12">
      <h2 className="text-[36px] font-extrabold lg:text-[56px]">{title}</h2>
      <span className="pb-1 text-right text-sm text-muted-foreground">{label}</span>
    </Reveal>
  );
}

const btn = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const btnPink = cn(btn, "bg-pink text-pink-foreground");
const btnGhost = cn(btn, "border border-border text-foreground hover:bg-card");

function Wordmark() {
  return <a href="#top" className="font-display text-2xl font-extrabold tracking-tight">k'anan<span className="text-sun">.</span></a>;
}

function Navbar() {
  const { t, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [["#servicios", t.nav.services], ["#equipo", t.nav.team], ["#preguntas", t.nav.faq]] as const;
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all", scrolled || open ? "glass border-x-0 border-t-0" : "border-b border-transparent")}>
      <div className="container-k flex h-16 items-center justify-between lg:h-20">
        <Wordmark />
        <nav className="flex items-center gap-2">
          <ul className="mr-4 hidden items-center gap-8 lg:flex">
            {links.map(([h, l]) => <li key={h}><a href={h} className="text-sm font-medium text-muted-foreground hover:text-foreground">{l}</a></li>)}
          </ul>
          <button onClick={toggle} aria-label={t.nav.langLabel} className="min-h-11 min-w-11 rounded-full border border-border px-4 text-sm font-semibold hover:bg-card">{t.nav.lang}</button>
          <a href={waLink(t.wa)} target="_blank" rel="noopener noreferrer" className={cn(btnPink, "hidden lg:inline-flex")}>{t.nav.book}</a>
          <button onClick={() => setOpen(!open)} aria-label={open ? t.nav.close : t.nav.menu} aria-expanded={open} className="grid size-11 place-items-center rounded-full bg-card lg:hidden">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </div>
      {open && (
        <ul className="container-k flex flex-col gap-1 pb-6 lg:hidden">
          {links.map(([h, l]) => <li key={h}><a href={h} onClick={() => setOpen(false)} className="block py-3 font-display text-3xl font-bold">{l}</a></li>)}
          <li className="pt-2"><a href={waLink(t.wa)} target="_blank" rel="noopener noreferrer" className={cn(btnPink, "w-full")}>{t.nav.book}</a></li>
        </ul>
      )}
    </header>
  );
}

function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden pb-28 pt-24 lg:min-h-0 lg:pb-[112px] lg:pt-36">
      <div className="container-k grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"><span className="size-2 rounded-full bg-pink" />{t.hero.badge}</span>
          <h1 className="mt-6 text-[50px] font-extrabold lg:text-[96px]">{t.hero.h1a} <span className="text-sun">{t.hero.h1b}</span></h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground lg:text-[17px]">{t.hero.sub}</p>
          <div className="mt-8 hidden gap-3 lg:flex">
            <a href={waLink(t.wa)} target="_blank" rel="noopener noreferrer" className={btnPink}><MessageCircle className="size-5" />{t.hero.cta}</a>
            <a href="#servicios" className={btnGhost}>{t.hero.cta2}</a>
          </div>
        </Reveal>
        <Reveal delay={150} className="relative mx-auto w-full max-w-[420px] lg:max-w-[520px]">
          <div className="glow-sun absolute -inset-16" />
          <div className="relative aspect-square overflow-hidden rounded-full bg-sun">
            <SunMark className="spin-slow absolute inset-[12%] text-sun-foreground/85" />
            <span className="sr-only">{t.hero.imgAlt}</span>
          </div>
          <div className="glass absolute left-0 top-[12%] flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold -rotate-2">
            <span className="grid size-5 place-items-center rounded-full bg-sun text-sun-foreground"><Check className="size-3.5" strokeWidth={3} /></span>{t.hero.verified}
          </div>
          <div className="absolute bottom-[10%] right-0 rotate-2 rounded-full bg-pink px-4 py-2 text-sm font-bold text-pink-foreground">{t.hero.from}</div>
        </Reveal>
      </div>
      <div className="glass fixed inset-x-3 bottom-3 z-40 flex items-center gap-2 rounded-full p-2 lg:hidden">
        <a href={waLink(t.wa)} target="_blank" rel="noopener noreferrer" className={cn(btnPink, "flex-1")}><MessageCircle className="size-5" />{t.hero.cta}</a>
        <a href="#servicios" aria-label={t.hero.cta2} className="grid size-12 place-items-center rounded-full bg-card"><ArrowDown className="size-5" /></a>
      </div>
    </section>
  );
}

const serviceIcons = { sol: SunI, luna: Moon, suenos: Stars, fiesta: PartyPopper, casa: Home, viajera: Plane };
const toneCls: Record<Tone, string> = {
  sun: "bg-sun text-sun-foreground",
  pink: "bg-pink text-pink-foreground",
  dark: "bg-card text-card-foreground border border-border",
};

function Carousel({ count, children, className }: { count: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const w = (first?.offsetWidth ?? 1) + 16;
    setActive(Math.min(count - 1, Math.round(el.scrollLeft / w)));
  };
  return (
    <>
      <div ref={ref} onScroll={onScroll} className={cn("no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0", className)}>
        {children}
      </div>
      <div className="mt-6 flex justify-center gap-2 lg:hidden" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => <span key={i} className={cn("h-2 rounded-full transition-all", i === active ? "w-6 bg-sun" : "w-2 bg-border")} />)}
      </div>
    </>
  );
}

function Services() {
  const { t } = useLang();
  return (
    <section id="servicios" className="section-k scroll-mt-16">
      <div className="container-k">
        <SectionHead title={t.services.title} label={t.services.label} />
        <Carousel count={services.length}>
          {services.map(({ key, tone }) => {
            const s = t.services.items[key]; const Icon = serviceIcons[key];
            const isPrice = s.price.includes("$");
            return (
              <a key={key} href={waLink(t.waService(s.name))} target="_blank" rel="noopener noreferrer"
                className={cn("lift flex h-[300px] w-[78%] shrink-0 snap-start flex-col rounded-[28px] p-6 sm:w-[45%] lg:w-auto", toneCls[tone])}>
                <Icon className="size-8" />
                <h3 className="mt-auto text-[40px] font-extrabold lowercase">{s.name}</h3>
                <p className="mt-2 text-[15px] opacity-80">{s.desc}</p>
                <p className="mt-5 font-display text-2xl font-bold">{s.price}{isPrice && <span className="text-base font-medium opacity-70"> {t.services.perHour}</span>}</p>
              </a>
            );
          })}
        </Carousel>
      </div>
    </section>
  );
}

function Why() {
  const { t } = useLang();
  const icons = [ShieldCheck, HeartPulse, Languages, Camera];
  const wide = [true, false, false, true];
  return (
    <section className="section-k">
      <div className="container-k">
        <SectionHead title={t.why.title} label={t.why.label} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {t.why.items.map((it, i) => {
            const Icon = icons[i]!; const pink = i % 2 === 1;
            return (
              <Reveal key={i} delay={i * 80} className={cn(wide[i] ? "col-span-2" : "col-span-1")}>
                <div className="lift flex h-full min-h-[200px] flex-col rounded-[28px] border border-border bg-card p-6">
                  <span className={cn("grid size-12 place-items-center rounded-2xl", pink ? "bg-pink/15 text-pink" : "bg-sun/15 text-sun")}><Icon className="size-6" /></span>
                  <h3 className="mt-auto pt-6 text-2xl font-bold">{it.t}</h3>
                  <p className="mt-2 text-[15px] text-muted-foreground">{it.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Team() {
  const { t, lang } = useLang();
  return (
    <section id="equipo" className="section-k scroll-mt-16">
      <div className="container-k">
        <SectionHead title={t.team.title} label={t.team.label} />
        <Reveal><p className="mb-8 max-w-2xl text-base text-muted-foreground lg:text-[17px]">{t.team.intro}</p></Reveal>
        <Carousel count={team.length}>
          {team.map((p, i) => (
            <article key={i} className="flex w-[85%] shrink-0 snap-start flex-col rounded-[28px] border border-border bg-card p-6 sm:w-[45%] lg:w-auto">
              <div className="flex items-center gap-4">
                <div className={cn("grid size-16 place-items-center rounded-full font-display text-2xl font-extrabold", p.tone === "sun" ? "bg-sun text-sun-foreground" : "bg-pink text-pink-foreground")} aria-hidden="true">
                  {p.avatar === "sun" ? <SunMark className="size-10" /> : p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.years} {t.team.years}</p>
                </div>
              </div>
              <p className="mt-5 text-[15px]">“{p.style[lang]}”</p>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{t.team.ages}</dt><dd className="font-medium">{p.kidsAges[lang]}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{t.team.langs}</dt><dd className="text-right font-medium">{p.languages[lang]}</dd></div>
                <div><dt className="text-muted-foreground">{t.team.certs}</dt><dd className="mt-1 font-medium">{p.certs[lang].join(" · ")}</dd></div>
              </dl>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={t.team.spec}>
                {p.specialties[lang].map((s) => <li key={s} className="rounded-full border border-border px-3 py-1 text-xs font-medium">{s}</li>)}
              </ul>
            </article>
          ))}
        </Carousel>
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground"><Shield className="size-4 shrink-0 text-sun" />{t.team.note}</p>
      </div>
    </section>
  );
}

function Meaning() {
  const { t } = useLang();
  return (
    <section className="section-k">
      <div className="container-k">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-sun p-8 text-sun-foreground lg:p-16">
            <SunMark className="spin-slow absolute -right-16 -top-16 size-56 opacity-90 lg:size-80" />
            <p className="relative text-sm font-semibold uppercase tracking-widest">{t.meaning.label}</p>
            <h2 className="relative mt-4 max-w-xl text-[48px] font-extrabold lg:text-[88px]">{t.meaning.title}</h2>
            <p className="relative mt-6 max-w-md text-base lg:text-[17px]">{t.meaning.text}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Steps() {
  const { t } = useLang();
  return (
    <section className="section-k">
      <div className="container-k">
        <SectionHead title={t.steps.title} label={t.steps.label} />
        <ol className="grid divide-y divide-border border-y border-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {t.steps.items.map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <li className="flex gap-6 py-8 lg:flex-col lg:px-8 lg:first:pl-0">
                <span className="font-display text-4xl font-extrabold text-pink">0{i + 1}</span>
                <div><h3 className="text-2xl font-bold">{s.t}</h3><p className="mt-2 text-[15px] text-muted-foreground">{s.d}</p></div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useLang();
  return (
    <section id="preguntas" className="section-k scroll-mt-16">
      <div className="container-k">
        <SectionHead title={t.faq.title} label={t.faq.label} />
        <div className="grid gap-3">
          {t.faq.items.map((f, i) => (
            <details key={i} className="group rounded-[28px] border border-border bg-card px-6">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold lg:text-lg [&::-webkit-details-marker]:hidden">
                {f.q}<Plus className="size-5 shrink-0 text-sun transition-transform group-open:rotate-45" />
              </summary>
              <p className="pb-6 text-[15px] text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const { t } = useLang();
  return (
    <section className="section-k">
      <div className="container-k">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-border bg-card px-6 py-14 text-center lg:py-24">
            <div className="glow-sun absolute -top-40 left-1/2 h-80 w-[140%] -translate-x-1/2" />
            <h2 className="relative mx-auto max-w-2xl text-[36px] font-extrabold lg:text-[56px]">{t.cta.title}</h2>
            <p className="relative mt-4 text-muted-foreground">{t.cta.text}</p>
            <a href={waLink(t.wa)} target="_blank" rel="noopener noreferrer" className={cn(btnPink, "relative mt-8 w-full max-w-md")}><MessageCircle className="size-5" />{t.cta.button}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border pb-28 pt-12 lg:pb-12">
      <div className="container-k flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div><Wordmark /><p className="mt-2 text-sm text-muted-foreground">{t.footer.city}</p></div>
        <ul className="flex flex-wrap gap-6 text-sm">
          <li><a href="#" className="inline-block py-3 hover:text-sun">Instagram</a></li>
          <li><a href="#" className="inline-block py-3 hover:text-sun">Facebook</a></li>
          <li><a href="#" className="inline-block py-3 hover:text-sun">{t.footer.privacy}</a></li>
        </ul>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <>
      <Navbar />
      <main><Hero /><Services /><Why /><Team /><Meaning /><Steps /><Faq /><FinalCta /></main>
      <Footer />
    </>
  );
}
