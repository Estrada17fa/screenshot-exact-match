# Project rules
- Booking pricing/hours/notice rules live in src/lib/booking.ts (pure, tested) and are re-run server-side in src/lib/booking.functions.ts — never trust client totals.
- Bookings are inserted only via the submitBooking server function (service role); RLS lets only admins (user_roles + has_role) read/update.
- Admin role is granted by a trigger on auth.users matching the admin email — change it there, never in client code.
- Plan copy lives in src/content/plans.ts; landing copy in src/content/i18n.tsx.
