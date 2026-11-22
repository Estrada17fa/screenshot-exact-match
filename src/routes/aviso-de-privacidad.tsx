import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/kanan/legal";

const title = "Aviso de privacidad · Kanan Childcare";
const description = "Cómo Kanan Childcare cuida y usa los datos de las familias que reservan con nosotros.";
export const Route = createFileRoute("/aviso-de-privacidad")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }] }),
  component: () => (
    <LegalPage title="Aviso de privacidad">
      <p>Texto provisional. Aquí irá el aviso de privacidad de Kanan Childcare: qué datos recopilamos, para qué los usamos y cómo puedes ejercer tus derechos ARCO.</p>
      <p>Reemplaza este texto con tu aviso de privacidad definitivo.</p>
    </LegalPage>
  ),
});
