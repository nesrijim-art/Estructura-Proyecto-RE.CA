# MÓDULO 03 · PLANES Y SUSCRIPCIONES

**Plataforma SaaS Multiempresa de Menús Digitales**  
**Versión:** 1.0  
**Fecha:** 07 junio 2026

---

## 1. RESUMEN EJECUTIVO

### 1.1 Propósito del Módulo

El módulo **Planes y Suscripciones** es el **centro de control de funcionalidades** de la plataforma SaaS. Su responsabilidad principal es:

- **Determinar qué funcionalidades están disponibles** para cada negocio según el plan contratado
- **Habilitar, limitar u ocultar características** de forma automática
- **Gestionar suscripciones, renovaciones y pagos**
- **Controlar Feature Flags** (banderas de funcionalidades) sin intervención técnica
- **Facilitar upgrades y downgrades** manteniendo la integridad de los datos

Este módulo actúa como **fuente de verdad** para todos los demás módulos de la plataforma. Antes de mostrar una funcionalidad, cada módulo consulta este sistema para verificar si el plan del negocio lo permite.

### 1.2 Usuarios Principales

#### Super Administrador
- **Acceso completo** a gestión de planes
- Puede crear, modificar, activar y suspender planes
- Puede cambiar el plan de cualquier negocio
- Consulta historial de pagos y renovaciones global
- Gestiona precios, beneficios y feature flags

#### Dueño del Negocio
- **Acceso de solo lectura** a su plan actual
- Consulta beneficios incluidos, fecha de vencimiento y próxima renovación
- Compara planes disponibles
- Solicita actualización de plan
- Consulta historial de pagos propio

---

## 2. FUNCIONALIDADES PRINCIPALES

### 2.1 Resumen del Plan Actual

**Usuarios:** Dueño del Negocio, Super Admin

**Qué muestra:**
- Nombre del plan (START / BUSINESS / PREMIUM)
- Precio mensual
- Estado de la suscripción (Activo / Vencido / En Prueba)
- Fecha de activación
- Fecha de renovación
- Próximo vencimiento
- **Contador regresivo en tiempo real** (días, horas, minutos)
- **Código de colores**:
  - 🟢 **Normal:** > 7 días restantes
  - 🟡 **Advertencia:** ≤ 7 días restantes
  - 🔴 **Crítico:** ≤ 3 días restantes
- Lista de funcionalidades incluidas en el plan actual

**Componentes visuales:**
- Tarjeta del plan con badge "Tu plan"
- 4 tarjetas de estadísticas (Plan actual, Días restantes, Inversión mensual, Próxima factura)
- Botón para comparar otros planes

---

### 2.2 Comparador de Planes

**Usuarios:** Dueño del Negocio, Super Admin

**Objetivos:**
- Comparación visual clara entre los 3 planes disponibles
- Facilitar la conversión hacia planes superiores
- Mostrar beneficios adicionales de cada plan

**Componentes:**

#### 2.2.1 Vista de Tarjetas (Grid de Planes)
Cada tarjeta muestra:
- Nombre del plan con badge de color
- Precio mensual
- Lista de funcionalidades (✓ incluidas, × no disponibles)
- Botón de acción:
  - **START:** "Cambiar a START" (downgrade)
  - **BUSINESS:** "Tu plan actual" (deshabilitado si es el plan actual)
  - **PREMIUM:** "Actualizar a PREMIUM" (upgrade)

Badge especial:
- **"Tu plan"** para el plan actual del negocio
- **"Recomendado"** para el plan BUSINESS (intermedio, mayor conversión)

#### 2.2.2 Tabla de Comparación Detallada
Muestra fila por fila:
- Nombre de la funcionalidad
- Disponibilidad por plan (✓, ×, o límite numérico)

Funcionalidades comparadas:
- Menú digital completo
- Idiomas (3 / 5 / Ilimitado)
- Productos en catálogo (50 / 200 / Ilimitado)
- QR personalizado
- Fotos y videos
- Integración WhatsApp y redes sociales
- Generación IA (textos / imágenes)
- Menú dinámico por horario
- Analytics (Básico / Avanzado)
- Etiquetas inteligentes
- Herramientas de marketing (Básicas / Avanzadas)
- Calendario inteligente IA
- Publicaciones automáticas
- Campañas promocionales avanzadas
- Automatizaciones
- Usuarios permitidos (1 / 3 / Ilimitado)
- Soporte (Email / Email+Chat / 24/7 Prioritario)

---

### 2.3 Historial de Pagos y Cambios

**Usuarios:** Dueño del Negocio (solo su negocio), Super Admin (todos los negocios)

**Qué muestra:**
Tabla con historial completo de:
- Fecha de operación
- Tipo (Pago / Cambio de Plan / Activación)
- Descripción
- Plan asociado
- Monto
- Estado (Pagado / Pendiente / Fallido)

**Casos de uso:**
- Auditoría financiera
- Verificación de pagos
- Seguimiento de cambios de plan
- Resolución de disputas
- Generación de reportes de facturación

---

### 2.4 Gestión de Planes (Solo Super Admin)

**Usuario:** Super Admin

**Pestaña exclusiva:** "Gestionar (Admin)"

#### 2.4.1 Tabla de Gestión de Planes
Muestra todos los planes configurados con:
- Nombre del plan
- Precio mensual
- Usuarios máximos permitidos
- Productos máximos permitidos
- IA Texto (✓ / ×)
- IA Imagen (✓ / ×)
- Estado (Activo / Inactivo)
- Botón "Editar"

#### 2.4.2 Feature Flags por Plan
Tabla de comparación completa mostrando:
- Cada módulo de la plataforma
- Disponibilidad por plan (✓, ×, o límite numérico)

**Módulos controlados:**
- Catálogo de Productos (límite por plan)
- Multimedia (habilitado/deshabilitado)
- Idiomas (límite por plan)
- Marketing → Campañas Básicas (habilitado/deshabilitado)
- Marketing → Campañas Avanzadas (solo PREMIUM)
- IA → Generación de Texto (BUSINESS y PREMIUM)
- IA → Generación de Imágenes (solo PREMIUM)
- Estadísticas → Básicas (BUSINESS y PREMIUM)
- Estadísticas → Avanzadas (solo PREMIUM)
- Automatizaciones (solo PREMIUM)
- Usuarios Permitidos (1 / 3 / Ilimitado)
- Menú Dinámico por Horario (BUSINESS y PREMIUM)
- Calendario Inteligente IA (solo PREMIUM)
- Publicaciones Automáticas (solo PREMIUM)

#### 2.4.3 Modal "Crear Nuevo Plan"
Formulario con campos:
- Nombre del Plan (ej: ENTERPRISE, RESELLER)
- Precio Mensual (R$)
- Usuarios Máximos (0 = ilimitado)
- Productos Máximos (0 = ilimitado)
- Idiomas Máximos (0 = ilimitado)
- Checkboxes para habilitar:
  - Generación IA (Texto)
  - Generación IA (Imágenes)
  - Analytics Avanzado
  - Automatizaciones
  - Marketing Avanzado

**Flujo:**
1. Super Admin completa el formulario
2. Hace clic en "Crear Plan"
3. Sistema valida datos
4. Crea registro en tabla `planes`
5. El nuevo plan queda disponible inmediatamente para asignación

---

## 3. PLANES DISPONIBLES

### 3.1 Plan START
**Precio:** R$ 150 / mes

**Perfil:** Negocios pequeños que inician con menú digital básico.

**Incluye:**
- ✓ Menú digital completo
- ✓ Hasta 3 idiomas
- ✓ QR personalizado
- ✓ Fotos y videos
- ✓ Integración WhatsApp y redes sociales
- ✓ Hasta 50 productos en catálogo
- ✓ 1 usuario (solo Dueño)
- ✓ Soporte por email

**No incluye:**
- × Generación de contenido con IA
- × Menú dinámico por horario
- × Analytics
- × Etiquetas inteligentes
- × Herramientas de marketing
- × Usuarios adicionales

---

### 3.2 Plan BUSINESS
**Precio:** R$ 300 / mes

**Perfil:** Negocios medianos que buscan automatización y contenido inteligente.

**Badge:** "Recomendado" (mayor conversión)

**Incluye:**
- ✓ Todo lo de START
- ✓ **Generación de contenido con IA (solo texto)**
- ✓ Menú dinámico por horario
- ✓ Analytics básico
- ✓ Etiquetas inteligentes de productos
- ✓ Herramientas básicas de marketing
- ✓ Hasta 5 idiomas
- ✓ Hasta 200 productos en catálogo
- ✓ Hasta 3 usuarios (Dueño + 2 colaboradores)
- ✓ Soporte por email + chat

**No incluye:**
- × Generación de imágenes con IA
- × Calendario inteligente con IA
- × Publicaciones automáticas
- × Campañas promocionales avanzadas
- × Automatizaciones
- × Analytics avanzado

---

### 3.3 Plan PREMIUM
**Precio:** R$ 600 / mes

**Perfil:** Negocios grandes o cadenas que requieren automatización completa y crecimiento acelerado.

**Incluye:**
- ✓ Todo lo de BUSINESS
- ✓ **Generación de imágenes con IA**
- ✓ Calendario inteligente con IA
- ✓ Publicaciones automáticas
- ✓ Campañas promocionales avanzadas
- ✓ Automatizaciones completas
- ✓ Analytics avanzado
- ✓ Herramientas avanzadas de crecimiento y fidelización
- ✓ Idiomas ilimitados
- ✓ Productos ilimitados
- ✓ Usuarios ilimitados
- ✓ Soporte prioritario 24/7

**Diferenciador clave:** Máxima autonomía con IA y automatizaciones.

---

## 4. GESTIÓN DE FUNCIONALIDADES (FEATURE FLAGS)

### 4.1 Concepto

El módulo **Planes y Suscripciones** administra internamente todas las funciones disponibles de la plataforma mediante un sistema de **Feature Flags** (banderas de características).

Cada funcionalidad tiene un estado:
- **Habilitada:** El usuario puede acceder y usar la funcionalidad
- **Deshabilitada:** La funcionalidad no se muestra en el menú ni es accesible
- **Restringida por plan:** La funcionalidad existe pero requiere upgrade

### 4.2 Regla Arquitectónica Principal

**Todos los módulos deben consultar primero este módulo antes de mostrar una funcionalidad.**

**Flujo de verificación:**

```
Usuario accede a módulo X
  ↓
Sistema consulta tabla `planes`
  ↓
Sistema obtiene `plan_id` de la empresa del usuario
  ↓
Sistema verifica feature flags del plan
  ↓
IF (funcionalidad habilitada en el plan)
  ↓ YES
  Mostrar y permitir uso
  ↓ NO
  Ocultar o mostrar mensaje "Actualiza tu plan para desbloquear"
```

### 4.3 Matriz de Feature Flags

| Funcionalidad | START | BUSINESS | PREMIUM |
|---------------|-------|----------|---------|
| `catalogo.productos_max` | 50 | 200 | ∞ |
| `multimedia.habilitado` | ✓ | ✓ | ✓ |
| `idiomas.max` | 3 | 5 | ∞ |
| `marketing.campanias_basicas` | × | ✓ | ✓ |
| `marketing.campanias_avanzadas` | × | × | ✓ |
| `ia.generacion_texto` | × | ✓ | ✓ |
| `ia.generacion_imagenes` | × | × | ✓ |
| `estadisticas.basicas` | × | ✓ | ✓ |
| `estadisticas.avanzadas` | × | × | ✓ |
| `automatizaciones.habilitado` | × | × | ✓ |
| `usuarios.max` | 1 | 3 | ∞ |
| `menu.dinamico_horario` | × | ✓ | ✓ |
| `calendario.ia` | × | × | ✓ |
| `publicaciones.automaticas` | × | × | ✓ |

**Implementación técnica:**

Estas banderas se almacenan en tabla `planes` como columnas JSON o columnas individuales. Cada módulo consulta esta tabla antes de renderizar componentes:

```javascript
// Ejemplo: antes de mostrar botón "Generar con IA"
const plan = await getPlanActual(empresa_id);

if (plan.ia_generacion_texto) {
  // Mostrar botón "Generar descripción con IA"
} else {
  // Mostrar tooltip "Actualiza a BUSINESS para desbloquear IA"
}
```

---

## 5. COMPORTAMIENTO AL CAMBIAR DE PLAN

### 5.1 Upgrade (Subir de Plan)

**Caso:** Un negocio pasa de START → BUSINESS o BUSINESS → PREMIUM

**Comportamiento:**
- ✓ Se habilitan **inmediatamente** las nuevas funciones
- ✓ Se mantienen **todos los datos existentes**
- ✓ No se requiere reinstalación ni intervención técnica
- ✓ El usuario puede acceder a las nuevas funcionalidades en el siguiente login (o inmediatamente con refresh de permisos)

**Flujo técnico:**
1. Super Admin (o sistema de pago) cambia `plan_id` en tabla `empresas`
2. Sistema recalcula permisos automáticamente
3. Frontend consulta nuevamente feature flags
4. Nuevas funcionalidades aparecen en sidebar y menús

**Ejemplo:**
- Negocio START (sin IA) sube a BUSINESS
- Inmediatamente aparece botón "Generar con IA" en editor de publicaciones
- Usuario puede generar descripciones automáticamente desde ese momento

---

### 5.2 Downgrade (Bajar de Plan)

**Caso:** Un negocio pasa de PREMIUM → BUSINESS o BUSINESS → START

**Comportamiento:**
- ✓ Las funciones premium **no se eliminan**
- ✓ Los datos **no se borran**
- ✓ Las funciones quedan **ocultas o bloqueadas**
- ✓ Si vuelve a contratar el plan superior, **toda la información reaparece automáticamente**

**Flujo técnico:**
1. Super Admin (o sistema de pago) cambia `plan_id` en tabla `empresas`
2. Sistema recalcula permisos automáticamente
3. Frontend oculta funcionalidades no incluidas en el nuevo plan
4. Los datos relacionados permanecen en base de datos intactos

**Ejemplo:**
- Negocio PREMIUM (con automatizaciones configuradas) baja a BUSINESS
- El módulo "Automatizaciones" desaparece del sidebar
- Las automatizaciones configuradas permanecen en tabla `automatizaciones` pero inactivas
- Si el negocio vuelve a PREMIUM, las automatizaciones reaparecen y se reactivan automáticamente

**Límites protegidos:**
- Si el plan nuevo tiene límite de productos (ej: START = 50) y el negocio tiene 120 productos:
  - Los 120 productos permanecen en base de datos
  - El sistema **impide agregar nuevos** productos hasta bajar de 50
  - Mensaje al usuario: "Has alcanzado el límite de 50 productos del plan START. Actualiza a BUSINESS para agregar más."

---

## 6. MODALES Y FLUJOS DE ACCIÓN

### 6.1 Modal "Actualizar a PREMIUM"

**Trigger:** Usuario hace clic en botón "Actualizar a PREMIUM" en pestaña "Comparar Planes"

**Contenido:**
- Título: "Actualizar a PREMIUM"
- Resumen del cambio (de BUSINESS a PREMIUM)
- Tarjeta con nuevo precio mensual: R$ 600
- Diferencia de inversión: +R$ 300 por mes
- Lista de nuevas funcionalidades incluidas
- Nota sobre prorrateo: "Se te cobrará la diferencia prorrateada por los días restantes del ciclo actual"
- Botones:
  - "Cancelar" → cierra el modal
  - "Confirmar Actualización" → ejecuta el cambio

**Flujo backend:**
1. Usuario confirma upgrade
2. Sistema calcula monto prorrateado
3. Procesa pago (si tiene tarjeta guardada)
4. Actualiza `plan_id` en tabla `empresas`
5. Registra transacción en `historial_pagos`
6. Envía correo de confirmación
7. Actualiza permisos en sesión
8. Redirige a dashboard con mensaje de éxito

---

### 6.2 Modal "Crear Nuevo Plan" (Solo Super Admin)

**Trigger:** Super Admin hace clic en "Crear Plan" en header

**Contenido:**
- Formulario con campos:
  - Nombre del Plan (texto)
  - Precio Mensual (número)
  - Usuarios Máximos (número, 0 = ilimitado)
  - Productos Máximos (número, 0 = ilimitado)
  - Idiomas Máximos (número, 0 = ilimitado)
  - Checkboxes para feature flags:
    - Generación IA (Texto)
    - Generación IA (Imágenes)
    - Analytics Avanzado
    - Automatizaciones
    - Marketing Avanzado
- Botones:
  - "Cancelar" → cierra el modal
  - "Crear Plan" → guarda el nuevo plan

**Flujo backend:**
1. Validar datos del formulario
2. Insertar registro en tabla `planes`
3. El nuevo plan queda disponible inmediatamente
4. Super Admin puede asignarlo a negocios desde módulo Multiempresa

---

## 7. CONEXIONES CON OTROS MÓDULOS

### 7.1 Multiempresa
**Relación:**  
Planes y Suscripciones determina el plan asignado a cada negocio.

**Flujo:**
- Al crear un negocio en Multiempresa → se asigna un `plan_id` inicial (ej: START como plan de prueba)
- Super Admin puede cambiar el plan desde panel Multiempresa mediante botón "Cambiar Plan"
- La tabla de negocios en Multiempresa muestra el plan actual de cada empresa

---

### 7.2 Usuarios y Permisos
**Relación:**  
Planes y Suscripciones controla **límites de usuarios permitidos** por plan.

**Regla:**
- START: 1 usuario (solo Dueño)
- BUSINESS: hasta 3 usuarios (Dueño + 2 colaboradores)
- PREMIUM: usuarios ilimitados

**Flujo de validación:**
1. Dueño intenta invitar colaborador
2. Sistema consulta plan actual de la empresa
3. Sistema cuenta usuarios activos actuales
4. IF (usuarios_actuales < limite_plan):
   - Permitir invitación
5. ELSE:
   - Mostrar mensaje: "Has alcanzado el límite de usuarios de tu plan. Actualiza a BUSINESS/PREMIUM para invitar más colaboradores."

---

### 7.3 Catálogo de Productos
**Relación:**  
Planes y Suscripciones determina **límite de productos** permitidos.

**Regla:**
- START: hasta 50 productos
- BUSINESS: hasta 200 productos
- PREMIUM: productos ilimitados

**Flujo de validación:**
1. Usuario intenta crear nuevo producto
2. Sistema consulta plan actual de la empresa
3. Sistema cuenta productos activos actuales
4. IF (productos_actuales < limite_plan):
   - Permitir creación
5. ELSE:
   - Mostrar mensaje: "Has alcanzado el límite de 50 productos del plan START. Actualiza tu plan para agregar más."

---

### 7.4 Marketing
**Relación:**  
Planes y Suscripciones controla acceso a **campañas básicas y avanzadas**.

**Regla:**
- START: sin acceso a marketing
- BUSINESS: campañas básicas (ej: promociones simples, descuentos)
- PREMIUM: campañas avanzadas (ej: segmentación por hora, automatización de publicaciones)

**Flujo:**
- Si usuario START accede a módulo Marketing → mensaje: "Actualiza a BUSINESS para acceder a herramientas de marketing"
- Si usuario BUSINESS intenta usar campaña avanzada → mensaje: "Actualiza a PREMIUM para desbloquear campañas avanzadas"

---

### 7.5 IA (Generación de Contenido)
**Relación:**  
Planes y Suscripciones controla acceso a **generación de texto e imágenes con IA**.

**Regla:**
- START: sin acceso a IA
- BUSINESS: generación de texto (descripciones, títulos, promociones)
- PREMIUM: generación de texto + imágenes

**Flujo:**
- Usuario edita publicación de menú
- Si plan permite `ia.generacion_texto` → mostrar botón "Generar descripción con IA"
- Si plan permite `ia.generacion_imagenes` → mostrar botón "Mejorar imagen con IA"
- Si plan no lo permite → ocultar botones o mostrar tooltip de upgrade

---

### 7.6 Automatizaciones
**Relación:**  
Planes y Suscripciones controla acceso completo al módulo de **automatizaciones**.

**Regla:**
- START: sin acceso
- BUSINESS: sin acceso
- PREMIUM: acceso completo

**Flujo:**
- Si usuario START o BUSINESS intenta acceder → redirect a comparador de planes con mensaje: "Las automatizaciones están disponibles en el plan PREMIUM"

---

### 7.7 Estadísticas
**Relación:**  
Planes y Suscripciones controla nivel de **analíticas disponibles**.

**Regla:**
- START: sin acceso a estadísticas
- BUSINESS: analytics básico (vistas de productos, horarios de mayor actividad)
- PREMIUM: analytics avanzado (tendencias, segmentación, reportes exportables)

**Flujo:**
- Si usuario START accede a módulo Estadísticas → mensaje: "Actualiza a BUSINESS para ver estadísticas básicas"
- Si usuario BUSINESS intenta acceder a reportes avanzados → mensaje: "Actualiza a PREMIUM para desbloquear analytics avanzado"

---

## 8. ARQUITECTURA DE DATOS

### 8.1 Modelo Conceptual

```
tabla: planes
├─ id (PK)
├─ nombre (START, BUSINESS, PREMIUM)
├─ precio_mensual (decimal)
├─ usuarios_max (int, 0 = ilimitado)
├─ productos_max (int, 0 = ilimitado)
├─ idiomas_max (int, 0 = ilimitado)
├─ ia_texto (boolean)
├─ ia_imagenes (boolean)
├─ analytics_basico (boolean)
├─ analytics_avanzado (boolean)
├─ marketing_basico (boolean)
├─ marketing_avanzado (boolean)
├─ automatizaciones (boolean)
├─ menu_dinamico (boolean)
├─ calendario_ia (boolean)
├─ publicaciones_automaticas (boolean)
├─ estado (activo, inactivo)
├─ created_at
└─ updated_at

tabla: empresas
├─ id (PK)
├─ nombre
├─ plan_id (FK → planes.id)
├─ fecha_activacion_plan
├─ fecha_renovacion_plan
├─ estado_suscripcion (activo, vencido, prueba, suspendido)
└─ ...

tabla: historial_pagos
├─ id (PK)
├─ empresa_id (FK → empresas.id)
├─ tipo (pago, cambio_plan, activacion)
├─ descripcion
├─ plan_anterior_id (FK → planes.id, nullable)
├─ plan_nuevo_id (FK → planes.id)
├─ monto (decimal)
├─ estado (pagado, pendiente, fallido)
├─ metodo_pago (tarjeta, transferencia, etc.)
└─ created_at
```

### 8.2 Consulta de Permisos

**Endpoint (pseudo):** `GET /api/empresas/:id/permisos`

**Retorna:**
```json
{
  "plan": {
    "nombre": "BUSINESS",
    "precio": 300,
    "usuarios_max": 3,
    "productos_max": 200,
    "idiomas_max": 5
  },
  "feature_flags": {
    "ia_texto": true,
    "ia_imagenes": false,
    "analytics_basico": true,
    "analytics_avanzado": false,
    "marketing_basico": true,
    "marketing_avanzado": false,
    "automatizaciones": false,
    "menu_dinamico": true,
    "calendario_ia": false,
    "publicaciones_automaticas": false
  },
  "limites_actuales": {
    "usuarios_actuales": 2,
    "productos_actuales": 87,
    "idiomas_actuales": 3
  }
}
```

Cada módulo consume este endpoint al cargar para adaptar UI y funcionalidades.

---

## 9. CASOS DE USO DETALLADOS

### 9.1 Caso: Dueño de Negocio Consulta Su Plan

**Actor:** Dueño del Negocio (Pizzería La Bella)

**Precondiciones:**
- Usuario autenticado
- Plan actual: BUSINESS
- Fecha de renovación: 22 Jun 2026 (15 días restantes)

**Flujo:**
1. Usuario accede a "Planes y Suscripciones" desde sidebar
2. Sistema carga pestaña "Resumen" por defecto
3. Sistema muestra:
   - 4 tarjetas de estadísticas (Plan BUSINESS, 15 días restantes, R$ 300, Próxima factura)
   - Tarjeta del plan actual con badge "Tu plan"
   - Lista de funcionalidades incluidas
   - Contador regresivo en tiempo real con código de color 🟢 (normal)
   - Botón "Ver otros planes"
4. Usuario puede cambiar a pestaña "Comparar Planes" para ver diferencias
5. Usuario puede cambiar a pestaña "Historial" para ver pagos anteriores

**Resultado:**
- Usuario conoce su plan actual, beneficios, fecha de vencimiento y opciones de upgrade

---

### 9.2 Caso: Dueño Solicita Upgrade a PREMIUM

**Actor:** Dueño del Negocio

**Precondiciones:**
- Plan actual: BUSINESS
- Método de pago guardado: Tarjeta de crédito

**Flujo:**
1. Usuario accede a pestaña "Comparar Planes"
2. Usuario revisa tarjeta de plan PREMIUM
3. Usuario hace clic en "Actualizar a PREMIUM"
4. Sistema abre modal "Actualizar a PREMIUM"
5. Sistema muestra:
   - Nuevo precio mensual: R$ 600
   - Diferencia: +R$ 300 por mes
   - Lista de nuevas funcionalidades
   - Nota sobre prorrateo
6. Usuario hace clic en "Confirmar Actualización"
7. Sistema:
   - Calcula monto prorrateado (ej: R$ 150 por los 15 días restantes del ciclo)
   - Procesa pago con tarjeta guardada
   - Actualiza `plan_id` de BUSINESS → PREMIUM en tabla `empresas`
   - Registra transacción en `historial_pagos`
   - Envía correo de confirmación
   - Recalcula permisos en sesión
8. Usuario ve mensaje de éxito: "✓ Plan actualizado a PREMIUM. Las nuevas funcionalidades están disponibles inmediatamente."
9. Sistema redirige a dashboard
10. Sidebar ahora muestra módulos antes ocultos:
    - Automatizaciones
    - Calendario IA
    - Analytics Avanzado

**Resultado:**
- Plan actualizado a PREMIUM
- Nuevas funcionalidades habilitadas inmediatamente
- Usuario puede usar generación de imágenes IA, automatizaciones, etc.

---

### 9.3 Caso: Super Admin Crea Nuevo Plan "ENTERPRISE"

**Actor:** Super Administrador

**Precondiciones:**
- Usuario autenticado con rol `super_admin`

**Flujo:**
1. Super Admin accede a módulo "Planes y Suscripciones"
2. Super Admin hace clic en botón "Crear Plan" en header
3. Sistema abre modal "Crear Nuevo Plan"
4. Super Admin completa formulario:
   - Nombre: "ENTERPRISE"
   - Precio: R$ 1200
   - Usuarios Máximos: 0 (ilimitado)
   - Productos Máximos: 0 (ilimitado)
   - Idiomas Máximos: 0 (ilimitado)
   - Checkboxes activados:
     - ✓ Generación IA (Texto)
     - ✓ Generación IA (Imágenes)
     - ✓ Analytics Avanzado
     - ✓ Automatizaciones
     - ✓ Marketing Avanzado
5. Super Admin hace clic en "Crear Plan"
6. Sistema:
   - Valida datos
   - Inserta registro en tabla `planes`
   - Muestra mensaje: "✓ Plan creado correctamente. Los negocios ya pueden seleccionarlo."
   - Cierra modal
7. Nuevo plan "ENTERPRISE" aparece en pestaña "Gestionar (Admin)" → tabla de planes
8. Super Admin puede asignarlo a negocios desde módulo Multiempresa

**Resultado:**
- Plan ENTERPRISE creado y disponible para asignación
- Super Admin puede venderlo a clientes corporativos

---

### 9.4 Caso: Negocio Baja de PREMIUM a BUSINESS (Downgrade)

**Actor:** Super Administrador (a solicitud del cliente o por falta de pago)

**Precondiciones:**
- Negocio actual: PREMIUM
- Tiene 5 automatizaciones configuradas
- Tiene 8 usuarios activos

**Flujo:**
1. Super Admin accede a módulo Multiempresa
2. Super Admin selecciona el negocio
3. Super Admin hace clic en "Cambiar Plan"
4. Super Admin selecciona "BUSINESS" en dropdown
5. Sistema:
   - Actualiza `plan_id` de PREMIUM → BUSINESS en tabla `empresas`
   - Registra cambio en `historial_pagos`
   - Recalcula permisos
   - Envía correo al Dueño notificando el cambio
6. Sistema **NO elimina** las 5 automatizaciones configuradas (permanecen en base de datos)
7. Sistema **deshabilita** las automatizaciones (campo `activo = false`)
8. Sistema **oculta** el módulo "Automatizaciones" del sidebar del Dueño
9. Sistema valida límite de usuarios (BUSINESS = 3 usuarios):
   - Detecta que hay 8 usuarios activos
   - Envía correo al Dueño: "Tu plan BUSINESS permite hasta 3 usuarios. Por favor, desactiva 5 usuarios para cumplir con el límite."
   - Sistema **no elimina** usuarios automáticamente (decisión del Dueño)
10. Dueño accede a módulo "Usuarios y Permisos"
11. Dueño desactiva 5 colaboradores manualmente
12. Sistema queda en compliance: 3 usuarios activos

**Resultado:**
- Plan cambiado de PREMIUM → BUSINESS
- Automatizaciones deshabilitadas pero **no eliminadas**
- Si el negocio vuelve a PREMIUM, las automatizaciones reaparecen y se reactivan automáticamente
- Usuarios excedentes desactivados por el Dueño (no eliminados)

---

## 10. FLUJO DE NAVEGACIÓN

```
Dashboard
  ↓
Planes y Suscripciones
  ├─ Pestaña: Resumen
  │    ├─ Ver plan actual
  │    ├─ Ver días restantes (contador regresivo)
  │    ├─ Ver funcionalidades incluidas
  │    └─ Botón "Ver otros planes" → Pestaña Comparar
  │
  ├─ Pestaña: Comparar Planes
  │    ├─ Ver 3 tarjetas de planes (START, BUSINESS, PREMIUM)
  │    ├─ Comparar funcionalidades
  │    ├─ Botón "Actualizar a PREMIUM" → Modal Upgrade
  │    └─ Ver tabla de comparación detallada
  │
  ├─ Pestaña: Historial
  │    ├─ Ver tabla de pagos
  │    ├─ Ver tabla de cambios de plan
  │    └─ Filtrar por fecha, tipo, estado
  │
  └─ Pestaña: Gestionar (Admin) [Solo Super Admin]
       ├─ Ver tabla de planes configurados
       ├─ Botón "Editar" por plan
       ├─ Ver tabla de Feature Flags por plan
       └─ Botón "Crear Plan" → Modal Crear Nuevo Plan

Modal: Actualizar a PREMIUM
  ├─ Ver resumen de cambio
  ├─ Ver nuevas funcionalidades
  ├─ Botón "Cancelar" → cierra modal
  └─ Botón "Confirmar Actualización" → ejecuta upgrade → redirect a Dashboard con mensaje de éxito

Modal: Crear Nuevo Plan
  ├─ Completar formulario
  ├─ Botón "Cancelar" → cierra modal
  └─ Botón "Crear Plan" → guarda plan → cierra modal → plan disponible en tabla
```

---

## 11. RESPONSIVE Y ADAPTABILIDAD

### 11.1 Breakpoints
- **Desktop (1280px+):** Sidebar fijo, tabla completa, stats en 4 columnas
- **Tablet (768-1279px):** Sidebar fijo, tabla con scroll horizontal, stats en 2 columnas
- **Mobile (<768px):** Sidebar oculto (menú hamburguesa), tabla scroll horizontal, stats en columna única

### 11.2 Adaptaciones Mobile
- Tarjetas de planes apiladas verticalmente
- Tabla de comparación con scroll horizontal
- Modales ocupan 90% del ancho de pantalla
- Botones a ancho completo en mobile

---

## 12. SEGURIDAD Y PERMISOS

### 12.1 Control de Acceso por Rol

**Super Admin:**
- ✓ Ver todos los planes
- ✓ Crear planes
- ✓ Editar planes
- ✓ Cambiar plan de cualquier negocio
- ✓ Ver historial de pagos global
- ✓ Gestionar feature flags

**Dueño del Negocio:**
- ✓ Ver su plan actual
- ✓ Ver beneficios incluidos
- ✓ Comparar planes
- ✓ Solicitar upgrade (si tiene método de pago configurado)
- ✓ Ver su historial de pagos
- × No puede crear planes
- × No puede cambiar plan de otros negocios
- × No puede ver historial de otros negocios

**Admin de Negocio / Editor / Visualizador:**
- × Sin acceso al módulo Planes y Suscripciones
- × Solo Dueño y Super Admin pueden acceder

### 12.2 Validaciones de Seguridad

1. **Autenticación requerida:** Todos los endpoints de este módulo requieren JWT válido
2. **Segregación multi-tenancy:** Dueño solo ve datos de su `empresa_id`
3. **Validación de rol:** Solo `super_admin` puede crear/editar planes
4. **Validación de pago:** Antes de upgrade, verificar método de pago activo
5. **Auditoría:** Todos los cambios de plan se registran en `historial_pagos` con timestamp y usuario responsable

---

## 13. MEJORAS FUTURAS

### 13.1 Fase 2
- **Descuentos y cupones:** Sistema de códigos promocionales
- **Pagos recurrentes automáticos:** Integración con Stripe, PayPal, PagSeguro
- **Facturación automática:** Generación de boletos e invoices
- **Planes personalizados:** Negociación de planes empresariales a medida
- **Prueba gratuita:** 14 días gratis sin tarjeta de crédito

### 13.2 Fase 3
- **Métricas de conversión:** Dashboard de conversión START → BUSINESS → PREMIUM
- **Notificaciones de vencimiento:** Recordatorios automáticos 7, 3 y 1 día antes del vencimiento
- **Reactivación automática:** Si el pago falla, reintento en 3, 7 días antes de suspender
- **Sistema de créditos:** Compra de créditos IA por separado (modelo freemium avanzado)

---

## 14. CHECKLIST DE IMPLEMENTACIÓN BACKEND

### 14.1 Desarrollo
- [ ] Crear tabla `planes` con todos los campos de feature flags
- [ ] Crear tabla `historial_pagos` para auditoría
- [ ] Actualizar tabla `empresas` con `plan_id`, `fecha_activacion_plan`, `fecha_renovacion_plan`, `estado_suscripcion`
- [ ] Implementar endpoint `GET /api/empresas/:id/permisos` (retorna feature flags del plan)
- [ ] Implementar endpoint `POST /api/planes` (crear plan, solo super admin)
- [ ] Implementar endpoint `PUT /api/planes/:id` (editar plan, solo super admin)
- [ ] Implementar endpoint `PUT /api/empresas/:id/plan` (cambiar plan de negocio)
- [ ] Implementar endpoint `POST /api/empresas/:id/upgrade` (upgrade con pago)
- [ ] Implementar endpoint `GET /api/empresas/:id/historial-pagos` (historial de transacciones)
- [ ] Implementar middleware de validación de feature flags por ruta (ej: `/api/ia/generar-texto` verifica `ia_texto`)
- [ ] Implementar cron job para actualizar `estado_suscripcion` a `vencido` si `fecha_renovacion_plan < NOW()`
- [ ] Implementar lógica de prorrateo de pago en upgrades
- [ ] Implementar lógica de deshabilitación (no eliminación) en downgrades
- [ ] Integrar pasarela de pagos (Stripe, PayPal, etc.)
- [ ] Implementar envío de correos de confirmación, recordatorios de vencimiento

### 14.2 Testing
- [ ] Test: crear plan nuevo
- [ ] Test: asignar plan a negocio
- [ ] Test: upgrade de START → BUSINESS (verificar feature flags actualizados)
- [ ] Test: downgrade de PREMIUM → BUSINESS (verificar datos no eliminados)
- [ ] Test: validación de límites (productos, usuarios, idiomas)
- [ ] Test: cálculo de prorrateo en upgrades
- [ ] Test: historial de pagos correcto
- [ ] Test: contador regresivo en frontend actualiza correctamente
- [ ] Test: middleware de feature flags bloquea rutas no permitidas

### 14.3 Despliegue
- [ ] Migrar base de datos con tablas `planes` y `historial_pagos`
- [ ] Insertar planes iniciales (START, BUSINESS, PREMIUM)
- [ ] Asignar planes existentes a negocios en producción
- [ ] Configurar variables de entorno para pasarela de pagos
- [ ] Configurar cron job de vencimiento de suscripciones
- [ ] Monitorear logs de cambios de plan y transacciones

---

## 15. CONCLUSIÓN

El módulo **Planes y Suscripciones** es el **centro neurálgico** de la plataforma SaaS. Controla qué funcionalidades están disponibles para cada negocio, facilita la monetización mediante upgrades, y garantiza la integridad de los datos en downgrades.

**Beneficios clave:**
- ✓ **Escalabilidad:** Agregar nuevos planes sin modificar código
- ✓ **Flexibilidad:** Feature flags permiten habilitar/deshabilitar funcionalidades dinámicamente
- ✓ **Integridad de datos:** Downgrades no eliminan información, solo la ocultan
- ✓ **Experiencia de usuario:** Upgrades instantáneos, comparador visual claro
- ✓ **Control total:** Super Admin gestiona todo desde un único panel

Este módulo está **listo para integración backend** siguiendo la arquitectura de datos, endpoints y flujos descritos en esta documentación.

---

**Documento generado el:** 07 junio 2026  
**Versión del módulo:** 1.0  
**Estado:** Diseño funcional completo — Listo para desarrollo backend
