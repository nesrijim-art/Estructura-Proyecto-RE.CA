# DOCUMENTACIÓN FUNCIONAL
# MÓDULO 02 · USUARIOS Y PERMISOS

**Plataforma:** SaaS de Menús Digitales Multiempresa  
**Fecha:** Junio 2026  
**Versión:** 1.0

---

## 1. Resumen Ejecutivo

Este módulo gestiona el control de acceso granular dentro de cada negocio registrado en la plataforma SaaS multiempresa. Permite a los dueños de negocio invitar colaboradores, asignarles roles específicos, definir qué módulos pueden ver y editar, y personalizar la identidad visual de su menú digital.

**Usuarios principales:**
- **Dueño del Negocio** — Propietario con acceso total
- **Super Administrador** — Acceso global sin estar listado en cada empresa
- **Admin** — Gestor del negocio con permisos amplios
- **Editor** — Actualiza catálogo y publicaciones
- **Visualizador** — Solo lectura

**Objetivo:**
Proveer control de acceso seguro, protección de privacidad del dueño mediante autenticación, invitación fluida de colaboradores, y herramientas de personalización visual que se propagan automáticamente a todo el menú digital.

---

## 2. Funcionalidades Principales

### 2.1. Gestión de Usuarios por Negocio

Cada negocio tiene su propio espacio de usuarios independiente. Los usuarios de un negocio **no pueden ver ni acceder** a otros negocios.

#### 2.1.1. Tabla de Usuarios

**Columnas visibles:**
- **Usuario** — Nombre completo
- **Correo** — Email de contacto
- **Rol** — Dueño, Admin, Editor, Visualizador
- **Último acceso** — Fecha y hora del último login
- **Estado** — Activo / Suspendido
- **Acciones** — Editar, Eliminar (solo Dueño y Super Admin pueden eliminar)

**Roles disponibles:**

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Dueño** | Propietario del negocio | Acceso total: usuarios, planes, identidad visual, catálogo, estadísticas, IA, marketing |
| **Admin** | Gestor del negocio | Puede gestionar usuarios y editar catálogo. **No** puede cambiar plan ni configuración de facturación |
| **Editor** | Actualiza contenido | Puede editar publicaciones del menú, actualizar productos, subir imágenes. **No** puede ver estadísticas ni usar IA |
| **Visualizador** | Solo lectura | Puede ver catálogo y menú. **Sin permisos de edición** |

#### 2.1.2. Seguridad y Privacidad

- **Autenticación obligatoria:** Todos los usuarios deben tener usuario y contraseña.
- **Segregación de datos:** Cada negocio opera en un espacio aislado (multi-tenancy por `empresa_id`).
- **Auditoría:** Registro de último acceso por usuario para soporte y seguridad.
- **Super Administrador separado:** Tiene acceso global con su propio rol, **sin estar listado** como usuario en cada empresa.

---

### 2.2. Flujo de Invitación de Colaboradores

El Dueño del negocio puede invitar colaboradores para que trabajen en su espacio.

#### 2.2.1. Proceso de Invitación

1. **El Dueño hace clic en "Invitar Colaborador"**
   - Se abre un modal con formulario de invitación

2. **Completa los campos:**
   - **Correo electrónico o WhatsApp** del colaborador
   - **Rol** a asignar (Admin, Editor, Visualizador)
   - **Método de envío** (Correo o WhatsApp)

3. **El sistema genera:**
   - **Token único de acceso** (válido por 48 horas)
   - **Enlace de registro** con el token embebido
   - **Nombre del negocio** pre-llenado

4. **El colaborador recibe:**
   - **Correo electrónico** o **mensaje de WhatsApp** con:
     - Enlace para descargar PWA (opcional)
     - Enlace de registro: `https://plataforma.com/registro-colaborador?token=ABC123`
     - Instrucciones de acceso

#### 2.2.2. Registro del Colaborador

El colaborador accede al enlace de invitación y completa el registro:

**Pantalla de registro con token:**

```
Campos del formulario:
- Nombre completo
- Token de acceso (pre-llenado desde URL, solo lectura)
- Nombre del negocio (pre-llenado, solo lectura)
- Usuario (elegir nombre de usuario único)
- Contraseña (mínimo 8 caracteres)
- Confirmar contraseña
```

**Flujo:**
1. El colaborador completa el formulario
2. El sistema valida el token
3. Si el token es válido y no ha expirado:
   - Crea el usuario
   - Lo asocia automáticamente al negocio (`empresa_id`)
   - Le asigna el rol definido por el Dueño
4. Redirige al login
5. El colaborador ingresa con su usuario y contraseña
6. Accede **solamente** al espacio de ese negocio

**Seguridad:**
- Token de un solo uso (se invalida tras registro exitoso)
- Expiración de 48 horas
- Validación de unicidad de usuario
- Asociación automática al negocio correcto

---

### 2.3. Permisos Granulares por Rol

Cada módulo de la plataforma consulta este módulo para validar permisos del usuario actual.

#### 2.3.1. Matriz de Permisos

| Módulo | Dueño | Admin | Editor | Visualizador |
|--------|-------|-------|--------|--------------|
| **Usuarios y Permisos** | ✅ Ver y editar | ✅ Ver y editar | ❌ | ❌ |
| **Identidad Visual** | ✅ Ver y editar | ✅ Ver y editar | ❌ | ❌ |
| **Catálogo de Productos** | ✅ Ver y editar | ✅ Ver y editar | ✅ Ver y editar | ✅ Solo ver |
| **Publicaciones del Menú** | ✅ Ver y editar | ✅ Ver y editar | ✅ Ver y editar | ✅ Solo ver |
| **Marketing** | ✅ Ver y editar | ✅ Ver y editar | ❌ | ❌ |
| **Estadísticas** | ✅ Ver | ✅ Ver | ❌ | ❌ |
| **IA (Generación de Contenido)** | ✅ Usar | ✅ Usar | ❌ | ❌ |
| **Planes y Suscripciones** | ✅ Ver y editar | ❌ | ❌ | ❌ |
| **Automatizaciones** | ✅ Ver y editar | ✅ Ver y editar | ❌ | ❌ |
| **Multimedia** | ✅ Ver y editar | ✅ Ver y editar | ✅ Ver y editar | ✅ Solo ver |

#### 2.3.2. Validación de Permisos

Todos los módulos realizan la validación:

```
Middleware de autenticación:
1. Usuario autenticado → verificar sesión activa
2. Obtener empresa_id del usuario
3. Obtener rol del usuario en esa empresa
4. Consultar matriz de permisos
5. Permitir o denegar acceso
```

**Ejemplo:**
- Usuario: `juan@lapizzeria.com`
- Rol: `editor`
- Empresa: `La Pizzería` (empresa_id: 5)
- Intento de acceso: `GET /api/estadisticas`
- Resultado: **❌ Acceso denegado** (Editor no puede ver estadísticas)

---

### 2.4. Submódulo: Identidad Visual del Negocio

Este submódulo permite al Dueño personalizar la apariencia visual de su menú digital.

#### 2.4.1. Funcionalidades

**1. Carga de Logotipo**
- El usuario carga el logo de su negocio (PNG, JPG, SVG, máx 2 MB)
- El sistema muestra vista previa inmediata
- El logo se almacena en CDN/storage
- Se propaga automáticamente a:
  - Menú público
  - Encabezado del catálogo
  - Correos de marketing
  - PWA (ícono de app)

**2. Análisis Automático de Colores**
- El sistema analiza la imagen del logo usando Canvas API o servicio de análisis de color
- Identifica los colores predominantes
- Genera una paleta sugerida con 6 tokens:
  - **Color Principal** — Fondo de header, destacados
  - **Color Secundario** — Texto sobre principal
  - **Color de Fondo** — Canvas del menú
  - **Color de Texto** — Texto general
  - **Color de Botones** — CTAs y acciones
  - **Color de Promociones** — Etiquetas de ofertas

**3. Edición Manual de Colores**
- Cada color tiene dos controles:
  - **Color picker** visual
  - **Input de texto** para valores hex (#RRGGBB)
- Los cambios se sincronizan en ambos controles
- Vista previa en tiempo real del menú

**4. Vista Previa en Tiempo Real**
- Simula cómo verán los clientes el menú digital
- Muestra:
  - Header con logo y colores aplicados
  - Productos de ejemplo con precios
  - Botón de acción
- Actualización instantánea al cambiar cualquier color

**5. Guardado y Propagación**
- Al guardar, la configuración se almacena en la base de datos (`empresas.identidad_visual`)
- Los cambios se propagan automáticamente a:
  - **Menú público** (vista del cliente final)
  - **Catálogo de productos** (panel de administración)
  - **Marketing** (plantillas de correo, promociones)
  - **PWA** (colores de tema, splash screen)
  - **Automatizaciones** (mensajes personalizados)

#### 2.4.2. Flujo de Personalización

```
Dueño accede a "Identidad Visual"
  ↓
Carga logotipo
  ↓
Sistema analiza imagen → extrae colores predominantes
  ↓
Muestra paleta sugerida en inputs
  ↓
Dueño ajusta manualmente los colores que desee
  ↓
Vista previa se actualiza en tiempo real
  ↓
Dueño hace clic en "Guardar Configuración"
  ↓
Sistema almacena:
  - URL del logo
  - 6 tokens de color en formato hex
  - Timestamp de última actualización
  ↓
Propagación automática a todos los módulos visuales
  ↓
Cambios visibles inmediatamente en el menú público
```

#### 2.4.3. Soporte del Super Administrador

El Super Administrador puede:
- Acceder a este submódulo de cualquier negocio
- Ajustar configuraciones visuales
- Corregir errores de configuración
- Asistir al cliente durante la personalización

---

### 2.5. Edición de Publicaciones del Menú

Cuando un usuario autorizado (Dueño, Admin, Editor) quiere editar una publicación de su menú:

#### 2.5.1. Flujo de Edición

```
Usuario hace clic en una publicación del menú
  ↓
Sistema verifica:
  - ¿Usuario autenticado?
  - ¿Tiene rol Dueño, Admin o Editor?
  - ¿La publicación pertenece a su negocio (empresa_id)?
  ↓
Si todas las validaciones pasan:
  ↓
Redirige a pantalla de edición de esa publicación
  ↓
Permite editar:
  - Foto del producto (subir nueva imagen)
  - Texto descriptivo
  - Precio
  - Categoría
  - Estado (activo/inactivo)
  ↓
Si el plan incluye IA:
  ↓
Muestra botones:
  - "Generar descripción con IA"
  - "Mejorar imagen con IA"
  ↓
Usuario guarda cambios
  ↓
Cambios se reflejan inmediatamente en el menú público
```

#### 2.5.2. Pantalla de Edición de Publicación

**Componentes:**
- **Sección de imagen:**
  - Vista previa de la imagen actual
  - Botón "Cambiar imagen"
  - Si plan incluye IA: botón "Mejorar con IA"
- **Sección de texto:**
  - Campo de nombre del producto
  - Campo de descripción (textarea)
  - Si plan incluye IA: botón "Generar descripción con IA"
- **Sección de precio:**
  - Input numérico para precio
  - Selector de moneda
- **Sección de categoría:**
  - Dropdown con categorías del negocio
- **Sección de estado:**
  - Toggle: Activo / Inactivo
- **Botones de acción:**
  - "Guardar cambios"
  - "Cancelar"

**Permisos para IA:**
- Solo planes **Profesional** y **Empresarial** pueden usar funciones de IA
- Si el plan es **Básico**, los botones de IA no se muestran
- Validación en backend antes de procesar solicitudes de IA

---

## 3. Conexiones con Otros Módulos

### 3.1. Planes y Suscripciones

El plan del negocio limita:
- **Cantidad máxima de usuarios:**
  - Básico: 1 usuario (solo Dueño)
  - Profesional: hasta 3 usuarios
  - Empresarial: ilimitado
- **Acceso a funciones de IA:**
  - Básico: sin acceso
  - Profesional: generación de texto
  - Empresarial: generación de texto + imágenes

**Validación:**
Cuando el Dueño intenta invitar un nuevo colaborador:
```
Sistema verifica:
  - ¿Cuántos usuarios tiene el negocio actualmente?
  - ¿Cuál es el límite según el plan?
  - Si límite alcanzado → mostrar mensaje:
    "Has alcanzado el límite de usuarios de tu plan.
     Actualiza a [Plan Superior] para invitar más colaboradores."
```

### 3.2. Multiempresa

El módulo Multiempresa (usado por Super Admin) permite:
- Ver la lista de usuarios de cada negocio
- Acceder como cualquier usuario (sin credenciales)
- Modificar roles desde el panel maestro

**Separación de roles:**
- Super Admin **no aparece** en la tabla de usuarios de cada empresa
- Tiene acceso con su propio rol global
- No cuenta para el límite de usuarios del plan

### 3.3. Catálogo de Productos

Todos los productos y publicaciones están asociados a `empresa_id`.

**Filtrado automático:**
```
Usuario: juan@lapizzeria.com (empresa_id: 5, rol: editor)
  ↓
GET /api/productos
  ↓
Backend filtra automáticamente:
  WHERE empresa_id = 5
  ↓
Juan solo ve productos de "La Pizzería"
```

**Permisos de edición:**
- Dueño, Admin, Editor: pueden editar
- Visualizador: solo lectura

### 3.4. Estadísticas

El módulo de Estadísticas consulta Usuarios y Permisos para verificar:
- ¿El usuario tiene rol Dueño o Admin?
- Si no → denegar acceso
- Si sí → mostrar estadísticas del negocio

**Datos visibles:**
- Productos más consultados
- Horarios de mayor actividad
- Interacciones del menú
- Tendencias de consumo

Estos datos son **exclusivos del negocio** del usuario (`empresa_id`).

### 3.5. Marketing

El módulo de Marketing usa la **Identidad Visual** para:
- Aplicar colores personalizados a correos de promoción
- Insertar logo en plantillas
- Generar mensajes con el branding del negocio

**Permisos:**
- Solo Dueño y Admin pueden crear campañas de marketing
- Editor y Visualizador no tienen acceso

### 3.6. Automatizaciones

Las automatizaciones (mensajes programados, recordatorios) usan:
- **Identidad Visual** — Colores y logo en mensajes
- **Permisos** — Solo Dueño y Admin pueden configurar automatizaciones

### 3.7. Menú Público

El menú digital que ven los clientes finales (tras escanear QR):
- **No requiere autenticación** para el cliente
- Aplica automáticamente la **Identidad Visual** del negocio:
  - Logo
  - Paleta de colores personalizada
  - Estilos de botones y promociones
- Muestra solo productos activos del negocio

---

## 4. Arquitectura de Datos

### 4.1. Modelo Conceptual

**Tablas principales:**

#### `usuarios`
```sql
usuarios {
  id: INT PRIMARY KEY
  nombre_completo: VARCHAR(255)
  email: VARCHAR(255) UNIQUE
  usuario: VARCHAR(100) UNIQUE
  password_hash: VARCHAR(255)
  created_at: TIMESTAMP
  last_login: TIMESTAMP
}
```

#### `empresa_usuarios` (relación muchos a muchos)
```sql
empresa_usuarios {
  id: INT PRIMARY KEY
  empresa_id: INT FOREIGN KEY → empresas(id)
  usuario_id: INT FOREIGN KEY → usuarios(id)
  rol: ENUM('dueno', 'admin', 'editor', 'visualizador')
  activo: BOOLEAN DEFAULT true
  created_at: TIMESTAMP
}
```

#### `empresas`
```sql
empresas {
  id: INT PRIMARY KEY
  nombre: VARCHAR(255)
  plan_id: INT FOREIGN KEY → planes(id)
  identidad_visual: JSON {
    logo_url: STRING
    colores: {
      principal: STRING
      secundario: STRING
      fondo: STRING
      texto: STRING
      botones: STRING
      promociones: STRING
    }
    updated_at: TIMESTAMP
  }
  created_at: TIMESTAMP
}
```

#### `tokens_invitacion`
```sql
tokens_invitacion {
  id: INT PRIMARY KEY
  token: VARCHAR(255) UNIQUE
  empresa_id: INT FOREIGN KEY → empresas(id)
  rol: ENUM('admin', 'editor', 'visualizador')
  contacto: VARCHAR(255) // correo o WhatsApp
  metodo: ENUM('email', 'whatsapp')
  usado: BOOLEAN DEFAULT false
  expira_at: TIMESTAMP // 48 horas desde creación
  created_at: TIMESTAMP
}
```

### 4.2. Segregación Multi-Tenancy

Cada consulta a la base de datos **debe filtrar por `empresa_id`**:

```sql
-- Ejemplo: obtener productos de un negocio
SELECT * FROM productos
WHERE empresa_id = :empresa_id_del_usuario_autenticado;

-- Ejemplo: obtener usuarios de un negocio
SELECT u.*, eu.rol, eu.activo
FROM usuarios u
JOIN empresa_usuarios eu ON u.id = eu.usuario_id
WHERE eu.empresa_id = :empresa_id
  AND eu.activo = true;
```

**Seguridad:**
- Middleware de autenticación obtiene `empresa_id` del usuario autenticado
- Todas las queries incluyen `WHERE empresa_id = :empresa_id`
- Super Admin tiene acceso sin filtro (rol global)

---

## 5. Casos de Uso Detallados

### 5.1. Caso: El Dueño Invita un Editor

**Actores:** Carlos (Dueño de "La Pizzería"), Juan (nuevo Editor)

**Flujo:**
1. Carlos inicia sesión en la plataforma
2. Navega a "Usuarios y Permisos"
3. Hace clic en "+ Invitar Colaborador"
4. Completa el formulario:
   - Contacto: `juan@gmail.com`
   - Rol: `Editor`
   - Método: `Correo Electrónico`
5. Hace clic en "Enviar Invitación"
6. El sistema:
   - Genera token único: `ABC123XYZ`
   - Crea registro en `tokens_invitacion` con `expira_at` = ahora + 48h
   - Envía correo a `juan@gmail.com` con:
     - Enlace: `https://plataforma.com/registro-colaborador?token=ABC123XYZ`
     - Instrucciones de registro
7. Juan recibe el correo y hace clic en el enlace
8. Se abre la pantalla de registro con:
   - Token: `ABC123XYZ` (pre-llenado, solo lectura)
   - Negocio: `La Pizzería` (pre-llenado, solo lectura)
9. Juan completa:
   - Nombre completo: `Juan Ramírez`
   - Usuario: `juan_ramirez`
   - Contraseña: `********`
   - Confirmar contraseña: `********`
10. Hace clic en "Registrarse"
11. El sistema:
    - Valida el token (no usado, no expirado)
    - Crea usuario en `usuarios`
    - Crea relación en `empresa_usuarios` con rol `editor`
    - Marca token como usado
    - Redirige a login
12. Juan ingresa con `juan_ramirez` y su contraseña
13. Accede al dashboard de "La Pizzería" con permisos de Editor

### 5.2. Caso: El Dueño Personaliza la Identidad Visual

**Actores:** Carlos (Dueño de "La Pizzería")

**Flujo:**
1. Carlos navega a "Usuarios y Permisos" → tab "Identidad Visual"
2. Hace clic en el área de carga de logo
3. Selecciona `logo-la-pizzeria.png` desde su computadora
4. El sistema:
   - Muestra vista previa del logo
   - Analiza la imagen con Canvas API
   - Detecta colores predominantes: rojo (#dc2626), crema (#fef3c7), negro (#0d1117)
   - Actualiza automáticamente los inputs de color con los valores detectados
5. La vista previa del menú se actualiza en tiempo real mostrando los colores aplicados
6. Carlos ajusta manualmente:
   - Color de botones: cambia de #dc2626 a #ea580c (naranja)
   - Color de promociones: mantiene #dc2626 (rojo)
7. La vista previa se actualiza instantáneamente
8. Carlos hace clic en "Guardar Configuración"
9. El sistema:
   - Almacena `logo_url` en CDN
   - Guarda los 6 tokens de color en `empresas.identidad_visual`
   - Actualiza `identidad_visual.updated_at`
10. Los cambios se propagan automáticamente:
    - El menú público ahora muestra el nuevo logo y colores
    - Las plantillas de marketing usan el nuevo branding
    - La PWA actualiza su tema y splash screen

### 5.3. Caso: Un Editor Actualiza una Publicación con IA

**Actores:** Juan (Editor), Plan: Profesional (incluye IA de texto)

**Flujo:**
1. Juan inicia sesión y accede al panel de su negocio
2. En el módulo "Catálogo de Productos" ve todas las publicaciones del menú
3. Hace clic en la publicación "Pizza Margherita"
4. El sistema verifica:
   - Usuario: Juan
   - Rol: Editor
   - Empresa: La Pizzería
   - Permisos: ✅ puede editar catálogo
5. Se abre la pantalla de edición de la publicación
6. Juan ve:
   - Imagen actual de la pizza
   - Campo de nombre: `Pizza Margherita`
   - Campo de descripción: `Salsa de tomate, mozzarella, albahaca`
   - Precio: `$12.99`
   - Botón "Generar descripción con IA" (visible porque plan es Profesional)
7. Juan hace clic en "Generar descripción con IA"
8. El sistema:
   - Verifica que el plan incluye IA
   - Envía solicitud a servicio de IA con contexto:
     - Producto: Pizza Margherita
     - Ingredientes: salsa de tomate, mozzarella, albahaca
     - Tipo de negocio: restaurante italiano
   - Recibe sugerencia: `Nuestra emblemática Margherita rinde homenaje a la tradición napolitana con salsa de tomate artesanal, mozzarella di bufala y albahaca fresca. Una explosión de sabor mediterráneo en cada bocado.`
9. La nueva descripción se muestra en el campo (Juan puede editarla si desea)
10. Juan hace clic en "Guardar cambios"
11. La publicación se actualiza inmediatamente en el menú público

### 5.4. Caso: Un Visualizador Intenta Editar (Acceso Denegado)

**Actores:** Ana (Visualizador)

**Flujo:**
1. Ana inicia sesión y accede al panel
2. Navega a "Catálogo de Productos"
3. Ve la lista de productos (solo lectura)
4. Intenta hacer clic en "Editar" sobre un producto
5. El botón no existe (el sistema lo oculta porque su rol es `visualizador`)
6. Ana intenta acceder directamente a `/productos/123/editar` modificando la URL
7. El sistema:
   - Verifica permisos
   - Rol: Visualizador
   - Matriz de permisos: ❌ no puede editar catálogo
   - Retorna error 403 Forbidden
8. Se muestra mensaje: "No tienes permisos para realizar esta acción"

---

## 6. Flujo de Navegación

```
Login
  ↓
Dashboard
  ├── Multiempresa (solo Super Admin)
  ├── Usuarios y Permisos (Dueño, Admin)
  │     ├── Tab: Usuarios
  │     │     ├── Ver lista de usuarios
  │     │     ├── Invitar colaborador → Modal de invitación → Envío de token
  │     │     ├── Editar usuario → Modal de edición de rol
  │     │     └── Eliminar usuario → Confirmación
  │     └── Tab: Identidad Visual
  │           ├── Carga de logo
  │           ├── Análisis automático de colores
  │           ├── Edición manual de paleta
  │           ├── Vista previa en tiempo real
  │           └── Guardar configuración → Propagación automática
  ├── Planes (solo Dueño)
  ├── Catálogo (Dueño, Admin, Editor, Visualizador)
  │     ├── Ver lista de productos
  │     ├── Editar publicación (Dueño, Admin, Editor)
  │     │     ├── Cambiar imagen
  │     │     ├── Editar texto
  │     │     ├── Generar con IA (si plan incluye)
  │     │     └── Guardar cambios
  │     └── Ver producto (Visualizador)
  ├── Estadísticas (Dueño, Admin)
  ├── Marketing (Dueño, Admin)
  ├── IA (Dueño, Admin)
  └── Perfil (todos)
```

---

## 7. Responsive y Adaptabilidad

### 7.1. Breakpoints

- **Desktop (1280px+):** Sidebar fijo + tabla completa + vista previa lado a lado
- **Tablet (768-1279px):** Sidebar fijo + tabla con scroll + vista previa debajo
- **Mobile (<768px):** Sidebar oculto (menú hamburguesa) + tabla scroll horizontal + vista previa en columna única

### 7.2. Touch Optimization

- Botones con área táctil mínima de 44px
- Modales ocupan 90% del ancho en móvil
- Color pickers táctiles nativos en mobile
- Upload de logo con tap directo (sin hover)

---

## 8. Seguridad y Permisos

### 8.1. Control de Acceso

- **Autenticación:** Requerida en todos los endpoints privados
- **Autorización:** Middleware verifica rol antes de cada acción
- **Segregación:** Filtro automático por `empresa_id` en todas las consultas
- **Auditoría:** Registro de `last_login` y acciones críticas (cambio de rol, eliminación de usuarios)

### 8.2. Protección de Datos

- **Contraseñas:** Hash con bcrypt (cost 12)
- **Tokens:** Generados con `crypto.randomBytes(32).toString('hex')`, expiración 48h
- **Sesiones:** JWT con refresh token, expiración 7 días
- **HTTPS:** Obligatorio en producción

### 8.3. Validaciones

- **Formato de correo:** Regex estándar
- **Unicidad de usuario:** Validación en base de datos antes de crear
- **Token de invitación:** Validar que no esté usado ni expirado
- **Roles válidos:** Enum estricto (`dueno`, `admin`, `editor`, `visualizador`)

---

## 9. Mejoras Futuras

### Fase 2
- **Autenticación de dos factores (2FA)** para Dueños y Admins
- **Logs de auditoría detallados** con timeline visual
- **Notificaciones push** cuando un colaborador accede por primera vez
- **Gestión de sesiones activas** con posibilidad de cerrar sesiones remotas

### Fase 3
- **Integración con Slack/Teams** para notificaciones de invitación
- **Plantillas de mensajes** personalizables para invitaciones
- **Análisis de colores con IA** más avanzado (extracción de paletas completas, sugerencias de armonía cromática)
- **Versionado de identidad visual** para permitir rollback

---

## 10. Checklist de Implementación Backend

### Desarrollo
- [ ] Crear tablas: `usuarios`, `empresa_usuarios`, `tokens_invitacion`
- [ ] Implementar middleware de autenticación (JWT)
- [ ] Implementar middleware de autorización (verificación de rol)
- [ ] Crear endpoint `POST /api/usuarios/invitar` (genera token, envía correo/WhatsApp)
- [ ] Crear endpoint `POST /api/usuarios/registro-colaborador` (valida token, crea usuario)
- [ ] Crear endpoint `GET /api/usuarios` (lista usuarios del negocio)
- [ ] Crear endpoint `PUT /api/usuarios/:id/rol` (cambia rol, solo Dueño/Admin)
- [ ] Crear endpoint `DELETE /api/usuarios/:id` (elimina usuario, solo Dueño)
- [ ] Crear endpoint `PUT /api/empresas/:id/identidad-visual` (guarda logo + colores)
- [ ] Crear endpoint `GET /api/empresas/:id/identidad-visual` (obtiene configuración)
- [ ] Implementar servicio de análisis de colores (Canvas API / servicio externo)
- [ ] Implementar propagación de identidad visual a todos los módulos

### Testing
- [ ] Test de invitación de colaborador (token generado correctamente)
- [ ] Test de registro con token válido
- [ ] Test de registro con token expirado (debe fallar)
- [ ] Test de registro con token usado (debe fallar)
- [ ] Test de validación de permisos por rol
- [ ] Test de segregación de datos (usuario no ve datos de otra empresa)
- [ ] Test de carga y análisis de logo
- [ ] Test de guardado de paleta de colores
- [ ] Test de propagación de identidad visual

### Despliegue
- [ ] Configurar storage para logos (S3, Cloudinary, etc.)
- [ ] Configurar servicio de envío de correos (SendGrid, AWS SES, etc.)
- [ ] Configurar servicio de envío de WhatsApp (Twilio, Meta Business API, etc.)
- [ ] Configurar variables de entorno para tokens JWT
- [ ] Configurar HTTPS obligatorio
- [ ] Configurar rate limiting en endpoints de invitación (prevenir spam)

---

## 11. Conclusión

El **Módulo de Usuarios y Permisos** es la piedra angular de la seguridad y control de acceso de la plataforma SaaS multiempresa.

**Beneficios clave:**
✅ **Protección de privacidad** — Cada negocio es un espacio aislado  
✅ **Invitación fluida** — Colaboradores registrados en 3 pasos  
✅ **Permisos granulares** — Control preciso de lo que cada rol puede hacer  
✅ **Identidad visual personalizada** — Branding automático en todo el menú  
✅ **Escalabilidad** — Preparado para miles de negocios sin interferencia  

Este módulo está **100% diseñado funcionalmente** y listo para ser implementado por el equipo de desarrollo backend.
