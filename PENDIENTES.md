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

**Pasos (tú):**

1. Abre <https://www.google.com/recaptcha/admin/create>.
2. **Etiqueta:** `Mapa de estudios`. **Tipo:** reCAPTCHA **v3** (por puntuación, invisible).
3. **Dominios:** `delvinsmart.github.io` y `localhost` (para probar en la Mac). Acepta los términos. **Enviar**.
4. Copia las dos claves que aparecen: la **clave del sitio** (pública) y la **clave secreta** (privada).
5. Abre <https://console.firebase.google.com/project/mapa-estudios-ds/appcheck>.
6. Pestaña **Apps** → tu app web → **reCAPTCHA v3** → pega la **clave secreta** → **Guardar**.
7. Pásale a la IA **solo la clave del sitio** (la pública). La secreta no se la pases a nadie.

**Pasos (la IA) — ✅ HECHO (2026-11-19):**

- ✅ App Check agregado en `web/nube.js` con la clave del sitio (reCAPTCHA v3, modo "mirar": el sitio ya manda el token con cada llamada).
- ⏳ **Todavía NO** se puso `enforceAppCheck: true` en las funciones, **a propósito**: primero se observa una semana que todo venga "verificado"; recién ahí se exige, para no bloquear a nadie por un error de configuración.

**Pasos finales (tú, una semana después):**

1. En la consola de App Check (<https://console.firebase.google.com/project/mapa-estudios-ds/appcheck>), mira las métricas:
   casi todo tiene que salir como **"verificado"** (*verified*). Si ves muchas "no verificadas", avísame **antes** de aplicar.
2. Cuando esté casi todo verificado, **avísame**: yo pongo `enforceAppCheck: true` en las funciones y las publico, y tú tocas **Aplicar** (*Enforce*) en Cloud Firestore. Desde ese momento, lo que no venga del sitio queda bloqueado.

> ⚠️ No actives "Aplicar" el primer día: si algo quedó mal configurado, bloquearías a los alumnos de verdad.
> Primero se mira, después se aplica.

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
