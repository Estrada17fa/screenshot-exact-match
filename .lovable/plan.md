# Nuevo inicio (hero) para Kanan

## Problema
El contenido del inicio usa una animación que solo aparece al hacer scroll; en el celular a veces nunca se activa y el inicio queda vacío. Además, la foto de la niñera con las tres niñas y el ícono del sol en espiral **nunca llegaron** (solo tengo el logo). Necesito que los subas de nuevo.

## Qué cambia
- **Visible al cargar:** el texto aparece de inmediato con una entrada suave (aparece y sube, escalonado cada 100ms). Si algo falla, todo se ve igual (empieza visible).
- **Sol que sale:** círculo amarillo grande (#FCCF4F) que sube desde abajo al cargar (1.2s), con un brillo amarillo suave detrás.
- **Foto:** sobre el sol, pegada abajo, justo encima de la barra flotante de WhatsApp. Mientras no llegue, el sol queda solo con el espiral dibujado.
- **Palabra que cambia:** "Tu tranquilidad, su ___." alternando felicidad → risa → juego → aventura cada 2.5s, deslizándose hacia arriba, en amarillo. (En inglés: happiness → laughter → play → adventure.)
- **Sol en espiral:** girando muy lento detrás del titular, al 8% de opacidad, cortado por el borde derecho (usa el dibujado hasta que subas el PNG).
- **Dos insignias de vidrio** sobre la foto, flotando 6px arriba y abajo (3s): "✓ Antecedentes verificados" y una rosa "desde $140 /hr".
- **Línea bajo el titular** en gris: "Niñeras verificadas en Guadalajara".

## Orden en celular (todo en una pantalla)
Barra superior → insignia → titular → línea gris → sol + foto llenando el resto → barra de WhatsApp. Nada encima del titular.

En computadora se mantiene en dos columnas (texto a la izquierda, sol y foto a la derecha).

## Detalles técnicos
- Hero sin `Reveal`/IntersectionObserver; animaciones CSS keyframes (`hero-in` con `animation-fill-mode: both` y fallback: estado base opaco, la animación solo con clase `.js` añadida en root o vía `@media (prefers-reduced-motion: no-preference)`).
- Layout móvil: `h-svh flex flex-col`, bloque de texto `shrink-0`, escena del sol `flex-1 min-h-0 relative` con `pb` igual a la altura de la barra fija.
- Keyframes nuevos en styles.css: `sun-rise`, `float-y`, `word-slide`; palabra rotatoria con `useEffect` + interval y `aria-live="polite"`, respeta reduced-motion.
- Textos nuevos en ES/EN en el diccionario existente.
- Imágenes subidas como assets CDN (`.asset.json`) cuando lleguen.
