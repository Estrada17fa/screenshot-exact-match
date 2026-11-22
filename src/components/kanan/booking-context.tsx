import { createContext, useContext, useState, type ReactNode } from "react";
import type { PlanKey } from "@/lib/booking";
import { BookingDialog } from "./BookingDialog";

/** One booking dialog for the whole page: any "Reservar" button calls openBooking(plan). */
const Ctx = createContext<{ openBooking: (plan?: PlanKey) => void }>({ openBooking: () => {} });

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<PlanKey>("sol");
  const openBooking = (p?: PlanKey) => {
    if (p) setPlan(p);
    setOpen(true);
  };
  return (
    <Ctx.Provider value={{ openBooking }}>
      {children}
      <BookingDialog plan={plan} open={open} onOpenChange={setOpen} />
    </Ctx.Provider>
  );
}

export const useBooking = () => useContext(Ctx);
