Genera una sola imagen vertical, muy nítida y de alta resolución (formato 2:3): una lámina técnica ilustrada de la arquitectura de la app "Copiloto Driver", vista como un gabinete de cableado profesional abierto. Es una imagen nueva, desde cero.

ESTILO
Ilustración técnica limpia, con líneas negras finas y colores planos. Fondo gris grafito oscuro. Módulos como placas metálicas claras atornilladas, con etiquetas de texto negro y letra de imprenta. Títulos de zona en bandas azul oscuro con texto blanco. Cables gruesos, paralelos, agrupados con abrazaderas metálicas, con curvas suaves. Sin personajes, sin personas, sin logos, sin ningún dibujo de carro.

REGLAS DEL TEXTO (OBLIGATORIAS)
1. Copia cada palabra y cada número exactamente, letra por letra. No traduzcas, no corrijas, no inventes, no agregues puntos ni comas al final.
2. Lo que está entre corchetes [así] es una instrucción para ti: nunca lo escribas en la imagen.
3. Todo el texto debe ser nítido. Si no cabe, reduce la letra o agranda la placa; nunca lo cambies ni lo abrevies.

REGLAS DE LOS CABLES (OBLIGATORIAS)
1. Cada cable sale de un puerto de su origen y entra físicamente en un puerto de su destino.
2. Ningún cable termina en otro sitio ni queda suelto.
3. NO hagas una columna de etiquetas a un lado. Cada número va en una etiqueta pequeña encima de su propio cable, a mitad de camino.
4. NO juntes todos los cables en una sola columna. Sigue las rutas indicadas: arriba, abajo, margen izquierdo y margen derecho.
5. Deja libres los dos márgenes laterales para que pasen los cables.

TÍTULO ARRIBA
COPILOTO DRIVER — MAPA DE LA APP
Subtítulo: 837 archivos · 5.038 conexiones

SIETE ZONAS, DE ARRIBA ABAJO

ZONA 1 [arriba a la izquierda]
Título: 1. PANEL WEB
Placas: Tema, Términos, Usuarios, Vehículos, Suscripciones, Costos de IA, Configuración remota, Estadísticas de landing

ZONA 2 [arriba a la derecha; cada motor en su propia placa]
Título: 2. LOS 11 MOTORES DE DISEÑO
1. Colores (15)
2. Radios (9)
3. Vidrio (opacidad, escarcha, tinte)
4. Bordes (5 grosores, color, intensidad)
5. Títulos (tamaño, fuente, sombra)
6. Separación entre bloques
7. Fondo (foto y degradado)
8. Gráficos
9. Pantalla de éxito
10. Movimiento (velocidad, subida, cascada, Android, toque)
11. Tema claro (9 colores)
Debajo, un candado con la etiqueta: Candado de diseño: prohibido valores a mano

ZONA 3 [franja horizontal debajo de las zonas 1 y 2]
Título: 3. PIEZAS ÚNICAS
Touchable, Button, Card, GlassFill, OsSectionLabel, OsScrollView, LoadFailedCard, dateFormat, dashSpring (13 resortes)

ZONA 4 [bloque central, el más grande]
Título: 4. LA APP
Cuatro placas separadas, cada una con sus puertos:
Pantallas (62): Início, San, Copiloto, Ganhos, Gastos, Lucro, Metas, Stats, Vehículos, Menú, Registro
Navegación: Tabs, Stack, San Stack
Componentes (357): dashboard 69, os 72, vehicles 37, profile 23, auth 19, vehicle 17, copilot 15, finance 14
Idiomas (6): pt-BR, en, es, fr, de, it
A la derecha de estas placas, un teléfono de pantalla lisa de un solo color, que dice solamente: Copiloto Driver

ZONA 5 [regleta de 3 filas con 7 placas grandes cada una, unidas por flechas]
Título: 5. DATOS DE LA APP (21 proveedores en cadena)
Fila 1: SafeArea, UserAccount, UserSettings, I18n, AppConfig, AppCurrency, AppTheme
Fila 2: Expenses, PersonalExpenses, RecurringExpenses, SanCaixinha, Earnings, VehicleTracking, GrupoSan
Fila 3: LiveWeather, AIEngine, Subscription, Support, DataDeletion, CopilotChat, FinanceModulePeriod
Al lado, una placa:
Puentes: AIEngineBridge, RecurringExpensesBridge, DataCleanupBridge, NotificationResponseBridge
Control: AppConfigGate

ZONA 6 [CUATRO bloques lado a lado]
Título: 6. CEREBROS Y LÓGICA
Bloque 1 — Copiloto Brain: AIEventBus, AIMemory, ModuleRegistry, Analytics, Herramientas. 15 módulos: user, earnings, expenses, personalExpenses, recurringExpenses, vehicles, san, weather, work, reminders, conversations, subscription, support, rideProfit, dataLifecycle
Bloque 2 — Utilidades y cálculos (103): Día fiscal, Ganancias, Gastos, Metas, Vehículo, San
Bloque 3 — Módulo San: controller, service, repository, events, notifications
Bloque 4 — Cartón automático (solo Android, Kotlin): RideReaderService, OfferParser, RideAppCatalog, RideOverlayWindow, ScreenOcr

ZONA 7 [como un rack de servidores con luces verdes]
Título: 7. SERVICIOS Y NUBE
Servicios (83): OCR, Notificaciones, Ubicación, Clima, Sesión, Copia de seguridad
Almacenamiento: Copia local en el teléfono + 22 archivos de nube
Firebase: Auth, Firestore, Storage, Cloud Functions, Hosting
Cloud Functions: aiCopilot (Gemini), classifyReceiptVision, OTP, Suscripciones, Soporte, Borrado de cuenta, Admin, Costos de IA, Backup
Reglas de Firestore [con un candado dorado]
Servicios externos: Google Gemini, RevenueCat, Sentry, Twilio

CABLES CON NÚMERO [el grosor depende del número; sigue la ruta indicada]
Azul grueso, 582: de Componentes hacia arriba hasta la ZONA 2
Azul fino, 117: de Pantallas hacia arriba hasta la ZONA 2
Azul grueso, 509: de Pantallas a Componentes, dentro de la ZONA 4
Amarillo, 208: de Componentes a Idiomas, dentro de la ZONA 4
Morado, 143: de Pantallas hacia abajo hasta la ZONA 5
Morado, 118: de Componentes hacia abajo hasta la ZONA 5
Verde, 225: de Componentes por el margen izquierdo hasta el bloque Utilidades y cálculos
Verde, 135: de Pantallas por el margen izquierdo hasta el bloque Utilidades y cálculos
Naranja, 78: de la ZONA 5 por el margen derecho hasta Servicios
Naranja, 70: de Componentes por el margen derecho hasta Servicios
Verde fino, 21: del bloque Copiloto Brain al bloque Utilidades y cálculos, corto y directo, con una etiqueta verde que diga 21

CABLES SIN NÚMERO
Azul corto y directo: de la ZONA 1 a la ZONA 2 [no a Piezas únicas]
Azul: de la ZONA 2 hacia abajo hasta la ZONA 3
Morado: de la ZONA 5 hacia abajo hasta el bloque Copiloto Brain, con una etiqueta morada nítida que diga eventos
Naranja: de Servicios a Firebase
Verde: de Cloud Functions a Servicios externos

FRANJA DE NOTAS [debajo de la ZONA 7; dos filas ordenadas de notas adhesivas, letra manuscrita clara]
Título: ESTADO DE LA REVISIÓN
Fila verde [arreglado]:
0 botones sueltos
0 ciclos
0 archivos TypeScript de más de 1.000 líneas
Pruebas: app 104 · backend 133 · reglas 21 · cartón 61
Fila amarilla [pendiente]:
21 proveedores anidados
2 archivos Kotlin de más de 1.000 líneas
22 vulnerabilidades moderadas en producción

BANDA VERDE AL PIE DEL GABINETE
CI activa: 5 revisiones en cada subida

ANTES DE ENTREGAR, COMPRUEBA
Que estén los 11 cables con número, cada uno con su etiqueta encima y llegando a su destino.
Que no haya una columna de etiquetas a un lado.
Que la ZONA 5 tenga 21 placas y la ZONA 6 cuatro bloques.
Que la ZONA 1 llegue directamente a la ZONA 2.
Que los títulos no tengan instrucciones ni palabras extra.
Que se lean bien estas palabras: intensidad, recurringExpenses, RecurringExpensesBridge, CopilotChat, dataLifecycle, AIEngine, Subscription, DataDeletion, eventos.
Que el teléfono no tenga logo ni dibujo de carro.
Que no aparezca ninguna instrucción escrita dentro de la imagen.
