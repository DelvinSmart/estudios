import html,sys
W,H=1200,1500
BLUE,YEL,PUR,GRN,ORG='#3f9bff','#ffd23f','#b06bff','#35c76f','#ff9a2e'
o=[]
def esc(s): return html.escape(s,quote=False)
def rect(x,y,w,h,fill,r=10,stroke=None,sw=2): o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="{sw}"' if stroke else '')+'/>')
def text(x,y,s,size=22,fill='#101820',w=500,anchor='start',font='var(--f)'): o.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{w}" text-anchor="{anchor}" font-family="{font}">{esc(s)}</text>')
def plate(x,y,w,h,title,lines=(),size=21,ts=28):
    rect(x,y,w,h,'#dfe5ea',9,'#8e9aa7'); yy=y+37
    text(x+18,yy,title,ts,'#101820',700); yy+=30
    for l in lines: text(x+18,yy,l,size,'#2b3642',500); yy+=size+6
rect(95,24,1010,86,'#123a70',10,'#3f6aa5')
text(600,64,'COPILOTO DRIVER — MAPA DE LA APP',40,'#fff',700,'middle'); text(600,98,'837 archivos · 5.038 conexiones',25,'#dbe7f7',500,'middle')
plate(95,130,250,120,'Panel web',['Diseño, usuarios, costos'])
plate(435,130,670,120,'11 motores de diseño',['Colores, radios, vidrio, bordes, títulos, fondo, movimiento y más','Candado: prohibido valores a mano'])
plate(95,335,290,185,'Pantallas (62)',['Início, San, Copiloto,','Ganhos, Gastos, Metas,','Vehículos, Menú'])
plate(490,335,310,185,'Componentes (357)',['Piezas de cada pantalla,','con motores únicos','de toque y vidrio'])
plate(900,335,205,185,'Idiomas (6)',['pt-BR, en, es,','fr, de, it'])
plate(95,610,1010,110,'Datos de la app',['21 proveedores: cuenta, ajustes, ganancias, gastos, vehículos, San, Copiloto y más'])
plate(95,810,305,160,'Copiloto Brain',['Eventos, memoria,','herramientas y 15 módulos'])
plate(490,810,300,160,'Utilidades y cálculos',['103 archivos: día fiscal,','ganancias, gastos, metas'])
plate(810,810,135,160,'San',['Grupos','y cuotas'],20,27)
plate(960,810,145,160,'Cartón',['Android,','Kotlin'],20,27)
plate(95,1050,300,110,'Servicios externos',['Gemini, RevenueCat,','Sentry, Twilio'],20,26)
plate(470,1050,270,110,'Firebase',['Auth, Firestore, Storage,','Functions, Hosting'],20,26)
plate(810,1050,295,110,'Servicios (83)',['OCR, notificaciones,','ubicación, copia de seguridad'],19,26)
c=[]
def cp(p,col,w,n=None,l=None): c.append((p,col,w,n,l))
cp([(345,190),(435,190)],BLUE,6)
cp([(700,335),(700,290),(800,290),(800,250)],BLUE,13,'582',(800,292))
cp([(300,335),(300,292),(560,292),(560,250)],BLUE,5,'117',(430,292))
cp([(385,430),(490,430)],BLUE,11,'509',(437,392))
cp([(800,430),(900,430)],YEL,5,'208',(850,392))
cp([(250,520),(250,610)],PUR,5,'143',(250,566))
cp([(620,520),(620,610)],PUR,5,'118',(620,566))
cp([(160,520),(160,548),(68,548),(68,762),(590,762),(590,810)],GRN,5,'135',(68,640))
cp([(530,520),(530,590),(32,590),(32,786),(680,786),(680,810)],GRN,6,'225',(32,700))
cp([(740,520),(740,560),(1172,560),(1172,1125),(1105,1125)],ORG,4,'70',(1168,800))
cp([(1105,665),(1138,665),(1138,1085),(1105,1085)],ORG,4,'78',(1136,900))
cp([(300,720),(300,810)],PUR,6,'eventos',(300,745))
cp([(400,890),(490,890)],GRN,4,'21',(445,852))
cp([(810,1105),(740,1105)],ORG,6)
cp([(470,1105),(395,1105)],GRN,6)
for p,col,w,n,l in c:
    d='M'+' L'.join(f'{a} {b}' for a,b in p)
    o.append(f'<path d="{d}" fill="none" stroke="#141b23" stroke-width="{w+6}" stroke-linejoin="round"/><path d="{d}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linejoin="round"/>')
    (a,b),(e,f)=p[0],p[-1]; (x,y)=p[-2]
    o.append(f'<circle cx="{a}" cy="{b}" r="{max(7,w/2+3)}" fill="{col}" stroke="#141b23" stroke-width="3"/>')
    s=max(9,w/2+7)
    if x==e: dy=1 if f>y else -1; t=f'{e-s} {f-dy*s*1.3} {e+s} {f-dy*s*1.3} {e} {f}'
    else: dx=1 if e>x else -1; t=f'{e-dx*s*1.3} {f-s} {e-dx*s*1.3} {f+s} {e} {f}'
    o.append(f'<polygon points="{t}" fill="{col}" stroke="#141b23" stroke-width="2"/>')
for p,col,w,n,l in c:
    if not l: continue
    x,y=l; wd=max(48,len(n)*14+20)
    rect(x-wd/2,y-16,wd,32,'#fff' if n!='eventos' else PUR,7,'#141b23',2); text(x,y+9,n,24,'#101820' if n!='eventos' else '#fff',700,'middle')
rect(95,1190,565,205,'#a9ec7c',7,'#5da52f'); text(118,1232,'RESUELTO',28,'#123d05',700)
for i,t in enumerate(['0 botones sueltos','0 ciclos','0 archivos TypeScript de más de 1.000 líneas','Pruebas: app 104 · backend 133','reglas 21 · cartón 61']):
    text(118,1268+i*25,('✓ ' if i<4 else '    ')+t,23,'#123d05',500,font='var(--h)')
rect(680,1190,425,205,'#ffe27a',7,'#c49a18'); text(703,1232,'PENDIENTE',28,'#4a3600',700)
for i,t in enumerate(['21 proveedores anidados','2 archivos Kotlin de más de','1.000 líneas','22 vulnerabilidades moderadas','en producción']):
    text(703,1268+i*25,t,23,'#4a3600',500,font='var(--h)')
rect(95,1415,1010,58,'#35c76f',10,'#1b8a48'); text(600,1455,'CI activa: 5 revisiones en cada subida',32,'#07301a',700,'middle')
svg=f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" xmlns="http://www.w3.org/2000/svg"><rect width="{W}" height="{H}" fill="#161d26"/>'+''.join(o)+'</svg>'
open(sys.argv[1]+'/li.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Patrick+Hand&display=swap"><style>:root{{--f:"Barlow Condensed","Arial Narrow",sans-serif;--h:"Patrick Hand",cursive}}body{{margin:0;background:#161d26}}svg{{display:block}}</style></head><body>{svg}</body></html>')
