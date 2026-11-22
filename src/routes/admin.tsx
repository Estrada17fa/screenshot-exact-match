import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, MessageCircle, CreditCard, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { planByKey } from "@/content/plans";
import type { PlanKey } from "@/lib/booking";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/kanan-logo.png.asset.json";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Panel · Kanan Childcare" }, { name: "description", content: "Panel interno de reservas de Kanan Childcare." }, { name: "robots", content: "noindex, nofollow" }, { property: "og:title", content: "Panel · Kanan Childcare" }, { property: "og:description", content: "Panel interno de reservas." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  ssr: false,
  component: AdminPage,
});

type Booking = Tables<"bookings">;
const STATUSES = ["pendiente", "confirmada", "pagada", "completada", "cancelada"] as const;
const field = "mt-1.5 block min-h-12 w-full rounded-2xl border border-border bg-background px-4 text-base";
const btn = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold disabled:opacity-50";
const statusCls: Record<string, string> = { pendiente: "bg-sun text-sun-foreground", confirmada: "bg-pink text-pink-foreground", pagada: "bg-pink/20 text-foreground", completada: "bg-border text-foreground", cancelada: "bg-background text-muted-foreground border border-border" };
const fmtDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const planName = (k: string) => { try { return planByKey(k as PlanKey).name; } catch { return k; } };

function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <Shell><p className="text-muted-foreground">Cargando…</p></Shell>;
  if (!session) return <Shell><Login /></Shell>;
  return <Shell signedIn><Gate userId={session.user.id} /></Shell>;
}

function Shell({ children, signedIn }: { children: React.ReactNode; signedIn?: boolean }) {
  const qc = useQueryClient();
  return (
    <main className="container-k max-w-5xl py-8">
      <div className="flex items-center justify-between">
        <Link to="/"><img src={logoAsset.url} alt="Kanan Childcare" className="h-8 w-auto" /></Link>
        {signedIn && <button onClick={async () => { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><LogOut className="size-4" />Salir</button>}
      </div>
      <div className="mt-8">{children}</div>
    </main>
  );
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error("Correo o contraseña incorrectos.");
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) toast.error(error.message); else toast.success("Revisa tu correo para confirmar tu cuenta.");
    }
    setBusy(false);
  };
  return (
    <form onSubmit={go} className="mx-auto max-w-sm rounded-[28px] border border-border bg-card p-6">
      <h1 className="font-display text-3xl font-extrabold">Panel de reservas</h1>
      <p className="mt-1 text-sm text-muted-foreground">{mode === "in" ? "Entra con tu correo de administración." : "Crea tu contraseña la primera vez."}</p>
      <label className="mt-6 block text-sm font-semibold">Correo<input type="email" required className={field} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
      <label className="mt-4 block text-sm font-semibold">Contraseña<input type="password" required minLength={8} className={field} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} /></label>
      <button disabled={busy} className={cn(btn, "mt-6 w-full bg-pink text-pink-foreground")}>{mode === "in" ? "Entrar" : "Crear cuenta"}</button>
      <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 w-full text-sm text-muted-foreground underline">{mode === "in" ? "¿Primera vez? Crea tu contraseña" : "Ya tengo cuenta"}</button>
    </form>
  );
}

function Gate({ userId }: { userId: string }) {
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin", userId],
    queryFn: async () => { const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" }); return !!data; },
  });
  if (isLoading) return <p className="text-muted-foreground">Cargando…</p>;
  if (!isAdmin) return <p className="rounded-[28px] border border-border bg-card p-6">Esta cuenta no tiene acceso al panel.</p>;
  return <Bookings />;
}

function Bookings() {
  const [filter, setFilter] = useState<string>("todas");
  const [selected, setSelected] = useState<string | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => { const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });
  const pending = data.filter((b) => b.status === "pendiente").length;
  const list = filter === "todas" ? data : data.filter((b) => b.status === filter);
  const current = data.find((b) => b.id === selected);
  if (current) return <Detail booking={current} onBack={() => setSelected(null)} />;
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl font-extrabold">Reservas</h1>
        {pending > 0 && <span className="rounded-full bg-sun px-3 py-1 text-sm font-bold text-sun-foreground">{pending} pendiente{pending === 1 ? "" : "s"}</span>}
      </div>
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {["todas", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={cn("min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold capitalize", filter === s ? "border-sun bg-sun text-sun-foreground" : "border-border")}>
            {s}{s !== "todas" && ` · ${data.filter((b) => b.status === s).length}`}
          </button>
        ))}
      </div>
      <ul className="mt-6 grid gap-3">
        {isLoading && <li className="text-muted-foreground">Cargando…</li>}
        {!isLoading && list.length === 0 && <li className="rounded-[28px] border border-border p-6 text-muted-foreground">No hay reservas aquí todavía.</li>}
        {list.map((b) => (
          <li key={b.id}>
            <button onClick={() => setSelected(b.id)} className="flex w-full flex-wrap items-center justify-between gap-3 rounded-[28px] border border-border bg-card p-5 text-left hover:border-sun">
              <div>
                <p className="font-display text-lg font-bold">{b.folio} · {planName(b.plan)}</p>
                <p className="text-sm text-muted-foreground">{b.name} · {fmtDate(b.date)} · {b.start_time.slice(0, 5)}–{b.end_time.slice(0, 5)}</p>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-bold capitalize", statusCls[b.status])}>{b.status}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Detail({ booking: b, onBack }: { booking: Booking; onBack: () => void }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState(b.status);
  const [notes, setNotes] = useState(b.internal_notes ?? "");
  const [nanny, setNanny] = useState(b.assigned_nanny ?? "");
  const save = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("bookings").update({ status, internal_notes: notes || null, assigned_nanny: nanny || null }).eq("id", b.id); if (error) throw error; },
    onSuccess: () => { toast.success("Cambios guardados"); qc.invalidateQueries({ queryKey: ["bookings"] }); },
    onError: () => toast.error("No se pudo guardar."),
  });
  const rows: [string, string][] = [
    ["Plan", planName(b.plan)], ["Fecha", fmtDate(b.date)], ["Horario", `${b.start_time.slice(0, 5)} – ${b.end_time.slice(0, 5)} (${b.hours} h)`],
    ["Niñeras", String(b.nannies_count)], ["Niños", `${b.children_count} · edades ${b.children_ages.join(", ")}`], ["Notas", b.notes || "—"],
    ["Zona", `${b.colonia}, ${b.municipio}`], ["Nombre", b.name], ["WhatsApp", b.whatsapp], ["Correo", b.email],
    ["Total estimado", b.estimated_total != null ? `$${Number(b.estimated_total).toLocaleString("es-MX")} MXN` : "Cotización"],
    ["Pagado", b.paid_amount != null ? `$${Number(b.paid_amount).toLocaleString("es-MX")}` : "—"],
    ["Recibida", new Date(b.created_at).toLocaleString("es-MX", { timeZone: "America/Mexico_City" })],
  ];
  return (
    <>
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Todas las reservas</button>
      <h1 className="mt-4 font-display text-4xl font-extrabold">{b.folio}</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-[28px] border border-border bg-card p-6 text-sm">
          {rows.map(([k, v]) => <Fragment key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></Fragment>)}
        </dl>
        <div className="rounded-[28px] border border-border bg-card p-6">
          <label className="block text-sm font-semibold">Estado
            <select className={cn(field, "capitalize")} value={status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="mt-4 block text-sm font-semibold">Niñera asignada (interno)<input className={field} value={nanny} onChange={(e) => setNanny(e.target.value)} /></label>
          <label className="mt-4 block text-sm font-semibold">Notas internas<textarea rows={4} className={cn(field, "py-3")} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
          <button onClick={() => save.mutate()} disabled={save.isPending} className={cn(btn, "mt-5 w-full bg-pink text-pink-foreground")}>Guardar cambios</button>
          <a href={`https://wa.me/52${b.whatsapp}?text=${encodeURIComponent(`Hola ${b.name.split(" ")[0]}, te escribimos de Kanan sobre tu solicitud ${b.folio}.`)}`} target="_blank" rel="noopener noreferrer" className={cn(btn, "mt-3 w-full border border-border")}><MessageCircle className="size-5" />WhatsApp con la familia</a>
          <button disabled title="Disponible pronto" className={cn(btn, "mt-3 w-full border border-border")}><CreditCard className="size-5" />Generar link de pago</button>
          {b.payment_link && <p className="mt-2 break-all text-sm text-muted-foreground">{b.payment_link}</p>}
        </div>
      </div>
    </>
  );
}
