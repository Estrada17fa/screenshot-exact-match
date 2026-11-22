import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Sun, Moon, Stars, PartyPopper, Home, Plane, Check } from "lucide-react";
import { plans } from "@/content/plans";
import { waLink } from "@/content/data";
import type { PlanKey } from "@/lib/booking";
import { cn } from "@/lib/utils";
import { BookingDialog } from "./BookingDialog";

const icons: Record<PlanKey, typeof Sun> = { sol: Sun, luna: Moon, suenos: Stars, fiesta: PartyPopper, casa: Home, viajera: Plane };
const tone = { sun: "bg-sun text-sun-foreground", pink: "bg-pink text-pink-foreground", dark: "bg-card text-card-foreground border border-border" } as const;

export function Plans() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [booking, setBooking] = useState<PlanKey | null>(null);
  const [lastPlan, setLastPlan] = useState<PlanKey>("sol");
  const drag = useRef<{ x: number; left: number } | null>(null);

  const cardAt = (i: number) => ref.current?.children[i] as HTMLElement | undefined;
  const goTo = (i: number, smooth = true) => {
    const el = ref.current; const card = cardAt(i); if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: smooth ? "smooth" : "auto" });
  };
  useEffect(() => { goTo(0, false); }, []);
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0, dist = Infinity;
    Array.from(el.children).forEach((c, i) => { const h = c as HTMLElement; const d = Math.abs(h.offsetLeft + h.offsetWidth / 2 - center); if (d < dist) { dist = d; best = i; } });
    setActive(best);
  };
  const open = (k: PlanKey) => { setLastPlan(k); setBooking(k); };

  return (
    <section id="planes" className="section-k scroll-mt-16">
      <div className="container-k mb-8 flex items-end justify-between gap-4 lg:mb-12">
        <h2 className="text-[36px] font-extrabold lg:text-[56px]">Planes</h2>
        <span className="pb-1 text-right text-sm text-muted-foreground">precio por hora, por niñera</span>
      </div>
      <div className="relative mx-auto max-w-[1100px]">
        <div
          ref={ref} onScroll={onScroll}
          onPointerDown={(e) => { if (e.pointerType === "mouse" && ref.current) drag.current = { x: e.clientX, left: ref.current.scrollLeft }; }}
          onPointerMove={(e) => { if (drag.current && ref.current) { ref.current.style.scrollSnapType = "none"; ref.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x); } }}
          onPointerUp={() => { if (drag.current && ref.current) { ref.current.style.scrollSnapType = ""; drag.current = null; goTo(active); } }}
          onPointerLeave={() => { if (drag.current && ref.current) { ref.current.style.scrollSnapType = ""; drag.current = null; goTo(active); } }}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc((100%-min(78vw,320px))/2)] pb-2 lg:cursor-grab lg:gap-6 lg:px-[calc((100%-320px)/2)]"
        >
          {plans.map((p, i) => {
            const Icon = icons[p.key];
            const dark = p.tone === "dark";
            return (
              <article key={p.key} aria-label={`Plan ${p.name}`} onClick={() => i !== active && goTo(i)}
                className={cn("flex aspect-[3/5] w-[min(78vw,320px)] shrink-0 snap-center select-none flex-col rounded-[28px] p-6 transition-opacity lg:w-[320px]", tone[p.tone], i === active ? "opacity-100" : "opacity-70")}>
                <Icon className={cn("size-8", dark && "text-sun")} strokeWidth={1.75} />
                <h3 className="mt-5 text-[40px] font-extrabold leading-none lowercase">{p.name}</h3>
                <p className="mt-2 text-[15px] opacity-75">{p.desc}</p>
                <p className="mt-5 font-display font-extrabold">
                  {p.perHour ? <><span className="text-[34px] leading-none">{p.price}</span><span className="text-base font-medium opacity-70"> /hr</span></> : <span className="text-2xl leading-tight">{p.price}</span>}
                </p>
                <hr className="my-5 border-current opacity-15" />
                <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Incluye</p>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {p.includes.map((it) => <li key={it} className="flex gap-2.5"><Check className={cn("mt-0.5 size-[18px] shrink-0", dark ? "text-sun/70" : "opacity-60")} />{it}</li>)}
                </ul>
                <div className="mt-auto grid gap-2 pt-5">
                  <button type="button" onClick={(e) => { e.stopPropagation(); open(p.key); }}
                    className={cn("min-h-12 rounded-full font-semibold", p.tone === "pink" ? "bg-background text-foreground" : "bg-pink text-pink-foreground")}>Reservar</button>
                  <a href={waLink(`Hola, quiero más información del plan ${p.name} de Kanan.`)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-current/30 text-sm font-semibold"><MessageCircle className="size-4" />Más info por WhatsApp</a>
                </div>
              </article>
            );
          })}
        </div>
        <button type="button" aria-label="Plan anterior" onClick={() => goTo(Math.max(0, active - 1))} disabled={active === 0}
          className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-card disabled:opacity-30 lg:grid"><ChevronLeft className="size-5" /></button>
        <button type="button" aria-label="Plan siguiente" onClick={() => goTo(Math.min(plans.length - 1, active + 1))} disabled={active === plans.length - 1}
          className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-card disabled:opacity-30 lg:grid"><ChevronRight className="size-5" /></button>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {plans.map((p, i) => <button key={p.key} type="button" aria-label={`Ver plan ${p.name}`} onClick={() => goTo(i)} className={cn("h-2 rounded-full transition-all", i === active ? "w-6 bg-sun" : "w-2 bg-border")} />)}
      </div>
      <BookingDialog plan={booking ?? lastPlan} open={booking !== null} onOpenChange={(o) => !o && setBooking(null)} />
    </section>
  );
}
