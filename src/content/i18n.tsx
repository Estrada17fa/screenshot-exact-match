import { createContext, useContext, useState, type ReactNode } from "react";

const es = {
  nav: {
    services: "Planes",
    how: "Cómo reservar",
    team: "Nuestro equipo",
    faq: "Preguntas frecuentes",
    book: "Reservar",
    signup: "Crear cuenta",
    login: "Iniciar sesión",
    account: "Mi cuenta",
    menu: "Abrir menú",
    close: "Cerrar menú",
    lang: "EN",
    langLabel: "Switch to English",
  },
  wa: "Hola, quiero información sobre el servicio de niñeras Kanan.",
  waService: (s: string) => `Hola, quiero información sobre el servicio "${s}" de niñeras Kanan.`,
  hero: {
    badge: "Niñeras certificadas · Guadalajara",
    h1a: "Tu tranquilidad,",
    h1b: "su",
    words: ["felicidad", "risa", "juego", "aventura"],
    line: "Niñeras verificadas en Guadalajara",
    sub: "Niñeras verificadas y con experiencia para cada momento de tu familia.",
    cta: "Reservar por WhatsApp",
    cta2: "Ver planes",
    book: "Reservar",
    firstAid: "Primeros auxilios",
    verified: "Antecedentes verificados",
    from: "desde $140 /hr",
    imgAlt: "Niñera cuidando a tres niñas",
  },
  services: {
    title: "Servicios",
    label: "por hora · por niñera",
    perHour: "/hr",
    from: "desde",
    items: {
      sol: { name: "sol", desc: "De día · pendientes, citas o una tarde libre.", price: "$170" },
      luna: { name: "luna", desc: "De noche · sal a cenar sin preocupaciones.", price: "$190" },
      suenos: {
        name: "dulces sueños",
        desc: "Toda la noche · tus hijos duermen cuidados mientras descansas.",
        price: "$180",
      },
      fiesta: {
        name: "fiesta",
        desc: "Fiestas infantiles con juegos y actividades.",
        price: "$250",
      },
      casa: {
        name: "en casa",
        desc: "Niñera fija, hecha a la medida de tu familia.",
        price: "desde $140",
      },
      viajera: {
        name: "viajera",
        desc: "Te acompaña en tu viaje. Cotizamos según tu destino y fechas.",
        price: "Cotiza a tu medida",
      },
    },
  },
  why: {
    title: "Por qué Kanan",
    label: "confianza primero",
    items: [
      { t: "Antecedentes verificados", d: "Identidad, referencias y entrevista en persona." },
      { t: "Primeros auxilios pediátricos", d: "Certificadas para actuar con calma." },
      { t: "Bilingües ES/EN", d: "Juegan y aprenden en dos idiomas." },
      { t: "Fotos y mensajes durante el cuidado", d: "Te mantenemos al tanto en todo momento." },
    ],
  },
  team: {
    title: "Nuestro equipo",
    label: "perfiles verificados · datos protegidos",
    intro:
      "Así es nuestro equipo. Tú no tienes que elegir: nosotros asignamos a la niñera ideal según las necesidades de tu familia, y te compartimos su perfil antes del servicio.",
    years: "años de experiencia",
    ages: "Edades",
    langs: "Idiomas",
    certs: "Certificaciones",
    spec: "Especialidades",
    note: "Por la seguridad de nuestras niñeras, no publicamos fotos ni datos personales.",
  },
  meaning: {
    label: "K'anan · del maya",
    title: "cuidar y proteger.",
    text: "No es solo nuestro nombre. Es lo que le prometemos a cada familia y a cada niñera.",
  },
  steps: {
    title: "Cómo reservar",
    label: "3 pasos",
    items: [
      { t: "Escríbenos", d: "Fecha, horario y edades de los niños." },
      { t: "Asignamos a tu niñera", d: "Elegimos a la ideal y te compartimos su perfil." },
      { t: "Disfruta tranquilo", d: "Sal, trabaja o descansa." },
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    label: "resolvemos tus dudas",
    items: [
      { q: "¿Con cuánta anticipación debo reservar?", a: "Respuesta por confirmar." },
      {
        q: "¿Puedo elegir a mi niñera?",
        a: "Nosotros asignamos a la niñera según tus necesidades. Si ya te atendió alguna y quieres repetir, avísanos y haremos lo posible por asignarla de nuevo.",
      },
      { q: "¿Qué edades cuidan?", a: "Respuesta por confirmar." },
      { q: "¿Qué zonas de Guadalajara cubren?", a: "Respuesta por confirmar." },
      { q: "¿Qué formas de pago aceptan?", a: "Respuesta por confirmar." },
    ],
  },
  cta: {
    title: "Planes a la medida de tu familia",
    text: "Te confirmamos disponibilidad en minutos.",
    button: "WhatsApp 33 2984 3381",
  },
  footer: {
    city: "Guadalajara, Jalisco",
    privacy: "Aviso de privacidad",
    cancel: "Cancelaciones",
    rights: "Todos los derechos reservados.",
  },
};

type Dict = typeof es;

const en: Dict = {
  nav: {
    services: "Plans",
    how: "How to book",
    team: "Our team",
    faq: "FAQ",
    book: "Book",
    signup: "Create account",
    login: "Log in",
    account: "My account",
    menu: "Open menu",
    close: "Close menu",
    lang: "ES",
    langLabel: "Cambiar a español",
  },
  wa: "Hi, I'd like information about Kanan's nanny service.",
  waService: (s) => `Hi, I'd like information about Kanan's "${s}" nanny service.`,
  hero: {
    badge: "Certified nannies · Guadalajara",
    h1a: "Your peace of mind,",
    h1b: "their",
    words: ["happiness", "laughter", "play", "adventure"],
    line: "Verified nannies in Guadalajara",
    sub: "Vetted, experienced nannies for every moment of your family's life.",
    cta: "Book on WhatsApp",
    cta2: "See plans",
    book: "Book now",
    firstAid: "First aid",
    verified: "Background checked",
    from: "from $140 /hr",
    imgAlt: "Nanny caring for three girls",
  },
  services: {
    title: "Services",
    label: "per hour · per nanny",
    perHour: "/hr",
    from: "from",
    items: {
      sol: {
        name: "sun",
        desc: "Daytime · errands, appointments or a free afternoon.",
        price: "$170",
      },
      luna: { name: "moon", desc: "Evening · go out to dinner worry-free.", price: "$190" },
      suenos: {
        name: "sweet dreams",
        desc: "Overnight · your kids sleep safe while you rest.",
        price: "$180",
      },
      fiesta: { name: "party", desc: "Kids' parties with games and activities.", price: "$250" },
      casa: {
        name: "at home",
        desc: "A dedicated nanny, tailored to your family.",
        price: "from $140",
      },
      viajera: {
        name: "traveler",
        desc: "Joins you on your trip. Quoted by destination and dates.",
        price: "Custom quote",
      },
    },
  },
  why: {
    title: "Why Kanan",
    label: "trust first",
    items: [
      { t: "Background checked", d: "ID, references and in-person interview." },
      { t: "Pediatric first aid", d: "Certified to act calmly." },
      { t: "Bilingual ES/EN", d: "Play and learn in two languages." },
      { t: "Photos & updates during care", d: "We keep you posted the whole time." },
    ],
  },
  team: {
    title: "Our team",
    label: "verified profiles · protected data",
    intro:
      "This is our team. You don't have to choose: we assign the ideal nanny for your family's needs and share her profile before the service.",
    years: "years of experience",
    ages: "Ages",
    langs: "Languages",
    certs: "Certifications",
    spec: "Specialties",
    note: "For our nannies' safety, we don't publish photos or personal data.",
  },
  meaning: {
    label: "K'anan · from Maya",
    title: "to care and protect.",
    text: "It's not just our name. It's what we promise every family and every nanny.",
  },
  steps: {
    title: "How to book",
    label: "3 steps",
    items: [
      { t: "Message us", d: "Date, time and children's ages." },
      { t: "We assign your nanny", d: "We pick the ideal one and share her profile." },
      { t: "Relax", d: "Go out, work or rest." },
    ],
  },
  faq: {
    title: "FAQ",
    label: "your questions answered",
    items: [
      { q: "How far in advance should I book?", a: "Answer coming soon." },
      {
        q: "Can I choose my nanny?",
        a: "We assign the nanny based on your needs. If you've had one before and want her again, let us know and we'll do our best to assign her.",
      },
      { q: "What ages do you care for?", a: "Answer coming soon." },
      { q: "Which areas of Guadalajara do you cover?", a: "Answer coming soon." },
      { q: "What payment methods do you accept?", a: "Answer coming soon." },
    ],
  },
  cta: {
    title: "Plans tailored to your family",
    text: "We confirm availability in minutes.",
    button: "WhatsApp 33 2984 3381",
  },
  footer: {
    city: "Guadalajara, Jalisco",
    privacy: "Privacy notice",
    cancel: "Cancellations",
    rights: "All rights reserved.",
  },
};

export type Lang = "es" | "en";
const Ctx = createContext<{ lang: Lang; t: Dict; toggle: () => void }>({
  lang: "es",
  t: es,
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  return (
    <Ctx.Provider
      value={{
        lang,
        t: lang === "es" ? es : en,
        toggle: () => setLang((l) => (l === "es" ? "en" : "es")),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export const useLang = () => useContext(Ctx);
