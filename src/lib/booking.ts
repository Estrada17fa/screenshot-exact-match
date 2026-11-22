import { z } from "zod";

export type PlanKey = "sol" | "luna" | "suenos" | "fiesta" | "casa" | "viajera";
export const PLAN_RATES: Record<PlanKey, number | null> = { sol: 170, luna: 190, suenos: 180, fiesta: 250, casa: null, viajera: null };
export const NO_MIN_PLANS: PlanKey[] = ["casa", "viajera"];
export const MIN_HOURS = 3;
export const MIN_ADVANCE_HOURS = 12;
export const MUNICIPIOS = ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Tlajomulco", "Otro"] as const;
/** Mexico City has no daylight saving time since 2022: fixed UTC-6. */
const MX_OFFSET_HOURS = 6;

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return (h ?? 0) * 60 + (m ?? 0); };

/** Hours between start and end; if end is not after start, it ends the next day. */
export function bookingHours(start: string, end: string): number {
  let diff = toMin(end) - toMin(start);
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 100) / 100;
}

export function estimateTotal(plan: PlanKey, hours: number, nannies: number): number | null {
  const rate = PLAN_RATES[plan];
  if (rate == null) return null;
  return Math.round(rate * hours * (plan === "fiesta" ? nannies : 1));
}

/** UTC instant for a Mexico City local date (YYYY-MM-DD) and time (HH:mm). */
export function mxInstant(date: string, time: string): number {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  return Date.UTC(y ?? 0, (mo ?? 1) - 1, d ?? 1, (h ?? 0) + MX_OFFSET_HOURS, mi ?? 0);
}

/** Today's date in Mexico City as YYYY-MM-DD. */
export function mxToday(now = Date.now()): string {
  return new Date(now - MX_OFFSET_HOURS * 3600_000).toISOString().slice(0, 10);
}

export function hasEnoughNotice(date: string, start: string, now = Date.now()): boolean {
  return mxInstant(date, start) - now >= MIN_ADVANCE_HOURS * 3600_000;
}

export const bookingSchema = z.object({
  plan: z.enum(["sol", "luna", "suenos", "fiesta", "casa", "viajera"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  nannies_count: z.number().int().min(1).max(5),
  children_count: z.number().int().min(1).max(6),
  children_ages: z.array(z.number().int().min(0).max(17)).min(1).max(6),
  notes: z.string().trim().max(1000).optional(),
  municipio: z.enum(MUNICIPIOS),
  colonia: z.string().trim().min(2).max(100),
  name: z.string().trim().min(2).max(100),
  whatsapp: z.string().regex(/^\d{10}$/),
  email: z.string().trim().email().max(255),
  accepted: z.literal(true),
  website: z.string().max(0).optional(), // honeypot
}).superRefine((v, ctx) => {
  if (v.children_ages.length !== v.children_count) ctx.addIssue({ code: "custom", message: "ages", path: ["children_ages"] });
  if (!NO_MIN_PLANS.includes(v.plan) && bookingHours(v.start_time, v.end_time) < MIN_HOURS) ctx.addIssue({ code: "custom", message: "min_hours", path: ["end_time"] });
  if (v.plan !== "fiesta" && v.nannies_count !== 1) ctx.addIssue({ code: "custom", message: "nannies", path: ["nannies_count"] });
});
export type BookingInput = z.infer<typeof bookingSchema>;
