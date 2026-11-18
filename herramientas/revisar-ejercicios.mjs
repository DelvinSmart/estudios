// Revisa los ejercicios de código de una o varias clases: la SOLUCIÓN tiene que pasar todas las pruebas
// y el CÓDIGO DE INICIO tiene que fallar al menos una (si no, el ejercicio no enseña nada).
//
//   node herramientas/revisar-ejercicios.mjs 61-kotlin-primeros-pasos/LECCION.md 87-*/LECCION.md
//
// js: se corre aquí mismo, con las mismas ayudas que la caja del navegador (prueba, igual, ok).
// kotlin: se manda al Kotlin Playground de verdad (hace falta internet); el inicio tiene que COMPILAR y fallar.
// ts y html se revisan en el navegador (necesitan el compilador de TypeScript o una página).
import { readFileSync } from 'node:fs';
import { leerEjercicio } from '../web/ejercicio.js';
import { correrKotlin } from '../web/ejercicio-kotlin.js';

const AYUDAS = `const __p=[];const prueba=(n,f)=>__p.push({n,f});const __m=x=>{try{return JSON.stringify(x)}catch{return String(x)}};
const igual=(o,e)=>{if(__m(o)!==__m(e))throw new Error('se esperaba '+__m(e)+' y salió '+__m(o))};const ok=(c,m)=>{if(!c)throw new Error(m||'no se cumple')};`;

async function correrJs(codigo, pruebas) {
  const log = console.log;
  console.log = () => {};
  try {
    const lista = new Function(`${AYUDAS}${codigo}\n;${pruebas}\n;return __p;`)();
    const resultados = [];
    for (const p of lista) {
      try {
        await Promise.race([p.f(), new Promise((_, no) => setTimeout(() => no(new Error('tardó más de 3 s')), 3000))]);
        resultados.push({ nombre: p.n, paso: true });
      } catch (e) {
        resultados.push({ nombre: p.n, paso: false, mensaje: e.message });
      }
    }
    return { error: null, resultados };
  } catch (e) {
    return { error: e.message, resultados: [] };
  } finally {
    console.log = log;
  }
}

const correr = (ej, codigo) => (ej.lenguaje === 'kotlin' ? correrKotlin(codigo, ej.pruebas) : correrJs(codigo, ej.pruebas));

let total = 0;
let malos = 0;
let saltados = 0;
for (const archivo of process.argv.slice(2)) {
  const md = readFileSync(archivo, 'utf8');
  for (const m of md.matchAll(/```ejercicio\n([\s\S]*?)\n```/g)) {
    const ej = leerEjercicio(m[1]);
    if (!['js', 'kotlin'].includes(ej.lenguaje)) { saltados++; continue; }
    total++;
    const [sol, ini] = await Promise.all([correr(ej, ej.solucion), correr(ej, ej.codigo)]);
    const solOk = !sol.error && sol.resultados.length > 0 && sol.resultados.every((x) => x.paso);
    const iniOk = !ini.error && ini.resultados.some((x) => !x.paso);
    if (!(solOk && iniOk)) malos++;
    const bien = sol.resultados.filter((x) => x.paso).length;
    console.log(`${solOk && iniOk ? '✓' : '✗'} ${archivo.split('/')[0]} · ${ej.titulo} · ${ej.lenguaje} · solución ${bien}/${sol.resultados.length} · el inicio falla: ${iniOk ? 'sí' : 'NO'}`);
    if (sol.error) console.log(`    la solución tiene un error: ${sol.error}`);
    for (const x of sol.resultados.filter((x) => !x.paso)) console.log(`    la solución falla "${x.nombre}": ${x.mensaje}`);
    if (ini.error) console.log(`    el código de inicio tiene un error (tiene que compilar y fallar): ${ini.error}`);
  }
}
console.log(`\n${total} ejercicios revisados, ${malos} con problemas${saltados ? ` (${saltados} de ts o html: se revisan en el navegador)` : ''}`);
process.exit(malos ? 1 : 0);
