import html,sys
W,H=1400,2790
BLUE,YEL,PUR,GRN,ORG='#3f9bff','#ffd23f','#b06bff','#35c76f','#ff9a2e'
o=[]
def esc(s): return html.escape(s,quote=False)
def rect(x,y,w,h,fill,r=10,stroke=None,sw=2):
    o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{sw}"' if stroke else '')+'/>')
def text(x,y,s,size=22,fill='var(--ink)',w=500,anchor='start',font='var(--f)'):
    o.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{w}" text-anchor="{anchor}" font-family="{font}">{esc(s)}</text>')
def screws(x,y,w,h):
    for a,b in ((x+12,y+12),(x+w-12,y+12),(x+12,y+h-12),(x+w-12,y+h-12)):
        o.append(f'<circle cx="{a}" cy="{b}" r="4.5" fill="#8b98a6" stroke="#4a5563" stroke-width="1.5"/>')
def zone(x,y,w,h,title,tw):
    rect(x,y,w,h,'#26313e',14,'#46566a',3); screws(x,y,w,h)
    rect(x+20,y+18,tw,48,'#123a70',8); text(x+36,y+52,title,29,'#fff',700)
def plate(x,y,w,h,title,lines=(),size=22,tsize=25):
    rect(x,y,w,h,'#dfe5ea',8,'#8e9aa7'); screws(x,y,w,h)
    yy=y+36
    if title: text(x+22,yy,title,tsize,'#101820',700); yy+=31
    for l in lines: text(x+22,yy,l,size,'#26303a',500); yy+=size+7
def cp(pts,color,width,n=None,lab=None):
    d='M'+' L'.join(f'{a} {b}' for a,b in pts)
    cables.append((d,color,width,pts,lab,n))
cables=[]
# título
rect(130,36,1140,100,'#123a70',10,'#3f6aa5'); screws(130,36,1140,100)
text(700,84,'COPILOTO DRIVER — MAPA DE LA APP',44,'#fff',700,'middle')
text(700,122,'837 archivos · 5.038 conexiones',28,'#dbe7f7',500,'middle')
# zonas
zone(130,160,370,310,'1. PANEL WEB',250)
for i,t in enumerate(['Tema','Términos','Usuarios','Vehículos','Suscripciones','Costos de IA','Configuración remota','Estadísticas de landing']):
    x=150+(0 if i<4 else 0); 
    yy=256+i*26
    text(170,yy+6,t,22,'#eef2f6',500)
zone(560,160,710,310,'2. LOS 11 MOTORES DE DISEÑO',430)
mot=['1. Colores (15)','2. Radios (9)','3. Vidrio (opacidad, escarcha, tinte)','4. Bordes (5 grosores, color, intensidad)','5. Títulos (tamaño, fuente, sombra)','6. Separación entre bloques','7. Fondo (foto y degradado)','8. Gráficos','9. Pantalla de éxito','10. Movimiento (velocidad, subida, cascada, Android, toque)','11. Tema claro (9 colores)']
for i,t in enumerate(mot[:6]): text(582,258+i*26,t,21,'#eef2f6',500)
for i,t in enumerate(mot[6:]):
    y=258+i*26+(0 if i<4 else 26)
    if i==3:
        text(925,y,'10. Movimiento (velocidad, subida,',21,'#eef2f6',500); text(956,y+26,'cascada, Android, toque)',21,'#eef2f6',500)
    else: text(925,y,t,21,'#eef2f6',500)
rect(700,420,430,36,'#ffd23f',8); text(915,446,'Candado de diseño: prohibido valores a mano',22,'#201a00',700,'middle')
zone(130,540,960,130,'3. PIEZAS ÚNICAS',270)
text(152,640,'Touchable · Button · Card · GlassFill · OsSectionLabel · OsScrollView · LoadFailedCard · dateFormat · dashSpring (13 resortes)',20.5,'#eef2f6',500)
zone(130,760,1140,370,'4. LA APP',170)
plate(152,850,165,250,'Navegación',['Tabs','Stack','San Stack'])
plate(335,850,265,250,'Pantallas (62)',['Início, San, Copiloto,','Ganhos, Gastos, Lucro,','Metas, Stats, Vehículos,','Menú, Registro'],21)
plate(690,850,330,250,'Componentes (357)',['dashboard 69, os 72,','vehicles 37, profile 23,','auth 19, vehicle 17,','copilot 15, finance 14'],22)
plate(1100,850,150,250,'Idiomas (6)',['pt-BR, en, es,','fr, de, it'],21,23)
zone(130,1240,1140,360,'5. DATOS DE LA APP (21 proveedores en cadena)',560)
rows=[['SafeArea','UserAccount','UserSettings','I18n','AppConfig','AppCurrency','AppTheme'],['Expenses','PersonalExpenses','RecurringExpenses','SanCaixinha','Earnings','VehicleTracking','GrupoSan'],['LiveWeather','AIEngine','Subscription','Support','DataDeletion','CopilotChat','FinanceModulePeriod']]
for r,row in enumerate(rows):
    y=1324+r*60
    o.append(f'<path d="M160 {y+24} H1240" stroke="#8e9aa7" stroke-width="3"/>')
    for c,t in enumerate(row):
        x=150+c*157.5
        rect(x,y,146,48,'#dfe5ea',6,'#8e9aa7'); text(x+73,y+31,t,18.5,'#101820',600,'middle')
rect(150,1510,1100,74,'#dfe5ea',8,'#8e9aa7')
text(170,1540,'Puentes: AIEngineBridge · RecurringExpensesBridge · DataCleanupBridge · NotificationResponseBridge',21,'#101820',600)
text(170,1570,'Control: AppConfigGate',21,'#101820',600)
zone(130,1720,1140,315,'6. CEREBROS Y LÓGICA',300)
plate(150,1800,370,215,'Copiloto Brain',['AIEventBus, AIMemory, ModuleRegistry, Analytics,','Herramientas. 15 módulos: user, earnings, expenses,','personalExpenses, recurringExpenses, vehicles, san,','weather, work, reminders, conversations,','subscription, support, rideProfit, dataLifecycle'],17)
plate(590,1800,265,215,'Utilidades y cálculos (103)',['Día fiscal, Ganancias,','Gastos, Metas,','Vehículo, San'],21,22)
plate(872,1800,170,215,'Módulo San',['controller, service,','repository, events,','notifications'],18,23)
plate(1058,1800,195,215,'Cartón automático',['(solo Android, Kotlin)','RideReaderService,','OfferParser, RideAppCatalog,','RideOverlayWindow,','ScreenOcr'],16,20)
zone(130,2100,1140,340,'7. SERVICIOS Y NUBE',300)
plate(150,2180,320,115,'Almacenamiento',['Copia local en el teléfono +','22 archivos de nube'],20,23)
plate(540,2180,340,115,'Firebase',['Auth, Firestore, Storage,','Cloud Functions, Hosting'],20,23)
plate(950,2180,300,115,'Servicios (83)',['OCR, Notificaciones, Ubicación,','Clima, Sesión, Copia de seguridad'],18.5,23)
plate(150,2310,490,115,'Cloud Functions',['aiCopilot (Gemini), classifyReceiptVision, OTP, Suscripciones,','Soporte, Borrado de cuenta, Admin, Costos de IA, Backup'],17,23)
plate(710,2310,270,115,'Servicios externos',['Google Gemini, RevenueCat,','Sentry, Twilio'],20,23)
plate(1000,2310,250,115,'Reglas de Firestore',['Con candado'],20,23)
# cables
cp([(500,300),(560,300)],BLUE,6)
cp([(800,470),(800,540)],BLUE,6)
cp([(960,850),(960,700),(1230,700),(1230,470)],BLUE,13,'582',(1230,590))
cp([(520,850),(520,725),(1150,725),(1150,470)],BLUE,5,'117',(1150,590))
cp([(600,975),(690,975)],BLUE,11,'509',(645,936))
cp([(1020,975),(1100,975)],YEL,5,'208',(1060,936))
cp([(450,1100),(450,1240)],PUR,5,'143',(450,1172))
cp([(880,1100),(880,1240)],PUR,5,'118',(880,1172))
cp([(380,1100),(380,1160),(72,1160),(72,1660),(650,1660),(650,1800)],GRN,5,'135',(72,1300))
cp([(800,1100),(800,1195),(36,1195),(36,1690),(760,1690),(760,1800)],GRN,6,'225',(36,1500))
cp([(960,1100),(960,1165),(1352,1165),(1352,2265),(1250,2265)],ORG,4,'70',(1352,1700))
cp([(1270,1420),(1308,1420),(1308,2215),(1250,2215)],ORG,4,'78',(1308,1900))
cp([(480,1600),(480,1800)],PUR,6,'eventos',(480,1628))
cp([(520,1905),(590,1905)],GRN,4,'21',(555,1866))
cp([(950,2237),(880,2237)],ORG,6)
cp([(640,2367),(710,2367)],GRN,6)
notes=[]
for d,c,wd,pts,lab,n in cables:
    o.append(f'<path d="{d}" fill="none" stroke="#141b23" stroke-width="{wd+6}" stroke-linejoin="round"/>')
    o.append(f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{wd}" stroke-linejoin="round"/>')
    (a,b),(e,f)=pts[0],pts[-1]; (p,q)=pts[-2]
    o.append(f'<circle cx="{a}" cy="{b}" r="{max(8,wd/2+3)}" fill="{c}" stroke="#141b23" stroke-width="3"/>')
    s=max(10,wd/2+7)
    if p==e: dy=1 if f>q else -1; tri=f'{e-s} {f-dy*s*1.3} {e+s} {f-dy*s*1.3} {e} {f}'
    else: dx=1 if e>p else -1; tri=f'{e-dx*s*1.3} {f-s} {e-dx*s*1.3} {f+s} {e} {f}'
    o.append(f'<polygon points="{tri}" fill="{c}" stroke="#141b23" stroke-width="2"/>')
for d,c,wd,pts,lab,n in cables:
    if not lab: continue
    x,y=lab; w=max(52,len(n)*15+22)
    rect(x-w/2,y-17,w,34,'#fff' if n!='eventos' else PUR,7,'#141b23',2)
    text(x,y+9,n,25,'#101820' if n!='eventos' else '#fff',700,'middle')
# notas
rect(130,2480,590,180,'#a9ec7c',6,'#5da52f'); text(154,2520,'ESTADO DE LA REVISIÓN',27,'#123d05',700)
for i,t in enumerate(['0 botones sueltos','0 ciclos','0 archivos TypeScript de más de 1.000 líneas','Pruebas: app 104 · backend 133 · reglas 21 · cartón 61']):
    text(154,2556+i*29,'✓ '+t,24,'#123d05',500,font='var(--h)')
rect(740,2480,530,180,'#ffe27a',6,'#c49a18'); text(764,2520,'PENDIENTE',27,'#4a3600',700)
for i,t in enumerate(['21 proveedores anidados','2 archivos Kotlin de más de 1.000 líneas','22 vulnerabilidades moderadas en producción']):
    text(764,2556+i*29,t,24,'#4a3600',500,font='var(--h)')
rect(130,2690,1140,66,'#35c76f',10,'#1b8a48'); text(700,2736,'CI activa: 5 revisiones en cada subida',34,'#07301a',700,'middle')
svg=f'<svg class="plate" id="plate" viewBox="0 0 {W} {H}" role="img" aria-label="Mapa de Copiloto Driver con sus siete zonas y los cables medidos entre ellas."><rect width="{W}" height="{H}" fill="#161d26"/>'+''.join(o)+'</svg>'
page=f'''<title>Copiloto Driver por dentro</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Patrick+Hand&display=swap">
<style>
/* Layout: lámina única; cada cable sale de los datos medidos en el código. */
:root {{ --bg:#161d26; --fg:#e8eef4; --soft:#aeb9c5; --ink:#101820; --f:"Barlow Condensed","Arial Narrow",sans-serif; --h:"Patrick Hand","Comic Sans MS",cursive; color-scheme:dark; }}
body {{ background:var(--bg); color:var(--fg); font-family:var(--f); padding-block:12px 28px; padding-left:max(16px,env(safe-area-inset-left,0px)); padding-right:max(16px,env(safe-area-inset-right,0px)); }}
main {{ max-width:1000px; margin:0 auto; display:grid; gap:14px; }}
.scroll {{ overflow-x:auto; }}
.plate {{ display:block; width:100%; min-width:780px; height:auto; }}
p {{ margin:0; font-size:19px; line-height:1.4; color:var(--soft); }}
</style>
<main>
<div class="scroll">{svg}</div>
<p>Cada número es la cantidad de conexiones medidas en el código y el grosor del cable sigue ese número. Los cables sin número son relaciones reales que no se contaron. El dibujo muestra las conexiones más grandes. Medido en el commit 63ccfca, sin contar pruebas ni imports de solo tipos.</p>
</main>
'''
open(sys.argv[1]+'/copiloto-por-dentro.html','w').write(page)
standalone=f'<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Patrick+Hand&display=swap"><style>:root{{--ink:#101820;--f:"Barlow Condensed","Arial Narrow",sans-serif;--h:"Patrick Hand",cursive}}body{{margin:0;background:#161d26}}svg{{display:block;width:{W}px;height:{H}px}}</style></head><body>{svg}</body></html>'
open(sys.argv[1]+'/mapa-solo.html','w').write(standalone)
