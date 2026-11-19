// LA LÓGICA: cuándo toca cada mantenimiento. Sin pantalla ni navegador: datos que entran, datos que salen.
// Paso 1 del plan.

export const AVISO_KM = 500; // "pronto" si faltan 500 km o menos
export const AVISO_DIAS = 15; // o 15 días o menos

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

/** "2026-01-31" + 1 mes = "2026-02-28": si el mes no tiene ese día, el último del mes (no se pasa al siguiente). */
export function sumarMeses(fecha, meses) {
  const [a, m, d] = fecha.split('-').map(Number);
  const total = m - 1 + meses;
  const anio = a + Math.floor(total / 12);
  const mes = total % 12; // 0 = enero
  const ultimoDia = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
  const dia = Math.min(d, ultimoDia);
  return `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

/** Días desde una fecha hasta otra (negativo si la segunda es antes). En UTC, para que la hora no corra el día. */
export function diasEntre(desde, hasta) {
  return Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / 86400000);
}

/** El estado de un mantenimiento: 'vencido', 'pronto' o 'al día', con lo que falta y por qué. */
export function estadoDe(m, kmActual, hoy) {
  const faltanKm = m.cadaKm ? m.ultimoKm + m.cadaKm - kmActual : null;
  const proximaFecha = m.cadaMeses ? sumarMeses(m.ultimaFecha, m.cadaMeses) : null;
  const faltanDias = proximaFecha ? diasEntre(hoy, proximaFecha) : null;

  // Lo que llegue primero manda: comparamos cada uno contra su aviso.
  const urgenciaKm = faltanKm === null ? Infinity : faltanKm / AVISO_KM;
  const urgenciaDias = faltanDias === null ? Infinity : faltanDias / AVISO_DIAS;
  const porQue = urgenciaKm <= urgenciaDias ? 'km' : 'fecha';

  let estado = 'al día';
  if ((faltanKm !== null && faltanKm <= 0) || (faltanDias !== null && faltanDias <= 0)) estado = 'vencido';
  else if ((faltanKm !== null && faltanKm <= AVISO_KM) || (faltanDias !== null && faltanDias <= AVISO_DIAS)) estado = 'pronto';

  return { estado, faltanKm, faltanDias, proximaFecha, porQue };
}

/** El texto que ve la persona: "faltan 300 km", "venció hace 3 días"… según lo que llegue primero. */
/** 14300 → "14.300", como se escribe en Brasil (encontrado mirando la app: "14300 km" se leía mal). */
export const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export function textoDeFalta(e) {
  const falta = e.porQue === 'km' ? e.faltanKm : e.faltanDias;
  if (falta === 0) return 'toca hoy'; // justo en el borde (encontrado en la revisión)
  if (e.porQue === 'km') return falta > 0 ? `faltan ${miles(falta)} km` : `se pasó por ${miles(-falta)} km`;
  return falta > 0 ? `faltan ${falta} días` : `venció hace ${-falta} días`;
}

/** Marcar como hecho hoy: una copia con los km y la fecha de hoy. Hacerlo dos veces da lo mismo. */
export function hechoHoy(m, kmActual, hoy) {
  return { ...m, ultimoKm: kmActual, ultimaFecha: hoy };
}

const ORDEN = { vencido: 0, pronto: 1, 'al día': 2 };

/** Lo vencido primero, después lo pronto, después lo que está al día. Una lista nueva. */
export function ordenar(lista, kmActual, hoy) {
  return [...lista].sort((a, b) => ORDEN[estadoDe(a, kmActual, hoy).estado] - ORDEN[estadoDe(b, kmActual, hoy).estado]);
}

const numero = (texto) => (String(texto ?? '').trim() === '' ? null : Number(String(texto).replace(',', '.')));

function existeElDia(texto) {
  if (!FECHA.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const f = new Date(Date.UTC(a, m - 1, d));
  return f.getUTCFullYear() === a && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
}

/** Del formulario (texto) a un mantenimiento. Solo se llama si problemasDe() dio una lista vacía.
 *  Si va solo por meses y no puso los km, se toman los de hoy. */
export function desdeFormulario(datos, kmActual, id) {
  return {
    id,
    nombre: String(datos.nombre).trim(),
    cadaKm: numero(datos.cadaKm),
    cadaMeses: numero(datos.cadaMeses),
    ultimoKm: numero(datos.ultimoKm) ?? kmActual,
    ultimaFecha: datos.ultimaFecha,
  };
}

/** Las puertas y ventanas al anotar uno (lo que escribe la persona llega como texto). */
export function problemasDe(datos, kmActual, hoy) {
  const problemas = [];
  if (!String(datos.nombre ?? '').trim()) problemas.push('Escribe qué mantenimiento es');
  const cadaKm = numero(datos.cadaKm);
  const cadaMeses = numero(datos.cadaMeses);
  const ultimoKm = numero(datos.ultimoKm);
  if (cadaKm === null && cadaMeses === null) problemas.push('Pon cada cuántos km o cada cuántos meses (o los dos)');
  // Ojo: en JavaScript, null >= 0 es true. Por eso el vacío se revisa aparte (encontrado en la revisión).
  // Los km del último cambio solo hacen falta si el mantenimiento va por km.
  if (cadaKm !== null && !(cadaKm > 0)) problemas.push('Los km tienen que ser un número mayor que 0');
  else if (cadaKm !== null && ultimoKm === null) problemas.push('Escribe los km del último cambio');
  else if (ultimoKm !== null && !(ultimoKm >= 0)) problemas.push('Los km tienen que ser un número mayor que 0');
  else if (ultimoKm !== null && ultimoKm > kmActual) problemas.push('El último cambio no puede tener más km que el carro hoy');
  if (cadaMeses !== null && !(Number.isInteger(cadaMeses) && cadaMeses > 0)) problemas.push('Los meses tienen que ser un número entero mayor que 0');
  if (!existeElDia(String(datos.ultimaFecha ?? ''))) problemas.push('La fecha tiene que ser un día que exista');
  else if (datos.ultimaFecha > hoy) problemas.push('La fecha no puede ser en el futuro');
  return problemas;
}
