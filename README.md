# Córdoba Anime Fest (CAF)

Sistema web para la gestión de la convención Córdoba Anime Fest. Permite administrar eventos, stands, zonas del mapa, usuarios y estadísticas, además de ofrecer notificaciones push y alertas en tiempo real.

## Tecnologías

| Capa | Tecnología |
|------|------------|
| **Frontend** | HTML, CSS, Bootstrap 5, Chart.js, Vanilla JavaScript (ES Modules), Service Worker |
| **Backend** | Node.js, Express 5 |
| **Base de datos** | PostgreSQL |
| **Autenticación** | JWT, bcrypt |
| **Tiempo real** | Socket.io |
| **Notificaciones** | Web Push (VAPID) |
| **Email** | Nodemailer |
| **Tareas programadas** | node-cron |

## Requisitos previos

- **Node.js** 18+ (recomendado LTS)
- **PostgreSQL** 14+ (o Docker)
- **npm** (incluido con Node.js)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/CordobaAnimeFest.git
cd CordobaAnimeFest
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PUERTO=3000

# Base de datos PostgreSQL
BD_HOST=localhost
BD_PUERTO=5432
BD_USUARIO=root
BD_PASSWORD=tu_password
BD_NOMBRE=caf

# JWT
FRASE_SECRETA=tu_frase_secreta_segura

# Web Push (notificaciones)
VAPID_PUBLIC_KEY=tu_clave_publica
VAPID_PRIVATE_KEY=tu_clave_privada
VAPID_CONTACT=mailto:tu@email.com

# Email (Nodemailer - Gmail)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
```

> **Nota:** Para generar claves VAPID: `npx web-push generate-vapid-keys`

### 4. Configurar la base de datos

#### Opción A: Con Docker

```bash
cd docker
docker build -t caf_imagen .
docker run --name caf_contenedor -e POSTGRES_USER=root -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=caf -p 5432:5432 -d caf_imagen
```

El script `caf.sql` se ejecuta automáticamente al crear el contenedor.

#### Opción B: PostgreSQL local

1. Crear la base de datos `caf`
2. Ejecutar el script `docker/caf.sql`:

```bash
psql -U tu_usuario -d caf -f docker/caf.sql
```

### 5. Ejecutar la aplicación

```bash
npm run dev
```

El servidor estará disponible en **http://localhost:3000**

## Estructura del proyecto

```
CordobaAnimeFest/
├── admin/                 # Panel de administración
│   ├── jsAdmin/           # Lógica del panel principal y CAF
│   ├── jsEventos/         # Gestión de eventos
│   ├── jsStands/          # Gestión de stands
│   ├── jsUsuarios/        # Gestión de usuarios
│   ├── jsEstadisticas/    # Estadísticas y gráficos
│   ├── jsAuditoria/       # Registro de auditoría
│   └── recursos/          # Utilidades compartidas
├── www/                   # Sitio público
│   ├── jsInicio/          # Página principal
│   ├── jsAlertas/          # Suscripción a alertas
│   └── jsContacto/        # Formulario de contacto
├── login/                 # Página de inicio de sesión
├── modulos/               # Backend
│   ├── api-crud/v1/       # API REST (eventos, stands, usuarios, caf, zonas, alertas)
│   ├── seguridad/         # Autenticación, JWT, auditoría
│   ├── notificaciones/    # Web Push
│   ├── email/             # Envío de correos
│   ├── contacto/          # Formulario de contacto
│   └── eventos/           # Estado de eventos (cron + Socket.io)
├── conexion/              # Pool de PostgreSQL
├── config/                # Configuración (dotenv)
├── recursos/              # Archivos estáticos (imágenes, logo)
├── docker/                # Docker y esquema SQL
├── app.mjs                # Punto de entrada
└── package.json
```

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal (eventos, stands) |
| `/alertas.html` | Suscripción a notificaciones push |
| `/contacto.html` | Formulario de contacto |
| `/login` | Inicio de sesión |
| `/admin` | Panel de administración (requiere autenticación) |
| `/admin/eventos.html` | Gestión de eventos |
| `/admin/stands.html` | Gestión de stands |
| `/admin/usuarios.html` | Gestión de usuarios (solo Admin) |
| `/admin/estadisticas.html` | Estadísticas y gráficos |
| `/admin/auditoria.html` | Registro de auditoría |

## Roles de usuario

- **Admin**: Acceso total (usuarios, auditoría, estadísticas, eventos, stands)
- **Eventos**: Solo gestión de eventos
- **Stands**: Solo gestión de stands

Los usuarios se crean desde el panel de administración una vez iniciada sesión con un usuario Admin.

## API

La API REST está bajo `/api/v1/`:

- `GET/POST/PUT/DELETE /api/v1/eventos` - Eventos
- `GET/POST/PUT/DELETE /api/v1/stands` - Stands
- `GET/POST/PUT/DELETE /api/v1/usuarios` - Usuarios
- `GET/POST/PUT/DELETE /api/v1/caf` - Ediciones CAF
- `GET/POST/PUT/DELETE /api/v1/zonas` - Zonas del mapa
- `GET/POST/DELETE /api/v1/alertas` - Suscripciones a alertas

## Licencia

ISC
