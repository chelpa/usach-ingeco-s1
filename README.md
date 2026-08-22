# Mi Semestre — apuntes y resúmenes

Sitio estático personal con un menú de barra para tus 7 ramos y una página
por cada resumen/guía de estudio. Sin frameworks, sin paso de build: son
puros archivos HTML/CSS/JS que puedes abrir directo en el navegador o
publicar en GitHub Pages.

Inspirado visualmente en [fae.usach.cl/fae](https://fae.usach.cl/fae/)
(paleta charcoal + teal + dorado).

Esta versión (`uni-blog-3`) consolida en un solo sitio con navbar
compartido el material que ya tenías repartido en repos separados dentro
de esta carpeta (`admin/`, `compu-r/`, `eco/`, `eco-pep1/`, `mate1-pep2/`)
— esos repos originales quedan intactos, sin tocar.

## Estructura

```
.
├── index.html                      landing: hero + tarjetas de los 7 ramos
├── assets/
│   ├── style.css                    estilos del sitio (navbar, hero, tarjetas)
│   ├── study.css                    estilos de guías de estudio (fórmulas,
│   │                                 ejercicios, plan de repaso) — reutilizable
│   │                                 en cualquier ramo
│   └── nav.js                       navbar compartido + lista de los 7 cursos
│                                     (única fuente de verdad de sus nombres)
└── courses/
    ├── maye1/
    │   ├── index.html                página de inicio del ramo
    │   └── pep2.html                 Resumen y Plan de Estudio — PEP 2
    ├── economia/
    │   ├── index.html
    │   ├── pep2.html                 Resumen PEP 2 completo (Clases 1–4)
    │   └── pep2-parcial.html         versión anterior/acotada (Clases 3–4)
    ├── administracion/
    │   ├── index.html
    │   └── guia.html                 Guía interactiva Robbins (resumen + flashcards + quiz)
    ├── computacion/
    │   ├── index.html
    │   └── guia.html                 Guía de estudio — Trabajo Final R 2026
    ├── contabilidad/index.html       placeholder "aún no hay material"
    ├── ramo6/index.html              pendiente de nombre
    └── ramo7/index.html              pendiente de nombre
```

## Sobre las páginas migradas (Economía, Administración, Computación)

Esas tres páginas venían ya armadas por ti/Claude con su propio diseño
completo (colores, tipografía, y en el caso de Administración y
Computación, JavaScript interactivo: quiz con progreso guardado en el
navegador, flashcards, sidebar de navegación, etc.). Para integrarlas sin
romper nada se les agregaron solo dos cosas:

1. `<link rel="stylesheet" href="../../assets/style.css">` + el `<script>`
   del navbar compartido, insertados al principio del archivo.
2. Un pequeño ajuste de posición (`top`) en sus propios elementos
   "sticky" (su menú de pestañas, su sidebar, su header) para que no
   queden tapados por la barra superior del sitio — el navbar del sitio
   mide 100px de alto, así que sus elementos internos ahora se pegan en
   `top:100px` en vez de `top:0`.

El resto del diseño y funcionalidad de cada página es 100% el original.
Si alguna de estas páginas se ve rara en algún detalle puntual, dímelo y
lo ajusto — no debería pasar, pero son páginas complejas con su propio
CSS y este tipo de integración a veces deja un caso borde suelto.

## Cómo renombrar o reordenar los ramos

Todo el menú y los títulos de cada página de curso se generan desde un
único array en `assets/nav.js`:

```js
var COURSES = [
  { id: "maye1", short: "MAyE I", name: "Matemáticas para la Administración y Economía I" },
  { id: "ramo6", short: "Ramo 6", name: "Ramo 6 (pendiente)" },
  ...
];
```

Para renombrar "Ramo 6" y "Ramo 7" (los dos que faltan):
1. Edita el `name`/`short` en `assets/nav.js`.
2. Si quieres que el `id` también cambie, renombra también la carpeta
   `courses/ramo6/` para que coincida — el `id` **debe** ser igual al
   nombre de la carpeta.

No necesitas tocar ningún otro archivo: el título de cada página de curso
y el breadcrumb se rellenan automáticamente vía JavaScript leyendo esta
misma lista.

## Cómo agregar material nuevo a un ramo

1. Crea el archivo HTML dentro de `courses/<id>/`. Si es un resumen tipo
   "fórmulas + ejercicios" (como los de matemáticas), copia
   `courses/maye1/pep2.html` como plantilla — ya trae el navbar, el hero,
   y todos los componentes de estudio. Si es una página ya armada con su
   propio diseño (como las de Economía/Administración/Computación), solo
   agrégale el `<link>` de `style.css` y el `<script>` de `nav.js` al
   principio, y revisa si tiene algún elemento `position:sticky` que
   necesite el mismo ajuste de `top:100px` explicado arriba.
2. En `courses/<id>/index.html`, agrega una `.resource-card` que enlace
   al nuevo archivo (copia el patrón de `courses/economia/index.html`,
   que ya tiene dos recursos).
3. En `index.html` (la landing), agrega el `id` del ramo al array
   `READY` para que su tarjeta muestre "✓ Material disponible".

## Cómo verlo localmente

Abre `index.html` con doble clic — todo funciona con rutas relativas,
sin necesidad de servidor. Si prefieres un servidor local:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser público o privado).
2. Desde esta carpeta:
   ```bash
   git remote add origin https://github.com/<tu-usuario>/<nombre-repo>.git
   git branch -M main
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source → Deploy from a branch**,
   elige la rama `main` y la carpeta `/ (root)`. Guarda.
4. En un par de minutos tu sitio queda disponible en
   `https://<tu-usuario>.github.io/<nombre-repo>/`.

No hace falta ningún paso de build ni configuración adicional — es HTML
estático puro.
