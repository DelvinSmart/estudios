// Los ejercicios de PYTHON. Python corre de verdad dentro del navegador con Pyodide (gratis, de jsdelivr):
// es el intérprete de Python compilado para la web. La primera vez baja unos 12 MB; después queda en la caché.
//
// Dónde corre: dentro de la misma caja aislada que JavaScript (un iframe sin acceso a este sitio) y, adentro
// de la caja, en un Worker. Así, si el código se queda en un ciclo sin fin, el Worker se mata y la página
// sigue andando.
//
// En un ejercicio de Python:
//   --- código     funciones y clases (lo que el alumno completa)
//   --- pruebas    prueba("nombre", lambda: igual(obtenido, esperado))
//                  o, para pruebas de varias líneas:
//                  @prueba("nombre")
//                  def _():
//                      ...
//
// Este archivo no toca la página: guarda el programa de Python que corre las pruebas y arma la caja.
// La herramienta que revisa los ejercicios (herramientas/revisar-ejercicios.mjs) usa este mismo programa
// con el Python de la computadora.

export const PYODIDE_VERSION = '314.0.7';
export const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
export const ESPERA_PYTHON_MS = 60000; // para bajar Pyodide la primera vez
export const ESPERA_PYTHON_CORRER_MS = 10000; // para correr el código, una vez que Python ya está listo

// Las ayudas de las pruebas, escritas en Python.
export const AYUDAS_PY = `
_resultados = []

def igual(obtenido, esperado):
    if obtenido != esperado:
        raise AssertionError(f"se esperaba {esperado!r} y salió {obtenido!r}")

def ok(condicion, mensaje="no se cumple"):
    if not condicion:
        raise AssertionError(mensaje)

def prueba(nombre, fn=None):
    def correr(f):
        try:
            f()
            _resultados.append({"nombre": nombre, "paso": True})
        except AssertionError as e:
            _resultados.append({"nombre": nombre, "paso": False, "mensaje": str(e)})
        except Exception as e:
            _resultados.append({"nombre": nombre, "paso": False, "mensaje": __explicar(e)})
        return f
    return correr(fn) if fn is not None else correr
`;

// El programa que corre todo: el código del alumno, después las pruebas. Devuelve un JSON con el resultado.
// Usa dos variables que se le pasan: __codigo y __pruebas.
export const CORREDOR_PY = `
import json, traceback

__EN_ESPANOL = {
    "IndentationError": "la sangría (los espacios al principio de la línea) no está bien",
    "TabError": "mezclaste tabulaciones y espacios en la sangría",
    "SyntaxError": "Python no entiende cómo está escrito (¿falta un :, un paréntesis o unas comillas?)",
    "NameError": "ese nombre no existe (¿está mal escrito o falta crearlo?)",
    "TypeError": "usaste un valor de un tipo donde va otro",
    "ValueError": "el tipo está bien, pero el valor no sirve (por ejemplo, int('abc'))",
    "ZeroDivisionError": "dividiste por cero",
    "KeyError": "esa clave no está en el diccionario",
    "IndexError": "pediste una posición que la lista no tiene",
    "AttributeError": "ese valor no tiene esa propiedad o función",
    "RecursionError": "la función se llama a sí misma sin parar",
    "UnboundLocalError": "usas una variable antes de darle un valor dentro de la función",
}

def __linea(e):
    if isinstance(e, SyntaxError) and e.filename == "<tu código>":
        return e.lineno
    for marco in reversed(traceback.extract_tb(e.__traceback__)):
        if marco.filename == "<tu código>":
            return marco.lineno
    return None

def __explicar(e):
    nombre = type(e).__name__
    original = f"{nombre}: {e.msg if isinstance(e, SyntaxError) else e}"
    espanol = __EN_ESPANOL.get(nombre)
    linea = __linea(e)
    donde = f"línea {linea}: " if linea else ""
    return f"{donde}{espanol} ({original})" if espanol else f"{donde}{original}"

__espacio = {"__name__": "__main__", "__explicar": __explicar}
exec(AYUDAS, __espacio)
__error = None
try:
    exec(compile(__codigo, "<tu código>", "exec"), __espacio)
except BaseException as e:
    __error = "Tu código tiene un error: " + __explicar(e)
if __error is None:
    try:
        exec(compile(__pruebas, "<pruebas>", "exec"), __espacio)
    except BaseException as e:
        __error = "Las pruebas no pudieron correr: " + __explicar(e)
json.dumps({"error": __error, "resultados": __espacio["_resultados"]})
`;

// El Worker: carga Pyodide, corre el programa y devuelve el resultado. La salida de print() va a "logs".
// Es un Worker de MÓDULO creado desde un data: (no desde un blob:): Pyodide ya no funciona en Workers clásicos,
// y dentro de la caja sin origen el navegador no deja crear un Worker de módulo desde un blob.
const WORKER = `
let listo = null;
onmessage = async (ev) => {
  const { codigo, pruebas, ayudas, corredor } = ev.data;
  const logs = [];
  try {
    listo = listo || import('${PYODIDE_URL}pyodide.mjs').then(({ loadPyodide }) => loadPyodide({ indexURL: '${PYODIDE_URL}' }));
    const py = await listo;
    postMessage({ listo: true }); // Python ya bajó: desde aquí corre el reloj corto
    py.setStdout({ batched: (t) => logs.push(t) });
    py.setStderr({ batched: (t) => logs.push('✗ ' + t) });
    py.setStdin({ stdin: () => { throw new Error('input() no se usa en los ejercicios: la función recibe los datos como parámetros'); } });
    py.globals.set('__codigo', codigo);
    py.globals.set('__pruebas', pruebas);
    py.globals.set('AYUDAS', ayudas);
    const r = JSON.parse(py.runPython(corredor));
    postMessage({ ...r, logs });
  } catch (e) {
    postMessage({ error: 'No se pudo cargar Python: ¿hay internet? (' + (e && e.message ? e.message : e) + ')', resultados: [], logs });
  }
};
`;

/** La caja de Python: un iframe aislado que crea el Worker y le pasa el código. Responde igual que las otras cajas. */
export function cajaPython() {
  return `<!doctype html><meta charset="utf-8"><script>
const AYUDAS = ${JSON.stringify(AYUDAS_PY)};
const CORREDOR = ${JSON.stringify(CORREDOR_PY)};
const trabajador = new Worker('data:text/javascript,' + encodeURIComponent(${JSON.stringify(WORKER)}), { type: 'module' });
window.addEventListener('message', (ev) => {
  const { codigo, pruebas } = ev.data || {};
  trabajador.onmessage = (r) => {
    if (r.data.listo) { parent.postMessage({ __ejercicioListo: true }, '*'); return; }
    parent.postMessage({ __ejercicio: true, error: r.data.error, logs: r.data.logs || [], resultados: r.data.resultados || [] }, '*');
  };
  trabajador.onerror = (e) => parent.postMessage({ __ejercicio: true, error: 'No se pudo cargar Python: ¿hay internet?', logs: [], resultados: [] }, '*');
  trabajador.postMessage({ codigo, pruebas, ayudas: AYUDAS, corredor: CORREDOR });
}, { once: true });
<\/script>`;
}
