import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/kanan-logo.png.asset.json";

type Modo = "registro" | "entrar";

export const Route = createFileRoute("/cuenta")({
  validateSearch: (s: Record<string, unknown>): { modo?: Modo | undefined } => {
    const m = s["modo"];
    return { modo: m === "registro" || m === "entrar" ? m : undefined };
  },
  head: () => ({
    meta: [
      { title: "Mi cuenta · Kanan Childcare" },
      {
        name: "description",
        content: "Crea tu cuenta de Kanan Childcare para reservar más rápido.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Mi cuenta · Kanan Childcare" },
      {
        property: "og:description",
        content: "Crea tu cuenta de Kanan Childcare para reservar más rápido.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  ssr: false,
  component: CuentaPage,
});

const field =
  "mt-1.5 block min-h-12 w-full rounded-2xl border border-border bg-background px-4 text-base text-foreground focus:outline-2 focus:outline-ring";
const label = "block text-sm font-semibold";
const btn =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 font-semibold disabled:opacity-50";

const authError = (msg: string) => {
  if (/invalid login/i.test(msg)) return "Correo o contraseña incorrectos.";
  if (/already registered|already been registered/i.test(msg))
    return "Ya existe una cuenta con ese correo. Inicia sesión.";
  if (/email not confirmed/i.test(msg))
    return "Confirma tu correo antes de entrar. Revisa tu bandeja de entrada.";
  if (/signups not allowed|signup is disabled/i.test(msg))
    return "Por ahora el registro no está disponible. Reserva sin cuenta o escríbenos por WhatsApp.";
  if (/password/i.test(msg)) return "La contraseña debe tener al menos 8 caracteres.";
  return "No pudimos completar la acción. Intenta de nuevo.";
};

function CuentaPage() {
  const { modo } = Route.useSearch();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container-k flex h-16 items-center justify-between">
          <Link to="/" aria-label="Kanan Childcare, inicio">
            <img src={logoAsset.url} alt="Kanan Childcare" className="h-8 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        </div>
      </header>
      <main className="container-k max-w-md py-10">
        {session === undefined ? (
          <p className="text-muted-foreground">Cargando…</p>
        ) : session ? (
          <Account session={session} />
        ) : (
          <AuthForm initial={modo ?? "registro"} />
        )}
      </main>
    </div>
  );
}

function AuthForm({ initial }: { initial: Modo }) {
  const [modo, setModo] = useState<Modo>(initial);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (modo === "registro") {
      if (name.trim().length < 2) return setError("Escribe tu nombre completo.");
      if (!/^\d{10}$/.test(whatsapp)) return setError("Tu WhatsApp debe tener 10 dígitos.");
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Escribe un correo válido.");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    setBusy(true);
    if (modo === "registro") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim(), whatsapp },
          emailRedirectTo: `${window.location.origin}/cuenta`,
        },
      });
      if (error) setError(authError(error.message));
      else if (!data.session) setInfo("¡Listo! Te enviamos un correo para confirmar tu cuenta.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(authError(error.message));
    }
    setBusy(false);
  };

  return (
    <>
      <h1 className="text-[40px] font-extrabold">
        {modo === "registro" ? "Crea tu cuenta" : "Inicia sesión"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {modo === "registro"
          ? "Guarda tus datos para reservar más rápido."
          : "Qué gusto verte de nuevo."}
      </p>

      <div className="mt-8 grid grid-cols-2 rounded-full bg-card p-1" role="tablist">
        {(["registro", "entrar"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={modo === m}
            onClick={() => {
              setModo(m);
              setError("");
              setInfo("");
            }}
            className={cn(
              "min-h-11 rounded-full text-sm font-semibold",
              modo === m ? "bg-sun text-sun-foreground" : "text-muted-foreground",
            )}
          >
            {m === "registro" ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
        {modo === "registro" && (
          <>
            <label className={label}>
              Nombre completo
              <input
                className={field}
                autoComplete="name"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className={label}>
              WhatsApp (10 dígitos)
              <input
                className={field}
                inputMode="numeric"
                autoComplete="tel-national"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </label>
          </>
        )}
        <label className={label}>
          Correo
          <input
            type="email"
            className={field}
            autoComplete="email"
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className={label}>
          Contraseña
          <input
            type="password"
            className={field}
            autoComplete={modo === "registro" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {modo === "registro" && (
            <span className="mt-1.5 block text-sm font-normal text-muted-foreground">
              Mínimo 8 caracteres.
            </span>
          )}
        </label>
        {error && (
          <p role="alert" className="text-sm font-semibold text-pink">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="rounded-2xl bg-sun/15 p-4 text-sm">
            {info}
          </p>
        )}
        <button type="submit" disabled={busy} className={cn(btn, "bg-pink text-pink-foreground")}>
          {busy ? "Un momento…" : modo === "registro" ? "Crear cuenta" : "Entrar"}
        </button>
      </form>
    </>
  );
}

function Account({ session }: { session: Session }) {
  const navigate = useNavigate();
  const meta = (session.user.user_metadata ?? {}) as { full_name?: string; whatsapp?: string };
  const first = meta.full_name?.split(" ")[0];
  return (
    <>
      <h1 className="text-[40px] font-extrabold">Hola{first ? `, ${first}` : ""}.</h1>
      <p className="mt-3 text-muted-foreground">
        Tu cuenta está lista. Cuando reserves, tus datos de contacto se llenan solos.
      </p>
      <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 rounded-[28px] border border-border bg-card p-6 text-sm">
        {meta.full_name && (
          <>
            <dt className="text-muted-foreground">Nombre</dt>
            <dd className="font-semibold">{meta.full_name}</dd>
          </>
        )}
        <dt className="text-muted-foreground">Correo</dt>
        <dd className="break-all font-semibold">{session.user.email}</dd>
        {meta.whatsapp && (
          <>
            <dt className="text-muted-foreground">WhatsApp</dt>
            <dd className="font-semibold">{meta.whatsapp}</dd>
          </>
        )}
      </dl>
      <div className="mt-8 grid gap-3">
        <Link to="/" hash="planes" className={cn(btn, "bg-pink text-pink-foreground")}>
          Ver planes y reservar
        </Link>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/" });
          }}
          className={cn(btn, "border border-border")}
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}
