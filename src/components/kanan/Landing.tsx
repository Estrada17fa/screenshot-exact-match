import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Menu,
  X,
  ArrowDown,
  Check,
  ShieldCheck,
  HeartPulse,
  Languages,
  Camera,
  Shield,
  Plus,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { useLang } from "@/content/i18n";
import { team, waLink } from "@/content/data";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Plans } from "./Plans";
import { BookingProvider, useBooking } from "./booking-context";
import logoAsset from "@/assets/kanan-logo.png.asset.json";

export function SunMark({ className }: { className?: string }) {
  const rays = Array.from({ length: 16 });
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      {rays.map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="6"
          x2="50"
          y2="16"
          strokeWidth="4"
          transform={`rotate(${i * 22.5} 50 50)`}
        />
      ))}
      <path
        d="M50 50 m0 -2 a2 2 0 1 1 -2 2 a5 5 0 0 1 5 -5 a8 8 0 0 1 8 8 a11 11 0 0 1 -11 11 a14 14 0 0 1 -14 -14 a17 17 0 0 1 17 -17 a20 20 0 0 1 20 20"
        strokeWidth="4"
      />
    </svg>
  );
}

/** Static wrapper: content is always visible (no scroll-triggered opacity, no jumps). */
function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}

function SectionHead({ title, label }: { title: string; label: string }) {
  return (
    <Reveal className="mb-8 flex items-end justify-between gap-4 lg:mb-12">
      <h2 className="text-[36px] font-extrabold lg:text-[56px]">{title}</h2>
      <span className="pb-1 text-right text-sm text-muted-foreground">{label}</span>
    </Reveal>
  );
}

const btn =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const btnPink = cn(btn, "bg-pink text-pink-foreground");
const btnGhost = cn(btn, "border border-border text-foreground hover:bg-card");

function Wordmark() {
  return (
    <a href="#top" aria-label="Kanan Childcare">
      <img src={logoAsset.url} alt="Kanan Childcare" className="h-8 w-auto lg:h-10" />
    </a>
  );
}

function useSession() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    let unsub = () => {};
    import("@/integrations/supabase/client")
      .then(({ supabase }) => {
        supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
        const { data } = supabase.auth.onAuthStateChange((_e, s) =>
          setEmail(s?.user.email ?? null),
        );
        unsub = () => data.subscription.unsubscribe();
      })
      .catch(() => {});
    return () => unsub();
  }, []);
  return email;
}

function Navbar() {
  const { t, toggle } = useLang();
  const { openBooking } = useBooking();
  const [open, setOpen] = useState(false);
  const user = useSession();
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const links = [
    ["#planes", t.nav.services],
    ["#como-reservar", t.nav.how],
    ["#equipo", t.nav.team],
    ["#preguntas", t.nav.faq],
  ] as const;
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container-k flex h-16 items-center justify-between lg:h-20">
          <Wordmark />
          <nav className="flex items-center gap-2" aria-label="Principal">
            <ul className="mr-4 hidden items-center gap-8 lg:flex">
              {links.map(([h, l]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={toggle}
              aria-label={t.nav.langLabel}
              className="hidden min-h-11 min-w-11 rounded-full border border-border px-4 text-sm font-semibold hover:bg-card lg:block"
            >
              {t.nav.lang}
            </button>
            <Link
              to="/cuenta"
              className="hidden min-h-11 items-center px-3 text-sm font-semibold hover:text-sun lg:inline-flex"
            >
              {user ? t.nav.account : t.nav.login}
            </Link>
            <button
              type="button"
              onClick={() => openBooking()}
              className={cn(btnPink, "hidden lg:inline-flex")}
            >
              {t.nav.book}
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? t.nav.close : t.nav.menu}
              aria-expanded={open}
              aria-controls="menu-movil"
              className="grid size-11 place-items-center rounded-full bg-card lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </nav>
        </div>
      </header>
      {/* Rendered outside the header: its backdrop-blur would trap a fixed overlay. */}
      {open && (
        <div
          id="menu-movil"
          className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col overflow-y-auto bg-background px-5 pb-8 pt-4 lg:hidden"
        >
          <ul className="flex flex-col">
            {links.map(([h, l]) => (
              <li key={h} className="border-b border-border">
                <a
                  href={h}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display text-[32px] font-bold"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            {user ? (
              <Link to="/cuenta" onClick={() => setOpen(false)} className={cn(btnPink, "w-full")}>
                <UserRound className="size-5" />
                {t.nav.account}
              </Link>
            ) : (
              <>
                <Link
                  to="/cuenta"
                  search={{ modo: "registro" }}
                  onClick={() => setOpen(false)}
                  className={cn(btnPink, "w-full")}
                >
                  {t.nav.signup}
                </Link>
                <Link
                  to="/cuenta"
                  search={{ modo: "entrar" }}
                  onClick={() => setOpen(false)}
                  className={cn(btnGhost, "w-full")}
                >
                  {t.nav.login}
                </Link>
              </>
            )}
          </div>
          <div className="mt-auto flex items-center justify-between pt-10 text-sm text-muted-foreground">
            <span>{t.footer.city}</span>
            <button
              onClick={toggle}
              aria-label={t.nav.langLabel}
              className="min-h-11 min-w-11 rounded-full border border-border px-4 font-semibold text-foreground"
            >
              {t.nav.lang}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Rotating word with its width reserved for the longest word, so the headline never reflows. */
/** Each word carries its own period so it stays attached to the word. */
function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2500);
    return () => clearInterval(id);
  }, [words]);
  return (
    <span className="inline-grid text-sun" aria-live="polite">
      {words.map((w, j) => (
        <span
          key={w}
          className={cn("[grid-area:1/1]", j === i ? "word-in" : "invisible")}
          aria-hidden={j !== i}
        >
          {w}.
        </span>
      ))}
    </span>
  );
}

function Hero() {
  const { t } = useLang();
  const { openBooking } = useBooking();
  const [showBar, setShowBar] = useState(false);
  // Floating WhatsApp bar: only after the hero, and hidden while the plans are on screen
  // so it never covers a card's own "Reservar" button.
  useEffect(() => {
    let pastHero = false;
    let plansVisible = false;
    const update = () => setShowBar(pastHero && !plansVisible);
    const onScroll = () => {
      pastHero = window.scrollY > 420;
      update();
    };
    const planes = document.getElementById("planes");
    const io = planes
      ? new IntersectionObserver(([e]) => {
          plansVisible = !!e?.isIntersecting;
          update();
        })
      : null;
    if (planes && io) io.observe(planes);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);
  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-24 lg:pb-24 lg:pt-36">
      <div className="container-k lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-12">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="hero-in inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[13px] lg:px-4 lg:text-sm">
              <span className="size-2 rounded-full bg-pink" />
              {t.hero.badge}
            </span>
            <img
              src="/sol.png"
              alt=""
              aria-hidden="true"
              width={104}
              height={99}
              className="spin-slow -mr-6 size-[104px] shrink-0 object-contain lg:hidden"
            />
          </div>
          <h1
            className="hero-in mt-4 text-[44px] font-extrabold leading-[1] lg:mt-6 lg:text-[84px]"
            style={{ animationDelay: "100ms" }}
          >
            {t.hero.h1a}
            <br />
            {t.hero.h1b} <RotatingWord words={t.hero.words} />
          </h1>
          <p
            className="hero-in mt-4 max-w-md text-base text-muted-foreground lg:text-[17px]"
            style={{ animationDelay: "200ms" }}
          >
            {t.hero.sub}
          </p>
          <div className="hero-in mt-7 flex gap-3" style={{ animationDelay: "300ms" }}>
            <button
              type="button"
              onClick={() => openBooking()}
              className={cn(btnPink, "flex-1 sm:flex-none")}
            >
              {t.hero.book}
            </button>
            <a href="#planes" className={cn(btnGhost, "flex-1 sm:flex-none")}>
              {t.hero.cta2}
            </a>
          </div>
          <ul
            className="hero-in mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
            style={{ animationDelay: "400ms" }}
          >
            <li className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-sun" strokeWidth={3} />
              {t.hero.verified}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-sun" strokeWidth={3} />
              {t.hero.firstAid}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-sun" strokeWidth={3} />
              {t.hero.from}
            </li>
          </ul>
        </div>
        <div className="relative hidden aspect-square lg:block" aria-hidden="true">
          <div className="glow-sun absolute -inset-[15%]" />
          <img
            src="/sol.png"
            alt=""
            width={480}
            height={456}
            className="spin-slow relative h-full w-full object-contain"
          />
        </div>
      </div>

      <div
        className={cn(
          "glass fixed inset-x-3 bottom-3 z-40 flex items-center gap-2 rounded-full p-2 transition-all duration-300 lg:hidden",
          showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <a
          href={waLink(t.wa)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(btnPink, "flex-1")}
        >
          <MessageCircle className="size-5" />
          {t.hero.cta}
        </a>
        <a
          href="#planes"
          aria-label={t.hero.cta2}
          className="grid size-12 place-items-center rounded-full bg-card"
        >
          <ArrowDown className="size-5" />
        </a>
      </div>
    </section>
  );
}

function Carousel({
  count,
  children,
  className,
}: {
  count: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const w = (first?.offsetWidth ?? 1) + 16;
    setActive(Math.min(count - 1, Math.round(el.scrollLeft / w)));
  };
  return (
    <>
      <div
        ref={ref}
        onScroll={onScroll}
        className={cn(
          "no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0",
          className,
        )}
      >
        {children}
      </div>
      <div className="mt-6 flex justify-center gap-2 lg:hidden" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 rounded-full transition-all",
              i === active ? "w-6 bg-sun" : "w-2 bg-border",
            )}
          />
        ))}
      </div>
    </>
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
            const Icon = icons[i]!;
            const pink = i % 2 === 1;
            return (
              <Reveal key={i} delay={i * 80} className={cn(wide[i] ? "col-span-2" : "col-span-1")}>
                <div className="lift flex h-full min-h-[200px] flex-col rounded-[28px] border border-border bg-card p-6">
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-2xl",
                      pink ? "bg-pink/15 text-pink" : "bg-sun/15 text-sun",
                    )}
                  >
                    <Icon className="size-6" />
                  </span>
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
    <section id="equipo" className="section-k scroll-mt-20">
      <div className="container-k">
        <SectionHead title={t.team.title} label={t.team.label} />
        <Reveal>
          <p className="mb-8 max-w-2xl text-base text-muted-foreground lg:text-[17px]">
            {t.team.intro}
          </p>
        </Reveal>
        <Carousel count={team.length}>
          {team.map((p, i) => (
            <article
              key={i}
              className="flex w-[85%] shrink-0 snap-start flex-col rounded-[28px] border border-border bg-card p-6 sm:w-[45%] lg:w-auto"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "grid size-16 place-items-center rounded-full font-display text-2xl font-extrabold",
                    p.tone === "sun"
                      ? "bg-sun text-sun-foreground"
                      : "bg-pink text-pink-foreground",
                  )}
                  aria-hidden="true"
                >
                  {p.avatar === "sun" ? <SunMark className="size-10" /> : p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {p.years} {t.team.years}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-[15px]">“{p.style[lang]}”</p>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t.team.ages}</dt>
                  <dd className="font-medium">{p.kidsAges[lang]}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t.team.langs}</dt>
                  <dd className="text-right font-medium">{p.languages[lang]}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t.team.certs}</dt>
                  <dd className="mt-1 font-medium">{p.certs[lang].join(" · ")}</dd>
                </div>
              </dl>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={t.team.spec}>
                {p.specialties[lang].map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Carousel>
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Shield className="size-4 shrink-0 text-sun" />
          {t.team.note}
        </p>
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
            <p className="relative text-sm font-semibold uppercase tracking-widest">
              {t.meaning.label}
            </p>
            <h2 className="relative mt-4 max-w-xl text-[48px] font-extrabold lg:text-[88px]">
              {t.meaning.title}
            </h2>
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
    <section id="como-reservar" className="section-k scroll-mt-20">
      <div className="container-k">
        <SectionHead title={t.steps.title} label={t.steps.label} />
        <ol className="grid divide-y divide-border border-y border-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {t.steps.items.map((s, i) => (
            <li key={i} className="flex gap-6 py-8 lg:flex-col lg:px-8 lg:first:pl-0">
              <span className="font-display text-4xl font-extrabold text-pink">0{i + 1}</span>
              <div>
                <h3 className="text-2xl font-bold">{s.t}</h3>
                <p className="mt-2 text-[15px] text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useLang();
  return (
    <section id="preguntas" className="section-k scroll-mt-20">
      <div className="container-k">
        <SectionHead title={t.faq.title} label={t.faq.label} />
        <div className="grid gap-3">
          {t.faq.items.map((f, i) => (
            <details key={i} className="group rounded-[28px] border border-border bg-card px-6">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold lg:text-lg [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-5 shrink-0 text-sun transition-transform group-open:rotate-45" />
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
            <h2 className="relative mx-auto max-w-2xl text-[36px] font-extrabold lg:text-[56px]">
              {t.cta.title}
            </h2>
            <p className="relative mt-4 text-muted-foreground">{t.cta.text}</p>
            <a
              href={waLink(t.wa)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(btnPink, "relative mt-8 w-full max-w-md")}
            >
              <MessageCircle className="size-5" />
              {t.cta.button}
            </a>
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
        <div>
          <Wordmark />
          <p className="mt-2 text-sm text-muted-foreground">{t.footer.city}</p>
        </div>
        <ul className="flex flex-wrap gap-6 text-sm">
          <li>
            <a href="#" className="inline-block py-3 hover:text-sun">
              Instagram
            </a>
          </li>
          <li>
            <a href="#" className="inline-block py-3 hover:text-sun">
              Facebook
            </a>
          </li>
          <li>
            <Link to="/aviso-de-privacidad" className="inline-block py-3 hover:text-sun">
              {t.footer.privacy}
            </Link>
          </li>
          <li>
            <Link to="/cancelaciones" className="inline-block py-3 hover:text-sun">
              {t.footer.cancel}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <BookingProvider>
      <Navbar />
      <main>
        <Hero />
        <Plans />
        <Steps />
        <Why />
        <Team />
        <Meaning />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </BookingProvider>
  );
}
