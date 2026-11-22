# Kanan Childcare — landing page

One-page landing (at `/`) following the brief's design system exactly: plum-black background, cream text, yellow sun + pink CTA accents, Bricolage Grotesque + Inter, 8px spacing, 28px cards / pill buttons.

## Sections
1. Navbar — "k'anan." wordmark, EN/ES pill, menu button (mobile sheet); desktop links + pink "Reservar". Blurs on scroll.
2. Hero — badge, H1 with yellow "su felicidad.", photo on yellow circle with glow, two glass badges. Mobile fixed glass bottom bar (WhatsApp + scroll-to-services).
3. Servicios — 6 cards (sol, luna, dulces sueños, fiesta, en casa, viajera), scroll-snap carousel + dots on mobile, 3-col grid desktop; each card opens WhatsApp with its service name.
4. Por qué Kanan — bento grid 2/4 columns.
5. Nuestro equipo — intro text, 6 editable placeholder profiles (abstract yellow/pink avatar with initial or sun, no photos/personal data, not clickable), shield trust note.
6. Significado — yellow card with cropped sun.
7. Así de fácil — 3 pink-numbered steps.
8. FAQ — accordion, 5 questions (placeholder answers except the "elegir niñera" one).
9. Final CTA — glow card, pink "WhatsApp 33 2984 3381".
10. Footer — wordmark, city, Instagram / Facebook / Aviso de privacidad (placeholder links).

## Behavior
- All WhatsApp links → wa.me/523329843381 with prefilled Spanish message.
- ES/EN toggle switches all copy (Spanish default).
- Fade-up on scroll, slow sun rotation, card hover lift; respects reduced motion.
- Spanish SEO meta for "niñeras en Guadalajara".

## Assets
The brief mentions hero photo, sun icon and logo, but only the text brief was uploaded. I'll build with a drawn SVG sun and a placeholder hero image area; upload the PNGs anytime and I'll swap them in.

## Technical details
- Translations in `src/content/i18n.ts` (ES/EN dictionaries) + React context for language.
- Team profiles and services in `src/content/data.ts` arrays for easy editing.
- Section components in `src/components/kanan/*`; tokens in `src/styles.css`; fonts via `<link>` in root head.
- IntersectionObserver for fade-ups; native scroll-snap carousels.
