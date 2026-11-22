# Planes, reservas y panel de administración

## 1. Nuevo orden de la página
Inicio → Planes → Cómo reservar → Por qué Kanan → Nuestro equipo → Significado → Preguntas frecuentes → CTA final → Pie de página.

## 2. Planes (tarjetas estilo Apple)
- Título "Planes" + "precio por hora, por niñera".
- Carrusel centrado: la tarjeta activa queda al centro y las vecinas asoman ~24px. En celular 78% del ancho (máx. 320px), formato vertical 3:5. En computadora 3 a la vez con flechas y arrastre. Puntos abajo (el activo, más ancho y amarillo). Abre centrado en "sol".
- Cada tarjeta: ícono amarillo, nombre grande en minúsculas, descripción, precio, línea, lista "Incluye" con íconos, y dos botones: rosa "Reservar" y "Más info por WhatsApp" (mensaje: "Hola, quiero más información del plan [PLAN] de Kanan.").
- Los 6 planes con tus precios y beneficios exactos, en una sola lista fácil de editar. "sol" amarilla, "fiesta" rosa, el resto oscuras con borde.

## 3. Formulario de reserva ("Reservar")
Ventana que sube desde abajo en celular y aparece al centro en computadora, con barra de progreso y 4 pasos:
1. **Servicio:** plan (ya elegido, se puede cambiar), fecha, hora de inicio y fin. Mínimo 3 horas (salvo "en casa" y "viajera"); "dulces sueños" empieza en 10:00 pm–7:00 am.
2. **Niños:** de 1 a 6, edad de cada uno y notas (alergias, mascotas, etc.).
3. **Ubicación y contacto:** municipio, colonia, nombre, WhatsApp de 10 dígitos y correo. Sin dirección exacta.
4. **Resumen:** todos los datos + precio estimado (horas × tarifa; "fiesta" × número de niñeras; "en casa" y "viajera": "Te enviaremos una cotización"), la nota de solicitud y la casilla de aviso de privacidad y cancelación.

Al enviar: se guarda con folio K-0001, K-0002…, y aparece "¡Recibimos tu solicitud! Folio K-000X" con el botón rosa "Continuar por WhatsApp" con el mensaje prellenado.

## 4. Panel de administración (/admin)
- Solo el correo de administración puede entrar.
- Lista de reservas (las más nuevas primero) con filtros: pendiente, confirmada, pagada, completada, cancelada.
- Detalle: todos los datos, cambiar el estado, notas internas, "niñera asignada" (privado), botón para abrir WhatsApp con la familia y un botón desactivado "Generar link de pago" (preparado para Stripe).

## 5. Aviso por correo al administrador
Primero reviso si tu proyecto puede enviar correos. Para enviar avisos necesitas un plan de pago y un dominio propio verificado. Si todavía no lo tienes, las reservas igual se guardan y se ven en /admin, y los correos se activan cuando el dominio esté listo.

## 6. Ajustes extra que pediste
- **Reservas nocturnas:** si la hora de fin es antes que la de inicio, cuenta como el día siguiente (10:00 pm–7:00 am = 9 horas), en el formulario y en el cálculo final.
- **Fiesta:** en el paso 1, "¿Cuántas niñeras necesitas?" (1–5) con la nota "Recomendamos 1 niñera por cada 6 niños". Se usa en el total y se guarda; los demás planes = 1 niñera.
- **Páginas nuevas:** /aviso-de-privacidad y /cancelaciones con texto provisional, enlazadas desde la casilla y el pie de página.
- **Anti-spam:** campo oculto trampa + máximo 3 solicitudes por número de WhatsApp por hora.
- **Hora de Ciudad de México:** no se permiten fechas pasadas y se piden mínimo 12 horas de anticipación, con un mensaje amable que invita a escribir por WhatsApp si es urgente.
- **Correo aún no disponible:** tu proyecto todavía no tiene un dominio de correo, así que /admin mostrará arriba un contador de reservas "pendiente".

## Lo que necesito de ti
- **Correo de administración:** aleinadnaveja14@gmail.com (podrá entrar a /admin; los avisos por correo llegarán ahí cuando haya un dominio de correo verificado).

## Detalles técnicos
- Activar Lovable Cloud. Tabla `bookings` con todos los campos del brief + `internal_notes`, `assigned_nanny`, `payment_link`, `paid_amount`, `nannies_count`; `folio` generado con una secuencia (`'K-' || lpad(nextval,4,'0')`) y un trigger.
- RLS: nadie anónimo puede leer, editar ni borrar. El insert pasa por un createServerFn con validación zod (minimum hours, WhatsApp de 10 dígitos) y supabaseAdmin; recalcula el total en el servidor.
- Roles: tabla `user_roles` + `has_role()`; solo admins hacen select/update. Ruta `/admin` bajo `_authenticated` con login por correo/contraseña; se desactiva el registro público y se asigna el rol admin a ese correo.
- Correo al admin con Lovable Emails tras el insert (idempotencia por id de reserva), solo si hay un dominio verificado.
- Datos de los planes en `src/content/plans.ts` (ES/EN); componentes `PlansCarousel`, `BookingDialog` (Drawer en móvil / Dialog en desktop).
- Prueba: enviar una reserva de prueba, confirmar la fila y el folio, y luego borrar solo esa fila.
