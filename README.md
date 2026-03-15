# Córdoba Anime Fest (CAF)

Sistema web para la gestión de la convención Córdoba Anime Fest. Permite administrar eventos, stands, zonas del mapa, usuarios y estadísticas, además de ofrecer notificaciones push y alertas en tiempo real.


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

### 3. Configurar la base de datos con docker

```bash
cd docker
docker build -t caf_imagen .
docker run --name caf_contenedor -e POSTGRES_USER=root -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=caf -p 5432:5432 -d caf_imagen
```

### 4. Ejecutar la aplicación

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