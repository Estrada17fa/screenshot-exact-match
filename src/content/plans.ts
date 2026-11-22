import type { PlanKey } from "@/lib/booking";
import type { Tone } from "@/content/data";

/** Edit plans here: name, description, price label and benefits. Rates for the estimate live in src/lib/booking.ts. */
export type Plan = { key: PlanKey; name: string; desc: string; price: string; perHour: boolean; tone: Tone; includes: string[] };

export const plans: Plan[] = [
  { key: "sol", name: "sol", desc: "Ocasional de día", price: "$170", perHour: true, tone: "sun", includes: ["Mínimo 3 horas", "Juegos y actividades", "Apoyo con tareas", "Comidas y rutinas", "Fotos y mensajes durante el cuidado"] },
  { key: "luna", name: "luna", desc: "Ocasional de noche", price: "$190", perHour: true, tone: "dark", includes: ["Mínimo 3 horas", "Cena y rutina de sueño", "Baño y pijama", "Acompañamiento hasta que duerman", "Mensajes de actualización"] },
  { key: "suenos", name: "dulces sueños", desc: "Toda la noche", price: "$180", perHour: true, tone: "dark", includes: ["Cuidado de 10 pm a 7 am", "Rutina de sueño completa", "Atención durante la noche", "Desayuno ligero opcional", "Reporte por la mañana"] },
  { key: "fiesta", name: "fiesta", desc: "Fiestas infantiles", price: "$250", perHour: true, tone: "pink", includes: ["Mínimo 3 horas", "Juegos y dinámicas grupales", "Materiales de actividades", "Supervisión de los niños", "Te ayudamos a calcular cuántas niñeras necesitas"] },
  { key: "casa", name: "en casa", desc: "Niñera fija", price: "desde $140", perHour: true, tone: "dark", includes: ["La misma niñera siempre", "Horario a tu medida", "Precio preferencial por volumen", "Reporte semanal", "Niñera de respaldo"] },
  { key: "viajera", name: "viajera", desc: "Acompañante en viaje", price: "Cotización a tu medida", perHour: false, tone: "dark", includes: ["Te acompaña en tu viaje", "Cuidado por día completo", "Bilingüe según disponibilidad", "Viáticos a cargo de la familia", "Planeamos el viaje contigo"] },
];
export const planByKey = (k: PlanKey) => plans.find((p) => p.key === k)!;
