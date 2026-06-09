# Módulo Login, Registro y Control de Acceso
## Plataforma SaaS Menús Digitales Multiempresa

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Pantallas Desarrolladas](#pantallas-desarrolladas)
3. [Componentes Visuales](#componentes-visuales)
4. [Flujos de Navegación](#flujos-de-navegación)
5. [Estados del Sistema](#estados-del-sistema)
6. [Casos de Uso por Rol](#casos-de-uso-por-rol)
7. [Relación con Multiempresa](#relación-con-multiempresa)
8. [Seguridad y Validaciones](#seguridad-y-validaciones)
9. [Experiencia de Usuario (UX)](#experiencia-de-usuario-ux)
10. [Arquitectura de Sesiones](#arquitectura-de-sesiones)

---

## 1. Resumen Ejecutivo

El **Módulo de Login, Registro y Control de Acceso** es la puerta de entrada exclusiva para:
- Super Administradores
- Administradores de Negocio
- Colaboradores autorizados

**NO es utilizado por clientes finales** (quienes acceden al menú mediante código QR).

### Características Principales:
- ✅ **Pantallas separadas** para Login y Registro (navegación simple)
- ✅ **Registro de nuevos negocios** con formulario completo en página independiente
- ✅ Autenticación segura con correo y contraseña
- ✅ CAPTCHA matemático ligero (sin dependencias pesadas)
- ✅ Recuperación de contraseña con enlace temporal
- ✅ Gestión de sesiones
- ✅ Registro de accesos (fecha, hora, último acceso)
- ✅ Dashboard post-autenticación con navegación lateral
- ✅ Diseño responsive (escritorio, tablet, móvil)
- ✅ Estética SaaS empresarial con Hugging Face Design System
- ✅ Rendimiento optimizado y bajo consumo de recursos

---

## 2. Pantallas Desarrolladas

### 2.1 Pantalla de Inicio de Sesión (`login.html`)

**Propósito:** Autenticación de usuarios autorizados.

**Navegación:**
- Enlace inferior: **"¿No tienes cuenta? Regístrate"** (redirige a `registro.html`)
- Enlace en formulario: **"¿Olvidaste tu contraseña?"** (redirige a `recuperar-contrasena.html`)

#### 2.1.1 Formulario de Inicio de Sesión

**Elementos:**
- **Logo de la plataforma** (centrado, superior)
- **Título:** "Iniciar Sesión"
- **Subtítulo:** "Acceso exclusivo para administradores y colaboradores"
- **Formulario:**
  - Campo: Correo electrónico
  - Campo: Contraseña (con botón para mostrar/ocultar)
  - CAPTCHA matemático simple (ej: "5 + 3 = ?")
  - Botón: "Ingresar"
  - Enlace: "¿Olvidaste tu contraseña?"
- **Footer informativo:** Indica que los clientes acceden mediante QR

**Validaciones:**
- Correo electrónico válido
- Contraseña mínima 6 caracteres
- CAPTCHA correcto
- Mensajes de error específicos por campo

**Flujo:**
```
Usuario ingresa credenciales
  ↓
Sistema valida
  ↓
Identifica rol y empresa
  ↓
Carga permisos
  ↓
Redirige a Dashboard
```

---

### 2.2 Pantalla de Registro (`registro.html`)

**Propósito:** Permitir que nuevos negocios se registren en la plataforma.

**Navegación:**
- Enlace inferior: **"¿Ya tienes cuenta? Inicia Sesión"** (redirige a `login.html`)

**Elementos:**
- **Logo de la plataforma** (centrado, superior)
- **Título:** "Crear Cuenta"
- **Subtítulo:** "Registra tu negocio en la plataforma"
- **Formulario:**
  - Campo: Nombre completo (mínimo 3 caracteres)
  - Campo: Correo electrónico (validación de formato)
  - Campo: Contraseña (con botón para mostrar/ocultar, mínimo 8 caracteres)
  - Campo: Confirmar contraseña (con validación de coincidencia)
  - Campo: Nombre de tu negocio
  - CAPTCHA matemático simple
  - Botón: "Crear Cuenta"

**Validaciones:**
- Nombre completo mínimo 3 caracteres
- Correo electrónico válido y único
- Contraseña mínima 8 caracteres
- Confirmación de contraseña coincidente
- Nombre de negocio mínimo 3 caracteres
- CAPTCHA correcto
- Mensajes de error específicos por campo

**Flujo de Registro:**
```
Usuario completa formulario de registro en registro.html
  ↓
Sistema valida datos
  ↓
Crea nueva empresa en base de datos
  ↓
Crea usuario como Administrador de Negocio
  ↓
Asigna rol y permisos iniciales
  ↓
Muestra mensaje de éxito
  ↓
Redirige automáticamente a login.html
  ↓
Pre-llena el campo de correo electrónico (vía sessionStorage)
  ↓
Usuario ingresa su contraseña para acceder
```

**Notas Importantes:**
- El primer usuario registrado de un negocio obtiene automáticamente el rol de **Administrador de Negocio**
- Se crea automáticamente una nueva empresa en el sistema multiempresa
- El usuario debe iniciar sesión después del registro exitoso
- El correo se transfiere entre páginas vía `sessionStorage` para pre-llenado automático
- El registro solo está disponible para **nuevos negocios**, no para colaboradores (estos son invitados por el Admin de Negocio desde el dashboard)

---

### 2.3 Pantalla de Recuperación (`recuperar-contrasena.html`)

**Propósito:** Restablecer contraseña olvidada.

**Elementos:**
- Enlace "Volver al inicio de sesión"
- Ícono de seguridad (candado)
- **Título:** "Recuperar Contraseña"
- **Descripción:** Instrucciones claras
- **Formulario:**
  - Campo: Correo electrónico
  - Botón: "Enviar enlace de recuperación"
- **Nota de seguridad:** Validez de 1 hora del enlace
- **Estado de éxito:** Confirmación visual con ícono verde

**Flujo:**
```
Usuario solicita recuperación
  ↓
Ingresa correo electrónico
  ↓
Sistema genera enlace temporal
  ↓
Envía correo electrónico
  ↓
Usuario accede al enlace
  ↓
Establece nueva contraseña
  ↓
Acceso restablecido
```

---

### 2.4 Dashboard (`dashboard.html`)

**Propósito:** Panel principal post-autenticación.

**Estructura:**
- **Barra lateral izquierda** (260px, sticky)
  - Logo de la plataforma
  - Navegación organizada por secciones
  - Tarjeta de usuario (avatar, nombre, rol)
- **Header superior** (64px, sticky)
  - Título de página actual
  - Acciones rápidas (búsqueda, notificaciones, ayuda)
- **Área de contenido principal**
  - Mensaje de bienvenida
  - Tarjetas informativas
  - Espacio para futuros módulos

**Navegación Lateral (Módulos Futuros):**

**Principal:**
- ✅ Dashboard (activo)
- 🔒 Multiempresa (próximo)

**Administración:**
- 🔒 Usuarios (próximo)
- 🔒 Roles y Permisos (próximo)
- 🔒 Planes (próximo)

**Contenido:**
- 🔒 Catálogo (próximo)
- 🔒 Multimedia (próximo)
- 🔒 Idiomas (próximo)

**Herramientas:**
- 🔒 Marketing (próximo)
- 🔒 IA Generativa (próximo)
- 🔒 Estadísticas (próximo)
- 🔒 Automatizaciones (próximo)

**Cuenta:**
- 🔒 Perfil (próximo)
- 🔒 Configuración (próximo)

---

## 3. Componentes Visuales

### 3.1 Sistema de Diseño

**Paleta de Colores (Hugging Face):**
- `--bg: #fafafa` — Fondo general
- `--surface: #ffffff` — Tarjetas y paneles
- `--fg: #0d1117` — Texto principal
- `--muted: #6b7280` — Texto secundario
- `--border: #e5e7eb` — Bordes
- `--accent: #ffd21e` — Amarillo de marca
- `--success: #16a34a` — Verde éxito
- `--danger: #dc2626` — Rojo error

**Tipografía:**
- Display/UI: `IBM Plex Mono` (monoespaciada, identidad técnica)
- Body: `Source Sans Pro` (legible, prosa optimizada)

**Espaciado:**
- Base: 4px
- Escala: 4, 8, 12, 16, 24, 32, 48, 64px

**Bordes:**
- Radio pequeño: 4px
- Radio medio: 6px
- Bordes crisp de 1px

---

### 3.2 Componentes Reutilizables

#### Enlaces de Navegación entre Pantallas
- Estilo: texto gris (`--muted`) con enlace destacado
- Enlace en fuente `IBM Plex Mono` con subrayado amarillo (`--accent`)
- Transición de color 120ms en hover
- Ubicación: debajo del botón principal
- Ejemplos:
  - "¿No tienes cuenta? **Regístrate**" (en login.html)
  - "¿Ya tienes cuenta? **Inicia Sesión**" (en registro.html)

#### Logo
- Cuadrado 64×64px
- Fondo amarillo (`--accent`)
- Ícono geométrico centrado
- Nombre de plataforma debajo

#### Campos de Formulario
- Altura: 48px
- Borde: 1px solid `--border`
- Radio: 6px
- Focus: Borde oscuro + sombra sutil
- Error: Borde rojo + mensaje debajo

#### Botones Primarios
- Altura: 52px
- Fondo: `--fg` (negro profundo)
- Texto: blanco
- Fuente: `IBM Plex Mono`
- Estados: hover (más claro), disabled (gris)
- Spinner integrado durante carga

#### CAPTCHA (Diseño Horizontal)
- **Layout:** Pregunta y campo en la misma línea horizontal
- Fondo: `--border-soft`
- Pregunta matemática en monospace (`IBM Plex Mono`)
- Input: 64px ancho, centrado, altura 40px
- Botón refresh para regenerar (ícono circular)
- Alineación: `display: flex`, `justify-content: space-between`

#### Mensajes de Estado
- Éxito: Fondo verde suave, borde verde, texto verde
- Error: Fondo rojo suave, borde rojo, texto rojo
- Ícono SVG + texto
- Aparición/desaparición suave

#### Tarjeta de Usuario
- Avatar circular con iniciales
- Nombre completo
- Rol del usuario
- Menú desplegable (Perfil, Configuración, Cerrar Sesión)

#### Navegación Lateral
- Items con ícono SVG + texto
- Estado activo: fondo negro, texto blanco
- Estado disabled: opacidad 40%
- Badges "Próximo" en elementos futuros

---

## 4. Flujos de Navegación

### 4.1 Flujo de Autenticación Exitosa

```
1. Usuario abre login.html
   ↓
2. Completa formulario:
   - Correo electrónico
   - Contraseña
   - CAPTCHA
   ↓
3. Click en "Ingresar"
   ↓
4. Validación frontend
   ↓
5. Simulación API (1.5s)
   ↓
6. Sistema crea sesión:
   {
     email: "usuario@email.com",
     role: "super_admin",
     empresa: "Empresa Demo",
     nombre: "Usuario Demo",
     lastAccess: "2026-06-06T10:30:00Z"
   }
   ↓
7. Almacena en sessionStorage
   ↓
8. Mensaje de éxito
   ↓
9. Redirección a dashboard.html (1s)
   ↓
10. Dashboard carga datos de sesión
    ↓
11. Muestra información personalizada
```

---

### 4.2 Flujo de Recuperación de Contraseña

```
1. Usuario click en "¿Olvidaste tu contraseña?"
   ↓
2. Redirección a recuperar-contrasena.html
   ↓
3. Usuario ingresa correo
   ↓
4. Click en "Enviar enlace"
   ↓
5. Validación frontend
   ↓
6. Simulación envío (1.5s)
   ↓
7. Estado cambia a "Correo enviado"
   ↓
8. Muestra confirmación visual
   ↓
9. Usuario puede:
   - Volver al login
   - Solicitar reenvío
```

**En producción:**
- Backend genera token único temporal
- Token válido por 1 hora
- Envío real de correo electrónico
- Enlace: `https://plataforma.com/reset-password?token=XXX`
- Usuario crea nueva contraseña
- Token se invalida tras uso

---

### 4.3 Flujo de Registro de Nuevo Negocio

```
1. Usuario en login.html click en "Regístrate"
   ↓
2. Navegación a registro.html
   ↓
3. Usuario completa formulario:
   - Nombre completo
   - Correo electrónico
   - Contraseña (mín 8 caracteres)
   - Confirmar contraseña
   - Nombre del negocio
   - CAPTCHA horizontal
   ↓
4. Sistema valida frontend:
   - Formato de correo
   - Longitud de contraseña
   - Coincidencia de contraseñas
   - CAPTCHA correcto
   ↓
5. Click en "Crear Cuenta"
   ↓
6. Simulación de registro (2s)
   ↓
7. Backend crea:
   - Nueva empresa en tabla `empresas`
   - Usuario con rol "admin_negocio"
   - Relación usuario-empresa
   - Permisos iniciales
   ↓
8. Guarda correo en sessionStorage
   ↓
9. Mensaje de éxito
   ↓
10. Redirección automática a login.html (1.5s)
    ↓
11. Pre-llena campo de correo electrónico (lee sessionStorage)
    ↓
12. Muestra mensaje: "Cuenta creada exitosamente. Ingresa tu contraseña para acceder."
    ↓
13. Usuario ingresa contraseña para acceder
    ↓
14. Dashboard muestra empresa recién creada
```

**Nota de Seguridad:**
- Validar que el correo no exista previamente en la base de datos
- Encriptar contraseña con bcrypt antes de almacenar
- Generar token de verificación de correo (opcional)
- Registrar IP y timestamp de creación

---

### 4.4 Flujo de Cierre de Sesión

```
1. Usuario click en tarjeta de usuario (sidebar)
   ↓
2. Aparece menú desplegable
   ↓
3. Click en "Cerrar Sesión" (rojo)
   ↓
4. Confirmación: "¿Estás seguro?"
   ↓
5. Si confirma:
   - Limpia sessionStorage
   - Registra hora de salida
   - Redirección a login.html
   ↓
6. Sesión cerrada
```

---

## 5. Estados del Sistema

### 5.1 Estados de Formularios

| Estado | Visual | Comportamiento |
|--------|--------|----------------|
| **Normal** | Bordes grises, placeholders | Listo para input |
| **Focus** | Borde oscuro + sombra | Usuario escribiendo |
| **Error** | Borde rojo + mensaje | Validación falló |
| **Success** | Mensaje verde | Acción completada |
| **Loading** | Botón disabled + spinner | Procesando |
| **Disabled** | Opacidad 40%, cursor no permitido | No interactivo |

---

### 5.2 Estados de Sesión

| Estado | Descripción | Almacenamiento |
|--------|-------------|----------------|
| **No autenticado** | Sin credenciales válidas | Sin sessionStorage |
| **Autenticado** | Sesión activa | sessionStorage con datos |
| **Expirado** | Timeout o cierre manual | sessionStorage limpio |
| **Inválido** | Token corrupto | Redirección forzada a login |

**Persistencia:**
- `sessionStorage` — Se pierde al cerrar pestaña
- **No usar `localStorage`** para sesiones críticas
- En producción: tokens JWT + refresh tokens

---

### 5.3 Estados de Validación CAPTCHA

| Intento | Acción |
|---------|--------|
| **Correcto** | Avanza al submit |
| **Incorrecto** | Error + campo marcado rojo |
| **Refresh** | Genera nueva pregunta |
| **Múltiples fallos** | (En producción: bloqueo temporal) |

---

## 6. Casos de Uso por Rol

### 6.1 Super Administrador

**Permisos:**
- ✅ Acceso total a la plataforma
- ✅ Gestión de todas las empresas
- ✅ Creación/edición/eliminación de usuarios
- ✅ Configuración global del sistema
- ✅ Acceso a todos los módulos futuros

**Flujo típico:**
```
Login → Dashboard → Multiempresa → Selecciona empresa
                  → Usuarios → Gestiona permisos
                  → Planes → Configura suscripciones
                  → Estadísticas globales
```

**Indicador visual:**
- Badge "Super Admin" en tarjeta de usuario
- Acceso a módulos de nivel superior

---

### 6.2 Administrador de Negocio

**Permisos:**
- ✅ Acceso a su empresa únicamente
- ✅ Gestión de usuarios de su empresa
- ✅ Configuración del catálogo de productos
- ✅ Carga de multimedia
- ✅ Configuración de idiomas
- ✅ Acceso a estadísticas de su empresa
- ❌ No puede acceder a otras empresas
- ❌ No puede modificar configuración global

**Flujo típico:**
```
Login → Dashboard → Catálogo → Agrega/edita productos
                  → Multimedia → Sube imágenes
                  → Usuarios → Invita colaboradores
                  → Estadísticas → Ve métricas de su empresa
```

**Indicador visual:**
- Badge "Admin de Negocio"
- Solo ve su empresa en contexto
- Módulos limitados a su scope

---

### 6.3 Colaborador

**Permisos:**
- ✅ Acceso limitado según permisos asignados
- ✅ Lectura de catálogo
- ⚠️ Edición según rol (ej: solo puede editar precios)
- ❌ No puede gestionar usuarios
- ❌ No puede cambiar configuración

**Ejemplos de roles colaborador:**
- **Editor de Catálogo:** Solo edita productos
- **Gestor de Marketing:** Solo módulo de promociones
- **Visor de Estadísticas:** Solo lectura de reportes

**Flujo típico:**
```
Login → Dashboard → [Módulos permitidos]
                  → Acciones limitadas
```

**Indicador visual:**
- Badge "Colaborador"
- Navegación muestra solo módulos permitidos
- Botones de edición deshabilitados según permisos

---

## 7. Relación con Multiempresa

### 7.1 Arquitectura Multiempresa

**Concepto:**
Una única plataforma SaaS sirve a múltiples empresas (restaurantes) de forma aislada.

**Identificación:**
- Cada usuario pertenece a **una** empresa
- Cada empresa tiene un `empresa_id` único
- Datos están segregados por `empresa_id`

**Al autenticarse:**
```javascript
{
  email: "admin@restaurante-a.com",
  role: "admin_negocio",
  empresa_id: "550e8400-e29b-41d4-a716-446655440000",
  empresa_nombre: "Restaurante A",
  permisos: ["catalogo.edit", "multimedia.upload", "usuarios.view"]
}
```

**Todas las consultas filtran por empresa:**
```sql
SELECT * FROM productos WHERE empresa_id = '550e8400-...'
SELECT * FROM usuarios WHERE empresa_id = '550e8400-...'
```

---

### 7.2 Control de Acceso por Empresa

| Rol | Scope |
|-----|-------|
| **Super Admin** | Todas las empresas |
| **Admin de Negocio** | Solo su empresa |
| **Colaborador** | Solo su empresa + permisos limitados |

**Validación en cada request:**
```javascript
// Backend (pseudocódigo)
function validarAcceso(usuario, recurso) {
  if (usuario.role === 'super_admin') {
    return true; // Acceso total
  }

  if (recurso.empresa_id !== usuario.empresa_id) {
    throw new Error('Acceso denegado: empresa diferente');
  }

  if (!usuario.permisos.includes(recurso.accion)) {
    throw new Error('Acceso denegado: sin permisos');
  }

  return true;
}
```

---

### 7.3 Futuros Módulos Multiempresa

**Módulo de Gestión de Empresas** (solo Super Admin):
- Crear nueva empresa
- Asignar plan (Free, Pro, Enterprise)
- Configurar límites (productos, usuarios, almacenamiento)
- Activar/desactivar empresa
- Ver estadísticas globales

**Dashboard Multiempresa:**
- Lista de empresas activas
- Búsqueda y filtros
- Acceso rápido a panel de cada empresa
- Métricas consolidadas

**Aislamiento de Datos:**
- Base de datos: índices por `empresa_id`
- Almacenamiento: rutas segregadas `/uploads/{empresa_id}/`
- Caché: keys separadas `empresa:{empresa_id}:productos`
- Logs: etiquetados por empresa

---

## 8. Seguridad y Validaciones

### 8.1 Validaciones Frontend

**Correo Electrónico:**
```javascript
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
```

**Contraseña:**
- Mínimo 6 caracteres (en prototipo)
- En producción: mínimo 8, mayúscula, número, símbolo

**CAPTCHA:**
- Validación matemática simple
- Regeneración en cada intento fallido
- En producción: considerar reCAPTCHA o hCaptcha para bots

---

### 8.2 Seguridad Backend (Recomendaciones)

**Autenticación:**
- ✅ Hasheo de contraseñas (bcrypt, Argon2)
- ✅ Tokens JWT con expiración corta (15 min)
- ✅ Refresh tokens en httpOnly cookies
- ✅ Rate limiting (max 5 intentos en 15 min)
- ✅ Bloqueo temporal tras fallos consecutivos

**Sesiones:**
- ✅ Timeout de inactividad (30 min)
- ✅ Renovación automática con refresh token
- ✅ Cierre forzado al cambiar contraseña
- ✅ Registro de IP y user-agent

**Recuperación de Contraseña:**
- ✅ Token único de un solo uso
- ✅ Expiración en 1 hora
- ✅ Envío solo a correo verificado
- ✅ No revelar si el correo existe

**Protección:**
- ✅ HTTPS obligatorio
- ✅ Headers de seguridad (HSTS, CSP, X-Frame-Options)
- ✅ Sanitización de inputs
- ✅ Protección CSRF
- ✅ Logs de auditoría

---

### 8.3 Gestión de Sesiones

**Registro de Accesos:**
```javascript
{
  usuario_id: "uuid",
  empresa_id: "uuid",
  fecha_acceso: "2026-06-06T10:30:00Z",
  ip: "192.168.1.100",
  user_agent: "Mozilla/5.0...",
  estado: "activo" | "cerrado" | "expirado"
}
```

**Tabla de Sesiones (propuesta):**
```sql
CREATE TABLE sesiones (
  id UUID PRIMARY KEY,
  usuario_id UUID NOT NULL,
  empresa_id UUID NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  fecha_expiracion TIMESTAMP NOT NULL,
  ultimo_acceso TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

**Limpieza Automática:**
- Cron job diario elimina sesiones expiradas
- Alerta si sesión sospechosa (IP/país diferente)

---

## 9. Experiencia de Usuario (UX)

### 9.1 Principios de Diseño Aplicados

**1. Simplicidad:**
- Formularios mínimos
- Campos claramente etiquetados
- Sin distracciones visuales

**2. Velocidad:**
- Sin frameworks pesados (React, Vue)
- CSS y JS inlineados
- Carga instantánea (<500ms)

**3. Feedback Inmediato:**
- Validación en tiempo real
- Mensajes de error específicos
- Estados de carga visibles

**4. Accesibilidad:**
- Labels asociados a inputs
- Aria-labels en botones de ícono
- Contraste WCAG AA
- Navegación por teclado

**5. Responsive:**
- Mobile-first approach
- Breakpoints: 480px, 768px, 920px
- Touch targets mínimos 44×44px

---

### 9.2 Optimizaciones de Rendimiento

**Tamaño de Archivos:**
- `login.html`: ~15KB
- `recuperar-contrasena.html`: ~12KB
- `dashboard.html`: ~25KB
- **Total:** <60KB sin comprimir

**Carga:**
- Sin dependencias externas
- CSS inline (evita request adicional)
- JS inline y minificado
- SVG inline (iconografía)

**Técnicas:**
- CSS Grid y Flexbox (sin frameworks)
- Transiciones hardware-accelerated
- Debouncing en validaciones
- Lazy loading de contenido futuro

---

### 9.3 Flujo de Interacción

**Tiempos de Respuesta:**
- Validación: inmediata (<50ms)
- Simulación login: 1.5s (configurable)
- Transiciones: 120ms
- Redirecciones: 1s post-confirmación

**Animaciones:**
- Entrada suave de mensajes de estado
- Fade in del spinner de carga
- Transición de páginas
- Hover states sutiles (sin exageración)

---

## 10. Arquitectura de Sesiones

### 10.1 Flujo de Autenticación Completo

```
[Cliente] ──(1)── POST /api/auth/login
              ↓
         { email, password, captcha }
              ↓
[Backend] ──(2)── Validar CAPTCHA
              ↓
         ──(3)── Buscar usuario en DB
              ↓
         ──(4)── Verificar contraseña (bcrypt)
              ↓
         ──(5)── Identificar empresa_id y role
              ↓
         ──(6)── Cargar permisos
              ↓
         ──(7)── Generar JWT (access + refresh)
              ↓
         ──(8)── Registrar en tabla sesiones
              ↓
         ──(9)── Respuesta:
              {
                access_token: "eyJ...",
                refresh_token: "eyJ...",
                user: {
                  id, email, nombre, role,
                  empresa_id, empresa_nombre,
                  permisos: [...]
                }
              }
              ↓
[Cliente] ──(10)── Almacena en sessionStorage
              ↓
         ──(11)── Redirige a /dashboard
```

---

### 10.2 Estructura de Token JWT

**Access Token (15 min):**
```json
{
  "sub": "usuario_id",
  "email": "admin@empresa.com",
  "role": "admin_negocio",
  "empresa_id": "550e8400-...",
  "permisos": ["catalogo.edit", "multimedia.upload"],
  "iat": 1717664400,
  "exp": 1717665300
}
```

**Refresh Token (7 días):**
```json
{
  "sub": "usuario_id",
  "type": "refresh",
  "iat": 1717664400,
  "exp": 1718269200
}
```

---

### 10.3 Renovación de Token

```
[Cliente] ── cada 10 min ── Check expiration
              ↓
         Si access_token expira en <5 min:
              ↓
         POST /api/auth/refresh
              { refresh_token }
              ↓
[Backend] ── Valida refresh_token
              ↓
         Genera nuevo access_token
              ↓
         Respuesta: { access_token }
              ↓
[Cliente] ── Actualiza sessionStorage
```

---

## 📊 Resumen de Archivos Entregados

| Archivo | Propósito | Tamaño aprox. |
|---------|-----------|---------------|
| `login.html` | Pantalla de autenticación | 15KB |
| `recuperar-contrasena.html` | Recuperación de contraseña | 12KB |
| `dashboard.html` | Panel principal post-login | 25KB |
| `DOCUMENTACION-LOGIN.md` | Este documento | — |

---

## ✅ Checklist de Implementación

- [x] Pantalla de Login con validaciones
- [x] CAPTCHA matemático ligero
- [x] Recuperación de contraseña
- [x] Dashboard con navegación lateral
- [x] Estados de carga y error
- [x] Gestión de sesiones (sessionStorage)
- [x] Responsive design (móvil, tablet, escritorio)
- [x] Hugging Face Design System aplicado
- [x] Documentación completa de flujos
- [x] Casos de uso por rol
- [x] Relación con sistema multiempresa
- [ ] Integración con backend real (API endpoints)
- [ ] Tokens JWT en producción
- [ ] Rate limiting y protección contra bots
- [ ] Envío real de correos de recuperación
- [ ] Tests automatizados
- [ ] Logs de auditoría

---

## 🚀 Próximos Pasos Recomendados

### Fase 1: Backend API
1. Endpoint `POST /api/auth/login`
2. Endpoint `POST /api/auth/refresh`
3. Endpoint `POST /api/auth/logout`
4. Endpoint `POST /api/auth/forgot-password`
5. Endpoint `POST /api/auth/reset-password`

### Fase 2: Base de Datos
1. Tabla `usuarios`
2. Tabla `empresas`
3. Tabla `roles`
4. Tabla `permisos`
5. Tabla `sesiones`
6. Relaciones y constraints

### Fase 3: Seguridad
1. Hasheo de contraseñas (bcrypt)
2. Generación de JWT
3. Rate limiting (express-rate-limit)
4. Protección CSRF
5. Headers de seguridad

### Fase 4: Módulos Futuros
1. Multiempresa
2. Usuarios y Permisos
3. Planes y Suscripciones
4. Catálogo de Productos
5. (continuar según roadmap)

---

## 📞 Soporte y Contacto

**Desarrollado por:** Arquitecto de Software Senior & Diseñador UX/UI SaaS  
**Fecha:** 6 de junio de 2026  
**Versión del Módulo:** 1.0.0  
**Plataforma:** SaaS Menús Digitales Multiempresa

---

**Fin de la Documentación**
