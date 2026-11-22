import { createFileRoute } from "@tanstack/react-router";
import { LangProvider } from "@/content/i18n";
import { Landing } from "@/components/kanan/Landing";

const title = "Kanan Childcare · Niñeras en Guadalajara certificadas";
const description = "Niñeras en Guadalajara con antecedentes verificados y primeros auxilios. Cuidado por hora, de noche, fiestas y niñera fija. Reserva por WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_MX" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LangProvider>
      <Landing />
    </LangProvider>
  ),
});
