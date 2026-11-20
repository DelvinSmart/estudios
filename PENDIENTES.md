# Pendientes que tiene que hacer Delvin (paso a paso)

Son cosas que una IA no puede hacer por ti: piden entrar con tu cuenta de Google o aceptar algo en una consola.
Cuando termines una, márcala con `[x]` y avísale a la IA si hay que cambiar algo en el código después.

---

## [ ] 1. Alerta de presupuesto en Google Cloud (gratis, 5 minutos)

**Qué es:** un aviso por correo cuando el proyecto de Firebase empieza a gastar dinero.
**Por qué:** las Cloud Functions necesitan el plan Blaze (de pago por uso). Si alguien abusa del sitio
(un robot que llama mil veces a la función que corrige las prácticas), Google cobra. La alerta **no corta**
el gasto, pero te avisa a tiempo para reaccionar.

> 🌎 **En la vida real:** es como la alarma del celular cuando gastaste el 80 % de tus datos del mes.

**Pasos:**

1. Abre <https://console.cloud.google.com/billing> con la cuenta de Google del proyecto.
2. Elige la **cuenta de facturación** que usa el proyecto `mapa-estudios-ds`.
3. En el menú de la izquierda: **Presupuestos y alertas** (*Budgets & alerts*) → **Crear presupuesto**.
4. **Nombre:** `Mapa de estudios`. En **Proyectos**, marca solo `mapa-estudios-ds`. **Siguiente**.
5. **Importe:** tipo "Importe especificado", por ejemplo **US$ 5** (o lo que estés dispuesto a gastar por mes).
6. **Umbrales de alerta:** deja 50 %, 90 % y 100 % del gasto real. Agrega uno de 100 % del **gasto previsto**.
7. Marca **Enviar alertas por correo a administradores y usuarios de facturación**. **Terminar**.

**Cómo saber que quedó:** en *Presupuestos y alertas* aparece "Mapa de estudios" con su barra en 0 %.

---

## [ ] 2. App Check (gratis, 15 minutos; la IA hace la parte del código después)

**Qué es:** un control que deja usar el servidor y la base de datos **solo desde tu sitio**, no desde un
programa que alguien escribió copiando tu configuración pública.
**Por qué:** hoy, con la `apiKey` (que es pública, y está bien que lo sea), un robot puede llamar directo a
`corregirPractica` o crear cuentas en masa. App Check le pide a cada visita una prueba de que es una página
real de `delvinsmart.github.io`, usando reCAPTCHA (invisible: el alumno no tiene que tocar nada).

> 🌎 **En la vida real:** la `apiKey` es la dirección del edificio (todos la saben). App Check es el portero
> que mira que vengas de verdad a una oficina del edificio y no seas un robot tocando todos los timbres.

**Estado (2026-11-19):** el reCAPTCHA "clásico" quedó **descontinuado** en la consola, así que App Check se registró con **Fraud Defense (reCAPTCHA Enterprise)**, y quedó **en verde (registrado)** en el proyecto `mapa-estudios-ds`. La API de reCAPTCHA Enterprise está **activada**. La clave v3 clásica que se creó al principio **no sirve** para Enterprise. El código del cliente (`web/nube.js`) quedó **limpio, sin App Check** a la espera de la clave de Enterprise (para no dejar nada a medias).

**Lo que falta para terminarlo (tú, cuando tengas paciencia):**

1. Entra a **<https://console.cloud.google.com/security/recaptcha?project=mapa-estudios-ds>** (reCAPTCHA Enterprise → **Chaves/Keys**). Debería haber una **clave** (empieza por `6L…`) creada por Fraud Defense.
   - Si esa página te lleva a otra cosa, usa el menú ☰ → **Segurança** → **reCAPTCHA**, con el proyecto **Mapa de estudios** elegido arriba.
2. Copia esa **clave de Enterprise** (es pública) y **pásasela a la IA**.

**Lo que hará la IA con esa clave:**

- Agregar `initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider('<clave>'), isTokenAutoRefreshEnabled: true })` en `web/nube.js` (importando `firebase-app-check.js`).
- Publicar. Queda en **modo "mirar"** (el sitio manda el token, pero los servidores **no** lo exigen).

**Pasos finales (tú, una semana después de eso):**

1. En <https://console.firebase.google.com/project/mapa-estudios-ds/appcheck>, mira que casi todo venga **"verificado"**. Si hay muchas "no verificadas", avísale a la IA **antes** de aplicar.
2. Cuando esté verificado, **avísale a la IA**: pone `enforceAppCheck: true` en las funciones y publica, y tú tocas **Aplicar** (*Enforce*) en Cloud Firestore. Desde ahí, lo que no venga del sitio queda bloqueado.

> ⚠️ No actives "Aplicar" el primer día: si algo quedó mal configurado, bloquearías a los alumnos de verdad. Primero se mira, después se aplica.
> 💡 Mientras tanto no pasa nada: tus datos ya están protegidos por las **reglas de Firestore** (`firebase/firestore.rules`). App Check es una **capa extra**.

---

## [ ] 3. Correr las pruebas de reglas en tu Mac (solo si quieres correrlas a mano)

Las pruebas de las reglas de Firestore necesitan **Java 21**. Tu Mac ya lo tiene instalado, pero el terminal usa
Java 17 por defecto (está en `~/.zshrc`, y conviene dejarlo así porque Android lo puede necesitar).
Para correr las pruebas de reglas, usa el 21 solo para ese comando:

```bash
cd /Volumes/SSD_Desarrollo/Developer/Aprender/firebase/pruebas
JAVA_HOME=/opt/homebrew/opt/openjdk@21 PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH npm test
```

No hace falta hacerlo siempre: el CI de GitHub (`.github/workflows/pruebas.yml`) las corre solo en cada subida.
