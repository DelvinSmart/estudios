# JavaScript 8: errores, clases y objetos

> 🌎 **En la vida real:** un buen taller tiene dos cosas: un plan para cuando algo sale mal (un repuesto que no llega, una pieza rota) y moldes para hacer piezas iguales sin dibujarlas cada vez. En programación, lo primero son los **errores** y lo segundo, las **clases**.

> 🎙️ **El profesor dice:** {{alumno}}, hoy aprendes a manejar errores como un profesional (lanzarlos, atraparlos y dar mensajes que sirvan) y a usar **clases**: moldes para crear objetos que juntan datos y comportamiento. Al final vas a entender qué es la famosa **programación orientada a objetos**, en qué se parece a un motor de diseño y en qué no, y cuándo conviene usarla.

## Parte 1. Errores: lanzar, atrapar y dar buenos mensajes

Un **error** es la forma que tiene un programa de decir "no puedo seguir así". Tú también puedes lanzarlos, cuando un dato no tiene sentido:

```js
function registrarCarga(litros) {
  if (!(litros > 0)) throw new Error('Los litros tienen que ser mayores que 0');
  return { litros };
}

try {
  registrarCarga(-5);
  console.log('esto no se ejecuta');
} catch (error) {
  console.log('No se pudo:', error.message);   // No se pudo: Los litros tienen que ser mayores que 0
} finally {
  console.log('esto se ejecuta siempre');      // con error o sin error
}
```

- `throw` **lanza** el error: la función se corta ahí.
- `try { … } catch (error) { … }` **atrapa** el error: si algo dentro del `try` falla, se salta al `catch` en vez de romper todo.
- `finally` corre **siempre**: sirve para limpiar (cerrar un "cargando…", por ejemplo).
- `error.message` es el mensaje; `error.name` dice qué tipo de error es (`TypeError`, `RangeError`…).

**Un buen mensaje de error dice qué pasó y qué hacer.** "Error 1" no ayuda a nadie; "Los litros tienen que ser mayores que 0" sí.

> 🌎 **En la vida real:** `throw` es como el mecánico que para el trabajo y dice "falta esta pieza"; `catch` es el encargado que recibe el aviso y decide qué hacer (pedir la pieza, avisar al cliente) en vez de cerrar el taller.

> 🌎 **Otro ejemplo:** `finally` es como apagar la máquina al final del día: lo haces haya salido bien o mal el trabajo.

> ⚠️ **No escondas los errores:** un `catch` vacío que se traga todo hace que el problema siga ahí sin que nadie lo vea (clase 34). Atrapa un error solo si sabes qué hacer con él.

> 🧩 **Piezas para este ejercicio**
> - `throw new Error(mensaje)` interrumpe la función. Si otra función la llamó dentro de `try`, el control pasa a `catch` y `error.message` recupera el mensaje.
> - `toFixed(2)` produce texto para mostrar. Para conservar un total numérico, puedes usar `Math.round(valor * 100) / 100`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Validar una carga de combustible
lenguaje: js
pide: `registrarCarga(litros, precio)` lanza un error con el mensaje `Los litros tienen que ser mayores que 0` si los litros no son mayores que 0, y `El precio tiene que ser mayor que 0` si el precio no lo es. Si todo está bien, devuelve `{ litros, precio, total }` con el total redondeado a 2 decimales. `intentarCarga` usa `try`/`catch`: devuelve el objeto o, si falla, el **mensaje** del error.
--- código
function registrarCarga(litros, precio) {
  // tu código aquí
}

function intentarCarga(litros, precio) {
  // tu código aquí
}
--- pruebas
prueba('una carga correcta', () => igual(registrarCarga(40, 5.99), { litros: 40, precio: 5.99, total: 239.6 }));
prueba('litros en 0 lanza un error', () => { let msg = ''; try { registrarCarga(0, 5); } catch (e) { msg = e.message; } igual(msg, 'Los litros tienen que ser mayores que 0'); });
prueba('precio negativo lanza un error', () => { let msg = ''; try { registrarCarga(10, -1); } catch (e) { msg = e.message; } igual(msg, 'El precio tiene que ser mayor que 0'); });
prueba('intentarCarga devuelve el mensaje si falla', () => igual(intentarCarga(-3, 5), 'Los litros tienen que ser mayores que 0'));
prueba('intentarCarga devuelve la carga si está bien', () => igual(intentarCarga(10, 6).total, 60));
--- solución
function registrarCarga(litros, precio) {
  if (!(litros > 0)) throw new Error('Los litros tienen que ser mayores que 0');
  if (!(precio > 0)) throw new Error('El precio tiene que ser mayor que 0');
  const total = Math.round(litros * precio * 100) / 100;
  return { litros, precio, total };
}

function intentarCarga(litros, precio) {
  try {
    return registrarCarga(litros, precio);
  } catch (error) {
    return error.message;
  }
}
```

```practica
vf :: Cuando se lanza un error con throw, la función se corta en ese punto
vf :: Un catch vacío es una buena forma de que la app no muestre errores
elige :: ¿Cuándo se ejecuta finally? :: Solo si hubo error :: Solo si no hubo error :: Siempre
elige :: ¿Cuál es un buen mensaje de error? :: "Error 1" :: "Algo salió mal" :: "Los litros tienen que ser mayores que 0"
escribe :: Explica con un ejemplo de la vida real la diferencia entre throw y catch. :: throw es el mecánico que para y avisa "falta esta pieza"; catch es el encargado que recibe el aviso y decide qué hacer (pedir la pieza, avisar al cliente) en vez de cerrar el taller.
```

## Parte 2. Clases: moldes para crear objetos

Hasta ahora creabas objetos a mano: `{ marca: 'Toyota', km: 85000 }`. Si necesitas muchos carros, todos con los mismos datos **y las mismas acciones**, se usa una **clase**: un molde.

```js
class Carro {
  constructor(marca, km) {     // se ejecuta al crear cada carro
    this.marca = marca;        // this = "este carro" (el que se está creando)
    this.km = km;
  }

  registrarViaje(distancia) {  // un MÉTODO: una función que vive dentro del objeto
    this.km += distancia;
    return this.km;
  }
}

const etios = new Carro('Toyota', 85000);   // new usa el molde y crea un carro
etios.registrarViaje(12);                   // 85012
const onix = new Carro('Chevrolet', 40000); // otro carro, con sus propios datos
```

- `class` define el molde; `new` crea un objeto con ese molde (se llama **instancia**).
- `constructor` prepara cada objeto nuevo.
- `this` es **el objeto actual**: en `etios.registrarViaje(12)`, `this` es `etios`.
- Cada objeto tiene **sus propios datos**, pero comparten los **métodos** del molde.

> 🌎 **En la vida real:** la clase es el molde de una panadería; cada pan (`new`) sale con la misma forma, pero cada uno es un pan distinto: si muerdes uno, los otros siguen enteros.

> 🌎 **Otro ejemplo:** Es como el formulario de inscripción de un gimnasio: el formulario es igual para todos (la clase), pero cada ficha llena es de una persona (cada objeto), con sus datos.

> 🧩 **Piezas para este ejercicio**
> - `constructor` se ejecuta al crear cada carro con `new`. `this.km` guarda los kilómetros de ese carro concreto.
> - Para medir lo recorrido desde el último cambio, resta el kilometraje registrado entonces al actual. Al cambiar el aceite, registra el kilometraje actual para la próxima comparación.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La clase Carro
lenguaje: js
pide: Completa la clase `Carro`. El `constructor` guarda `marca` y `km`. `registrarViaje(distancia)` suma la distancia a los km y los devuelve. `necesitaAceite()` devuelve `true` si pasaron **5000 km o más** desde `ultimoCambio` (que empieza en los km con que se creó el carro). `cambiarAceite()` deja `ultimoCambio` en los km de ahora.
--- código
class Carro {
  constructor(marca, km) {
    // tu código aquí
  }

  registrarViaje(distancia) {
    // tu código aquí
  }

  necesitaAceite() {
    // tu código aquí
  }

  cambiarAceite() {
    // tu código aquí
  }
}
--- pruebas
prueba('guarda la marca y los km', () => { const c = new Carro('Toyota', 85000); igual([c.marca, c.km], ['Toyota', 85000]); });
prueba('registrarViaje suma y devuelve', () => igual(new Carro('Fiat', 100).registrarViaje(12), 112));
prueba('recién creado no necesita aceite', () => igual(new Carro('Fiat', 100).necesitaAceite(), false));
prueba('después de 5000 km, sí', () => { const c = new Carro('Fiat', 100); c.registrarViaje(5000); igual(c.necesitaAceite(), true); });
prueba('cambiar el aceite reinicia la cuenta', () => { const c = new Carro('Fiat', 0); c.registrarViaje(6000); c.cambiarAceite(); igual(c.necesitaAceite(), false); });
prueba('dos carros no se mezclan', () => { const a = new Carro('A', 0); const b = new Carro('B', 0); a.registrarViaje(10); igual(b.km, 0); });
--- solución
class Carro {
  constructor(marca, km) {
    this.marca = marca;
    this.km = km;
    this.ultimoCambio = km;
  }

  registrarViaje(distancia) {
    this.km += distancia;
    return this.km;
  }

  necesitaAceite() {
    return this.km - this.ultimoCambio >= 5000;
  }

  cambiarAceite() {
    this.ultimoCambio = this.km;
  }
}
```

```practica
vf :: Una clase es un molde, y new crea un objeto con ese molde
vf :: Si cambias los km de un carro, cambian los km de todos los carros de la misma clase
elige :: Dentro de un método, ¿qué es this? :: La clase :: El objeto con el que se llamó al método :: La página
elige :: ¿Cuándo se ejecuta el constructor? :: Cada vez que se llama a un método :: Al crear cada objeto con new :: Una sola vez en todo el programa
escribe :: Explica con un ejemplo de la vida real qué es una clase y qué es una instancia. :: La clase es el molde de una panadería y cada pan que sale es una instancia: todos tienen la misma forma, pero cada uno es un pan distinto con lo suyo.
```

## Parte 3. Herencia, campos privados y getters

### Herencia: un molde que parte de otro

```js
class CarroDeApp extends Carro {          // CarroDeApp "es un" Carro, con algo más
  constructor(marca, km, apps) {
    super(marca, km);                     // primero arma la parte de Carro
    this.apps = apps;
  }
  trabajaCon(app) {
    return this.apps.includes(app);
  }
}
```

`extends` toma todo lo del molde padre; `super(...)` llama a su constructor. Un `CarroDeApp` tiene `registrarViaje` sin escribirlo otra vez.

### Campos privados y getters

```js
class Billetera {
  #saldo = 0;                    // con # es PRIVADO: no se puede tocar desde afuera
  depositar(monto) {
    if (!(monto > 0)) throw new Error('El monto tiene que ser mayor que 0');
    this.#saldo += monto;
  }
  get saldo() {                  // un getter: se LEE como un dato (billetera.saldo), pero es una función
    return this.#saldo;
  }
}
```

Con `#saldo`, nadie puede escribir `billetera.#saldo = 1000000` desde afuera: la única forma de cambiarlo es `depositar`, que **valida**. Esto se llama **encapsular**: el objeto protege sus propios datos.

> 🌎 **En la vida real:** la herencia es como un modelo de carro con versiones: el "Etios XLS" tiene todo lo del "Etios" más el techo solar. No se diseña el carro de nuevo.

> 🌎 **Otro ejemplo:** el campo privado es como la caja de un banco: no metes la mano; le pides al cajero (`depositar`), que revisa antes de guardar.

> 💡 **Idea:** no abuses de la herencia. Más de dos o tres niveles (`A extends B extends C extends D`) se vuelve difícil de seguir. Muchas veces es mejor **componer**: un objeto que **tiene** otro adentro, en vez de **ser** otro.

> 🧩 **Piezas para este ejercicio**
> - `#saldo` es un campo que solo puede usar el código de la clase que lo declara. Un getter escrito como `get saldo()` se lee con `billetera.saldo`.
> - Si la subclase tiene constructor, `super(...)` inicializa la parte heredada antes de usar `this`. La subclase puede leer el saldo mediante el getter.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una billetera que se protege sola
lenguaje: js
pide: Completa `Billetera`: el saldo es **privado** (`#saldo`), `depositar(monto)` y `retirar(monto)` lanzan un error si el monto no es mayor que 0, y `retirar` también si no alcanza el saldo (`Saldo insuficiente`). El getter `saldo` lo deja leer. Después, `BilleteraConMeta` **hereda** de `Billetera` y agrega `faltaParaMeta()`.
--- código
class Billetera {
  // tu código aquí
}

class BilleteraConMeta extends Billetera {
  constructor(meta) {
    // tu código aquí
  }

  faltaParaMeta() {
    // tu código aquí
  }
}
--- pruebas
prueba('deposita y lee el saldo', () => { const b = new Billetera(); b.depositar(100); igual(b.saldo, 100); });
prueba('retirar resta', () => { const b = new Billetera(); b.depositar(100); b.retirar(30); igual(b.saldo, 70); });
prueba('no se puede retirar más de lo que hay', () => { const b = new Billetera(); b.depositar(10); let msg = ''; try { b.retirar(50); } catch (e) { msg = e.message; } igual(msg, 'Saldo insuficiente'); });
prueba('un monto de 0 da error', () => { let fallo = false; try { new Billetera().depositar(0); } catch (e) { fallo = true; } ok(fallo, 'tenía que lanzar un error'); });
prueba('el saldo no se puede cambiar desde afuera', () => { const b = new Billetera(); b.depositar(5); b.saldo = 999999; igual(b.saldo, 5); });
prueba('la billetera con meta hereda depositar', () => { const b = new BilleteraConMeta(1000); b.depositar(400); igual(b.faltaParaMeta(), 600); });
prueba('si pasó la meta, falta 0', () => { const b = new BilleteraConMeta(100); b.depositar(150); igual(b.faltaParaMeta(), 0); });
--- solución
class Billetera {
  #saldo = 0;

  depositar(monto) {
    if (!(monto > 0)) throw new Error('El monto tiene que ser mayor que 0');
    this.#saldo += monto;
  }

  retirar(monto) {
    if (!(monto > 0)) throw new Error('El monto tiene que ser mayor que 0');
    if (monto > this.#saldo) throw new Error('Saldo insuficiente');
    this.#saldo -= monto;
  }

  get saldo() {
    return this.#saldo;
  }
}

class BilleteraConMeta extends Billetera {
  constructor(meta) {
    super();
    this.meta = meta;
  }

  faltaParaMeta() {
    return Math.max(this.meta - this.saldo, 0);
  }
}
```

```practica
vf :: Con extends, la clase hija tiene los métodos de la clase padre sin escribirlos otra vez
vf :: Un campo con # se puede cambiar desde afuera escribiendo objeto.#campo
elige :: ¿Qué es encapsular? :: Guardar el código en una carpeta :: Que el objeto proteja sus datos y solo se cambien por sus métodos, que validan :: Copiar una clase
elige :: ¿Qué conviene cuando la herencia se vuelve de muchos niveles? :: Agregar más niveles :: Componer: un objeto que tiene otro adentro :: Borrar las clases
escribe :: Explica con un ejemplo de la vida real qué es la herencia. :: Es como las versiones de un modelo de carro: la versión completa tiene todo lo del modelo base más algunos extras, sin diseñar el carro de nuevo. La clase hija tiene todo lo de la padre y agrega lo suyo.
```

## Parte 4. Programación orientada a objetos: qué es y cuándo usarla

**Programación orientada a objetos** (en inglés *Object-Oriented Programming*, **POO** u **OOP**) es una forma de **organizar** el código: en vez de tener datos por un lado y funciones por otro, se juntan en **objetos** que tienen sus datos **y** saben hacer cosas con ellos. Es lo que hiciste con `Carro` y `Billetera`.

Tiene cuatro ideas, y ya las viste todas:

| Idea | Qué quiere decir | Dónde la viste |
|---|---|---|
| **Encapsular** | El objeto protege sus datos; se cambian por sus métodos | `#saldo` y `depositar` |
| **Abstraer** | Usas el objeto sin saber cómo funciona por dentro | `carro.necesitaAceite()` |
| **Heredar** | Un molde parte de otro | `CarroDeApp extends Carro` |
| **Polimorfismo** | Objetos distintos responden al mismo mensaje, cada uno a su manera | Un `Carro` y una `Moto` con su propio `necesitaAceite()` |

> 🌎 **En la vida real:** una empresa organizada por **personas con su función** (el cajero cobra, el mecánico arregla) es orientada a objetos: le pides al que sabe, y cada uno cuida lo suyo. Una empresa organizada por **listas de tareas** sueltas es el otro estilo.

> 🌎 **Otro ejemplo:** el polimorfismo es como decir "arranca" a un carro y a una moto: los dos entienden la orden, pero cada uno arranca a su manera.

### ¿Y un motor de diseño? ¿Es lo mismo?

No, aunque se parecen en algo. Un **motor de diseño** (como `--hueco` y `--relleno` de este mapa, o `dash.*` de Copiloto) es **una sola fuente de valores** que todos usan: los colores, las formas, las separaciones. La **POO** es una forma de organizar **comportamiento**: objetos que hacen cosas.

Se parecen en la idea de fondo: **cada cosa en un solo lugar, y los demás la piden en vez de copiarla**. El motor guarda los valores en un lugar; el objeto guarda sus datos y sus reglas en un lugar.

> 🌎 **En la vida real:** el motor de diseño es el manual de colores de una marca; la POO es la forma en que se organiza el personal de la empresa. Los dos evitan el desorden, pero son cosas distintas.

### ¿Cuándo usar clases y cuándo funciones?

- **Clases**: cuando un dato tiene reglas que cuidar y acciones propias (una billetera, un carro, una conexión a la base de datos). Son muy usadas en **Kotlin**, **Swift**, **Java** y **Python**.
- **Funciones y objetos simples**: para transformar datos (calcular un total, filtrar una lista). Es lo más usado hoy en **JavaScript con React**: los componentes de Copiloto son funciones, no clases.

Ninguna es "la correcta": un buen programador elige la que hace el código más claro.

> 🧩 **Piezas para este ejercicio**
> - Dos tipos de vehículo pueden tener un método con el mismo nombre y aplicar reglas diferentes. Cuando llamas `vehiculo.necesitaAceite()`, se ejecuta el método del objeto que tienes en esa vuelta.
> - `filter` puede quedarse con los vehículos cuya respuesta fue `true`. `map` puede convertir esos vehículos en sus nombres.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Polimorfismo: cada vehículo a su manera
lenguaje: js
pide: `Carro` y `Moto` heredan de `Vehiculo`. Los dos tienen `necesitaAceite()`, pero cada uno a su manera: el carro cada **5000** km y la moto cada **3000**. `revisarFlota(vehiculos)` le pregunta lo mismo a todos (sin preguntar si es carro o moto) y devuelve los **nombres** de los que necesitan aceite.
--- código
class Vehiculo {
  constructor(nombre, kmDesdeCambio) {
    this.nombre = nombre;
    this.kmDesdeCambio = kmDesdeCambio;
  }
  necesitaAceite() {
    return false;
  }
}

class Carro extends Vehiculo {
  // tu código aquí
}

class Moto extends Vehiculo {
  // tu código aquí
}

function revisarFlota(vehiculos) {
  // tu código aquí
}
--- pruebas
prueba('un carro con 6000 km necesita', () => igual(new Carro('Etios', 6000).necesitaAceite(), true));
prueba('un carro con 4000 km no', () => igual(new Carro('Etios', 4000).necesitaAceite(), false));
prueba('una moto con 4000 km sí', () => igual(new Moto('CG 160', 4000).necesitaAceite(), true));
prueba('revisar la flota', () => igual(revisarFlota([new Carro('Etios', 4000), new Moto('CG 160', 3500), new Carro('Onix', 5200)]), ['CG 160', 'Onix']));
--- solución
class Vehiculo {
  constructor(nombre, kmDesdeCambio) {
    this.nombre = nombre;
    this.kmDesdeCambio = kmDesdeCambio;
  }
  necesitaAceite() {
    return false;
  }
}

class Carro extends Vehiculo {
  necesitaAceite() {
    return this.kmDesdeCambio >= 5000;
  }
}

class Moto extends Vehiculo {
  necesitaAceite() {
    return this.kmDesdeCambio >= 3000;
  }
}

function revisarFlota(vehiculos) {
  return vehiculos.filter((v) => v.necesitaAceite()).map((v) => v.nombre);
}
```

```practica
vf :: La programación orientada a objetos junta los datos y lo que se hace con ellos en objetos
vf :: Un motor de diseño y la programación orientada a objetos son exactamente lo mismo
elige :: ¿Qué es el polimorfismo? :: Que una clase tenga muchos campos :: Que objetos distintos respondan al mismo mensaje cada uno a su manera :: Que el código tenga muchos archivos
elige :: En JavaScript con React, ¿qué se usa más para los componentes? :: Clases :: Funciones :: Herencia de muchos niveles
escribe :: Explícale a un amigo qué es la programación orientada a objetos y en qué se diferencia de un motor de diseño. :: Es organizar el código en objetos que tienen sus datos y saben hacer cosas con ellos, como un carro que sabe si necesita aceite; se basa en encapsular, abstraer, heredar y el polimorfismo. Un motor de diseño es otra cosa: un solo lugar con los valores (colores, separaciones) que todas las pantallas usan. Se parecen en que evitan copiar: cada cosa vive en un solo lugar.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo manejas los errores?":** "Lanzo errores con mensajes claros cuando un dato no tiene sentido, los atrapo con try/catch solo donde sé qué hacer con ellos, uso finally para limpiar, y nunca dejo un catch vacío que esconda el problema."

> 🎤 **Si te preguntan "¿qué es la programación orientada a objetos?":** "Es organizar el código en objetos que juntan datos y comportamiento. Sus ideas son encapsular, con campos privados que solo se cambian por métodos que validan; abstraer; heredar con extends; y el polimorfismo, que objetos distintos respondan al mismo mensaje a su manera. En JavaScript con React uso más funciones, y clases cuando un dato tiene reglas que cuidar. En Kotlin y Swift las clases son el centro."

> 🌎 **En la vida real:** es como explicar cómo organizas un taller: quién hace qué, qué hace cada uno cuando algo sale mal, y por qué está organizado así.

> 🌎 **Otro ejemplo:** Es como contar cómo se arma una línea de producción con moldes: cada pieza sale igual, y cada una cuida lo suyo.
