# 💍 Web de boda — Rafa & Ali

Web de boda hecha con **Vue 3 + Vite + Tailwind CSS + Vue Router + Supabase**.

- **`/`** Portada, nuestra historia, horarios, mapas (iglesia y hacienda) y cuenta atrás.
- **`/encuesta`** Confirmación de asistencia paso a paso (guarda en Supabase).
- **`/admin`** Panel privado con login: estadísticas, tabla, búsqueda, filtros y exportación a CSV.

> Los nombres, la fecha y los textos son de ejemplo. Lo personalizas todo en **`src/config/boda.js`** (ver [sección 8](#8-personalizar-la-web)).

---

## Índice

1. [Instalar Node.js y Visual Studio Code](#1-instalar-nodejs-y-visual-studio-code)
2. [Abrir el proyecto](#2-abrir-el-proyecto)
3. [Crear el proyecto en Supabase](#3-crear-el-proyecto-en-supabase)
4. [Crear la tabla y las políticas de seguridad](#4-crear-la-tabla-y-las-políticas-de-seguridad)
5. [Crear el usuario administrador](#5-crear-el-usuario-administrador)
6. [Configurar `.env.local`](#6-configurar-envlocal)
7. [Ejecutar en local](#7-ejecutar-en-local)
8. [Personalizar la web](#8-personalizar-la-web)
9. [Subir a GitHub](#9-subir-a-github)
10. [Activar GitHub Pages](#10-activar-github-pages)
11. [Solución de problemas](#11-solución-de-problemas)
12. [Notas de seguridad](#12-notas-de-seguridad)

---

## 1. Instalar Node.js y Visual Studio Code

1. Descarga **Node.js (versión LTS)** desde <https://nodejs.org> e instálalo con las opciones por defecto.
2. Descarga **Visual Studio Code** desde <https://code.visualstudio.com>.
3. Abre una terminal nueva y comprueba que funciona:

   ```bash
   node -v
   npm -v
   ```

   Debe mostrar versiones (Node 18 o superior; recomendado 20 o 22).

4. (Opcional) Instala **Git** desde <https://git-scm.com> — lo necesitarás en el paso 9.

## 2. Abrir el proyecto

1. Descomprime la carpeta `boda-rafayali` donde quieras.
2. Abre VS Code → **Archivo → Abrir carpeta…** → elige `boda-rafayali`.
   (O desde la terminal: `cd boda-rafayali` y luego `code .`)
3. VS Code te sugerirá instalar las extensiones **Vue - Official** y **Tailwind CSS IntelliSense**. Acepta.
4. Abre la terminal integrada: **Terminal → Nueva terminal**.

<details>
<summary>¿Prefieres crear el proyecto desde cero en una carpeta vacía? (opcional)</summary>

```bash
mkdir boda-rafayali && cd boda-rafayali
npm init -y
npm install vue vue-router @supabase/supabase-js
npm install -D vite @vitejs/plugin-vue tailwindcss@3 postcss autoprefixer
```

Después copia dentro todos los archivos de este proyecto (respetando las rutas).
</details>

## 3. Crear el proyecto en Supabase

1. Entra en <https://supabase.com> → **Start your project** → inicia sesión (puedes usar tu cuenta de GitHub).
2. **New project**:
   - **Name:** `boda-rafayali`
   - **Database password:** crea una contraseña y guárdala en un sitio seguro (no la necesitarás en la web).
   - **Region:** elige una de Europa (por ejemplo *West EU* o *Central EU*).
3. Espera un par de minutos a que se cree.
4. Ve a **Project Settings → API** (o **API Keys**) y apunta dos datos:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **Clave pública** → la llamada **`anon` `public`** (o **Publishable key**).

> ⚠️ **Nunca** uses la clave `service_role` / `secret` en este proyecto. Solo la `anon` / `publishable`.

## 4. Crear la tabla y las políticas de seguridad

1. En Supabase abre **SQL Editor → New query**.
2. Abre el archivo **`supabase/schema.sql`** de este proyecto, copia **todo** su contenido y pégalo.
3. Pulsa **Run**. Debe decir *Success*.

Qué hace el script:

- Crea la tabla `respuestas_boda` (`id`, `nombre`, `asistencia`, `acompanantes`, `nombres_acompanantes`, `alergias`, `cancion`, `mensaje`, `creado_en`) con límites de longitud.
- Crea índices por fecha y por asistencia.
- Activa **Row Level Security** con estas reglas:

| Quién | Insertar | Leer | Modificar | Borrar |
|---|:-:|:-:|:-:|:-:|
| Invitado (anónimo) | ✅ | ❌ | ❌ | ❌ |
| Novios (usuario autenticado) | ❌ | ✅ | ❌ | ❌ |

Puedes comprobarlo en **Table Editor → respuestas_boda** (debe aparecer con el candado de RLS activo).

## 5. Crear el usuario administrador

El panel `/admin` solo funciona con un usuario que crees tú. **No hay registro público.**

1. En Supabase: **Authentication → Users → Add user → Create new user**.
2. Escribe tu **email** y una **contraseña segura**.
3. Marca **Auto Confirm User** (para no depender de un correo de confirmación).
4. Pulsa **Create user**.
5. **Importante — cierra el registro público:** en **Authentication → Sign In / Providers** (en algunas versiones: *Authentication → Settings*), busca **“Allow new users to sign up”** y **desactívalo**.
   Así nadie más podrá crearse una cuenta y leer las respuestas.

## 6. Configurar `.env.local`

1. Copia el archivo de ejemplo:

   ```bash
   # macOS / Linux / Git Bash
   cp .env.example .env.local

   # Windows (CMD o PowerShell)
   copy .env.example .env.local
   ```

2. Abre `.env.local` y pega tus datos del paso 3:

   ```env
   VITE_SUPABASE_URL=https://abcdefgh.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_clave_anon_o_publishable
   ```

`.env.local` está en `.gitignore`, así que no se sube a GitHub.

## 7. Ejecutar en local

```bash
npm install      # instala las dependencias (solo la primera vez)
npm run dev      # arranca el servidor de desarrollo
```

Abre <http://localhost:5173>. Rutas:

- <http://localhost:5173/> — web principal
- <http://localhost:5173/encuesta> — confirmación de asistencia
- <http://localhost:5173/admin> — panel privado

Prueba a rellenar la encuesta, luego entra en `/admin` con el usuario del paso 5 y comprueba que aparece la respuesta.

Otros comandos:

```bash
npm run build     # compila para producción en la carpeta dist/
npm run preview   # sirve lo compilado en http://localhost:4173/boda-rafayali-web/
```

> Si cambias `.env.local` con el servidor encendido, páralo (`Ctrl + C`) y vuelve a lanzar `npm run dev`.

## 8. Personalizar la web

| Qué | Dónde |
|---|---|
| Nombres, fecha y hora, mensaje de portada, historia, horarios, nombres/direcciones de los lugares, máximo de acompañantes | `src/config/boda.js` |
| **URLs de Google Maps** (iglesia y hacienda) | `src/config/boda.js` → `MAPA_IGLESIA_URL`, `MAPA_HACIENDA_URL` (y los enlaces `ENLACE_*_URL`) |
| Fotos | Copia las imágenes en `public/fotos/` y pon la ruta en `src/config/boda.js` → `imagenes` (por ejemplo `'fotos/portada.jpg'`) |
| Colores | `tailwind.config.js` → `colors` (`crema`, `salvia`, `oro`, `tierra`) |
| Tipografías | `index.html` (enlace a Google Fonts) y `tailwind.config.js` → `fontFamily` |
| Preguntas de la encuesta | `src/views/SurveyView.vue` → lista `preguntas` |
| Icono de la pestaña | `public/favicon.svg` |

**Fecha de la boda:** formato ISO con zona horaria, por ejemplo `'2027-06-12T17:00:00+02:00'`
(`+02:00` en horario de verano, `+01:00` en invierno). La cuenta atrás cambia sola al diseño festivo
cuando llega ese día (a las 00:00 hora de España) y a un mensaje de agradecimiento al día siguiente.

**Mapas de Google:** Google Maps → busca el lugar → **Compartir → Incorporar un mapa → Copiar HTML** → de ese código copia
solo lo que hay dentro de `src="…"` y pégalo en la constante correspondiente.

**Comportamiento de la encuesta:** si el invitado dice que **no** asistirá, se saltan las preguntas de acompañantes,
alergias y canción (solo se le pregunta el mensaje opcional). Si no trae acompañantes, no se le piden sus nombres.
Puedes cambiarlo con la propiedad `visible` de cada pregunta.

**Sobre robots:** `index.html` incluye `noindex, nofollow` para que Google no indexe la web. Borra esa línea si lo prefieres.

## 9. Subir a GitHub

1. En <https://github.com/new> crea un repositorio llamado exactamente **`boda-rafayali-web`**.
   - Déjalo **vacío** (sin README, `.gitignore` ni licencia).
   - Con una cuenta gratuita de GitHub, **GitHub Pages solo funciona con repositorios públicos**.
2. En la terminal, dentro de la carpeta del proyecto:

   ```bash
   git init
   git add .
   git commit -m "Primera versión de la web de boda"
   git branch -M main
   git remote add origin https://github.com/albertjcuac/boda-rafayali-web.git
   git push -u origin main
   ```

3. Comprueba en GitHub que **no** aparece `.env.local` entre los archivos (no debe estar).

> El repositorio debe llamarse `boda-rafayali-web`. Si usas otro nombre, cámbialo también en `vite.config.js` (`NOMBRE_REPOSITORIO`).
> Tanto el repositorio como la web publicada serán públicos. `noindex, nofollow` solo pide a los buscadores que no indexen la web; no impide que alguien con el enlace la visite.

## 10. Activar GitHub Pages

Hazlo en este orden:

1. **Añade las claves de Supabase como secretos** (la compilación en GitHub no tiene tu `.env.local`):
   En el repositorio → **Settings → Secrets and variables → Actions → New repository secret**. Crea dos:
   - `VITE_SUPABASE_URL` → tu Project URL
   - `VITE_SUPABASE_ANON_KEY` → tu clave `anon` / `publishable`
2. **Activa Pages:** **Settings → Pages → Build and deployment → Source: _GitHub Actions_**.
3. **Lanza el despliegue:** pestaña **Actions** → *Desplegar en GitHub Pages* → **Run workflow**
   (o haz cualquier `git push` a `main`).
4. Cuando termine (marca verde ✅), tu web estará en:

   **`https://albertjcuac.github.io/boda-rafayali-web/`**

A partir de ahora, cada `git push` a `main` vuelve a compilar y publicar la web automáticamente.

El repositorio ya incluye `package-lock.json`; el workflow lo usa con `npm ci` y cachea las dependencias de npm.

## 11. Solución de problemas

| Problema | Causa y solución |
|---|---|
| Página en blanco en GitHub Pages | El nombre del repositorio no coincide con `NOMBRE_REPOSITORIO` en `vite.config.js`. |
| Error 404 al abrir `/encuesta` directamente | `npm run build` ya crea `dist/404.html` para esto. Comprueba que el despliegue se hizo con el workflow incluido. |
| “Falta configurar Supabase” en la web publicada | Faltan los secretos del paso 10.1. Añádelos y relanza el workflow (**Actions → Run workflow**). |
| La encuesta da “problema de permisos” | No se ejecutó bien `supabase/schema.sql`. Vuelve a ejecutarlo entero. |
| En `/admin` no aparecen respuestas (y sí hay en Supabase) | Revisa que hayas iniciado sesión y que se ejecutó la política de lectura del SQL. Pulsa **Actualizar**. |
| “El email o la contraseña no son correctos” | Revisa el usuario en **Authentication → Users**; marca *Auto Confirm* o confírmalo manualmente. |
| Los mapas salen en blanco | La URL pegada no es correcta. Usa la del atributo `src` del código “Incorporar un mapa”. |
| Cambié `.env.local` y no se nota | Reinicia `npm run dev`. |

## 12. Notas de seguridad

- La clave `anon` / `publishable` **es pública por diseño**: va dentro del JavaScript de la web. Lo que protege tus datos son las **políticas RLS** del paso 4, no esa clave.
- **Desactiva el registro público** (paso 5.5); de lo contrario cualquiera podría crear una cuenta y leer las respuestas.
- Para ser aún más estricto, `supabase/schema.sql` incluye una política opcional (comentada) que limita la lectura a **un único email**.
- El CSV exportado evita la “inyección de fórmulas” (celdas que empiezan por `=`, `+`, `-` o `@`).
- Nunca subas `.env` ni `.env.local` a GitHub, ni uses la clave `service_role` en este proyecto.

---

## Estructura del proyecto

```
boda-rafayali/
├── .github/workflows/deploy.yml   Despliegue automático en GitHub Pages
├── .vscode/                       Extensiones y ajustes recomendados
├── public/
│   └── favicon.svg                (aquí también puedes crear la carpeta "fotos/")
├── scripts/spa-404.mjs            Crea dist/404.html para las rutas en GitHub Pages
├── supabase/schema.sql            Tabla, índices y políticas RLS
├── src/
│   ├── components/                Secciones y piezas reutilizables
│   ├── composables/useCountdown.js
│   ├── config/boda.js             ← TODA la personalización
│   ├── directives/reveal.js       Animación al hacer scroll
│   ├── lib/supabase.js            Cliente de Supabase
│   ├── router/index.js
│   ├── utils/                     Fechas, CSV y rutas de imágenes
│   ├── views/                     Home, Encuesta, Admin, 404
│   ├── App.vue · main.js · style.css
├── .env.example · .gitignore · index.html
├── package.json · vite.config.js · tailwind.config.js · postcss.config.js
└── README.md
```
