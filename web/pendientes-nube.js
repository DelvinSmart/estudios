// Los pendientes sobreviven al cierre y pertenecen a la cuenta que los guardó.
export function crearColaNube({ almacenamiento, enviar, avisar, conectado, esperar, cancelar }) {
  const clave = 'mapa-pendientes-nube';
  const claveCuenta = 'mapa-cuenta-nube';
  let enviando = null;
  let agregadaDuranteEnvio = false;
  let temporizador = null;

  const leer = () => {
    try { return JSON.parse(almacenamiento.getItem(clave)) || []; }
    catch { return []; }
  };
  const misma = (a, b) => a.uid === b.uid && a.curso === b.curso && a.id === b.id;
  const cuenta = () => almacenamiento.getItem(claveCuenta);
  const guardar = (lista) => almacenamiento.setItem(clave, JSON.stringify(lista));

  function programar(ms) {
    if (temporizador !== null) cancelar(temporizador);
    temporizador = esperar(() => { temporizador = null; procesar(); }, ms);
  }

  function procesar() {
    if (enviando) return enviando;
    let uid;
    try { uid = cuenta(); } catch { return Promise.resolve(); }
    if (!uid || !conectado()) return Promise.resolve();
    enviando = (async () => {
      let reintento = Infinity;
      const pausados = new Set();
      for (const parte of leer().filter((p) => p.uid === uid)) {
        if (cuenta() !== uid || !conectado()) break;
        if (pausados.has(parte.curso) || !leer().some((p) => misma(p, parte))) continue;
        let resultado;
        try { resultado = await enviar(parte); }
        catch { resultado = { motivo: 'error' }; }
        if (cuenta() !== uid) break;
        if (resultado.ok || resultado.motivo === 'ya') {
          guardar(leer().filter((p) => !misma(p, parte)));
          avisar(parte);
        } else {
          pausados.add(parte.curso);
          if (!['sin-sesion', 'sin-verificar'].includes(resultado.motivo)) {
            const ms = resultado.motivo === 'espera' ? (resultado.segundos + 1) * 1000 : 60000;
            reintento = Math.min(reintento, ms);
          }
        }
      }
      if (Number.isFinite(reintento) && cuenta() === uid) programar(reintento);
    })().catch(() => {
      if (cuenta() === uid) programar(60000);
    }).finally(() => {
      enviando = null;
      if (agregadaDuranteEnvio) {
        agregadaDuranteEnvio = false;
        programar(0);
      }
    });
    return enviando;
  }

  return {
    asociar(uid) {
      if (enviando && cuenta() !== uid) agregadaDuranteEnvio = true;
      if (uid) almacenamiento.setItem(claveCuenta, uid);
      else almacenamiento.removeItem(claveCuenta);
    },
    agregar(curso, id) {
      const uid = cuenta();
      if (!uid) return false;
      const parte = { uid, curso, id };
      const lista = leer();
      if (!lista.some((p) => misma(p, parte))) guardar([...lista, parte]);
      if (enviando) agregadaDuranteEnvio = true;
      else programar(0);
      return true;
    },
    quitar(curso, id) {
      const uid = cuenta();
      guardar(leer().filter((p) => !misma(p, { uid, curso, id })));
    },
    tiene(curso, id) {
      try {
        const uid = cuenta();
        return leer().some((p) => misma(p, { uid, curso, id }));
      } catch { return false; }
    },
    procesar,
  };
}
