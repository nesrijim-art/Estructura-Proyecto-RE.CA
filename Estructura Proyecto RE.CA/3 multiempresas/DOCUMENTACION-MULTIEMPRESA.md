# MÓDULO 01 · MULTIEMPRESA

**Documento Funcional de Diseño UX/UI**

Plataforma SaaS de Menús Digitales para Restaurantes

---

## 1. RESUMEN EJECUTIVO

### 1.1 Propósito del Módulo

El módulo **Multiempresa** es el panel maestro de administración de la plataforma SaaS de menús digitales. Su función principal es permitir al **Super Administrador** gestionar todos los negocios registrados desde un único lugar centralizado, ofreciendo capacidades de:

- Supervisión general de todos los negocios activos
- Gestión de planes y suscripciones
- Acceso administrativo a cualquier negocio
- Seguimiento de renovaciones y vencimientos
- Soporte operativo directo
- Análisis de uso y estadísticas

### 1.2 Usuarios del Módulo

**Exclusivamente:** Super Administrador de la plataforma

**No utilizan este módulo:**
- Administradores de negocio (ven solo su empresa)
- Colaboradores (acceso limitado a su negocio)
- Clientes finales (consultan el menú vía QR)

---

## 2. FUNCIONALIDADES PRINCIPALES

### 2.1 Gestión Centralizada de Negocios

#### 2.1.1 Tabla Maestra

Vista unificada de todos los negocios registrados con columnas:

| Campo | Descripción | Tipo de Dato |
|-------|-------------|--------------|
| **Negocio** | Nombre comercial | Texto (bold) |
| **Ciudad** | Ubicación geográfica | Texto |
| **Plan** | Plan actual contratado | Badge (Básico / Profesional / Empresarial) |
| **Estado** | Estado de la cuenta | Badge (Activo / Suspendido / Prueba) |
| **Activación** | Fecha de inicio del servicio | Fecha (DD/MM/YYYY) |
| **Renovación** | Fecha de próxima renovación | Fecha (DD/MM/YYYY) |
| **Tiempo Restante** | Contador regresivo | Días / Horas / Minutos |
| **Acciones** | Botones de acción rápida | Iconos interactivos |

#### 2.1.2 Estados del Negocio

**Activo** (Badge verde con punto)
- El plan está vigente
- Todos los módulos funcionan
- Menú visible para clientes

**En Prueba** (Badge amarillo con punto)
- Período de prueba gratuito
- Acceso limitado por tiempo
- Requiere seguimiento comercial

**Suspendido** (Badge rojo con punto)
- Plan vencido sin renovación
- Menú no visible
- Requiere atención inmediata

#### 2.1.3 Planes Disponibles

**Básico** (Badge azul)
- Menú digital básico
- Hasta 50 productos
- 1 idioma
- Sin IA generativa

**Profesional** (Badge rosa)
- Menú avanzado
- Productos ilimitados
- 3 idiomas
- IA generativa incluida
- Estadísticas avanzadas

**Empresarial** (Badge morado)
- Multi-sucursal
- Productos ilimitados
- Idiomas ilimitados
- IA generativa premium
- Automatizaciones
- Soporte prioritario

### 2.2 Contador Regresivo de Renovación

Cada negocio muestra en tiempo real:

```
[45] días  [12] hrs  [34] min
```

**Código de colores:**
- **Negro** → Más de 30 días restantes (normal)
- **Naranja** → Entre 7 y 30 días (advertencia)
- **Rojo** → Menos de 7 días (crítico)

**Actualización:** Cada minuto mediante JavaScript

**Objetivo:** Identificar visualmente negocios próximos a vencer para realizar seguimiento comercial proactivo.

---

## 3. PANELES Y COMPONENTES

### 3.1 Panel de Estadísticas Generales

Cuatro tarjetas superiores con métricas clave:

#### Tarjeta 1: Total de Negocios
- **Valor:** Número total de empresas registradas
- **Tendencia:** Crecimiento porcentual mensual
- **Ejemplo:** `47 | +12% este mes`

#### Tarjeta 2: Activos
- **Valor:** Negocios con estado "Activo"
- **Porcentaje:** Del total de negocios
- **Ejemplo:** `42 | 89% del total`

#### Tarjeta 3: En Prueba
- **Valor:** Negocios en período de prueba
- **Alerta:** Próximos a vencer (texto naranja)
- **Ejemplo:** `3 | Próximos a vencer`

#### Tarjeta 4: Suspendidos
- **Valor:** Negocios suspendidos
- **Alerta:** Requieren atención (texto rojo)
- **Ejemplo:** `2 | Requieren atención`

### 3.2 Panel de Filtros

Sistema de filtrado múltiple para localizar negocios:

**Filtro 1: Por Plan**
- Dropdown con opciones:
  - Todos los planes
  - Básico
  - Profesional
  - Empresarial

**Filtro 2: Por Estado**
- Dropdown con opciones:
  - Todos los estados
  - Activo
  - Prueba
  - Suspendido

**Filtro 3: Búsqueda por Texto**
- Input libre
- Busca en: Nombre del negocio, Ciudad
- Filtrado en tiempo real (oninput)

**Botón: Limpiar Filtros**
- Resetea todos los filtros
- Muestra tabla completa

### 3.3 Botones de Acción Rápida (por negocio)

Cada fila de la tabla incluye tres botones icónicos:

#### Botón 1: Acceder como Negocio
**Icono:** → (flecha de entrada)  
**Función:** Abrir modal de acceso administrativo  
**Descripción:** Permite al Super Admin ingresar al panel del negocio sin solicitar credenciales

#### Botón 2: Cambiar Plan
**Icono:** ⏱ (reloj)  
**Función:** Abrir modal de cambio de plan  
**Descripción:** Modificar el plan contratado y actualizar permisos automáticamente

#### Botón 3: Ver Estadísticas
**Icono:** 📊 (gráfico de barras)  
**Función:** Redirigir a panel de estadísticas del negocio  
**Descripción:** Consultar métricas de uso, productos más vistos, horarios de actividad

---

## 4. MODALES Y FLUJOS

### 4.1 Modal: Acceder como Negocio

**Disparador:** Click en botón "→" de la tabla

**Contenido del Modal:**

```
┌─────────────────────────────────────────┐
│ Acceder como Negocio              [X]   │
├─────────────────────────────────────────┤
│                                         │
│ Negocio:     La Piazza Restaurant       │
│ Plan Actual: Profesional                │
│ Estado:      Activo                     │
│ Propietario: Juan Pérez                 │
│                                         │
│ ⓘ Vas a acceder al panel de este       │
│   negocio con todos sus permisos y      │
│   módulos. Podrás realizar cambios y    │
│   brindar soporte directo.              │
│                                         │
├─────────────────────────────────────────┤
│         [Cancelar]  [Acceder al Negocio]│
└─────────────────────────────────────────┘
```

**Flujo de Acceso:**

1. Super Admin hace click en "Acceder al Negocio"
2. Sistema crea sesión temporal con privilegios del negocio
3. Redirige a `dashboard.html?business_id=X&admin_access=true`
4. Super Admin ve la plataforma exactamente como la ve el propietario
5. Puede editar productos, publicaciones, configuración
6. Banner superior indica "Sesión administrativa activa"
7. Botón "Salir del Negocio" vuelve al panel Multiempresa

**Casos de Uso:**
- Soporte técnico directo
- Corrección de contenido
- Carga de productos por solicitud
- Actualización de imágenes
- Configuración inicial del negocio
- Capacitación en vivo

### 4.2 Modal: Cambiar Plan

**Disparador:** Click en botón "⏱" de la tabla

**Contenido del Modal:**

```
┌─────────────────────────────────────────┐
│ Cambiar Plan                      [X]   │
├─────────────────────────────────────────┤
│                                         │
│ Negocio:       Café del Centro          │
│ Plan Actual:   Básico                   │
│                                         │
│ NUEVO PLAN                              │
│ ┌─────────────────────────────────┐     │
│ │ [Seleccionar plan...        ▼] │     │
│ └─────────────────────────────────┘     │
│   - Básico                              │
│   - Profesional                         │
│   - Empresarial                         │
│                                         │
│ ⓘ Al cambiar el plan, los módulos y    │
│   permisos se actualizarán              │
│   automáticamente. No se requiere       │
│   intervención técnica.                 │
│                                         │
├─────────────────────────────────────────┤
│         [Cancelar]    [Actualizar Plan] │
└─────────────────────────────────────────┘
```

**Flujo de Cambio de Plan:**

1. Super Admin selecciona nuevo plan del dropdown
2. Click en "Actualizar Plan"
3. Sistema ejecuta:
   - Actualiza campo `plan` en tabla `empresas`
   - Recalcula permisos según matriz plan-módulo
   - Habilita/deshabilita módulos correspondientes
   - Registra cambio en log de auditoría
4. Mensaje de confirmación: "Plan actualizado exitosamente"
5. Tabla se actualiza reflejando el nuevo plan

**Matriz de Permisos por Plan:**

| Módulo | Básico | Profesional | Empresarial |
|--------|--------|-------------|-------------|
| Catálogo de Productos | 50 productos | Ilimitado | Ilimitado |
| Multimedia | 10 imágenes | 100 imágenes | Ilimitado |
| Idiomas | 1 idioma | 3 idiomas | Ilimitado |
| IA Generativa | ❌ | ✅ | ✅ Premium |
| Estadísticas | Básicas | Avanzadas | Completas |
| Marketing | ❌ | ✅ | ✅ |
| Automatizaciones | ❌ | ❌ | ✅ |
| Multi-sucursal | ❌ | ❌ | ✅ |

### 4.3 Modal: Crear Nuevo Negocio

**Disparador:** Click en botón "+ Nuevo Negocio" del header

**Contenido del Modal:**

```
┌─────────────────────────────────────────┐
│ Crear Nuevo Negocio               [X]   │
├─────────────────────────────────────────┤
│                                         │
│ NOMBRE DEL NEGOCIO *                    │
│ ┌─────────────────────────────────┐     │
│ │ [La Piazza Restaurant        ] │     │
│ └─────────────────────────────────┘     │
│                                         │
│ CIUDAD *                                │
│ ┌─────────────────────────────────┐     │
│ │ [Puerto Ordaz                ] │     │
│ └─────────────────────────────────┘     │
│                                         │
│ PLAN INICIAL *                          │
│ ┌─────────────────────────────────┐     │
│ │ [Seleccionar plan...        ▼] │     │
│ └─────────────────────────────────┘     │
│                                         │
│ PROPIETARIO *                           │
│ ┌─────────────────────────────────┐     │
│ │ [Nombre completo             ] │     │
│ └─────────────────────────────────┘     │
│                                         │
│ CORREO ELECTRÓNICO *                    │
│ ┌─────────────────────────────────┐     │
│ │ [correo@ejemplo.com          ] │     │
│ └─────────────────────────────────┘     │
│                                         │
│ CONTRASEÑA TEMPORAL *                   │
│ ┌─────────────────────────────────┐     │
│ │ [••••••••                    ] │     │
│ └─────────────────────────────────┘     │
│                                         │
├─────────────────────────────────────────┤
│            [Cancelar]    [Crear Negocio]│
└─────────────────────────────────────────┘
```

**Flujo de Creación:**

1. Super Admin completa formulario
2. Click en "Crear Negocio"
3. Sistema ejecuta:
   - Crea registro en tabla `empresas`
   - Crea usuario propietario en tabla `usuarios` con rol `admin_negocio`
   - Asigna plan inicial
   - Genera espacio de catálogo vacío
   - Envía correo de bienvenida con credenciales
   - Configura fecha de activación y renovación
4. Confirmación: "Negocio creado exitosamente"
5. Tabla se actualiza mostrando el nuevo negocio

---

## 5. SEGUIMIENTO DE RENOVACIONES

### 5.1 Indicadores Visuales

El sistema utiliza tres niveles de alerta visual:

**Normal (texto negro)**
- Más de 30 días para renovación
- No requiere acción inmediata

**Advertencia (texto naranja)**
- Entre 7 y 30 días para renovación
- Requiere contacto comercial preventivo

**Crítico (texto rojo)**
- Menos de 7 días para renovación
- Requiere acción urgente

### 5.2 Filtros para Gestión Comercial

El Super Admin puede:

1. **Filtrar por estado "Prueba"** → Identificar negocios en período de prueba gratuito
2. **Ordenar por "Renovación"** → Ver primero los más próximos a vencer
3. **Filtrar por plan** → Priorizar seguimiento según valor del cliente

### 5.3 Mensajes de Seguimiento

El sistema facilita la generación de mensajes personalizados:

**Plantilla Automática:**

```
Hola [Propietario],

Tu plan [Plan Actual] para [Nombre del Negocio] 
vence el [Fecha de Renovación] ([X] días restantes).

Para renovar tu suscripción y seguir disfrutando de:
- [Módulos del plan]
- [Beneficios del plan]

Contáctanos al [Teléfono] o responde este correo.

¡Gracias por confiar en MenuDigital!
```

---

## 6. ESTADO GENERAL DEL NEGOCIO

### 6.1 Indicadores Rápidos (futuro)

En versiones posteriores, cada negocio mostrará:

**Menú Activo/Inactivo**
- Estado del QR público
- Visibilidad del catálogo

**Cantidad de Productos**
- Total de productos cargados
- Porcentaje de capacidad según plan

**Última Actividad**
- Fecha del último cambio
- Tipo de actividad (edición, carga de imagen, etc.)

**Uso de IA**
- Cantidad de generaciones del mes
- Créditos restantes

**Estado de Configuración**
- Porcentaje de completitud del perfil
- Campos faltantes

### 6.2 Soporte Operativo Directo

Mediante la función "Acceder como Negocio", el Super Admin puede:

✅ **Crear contenido**
- Cargar productos
- Crear categorías
- Subir imágenes

✅ **Editar contenido**
- Corregir descripciones
- Actualizar precios
- Reorganizar menú

✅ **Configurar**
- Ajustar idiomas
- Personalizar marca
- Configurar horarios

✅ **Brindar soporte**
- Resolver problemas técnicos
- Capacitar al propietario
- Responder dudas en vivo

---

## 7. CONEXIONES CON OTROS MÓDULOS

### 7.1 Planes y Suscripciones

**Al crear un negocio:**
- Sistema asigna automáticamente el plan seleccionado
- Habilita módulos según matriz de permisos
- Configura límites de uso (productos, imágenes, idiomas)
- Genera fecha de renovación

**Al cambiar un plan:**
- Actualiza permisos en tiempo real
- Habilita/deshabilita módulos
- No requiere reinstalación
- No pierde configuración existente

### 7.2 Usuarios y Permisos

**Gestión de accesos:**
- Propietario del negocio (rol: `admin_negocio`)
- Colaboradores autorizados (rol: `colaborador`)
- Super Admin (acceso temporal vía modal)

**Matriz de roles:**

| Acción | Super Admin | Admin Negocio | Colaborador |
|--------|-------------|---------------|-------------|
| Ver todos los negocios | ✅ | ❌ | ❌ |
| Acceder a cualquier negocio | ✅ | Solo el suyo | Solo el suyo |
| Cambiar planes | ✅ | ❌ | ❌ |
| Crear negocios | ✅ | ❌ | ❌ |
| Editar productos | ✅ (vía acceso) | ✅ | Según permisos |

### 7.3 Catálogo de Productos

**Espacio independiente por empresa:**

Cada negocio creado recibe automáticamente:
- Tabla de productos con `empresa_id`
- Tabla de categorías con `empresa_id`
- Tabla de imágenes con `empresa_id`

**Segregación de datos:**
- Un negocio NO puede ver productos de otro
- Búsquedas y filtros limitados por `empresa_id`
- QR único por empresa

### 7.4 Estadísticas

**Acceso desde Multiempresa:**

El botón "Ver Estadísticas" (📊) redirige a:

`estadisticas.html?business_id=X`

**Datos mostrados:**

**Productos más consultados**
- Top 10 con número de vistas
- Porcentaje del total

**Productos más visualizados**
- Tiempo promedio de visualización
- Tasa de clics

**Horarios de mayor actividad**
- Gráfico de barras por hora
- Día de la semana

**Interacciones del menú**
- Total de escaneos QR
- Dispositivos únicos
- Ubicaciones geográficas

**Tendencias de consumo**
- Categorías más vistas
- Patrones estacionales

**Objetivo comercial:**

Estas estadísticas permiten al Super Admin:
- Ofrecer servicios de **asesoría comercial**
- Identificar oportunidades de **upselling**
- Proveer **recomendaciones estratégicas**
- Acompañar el **crecimiento del negocio**

---

## 8. ARQUITECTURA DE DATOS

### 8.1 Modelo de Datos (Conceptual)

**Tabla: `empresas`**

```sql
id                INT PRIMARY KEY AUTO_INCREMENT
nombre            VARCHAR(255) NOT NULL
ciudad            VARCHAR(100)
plan              ENUM('basico', 'profesional', 'empresarial')
estado            ENUM('activo', 'prueba', 'suspendido')
fecha_activacion  DATE
fecha_renovacion  DATE
propietario_id    INT (FK → usuarios.id)
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

**Tabla: `usuarios`**

```sql
id                INT PRIMARY KEY AUTO_INCREMENT
nombre_completo   VARCHAR(255)
email             VARCHAR(255) UNIQUE
password          VARCHAR(255) HASHED
rol               ENUM('super_admin', 'admin_negocio', 'colaborador')
empresa_id        INT (FK → empresas.id, NULL para super_admin)
created_at        TIMESTAMP
last_login        TIMESTAMP
```

**Tabla: `productos`**

```sql
id                INT PRIMARY KEY AUTO_INCREMENT
empresa_id        INT (FK → empresas.id) NOT NULL
nombre            VARCHAR(255)
descripcion       TEXT
precio            DECIMAL(10,2)
categoria_id      INT
imagen_url        VARCHAR(500)
activo            BOOLEAN
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

### 8.2 Segregación Multi-tenant

**Principio fundamental:**

Todos los datos de contenido están segregados por `empresa_id`:

- Productos
- Categorías
- Imágenes
- Idiomas
- Configuración

**Consultas siempre incluyen:**

```sql
WHERE empresa_id = [empresa_actual]
```

**Excepciones (solo Super Admin):**

```sql
-- Ver todos los negocios
SELECT * FROM empresas;

-- Ver estadísticas globales
SELECT COUNT(*) FROM empresas WHERE estado = 'activo';
```

---

## 9. CASOS DE USO DETALLADOS

### Caso de Uso 1: Renovación Proactiva

**Actor:** Super Administrador  
**Objetivo:** Contactar negocios próximos a vencer para renovar suscripción

**Flujo:**

1. Super Admin ingresa a panel Multiempresa
2. Observa tarjeta "En Prueba: 3 | Próximos a vencer" (naranja)
3. Aplica filtro "Estado: Prueba"
4. Tabla muestra solo 3 negocios en período de prueba
5. Identifica "Hamburguesas Express" con contador 8 días / 5 hrs / 23 min (naranja)
6. Click en botón "📊 Ver Estadísticas"
7. Consulta productos más vistos: "Hamburguesa Clásica" 234 vistas
8. Redacta correo personalizado:

   ```
   Hola Carlos,

   Tu período de prueba vence en 8 días. Hemos notado 
   que "Hamburguesa Clásica" ha recibido 234 consultas 
   este mes, ¡excelente aceptación!

   Con el plan Profesional podrás:
   - Agregar productos ilimitados
   - Ver estadísticas completas por producto
   - Usar IA para mejorar descripciones

   ¿Conversamos sobre cómo seguir creciendo?
   ```

9. Envía correo
10. Marca seguimiento en CRM externo

**Resultado:** Aumento de tasa de conversión de prueba a pago

### Caso de Uso 2: Soporte Técnico Directo

**Actor:** Super Administrador  
**Objetivo:** Ayudar a un cliente que no puede subir imágenes

**Flujo:**

1. Cliente escribe: "No puedo cargar la foto de mi pizza nueva"
2. Super Admin ingresa a Multiempresa
3. Busca "Pizzería Napolitana" en filtro de búsqueda
4. Click en botón "→ Acceder como Negocio"
5. Modal muestra datos del negocio
6. Click en "Acceder al Negocio"
7. Sistema redirige a dashboard del cliente
8. Banner superior indica: "⚠️ Sesión administrativa activa"
9. Super Admin navega a "Catálogo de Productos"
10. Click en "Agregar Producto"
11. Completa formulario con datos de la pizza
12. Carga imagen desde su computadora
13. Guarda producto exitosamente
14. Verifica que aparece en el menú
15. Click en "Salir del Negocio"
16. Regresa a panel Multiempresa
17. Informa al cliente: "Listo, cargué la pizza. Ya puedes verla en tu menú."

**Resultado:** Problema resuelto en minutos, sin necesidad de solicitar credenciales

### Caso de Uso 3: Upgrade de Plan

**Actor:** Super Administrador  
**Objetivo:** Actualizar plan de un cliente que creció

**Flujo:**

1. Cliente solicita: "Necesito agregar más de 50 productos, mi plan Básico ya no alcanza"
2. Super Admin ingresa a Multiempresa
3. Busca el negocio en la tabla
4. Verifica estado: Activo | Plan: Básico
5. Click en botón "⏱ Cambiar Plan"
6. Modal muestra:
   - Negocio: Café del Centro
   - Plan Actual: Básico
7. Selecciona del dropdown: "Profesional"
8. Click en "Actualizar Plan"
9. Sistema ejecuta:
   - Actualiza `empresas.plan = 'profesional'`
   - Recalcula límites: productos ilimitados
   - Habilita módulo IA Generativa
   - Habilita módulo Estadísticas Avanzadas
10. Mensaje: "Plan actualizado exitosamente"
11. Tabla refleja nuevo badge "Profesional" (rosa)
12. Informa al cliente: "Listo, ahora tienes productos ilimitados y acceso a IA. Pruébalo."

**Resultado:** Upgrade instantáneo sin intervención técnica

### Caso de Uso 4: Auditoría de Negocios Suspendidos

**Actor:** Super Administrador  
**Objetivo:** Identificar y contactar negocios con planes vencidos

**Flujo:**

1. Super Admin ingresa a Multiempresa
2. Observa tarjeta "Suspendidos: 2 | Requieren atención" (rojo)
3. Aplica filtro "Estado: Suspendido"
4. Tabla muestra 2 negocios:
   - Panadería Artesanal | Plan: Básico | Renovación: 05/05/2026 (vencido hace 33 días)
   - Otro negocio
5. Click en botón "📊 Ver Estadísticas" de Panadería Artesanal
6. Consulta última actividad: 01/05/2026
7. Identifica que el negocio no ha ingresado desde el vencimiento
8. Redacta correo:

   ```
   Hola Luis,

   Tu plan venció el 05/05/2026 y tu menú ya no está 
   visible para tus clientes. 

   Para reactivarlo solo necesitas renovar tu suscripción.

   ¿Te gustaría que conversemos sobre cómo retomar?
   ```

9. Envía correo
10. Espera respuesta del cliente
11. Si renueva: cambia estado a "Activo" y actualiza fecha de renovación
12. Si no responde: después de 60 días, ofrece plan de reactivación

**Resultado:** Recuperación de clientes inactivos

---

## 10. FLUJO DE NAVEGACIÓN

### Diagrama de Flujo

```
[Dashboard Super Admin]
         ↓
   Click en sidebar
   "Multiempresa"
         ↓
[Panel Multiempresa]
         │
         ├─→ [Filtrar por Plan] → Tabla filtrada
         ├─→ [Filtrar por Estado] → Tabla filtrada
         ├─→ [Buscar negocio] → Tabla filtrada
         ├─→ [Limpiar filtros] → Tabla completa
         │
         ├─→ Click "→ Acceder como Negocio"
         │         ↓
         │   [Modal: Acceder]
         │         ↓
         │   Click "Acceder al Negocio"
         │         ↓
         │   [Dashboard del Negocio]
         │   (con banner de sesión admin)
         │         ↓
         │   Click "Salir del Negocio"
         │         ↓
         │   [Panel Multiempresa]
         │
         ├─→ Click "⏱ Cambiar Plan"
         │         ↓
         │   [Modal: Cambiar Plan]
         │         ↓
         │   Selecciona nuevo plan
         │         ↓
         │   Click "Actualizar Plan"
         │         ↓
         │   Sistema actualiza permisos
         │         ↓
         │   [Panel Multiempresa]
         │   (tabla actualizada)
         │
         └─→ Click "📊 Ver Estadísticas"
                   ↓
            [Panel de Estadísticas]
            (del negocio seleccionado)
```

---

## 11. RESPONSIVE Y ADAPTABILIDAD

### 11.1 Breakpoints

**Desktop (1280px+)**
- Sidebar fijo 280px
- Tabla completa con todas las columnas
- Stats en grid 4 columnas

**Tablet (768px - 1279px)**
- Sidebar fijo 280px
- Tabla con scroll horizontal si es necesario
- Stats en grid 2 columnas

**Mobile (< 768px)**
- Sidebar oculto (menú hamburguesa)
- Tabla con scroll horizontal
- Stats en columna única
- Filtros en columna única

### 11.2 Touch Optimization

- Botones de acción mínimo 44px de altura
- Espaciado generoso entre elementos táctiles
- Modales ocupan 90% del ancho en móvil

---

## 12. SEGURIDAD Y PERMISOS

### 12.1 Control de Acceso

**Solo Super Admin puede:**
- Ver la ruta `/multiempresa`
- Listar todos los negocios
- Acceder a cualquier negocio
- Cambiar planes
- Crear negocios

**Admin de Negocio NO puede:**
- Ver otros negocios
- Acceder a panel Multiempresa
- Cambiar su propio plan

**Implementación Backend:**

```javascript
// Middleware de autenticación
if (req.path === '/multiempresa' && user.rol !== 'super_admin') {
  return res.status(403).json({ error: 'Acceso denegado' });
}
```

### 12.2 Auditoría

Todas las acciones del Super Admin se registran:

**Tabla: `audit_log`**

```sql
id                INT PRIMARY KEY AUTO_INCREMENT
usuario_id        INT (FK → usuarios.id)
accion            VARCHAR(100) -- 'cambio_plan', 'acceso_negocio', 'creacion_negocio'
empresa_id        INT (FK → empresas.id)
detalles          JSON
timestamp         TIMESTAMP
```

**Ejemplo de registro:**

```json
{
  "accion": "cambio_plan",
  "empresa_id": 5,
  "plan_anterior": "basico",
  "plan_nuevo": "profesional",
  "usuario_id": 1,
  "timestamp": "2026-06-07 14:23:45"
}
```

---

## 13. MEJORAS FUTURAS

### 13.1 Fase 2

- **Exportación de datos** (Excel, CSV)
- **Gráficos de crecimiento** por plan
- **Recordatorios automáticos** de renovación
- **Integración con CRM** externo
- **Facturación automática**

### 13.2 Fase 3

- **Dashboard de métricas agregadas** (ingresos, churn, LTV)
- **Análisis predictivo** de cancelaciones
- **Segmentación avanzada** de clientes
- **Campañas de email** masivas
- **Soporte por chat** integrado

---

## 14. CHECKLIST DE IMPLEMENTACIÓN BACKEND

### 14.1 Desarrollo

- [ ] Crear tabla `empresas`
- [ ] Crear tabla `usuarios`
- [ ] Crear tabla `productos`
- [ ] Crear tabla `audit_log`
- [ ] Implementar middleware de autenticación
- [ ] Crear endpoint `GET /api/empresas` (solo super_admin)
- [ ] Crear endpoint `POST /api/empresas` (crear negocio)
- [ ] Crear endpoint `PUT /api/empresas/:id/plan` (cambiar plan)
- [ ] Crear endpoint `POST /api/auth/access-as/:empresa_id` (sesión temporal)
- [ ] Implementar lógica de recalculo de permisos por plan
- [ ] Configurar envío de correos de bienvenida
- [ ] Configurar sistema de alertas de vencimiento

### 14.2 Testing

- [ ] Probar creación de negocio
- [ ] Probar cambio de plan
- [ ] Probar acceso como negocio
- [ ] Verificar segregación de datos multi-tenant
- [ ] Probar filtros de tabla
- [ ] Validar contador regresivo
- [ ] Probar flujo completo de renovación

### 14.3 Despliegue

- [ ] Configurar variables de entorno
- [ ] Migrar base de datos
- [ ] Seed de usuario super_admin inicial
- [ ] Configurar SMTP para correos
- [ ] Configurar logs de auditoría
- [ ] Documentar API endpoints

---

## 15. CONCLUSIÓN

El **Módulo Multiempresa** es el núcleo administrativo de la plataforma SaaS de menús digitales. Provee al Super Administrador una vista unificada, herramientas de gestión eficientes y capacidad de soporte directo sin fricciones.

**Beneficios clave:**

✅ **Visibilidad total** de todos los negocios  
✅ **Gestión ágil** de planes y renovaciones  
✅ **Soporte sin barreras** mediante acceso directo  
✅ **Automatización** de permisos por plan  
✅ **Base para crecimiento** comercial basado en datos

El módulo está diseñado para escalar con la plataforma, soportando desde 10 hasta 10,000+ negocios sin degradación de rendimiento.

---

**Documento creado:** Junio 2026  
**Versión:** 1.0  
**Autor:** Sistema de Diseño UX/UI  
**Estado:** Listo para implementación backend
