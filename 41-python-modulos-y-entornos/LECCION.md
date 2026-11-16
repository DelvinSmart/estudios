# Python 6: módulos, paquetes y entornos virtuales

> 🌎 **En la vida real:** no fabricas tus propios tornillos: los compras hechos. En programación, buena parte del trabajo ya lo hizo alguien y lo dejó en una "caja" que puedes traer a tu proyecto.

> 🎙️ **El profesor dice:** hoy aprendes a **ordenar** tu código en varios archivos (módulos), a usar lo que ya trae Python (la biblioteca estándar), a instalar paquetes de otros con `pip`, y algo que evita muchos dolores de cabeza: el **entorno virtual**, una caja aislada para cada proyecto. Es el equivalente a `npm` y `node_modules` en JavaScript.

## Parte 1. Módulos: tu código en varios archivos

> 🌎 **En la vida real:** un libro no es una sola página gigante: tiene capítulos, y desde un capítulo puedes decir "ver capítulo 3".

> 🌎 **Otro ejemplo:** Es como una cocina ordenada: las especias en un cajón, los cubiertos en otro.

### import

Cada archivo `.py` es un **módulo**. Desde otro archivo lo traes con `import`:

```python
# calculos.py
def ganancia_neta(bruto, gastos):
    return bruto - gastos
```

```python
# principal.py
from calculos import ganancia_neta
print(ganancia_neta(300, 80))
```

```js
// En JavaScript:
import { gananciaNeta } from './calculos.js';
```

También `import calculos` y después `calculos.ganancia_neta(...)`, o con otro nombre: `import calculos as c`.

> 🌎 **En la vida real:** es como pedirle una herramienta prestada al vecino: "pásame el martillo".

> 🌎 **Otro ejemplo:** Es como citar otro capítulo del libro en vez de copiarlo entero.

### if __name__ == "__main__"

Cuando corres un archivo directamente, Python le pone el nombre especial `"__main__"`. Esto sirve para que un módulo tenga código de prueba que **no** corra cuando otro lo importa:

```python
def ganancia_neta(bruto, gastos):
    return bruto - gastos

if __name__ == "__main__":
    print(ganancia_neta(300, 80))   # solo al correr: python3 calculos.py
```

> 🌎 **En la vida real:** es como la puerta principal de una casa: entras por ahí cuando vienes de visita, no cuando solo te prestan algo por la ventana.

> 🌎 **Otro ejemplo:** Es como un actor que ensaya en su casa: el ensayo no sale en la función.

```practica
vf :: Cada archivo .py es un módulo que se puede importar
vf :: El código dentro de if __name__ == "__main__" corre también cuando otro archivo importa el módulo
elige :: ¿Cómo traes solo la función ganancia_neta del archivo calculos.py? :: import ganancia_neta :: from calculos import ganancia_neta :: require(calculos)
elige :: ¿Qué hace import calculos as c? :: Copia el archivo :: Importa el módulo con el nombre corto c :: Borra calculos
escribe :: ¿Para qué sirve if __name__ == "__main__"? :: Para poner código que solo corre al ejecutar ese archivo directamente (por ejemplo, pruebas o un menú), y no cuando otro archivo lo importa.
```

## Parte 2. La biblioteca estándar: pilas incluidas

> 🌎 **En la vida real:** Python viene "con pilas incluidas": como un celular que ya trae calculadora, reloj y cámara sin instalar nada.

> 🌎 **Otro ejemplo:** Es como una casa amueblada: no tienes que comprar la cama para dormir la primera noche.

### Los módulos que más vas a usar

| Módulo | Para qué |
|---|---|
| `math` | Raíz, redondeos, pi |
| `random` | Números al azar, elegir de una lista |
| `datetime` | Fechas y horas |
| `pathlib` | Rutas de archivos y carpetas |
| `json`, `csv` | Leer y escribir datos (Python 5) |
| `os` | Variables de entorno, el sistema |
| `statistics` | Promedio, mediana |

```python
from datetime import date, timedelta
from statistics import mean

hoy = date.today()
proximo_aceite = hoy + timedelta(days=90)
print(f"Próximo cambio de aceite: {proximo_aceite:%d/%m/%Y}")
print(mean([120, 95, 180]))
```

> 🌎 **En la vida real:** es como la caja de herramientas que viene con el carro: gato, llave de ruedas, triángulo.

> 🌎 **Otro ejemplo:** Es como la despensa básica: sal, aceite y arroz siempre están.

### pathlib: rutas sin dolor

```python
from pathlib import Path

carpeta = Path("datos")
carpeta.mkdir(exist_ok=True)             # crea la carpeta si no existe
archivo = carpeta / "gastos.json"        # une rutas con /
print(archivo.exists())
```

> 🌎 **En la vida real:** es como un GPS para carpetas: le dices adónde y él arma el camino.

> 🌎 **Otro ejemplo:** Es como las direcciones con calle y número en vez de "la casa azul después del árbol".

```practica
vf :: La biblioteca estándar viene con Python, no hay que instalarla
vf :: Para trabajar con fechas hay que instalar un paquete externo sí o sí
elige :: ¿Qué módulo usas para sumar 90 días a una fecha? :: math :: datetime (con timedelta) :: random
elige :: ¿Qué hace carpeta / "gastos.json" con pathlib? :: Divide :: Une la carpeta y el nombre en una ruta :: Borra el archivo
escribe :: ¿Qué módulo usarías para calcular el promedio de tus ganancias y cómo? :: statistics: from statistics import mean y después mean(ganancias).
```

## Parte 3. Paquetes de otros con pip

> 🌎 **En la vida real:** cuando la caja de herramientas no alcanza, vas a la ferretería. pip es la ferretería de Python.

> 🌎 **Otro ejemplo:** Es como la tienda de apps del celular: buscas, instalas y usas.

### pip y PyPI

**PyPI** es el depósito público de paquetes de Python (como npm para JavaScript). Se instalan con `pip`:

```bash
python3 -m pip install requests      # un paquete para hablar con APIs
```

Antes de instalar algo: confirma el **nombre exacto**, que sea el paquete oficial y que tenga mucho uso. Los paquetes con nombres parecidos pueden ser trampas (Tema 23, IA 5).

> 🌎 **En la vida real:** compras repuestos en la tienda oficial, no en un puesto con la marca mal escrita.

> 🌎 **Otro ejemplo:** Es como bajar una app solo de la tienda oficial y no de un enlace raro.

### requirements.txt

Para que otro (o tú en otra computadora) instale lo mismo, se anota en `requirements.txt`:

```text
requests==2.32.3
pytest==8.3.3
```

```bash
python3 -m pip install -r requirements.txt
```

Es el equivalente a `package.json` + `npm install`.

> 🌎 **En la vida real:** es como la lista de materiales de una obra: cualquier albañil compra lo mismo.

> 🌎 **Otro ejemplo:** Es como la lista de útiles escolares: todos llevan los mismos cuadernos.

```practica
vf :: PyPI es para Python lo que npm es para JavaScript
vf :: Cualquier paquete con un nombre parecido al oficial es seguro
elige :: ¿Qué archivo anota los paquetes de un proyecto de Python? :: package.json :: requirements.txt :: index.html
elige :: ¿Qué comando instala todo lo de requirements.txt? :: pip run :: python3 -m pip install -r requirements.txt :: npm install
escribe :: ¿Qué revisas antes de instalar un paquete nuevo con pip? :: Que el nombre sea exacto, que sea el oficial, que tenga muchas descargas y mantenimiento, y que no sea una copia con un nombre parecido.
```

## Parte 4. Entornos virtuales: una caja por proyecto

> 🌎 **En la vida real:** si cocinas para alguien alérgico, usas ollas separadas para que no se mezcle nada. Un entorno virtual son las ollas separadas de cada proyecto.

> 🌎 **Otro ejemplo:** Es como cada inquilino de un edificio con su propio medidor de luz: lo que gasta uno no afecta al otro.

### Por qué

Si instalas todo "en la Mac", dos proyectos que necesitan versiones distintas de un paquete se pelean. Un **entorno virtual** (`venv`) es una carpeta con su propio Python y sus propios paquetes, solo para ese proyecto. Es como `node_modules`, pero hay que activarlo.

> 🌎 **En la vida real:** es como tener una caja de herramientas por carro: la del Corolla no se mezcla con la de la moto.

> 🌎 **Otro ejemplo:** Es como los casilleros de un gimnasio: cada uno guarda lo suyo.

### Crear, activar y salir

```bash
cd mi-proyecto
python3 -m venv .venv            # crear (una sola vez)
source .venv/bin/activate        # activar (en la Mac y Linux)
python -m pip install requests   # se instala SOLO en este proyecto
deactivate                       # salir
```

Cuando está activo, la terminal muestra `(.venv)` al principio. La carpeta `.venv` **no se sube a Git**: va en `.gitignore`, igual que `node_modules`.

> 🌎 **En la vida real:** activar es como ponerte el uniforme del trabajo: mientras lo tienes puesto, todo lo que haces es "de ese trabajo".

> 🌎 **Otro ejemplo:** Es como entrar a una habitación: lo que dejas adentro se queda ahí cuando sales.

```practica
vf :: Un entorno virtual tiene sus propios paquetes, separados de otros proyectos
vf :: La carpeta .venv se sube a GitHub para que otros la usen
elige :: ¿Qué comando crea un entorno virtual llamado .venv? :: pip venv :: python3 -m venv .venv :: git venv
elige :: ¿Cómo sabes que el entorno virtual está activo? :: La pantalla cambia de color :: La terminal muestra (.venv) al principio :: No se puede saber
escribe :: Escribe los pasos para empezar un proyecto de Python nuevo con su entorno virtual e instalar requests. :: cd al proyecto; python3 -m venv .venv; source .venv/bin/activate; python -m pip install requests; anotarlo en requirements.txt y poner .venv en .gitignore.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo organizas un proyecto de Python?":** "Separo el código en módulos e importo lo que necesito. Uso primero la biblioteca estándar (datetime, pathlib, json, csv). Para paquetes externos, un entorno virtual por proyecto con venv, los paquetes anotados en requirements.txt con su versión, y la carpeta .venv fuera de Git. Antes de instalar algo reviso que sea el paquete oficial."

> 🌎 **En la vida real:** es como explicar cómo organizas un taller: herramientas propias, las que pides prestadas anotadas, y cada trabajo en su mesa.

> 🌎 **Otro ejemplo:** Es como un chef explicando su despensa y su lista de proveedores.
