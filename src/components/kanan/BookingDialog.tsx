import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { plans, planByKey } from "@/content/plans";
import { waLink } from "@/content/data";
import { bookingHours, estimateTotal, hasEnoughNotice, mxToday, MIN_HOURS, MUNICIPIOS, NO_MIN_PLANS, type PlanKey } from "@/lib/booking";
import { submitBooking } from "@/lib/booking.functions";
import { cn } from "@/lib/utils";

const field = "mt-1.5 block min-h-12 w-full rounded-2xl border border-border bg-background px-4 text-base text-foreground focus:outline-2 focus:outline-ring";
const label = "block text-sm font-semibold";
const btnBase = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold disabled:opacity-50";
const STEPS = ["Servicio", "Niños", "Ubicación y contacto", "Resumen"];

const fmtDate = (d: string) => d ? new Date(d + "T12:00:00").toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }) : "";
const fmtTime = (t: string) => { const [h, m] = t.split(":").map(Number); const ap = (h ?? 0) >= 12 ? "pm" : "am"; const hh = ((h ?? 0) % 12) || 12; return `${hh}:${String(m ?? 0).padStart(2, "0")} ${ap}`; };
const money = (n: number) => `$${n.toLocaleString("es-MX")}`;

export function BookingDialog({ plan: initial, open, onOpenChange }: { plan: PlanKey; open: boolean; onOpenChange: (o: boolean) => void }) {
  const submit = useServerFn(submitBooking);
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<PlanKey>(initial);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("13:00");
  const [nannies, setNannies] = useState(1);
  const [kids, setKids] = useState(1);
  const [ages, setAges] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [municipio, setMunicipio] = useState<string>("");
  const [colonia, setColonia] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [folio, setFolio] = useState("");

  const applyPlan = (k: PlanKey) => {
    setPlan(k);
    if (k === "suenos") { setStart("22:00"); setEnd("07:00"); }
    if (k !== "fiesta") setNannies(1);
  };
  useEffect(() => { if (open) { setStep(0); setFolio(""); setError(""); applyPlan(initial); } }, [open, initial]);
  useEffect(() => { setAges((a) => Array.from({ length: kids }, (_, i) => a[i] ?? "")); }, [kids]);

  const hours = bookingHours(start, end);
  const total = estimateTotal(plan, hours, nannies);
  const today = mxToday();

  const stepError = useMemo(() => {
    if (step === 0) {
      if (!date) return "Elige una fecha.";
      if (date < today) return "Elige una fecha a partir de hoy.";
      if (!hasEnoughNotice(date, start)) return "urgent";
      if (!NO_MIN_PLANS.includes(plan) && hours < MIN_HOURS) return `El mínimo es de ${MIN_HOURS} horas.`;
    }
    if (step === 1 && ages.some((a) => a === "" || Number(a) < 0 || Number(a) > 17)) return "Escribe la edad de cada niño (0 a 17 años).";
    if (step === 2) {
      if (!municipio) return "Elige tu municipio.";
      if (colonia.trim().length < 2) return "Escribe tu colonia.";
      if (name.trim().length < 2) return "Escribe tu nombre completo.";
      if (!/^\d{10}$/.test(whatsapp)) return "Tu WhatsApp debe tener 10 dígitos.";
      if (!/^\S+@\S+\.\S+$/.test(email)) return "Escribe un correo válido.";
    }
    return "";
  }, [step, date, start, hours, plan, ages, municipio, colonia, name, whatsapp, email, today]);

  const next = () => { if (stepError) { setError(stepError); return; } setError(""); setStep((s) => s + 1); };

  const send = async () => {
    if (!accepted) { setError("Acepta el aviso de privacidad y la política de cancelación."); return; }
    setSending(true); setError("");
    try {
      const res = await submit({ data: { plan, date, start_time: start, end_time: end, nannies_count: plan === "fiesta" ? nannies : 1, children_count: kids, children_ages: ages.map(Number), notes, municipio, colonia, name, whatsapp, email, accepted: true, website } });
      if (res.ok) setFolio(res.folio);
      else setError(res.error === "rate" ? "Ya recibimos varias solicitudes de este número. Escríbenos por WhatsApp y te ayudamos." : res.error === "notice" ? "urgent" : "No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.");
    } catch { setError("Revisa los datos e intenta de nuevo."); }
    setSending(false);
  };

  const p = planByKey(plan);
  const waUrgent = waLink(`Hola, necesito una niñera urgente para el plan ${p.name}${date ? ` el ${fmtDate(date)}` : ""}.`);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] gap-0 overflow-y-auto rounded-t-[28px] border-border bg-card p-0 max-sm:bottom-0 max-sm:top-auto max-sm:max-w-none max-sm:translate-y-0 sm:max-w-xl sm:rounded-[28px]">
        {folio ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto size-14 text-sun" />
            <DialogTitle className="mt-4 font-display text-3xl font-extrabold">¡Recibimos tu solicitud!</DialogTitle>
            <p className="mt-2 font-display text-2xl font-bold text-sun">Folio {folio}</p>
            <DialogDescription className="mt-3 text-muted-foreground">Te escribimos en minutos para confirmar.</DialogDescription>
            <a href={waLink(`Hola, acabo de hacer la solicitud ${folio} para el plan ${p.name} el ${fmtDate(date)}.`)} target="_blank" rel="noopener noreferrer" className={cn(btnBase, "mt-8 w-full bg-pink text-pink-foreground")}><MessageCircle className="size-5" />Continuar por WhatsApp</a>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <p className="text-sm text-muted-foreground">Paso {step + 1} de 4 · {STEPS[step]}</p>
            <DialogTitle className="mt-1 font-display text-3xl font-extrabold">Reservar</DialogTitle>
            <DialogDescription className="sr-only">Formulario de solicitud de reserva en 4 pasos.</DialogDescription>
            <div className="mt-4 h-1.5 rounded-full bg-border"><div className="h-full rounded-full bg-sun transition-all" style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true" />

            <div className="mt-6 space-y-5">
              {step === 0 && <>
                <label className={label}>Plan
                  <select className={field} value={plan} onChange={(e) => applyPlan(e.target.value as PlanKey)}>
                    {plans.map((x) => <option key={x.key} value={x.key}>{x.name} · {x.desc}</option>)}
                  </select>
                </label>
                <label className={label}>Fecha<input type="date" min={today} className={field} value={date} onChange={(e) => setDate(e.target.value)} /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={label}>Inicio<input type="time" step={900} className={field} value={start} onChange={(e) => setStart(e.target.value)} /></label>
                  <label className={label}>Fin<input type="time" step={900} className={field} value={end} onChange={(e) => setEnd(e.target.value)} /></label>
                </div>
                <p className="text-sm text-muted-foreground">{hours} horas{end <= start ? " · termina al día siguiente" : ""}{!NO_MIN_PLANS.includes(plan) ? ` · mínimo ${MIN_HOURS} horas` : ""}</p>
                {plan === "fiesta" && (
                  <label className={label}>¿Cuántas niñeras necesitas?
                    <select className={field} value={nannies} onChange={(e) => setNannies(Number(e.target.value))}>
                      {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span className="mt-1.5 block text-sm font-normal text-muted-foreground">Recomendamos 1 niñera por cada 6 niños.</span>
                  </label>
                )}
              </>}

              {step === 1 && <>
                <label className={label}>Número de niños
                  <select className={field} value={kids} onChange={(e) => setKids(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {ages.map((a, i) => (
                    <label key={i} className={label}>Edad niño {i + 1}
                      <input type="number" inputMode="numeric" min={0} max={17} placeholder="años" className={field} value={a} onChange={(e) => setAges((arr) => arr.map((v, j) => j === i ? e.target.value : v))} />
                    </label>
                  ))}
                </div>
                <label className={label}>Notas<textarea rows={3} maxLength={1000} placeholder="Alergias, mascotas en casa, necesidades especiales, rutinas…" className={cn(field, "py-3")} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
              </>}

              {step === 2 && <>
                <label className={label}>Municipio
                  <select className={field} value={municipio} onChange={(e) => setMunicipio(e.target.value)}>
                    <option value="" disabled>Elige…</option>
                    {MUNICIPIOS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </label>
                <label className={label}>Colonia<input className={field} maxLength={100} value={colonia} onChange={(e) => setColonia(e.target.value)} /></label>
                <p className="text-sm text-muted-foreground">No te pedimos la dirección exacta: la solicitamos al confirmar.</p>
                <label className={label}>Nombre completo<input className={field} maxLength={100} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label className={label}>WhatsApp (10 dígitos)<input className={field} inputMode="numeric" autoComplete="tel-national" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))} /></label>
                <label className={label}>Correo<input type="email" className={field} maxLength={255} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              </>}

              {step === 3 && <>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-2xl bg-background p-5 text-sm">
                  <dt className="text-muted-foreground">Plan</dt><dd className="font-semibold">{p.name} · {p.desc}</dd>
                  <dt className="text-muted-foreground">Fecha</dt><dd className="font-semibold capitalize">{fmtDate(date)}</dd>
                  <dt className="text-muted-foreground">Horario</dt><dd className="font-semibold">{fmtTime(start)} – {fmtTime(end)} ({hours} h)</dd>
                  {plan === "fiesta" && <><dt className="text-muted-foreground">Niñeras</dt><dd className="font-semibold">{nannies}</dd></>}
                  <dt className="text-muted-foreground">Niños</dt><dd className="font-semibold">{kids} · edades {ages.join(", ")}</dd>
                  {notes && <><dt className="text-muted-foreground">Notas</dt><dd>{notes}</dd></>}
                  <dt className="text-muted-foreground">Zona</dt><dd className="font-semibold">{colonia}, {municipio}</dd>
                  <dt className="text-muted-foreground">Contacto</dt><dd className="font-semibold">{name} · {whatsapp} · {email}</dd>
                </dl>
                <div className="rounded-2xl border border-sun/40 p-5">
                  <p className="text-sm text-muted-foreground">Precio estimado</p>
                  <p className="font-display text-3xl font-extrabold text-sun">{total == null ? "Te enviaremos una cotización" : `${money(total)} MXN`}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Esto es una solicitud. Te confirmamos disponibilidad por WhatsApp y te enviamos el link de pago.</p>
                </div>
                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" className="mt-0.5 size-5 accent-[var(--pink)]" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                  <span>Acepto el <Link to="/aviso-de-privacidad" target="_blank" className="font-semibold text-sun underline">aviso de privacidad</Link> y la <Link to="/cancelaciones" target="_blank" className="font-semibold text-sun underline">política de cancelación</Link></span>
                </label>
              </>}
            </div>

            {error && (error === "urgent"
              ? <p role="alert" className="mt-5 rounded-2xl bg-pink/15 p-4 text-sm">Necesitamos al menos 12 horas de anticipación. ¿Es urgente? <a href={waUrgent} target="_blank" rel="noopener noreferrer" className="font-semibold text-pink underline">Escríbenos por WhatsApp</a> y vemos cómo ayudarte.</p>
              : <p role="alert" className="mt-5 text-sm font-semibold text-pink">{error}</p>)}

            <div className="mt-6 flex gap-3">
              {step > 0 && <button type="button" onClick={() => { setError(""); setStep((s) => s - 1); }} className={cn(btnBase, "border border-border")}>Atrás</button>}
              {step < 3
                ? <button type="button" onClick={next} className={cn(btnBase, "flex-1 bg-pink text-pink-foreground")}>Continuar</button>
                : <button type="button" onClick={send} disabled={sending} className={cn(btnBase, "flex-1 bg-pink text-pink-foreground")}>{sending ? "Enviando…" : "Enviar solicitud"}</button>}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
