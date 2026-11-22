import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/kanan-logo.png.asset.json";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="container-k max-w-3xl py-10">
      <Link to="/"><img src={logoAsset.url} alt="Kanan Childcare" className="h-9 w-auto" /></Link>
      <h1 className="mt-10 text-[40px] font-extrabold">{title}</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">{children}</div>
      <Link to="/" className="mt-10 inline-block font-semibold text-sun">← Volver al inicio</Link>
    </main>
  );
}
