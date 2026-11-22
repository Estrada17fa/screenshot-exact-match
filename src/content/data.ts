export const WHATSAPP_NUMBER = "523329843381";
export const waLink = (msg: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export type Tone = "sun" | "pink" | "dark";
export const services: { key: "sol" | "luna" | "suenos" | "fiesta" | "casa" | "viajera"; tone: Tone }[] = [
  { key: "sol", tone: "sun" },
  { key: "luna", tone: "dark" },
  { key: "suenos", tone: "dark" },
  { key: "fiesta", tone: "pink" },
  { key: "casa", tone: "dark" },
  { key: "viajera", tone: "dark" },
];

/** Edit team profiles here. Never add photos, last names, ages, locations or contact info. */
export type Profile = {
  name: string; // first name or initial only
  avatar: "initial" | "sun";
  tone: "sun" | "pink";
  years: number;
  kidsAges: { es: string; en: string };
  languages: { es: string; en: string };
  certs: { es: string[]; en: string[] };
  specialties: { es: string[]; en: string[] };
  style: { es: string; en: string };
};

export const team: Profile[] = [
  { name: "Ana", avatar: "initial", tone: "sun", years: 6, kidsAges: { es: "0–5 años", en: "0–5 yrs" }, languages: { es: "Español, inglés", en: "Spanish, English" }, certs: { es: ["Primeros auxilios pediátricos"], en: ["Pediatric first aid"] }, specialties: { es: ["Bebés", "Rutinas de sueño"], en: ["Babies", "Sleep routines"] }, style: { es: "Tranquila, cariñosa y muy organizada.", en: "Calm, warm and very organized." } },
  { name: "M.", avatar: "sun", tone: "pink", years: 4, kidsAges: { es: "3–10 años", en: "3–10 yrs" }, languages: { es: "Español", en: "Spanish" }, certs: { es: ["Primeros auxilios", "RCP"], en: ["First aid", "CPR"] }, specialties: { es: ["Actividades", "Manualidades"], en: ["Activities", "Crafts"] }, style: { es: "Creativa: convierte cualquier tarde en juego.", en: "Creative: turns any afternoon into play." } },
  { name: "Lucía", avatar: "initial", tone: "pink", years: 8, kidsAges: { es: "6–12 años", en: "6–12 yrs" }, languages: { es: "Español, inglés", en: "Spanish, English" }, certs: { es: ["Primeros auxilios pediátricos"], en: ["Pediatric first aid"] }, specialties: { es: ["Tareas", "Lectura"], en: ["Homework", "Reading"] }, style: { es: "Paciente y estructurada con las tareas.", en: "Patient and structured with homework." } },
  { name: "S.", avatar: "sun", tone: "sun", years: 5, kidsAges: { es: "0–8 años", en: "0–8 yrs" }, languages: { es: "Español", en: "Spanish" }, certs: { es: ["Primeros auxilios", "Lengua de señas básica"], en: ["First aid", "Basic sign language"] }, specialties: { es: ["Necesidades especiales"], en: ["Special needs"] }, style: { es: "Empática, atenta a cada detalle.", en: "Empathetic, attentive to every detail." } },
  { name: "Valeria", avatar: "initial", tone: "sun", years: 3, kidsAges: { es: "2–9 años", en: "2–9 yrs" }, languages: { es: "Español, inglés", en: "Spanish, English" }, certs: { es: ["Primeros auxilios pediátricos"], en: ["Pediatric first aid"] }, specialties: { es: ["Fiestas", "Actividades"], en: ["Parties", "Activities"] }, style: { es: "Energía alegre y mucha imaginación.", en: "Cheerful energy and lots of imagination." } },
  { name: "R.", avatar: "sun", tone: "pink", years: 10, kidsAges: { es: "0–12 años", en: "0–12 yrs" }, languages: { es: "Español", en: "Spanish" }, certs: { es: ["Primeros auxilios", "RCP"], en: ["First aid", "CPR"] }, specialties: { es: ["Bebés", "Toda la noche"], en: ["Babies", "Overnight"] }, style: { es: "Experiencia y calma para noches largas.", en: "Experience and calm for long nights." } },
];
