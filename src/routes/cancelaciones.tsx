import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/kanan/legal";

const title = "Política de cancelación · Kanan Childcare";
const description = "Condiciones para cambiar o cancelar una reserva con Kanan Childcare.";
export const Route = createFileRoute("/cancelaciones")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }] }),
  component: () => (
    <LegalPage title="Política de cancelación">
      <p>Texto provisional. Aquí irán las condiciones para cambiar o cancelar una reserva.</p>
      <p>Reemplaza este texto con tu política de cancelación definitiva.</p>
    </LegalPage>
  ),
});
