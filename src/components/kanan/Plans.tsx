import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Sun,
  Moon,
  Stars,
  PartyPopper,
  Home,
  Plane,
  Check,
} from "lucide-react";
import { plans } from "@/content/plans";
import { waLink } from "@/content/data";
import type { PlanKey } from "@/lib/booking";
import { cn } from "@/lib/utils";
import { useBooking } from "./booking-context";

const icons: Record<PlanKey, typeof Sun> = {
  sol: Sun,
  luna: Moon,
  suenos: Stars,
  fiesta: PartyPopper,
  casa: Home,
  viajera: Plane,
};
const tone = {
  sun: "bg-sun text-sun-foreground",
  pink: "bg-pink text-pink-foreground",
  dark: "bg-card text-card-foreground border border-border",
} as const;

/**
 * Centered, swipeable plan cards (3:5). Native scroll-snap only: no drag hacks or
 * click-to-scroll on the cards, so nothing jumps under the user's finger.
 */
export function Plans() {
  const { openBooking } = useBooking();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const cards = () => Array.from(track.current?.children ?? []) as HTMLElement[];
  const goTo = (i: number, smooth = true) => {
    const el = track.current;
    const card = cards()[i];
    if (!el || !card) return;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    goTo(0, false);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2;
        let best = 0,
          dist = Infinity;
        cards().forEach((c, i) => {
          const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="planes" className="scroll-mt-16 pb-14 pt-6 lg:scroll-mt-20 lg:py-[112px]">
      <div className="container-k mb-5 flex items-baseline justify-between gap-4 lg:mb-10">
        <h2 className="text-[36px] font-extrabold lg:text-[56px]">Planes</h2>
        <span className="text-sm text-muted-foreground">precio por hora</span>
      </div>

      <div className="relative mx-auto max-w-[1100px]">
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[calc((100%-min(74vw,300px))/2)] py-1 lg:gap-6 lg:px-[calc((100%-320px)/2)]"
        >
          {plans.map((p, i) => {
            const Icon = icons[p.key];
            const dark = p.tone === "dark";
            return (
              <article
                key={p.key}
                aria-label={`Plan ${p.name}`}
                className={cn(
                  "flex aspect-[3/5] w-[min(74vw,300px)] shrink-0 snap-center snap-always flex-col rounded-[28px] p-5 lg:p-6 transition-transform duration-300 lg:w-[320px]",
                  tone[p.tone],
                  i === active ? "scale-100" : "scale-[0.96]",
                )}
              >
                <Icon
                  className={cn("size-7", dark && "text-sun")}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h3 className="mt-3 text-[34px] font-extrabold leading-none lowercase lg:text-[38px]">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm opacity-75">{p.desc}</p>
                <p className="mt-3 font-display font-extrabold">
                  {p.perHour ? (
                    <>
                      <span className="text-[30px] leading-none">{p.price}</span>
                      <span className="text-base font-medium opacity-70"> /hr</span>
                    </>
                  ) : (
                    <span className="text-2xl leading-tight">{p.price}</span>
                  )}
                </p>
                <hr className="my-3.5 border-current opacity-15" />
                <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Incluye</p>
                <ul className="mt-2 space-y-1.5 text-[13.5px] leading-snug">
                  {p.includes.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <Check
                        className={cn("mt-px size-4 shrink-0", dark ? "text-sun/70" : "opacity-60")}
                        aria-hidden="true"
                      />
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto grid gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => openBooking(p.key)}
                    className={cn(
                      "min-h-12 rounded-full font-semibold transition-transform active:scale-[0.98]",
                      p.tone === "pink"
                        ? "bg-background text-foreground"
                        : "bg-pink text-pink-foreground",
                    )}
                  >
                    Reservar
                  </button>
                  <a
                    href={waLink(`Hola, quiero más información del plan ${p.name} de Kanan.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-current/30 text-sm font-semibold"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Más info por WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Plan anterior"
          onClick={() => goTo(Math.max(0, active - 1))}
          disabled={active === 0}
          className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-card disabled:opacity-30 lg:grid"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Plan siguiente"
          onClick={() => goTo(Math.min(plans.length - 1, active + 1))}
          disabled={active === plans.length - 1}
          className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-card disabled:opacity-30 lg:grid"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-5 flex justify-center gap-1">
        {plans.map((p, i) => (
          <button
            key={p.key}
            type="button"
            aria-label={`Ver plan ${p.name}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className="grid h-11 w-6 place-items-center"
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-all",
                i === active ? "w-6 bg-sun" : "w-2 bg-border",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
