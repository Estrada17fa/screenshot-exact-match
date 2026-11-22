import { createServerFn } from "@tanstack/react-start";
import { bookingSchema, bookingHours, estimateTotal, hasEnoughNotice, mxToday } from "./booking";

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const, folio: "K-0000" }; // honeypot: pretend success
    if (data.date < mxToday() || !hasEnoughNotice(data.date, data.start_time)) return { ok: false as const, error: "notice" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count } = await supabaseAdmin.from("bookings").select("id", { count: "exact", head: true }).eq("whatsapp", data.whatsapp).gte("created_at", since);
    if ((count ?? 0) >= 3) return { ok: false as const, error: "rate" };
    const hours = bookingHours(data.start_time, data.end_time);
    const nannies = data.plan === "fiesta" ? data.nannies_count : 1;
    const { data: row, error } = await supabaseAdmin.from("bookings").insert({
      plan: data.plan, date: data.date, start_time: data.start_time, end_time: data.end_time, hours,
      nannies_count: nannies, children_count: data.children_count, children_ages: data.children_ages,
      notes: data.notes || null, municipio: data.municipio, colonia: data.colonia, name: data.name,
      whatsapp: data.whatsapp, email: data.email, estimated_total: estimateTotal(data.plan, hours, nannies),
    }).select("folio").single();
    if (error || !row) { console.error("booking insert failed", error?.message); return { ok: false as const, error: "server" }; }
    return { ok: true as const, folio: row.folio };
  });
