# MÓDULO 07 · MOTOR DE INTELIGENCIA ARTIFICIAL

**Versión:** 1.0  
**Fecha:** 2026-06-07  
**Tipo:** Documentación Funcional  
**Audiencia:** Equipo técnico (CTOs, desarrolladores, arquitectos)

---

## 1. Introducción

### 1.1 Propósito del Módulo

El **Motor de Inteligencia Artificial** es el servicio transversal de asistencia inteligente que aumenta la productividad de los negocios automatizando tareas de creación, optimización, traducción y generación de contenido.

### 1.2 Filosofía de Diseño

La IA actúa como un **asistente operativo del negocio**, no como un chatbot tradicional ni una pantalla independiente.

**Principios fundamentales:**

- **Asistencia silenciosa:** Se integra contextualmente en otros módulos
- **Control humano:** Toda acción generada debe ser revisada/aprobada antes de publicarse
- **Reducción de fricción:** Elimina trabajo repetitivo sin comprometer calidad
- **Trazabilidad completa:** Historial de todas las acciones generadas por IA
- **Sin publicación automática:** Excepto en Automatizaciones configuradas explícitamente

### 1.3 Alcance del Módulo

**Incluye:**

- Generación de descripciones de productos
- Generación de contenido comercial (promociones, campañas, publicaciones)
- Traducción inteligente multiidioma
- Optimización de imágenes
- Generación de variantes de contenido
- Historial centralizado de acciones de IA
- Integración con Automatizaciones (solo Premium)

**No incluye:**

- Chatbot de atención al cliente
- Recomendaciones automáticas al consumidor final
- IA conversacional en el menú público
- Análisis predictivo de ventas (módulo Estadísticas)

---

## 2. Roles y Permisos

### 2.1 Acceso por Plan

| Plan | Acceso | Funcionalidades |
|------|--------|-----------------|
| **Básico** | ❌ No disponible | — |
| **Business** | ✅ Limitado | Generación y optimización de contenido |
| **Premium** | ✅ Completo | Todo Business + Automatizaciones inteligentes |

### 2.2 Roles dentro del Negocio

#### Administrador de Negocio

- Puede generar contenido en todos los módulos
- Puede aprobar/descartar contenido generado
- Puede editar manualmente antes de publicar
- Puede acceder al Historial de IA completo
- Puede configurar Automatizaciones inteligentes (solo Premium)

#### Editor

- Puede generar contenido solo en módulos/productos autorizados
- Puede aprobar/descartar solo en su ámbito de permiso
- No puede configurar Automatizaciones

#### Super Administrador

- Acceso completo para soporte técnico y asistencia operativa
- No interfiere en decisiones de contenido del negocio salvo solicitud explícita

---

## 3. Arquitectura Funcional

### 3.1 Modelo de Integración Transversal

La IA **no es un módulo con pantalla propia**, sino un **servicio que se invoca desde otros módulos**.

**Patrón de integración:**

```
Módulo A (Catálogo de Productos)
  └─> Usuario hace clic en "Mejorar con IA"
      └─> Llama al Motor de IA
          └─> IA genera contenido
              └─> Usuario revisa/edita/aprueba
                  └─> Se guarda en Catálogo + Historial de IA
```

### 3.2 Flujo General de Generación

```
Usuario solicita asistencia de IA
    ↓
IA recibe contexto (producto, idioma, tono, objetivo)
    ↓
IA genera contenido/variantes
    ↓
Usuario visualiza resultado
    ↓
Usuario puede:
    - Aceptar
    - Editar y guardar
    - Regenerar con ajustes
    - Descartar
    ↓
Si acepta → Se guarda en módulo origen + Historial de IA
Si descarta → Solo se registra en Historial (estado: Descartado)
```

### 3.3 Estados de Contenido Generado

| Estado | Descripción |
|--------|-------------|
| **Generado** | IA creó el contenido, pendiente de revisión |
| **Editado** | Usuario modificó el contenido antes de aprobar |
| **Aprobado** | Usuario aceptó el contenido sin editar |
| **Publicado** | Contenido aprobado y ahora visible para clientes |
| **Descartado** | Usuario rechazó el contenido generado |

---

## 4. Funcionalidades Principales

### 4.1 Generación de Descripciones de Productos

**Ubicación:** Integrado en **Catálogo de Productos**

**Casos de uso:**

- Crear descripción desde cero (solo con nombre de producto)
- Mejorar descripción existente
- Corregir redacción
- Adaptar tono comercial (formal, informal, juvenil, premium)
- Resaltar beneficios del producto

**Entradas:**

- Nombre del producto
- Descripción actual (opcional)
- Tono deseado
- Idioma de salida

**Salidas:**

- Descripción optimizada
- Hasta 3 variantes (según configuración)

**Flujo:**

```
Usuario edita producto → Clic en "Generar descripción con IA"
    ↓
Modal con opciones:
    - Tono: [Formal | Informal | Juvenil | Premium]
    - Longitud: [Corta | Media | Larga]
    - Idioma: [Español | Portugués | Inglés | ...]
    ↓
IA genera 1-3 variantes
    ↓
Usuario selecciona una → Edita si desea → Guarda
```

### 4.2 Generación de Contenido Comercial

**Ubicación:** Integrado en **Marketing**

**Casos de uso:**

- Publicaciones para redes sociales (Instagram, Facebook, WhatsApp)
- Promociones (2x1, descuentos, combos)
- Campañas especiales (Navidad, Black Friday, Día de la Madre)
- Lanzamientos de productos
- Mensajes para WhatsApp Business
- Textos para historias/anuncios

**Entradas:**

- Tipo de contenido (publicación, promoción, campaña)
- Producto(s) involucrado(s)
- Objetivo (conversión, engagement, branding)
- Tono
- Plataforma destino

**Salidas:**

- Texto optimizado para la plataforma
- Sugerencia de hashtags (si aplica)
- Variantes de mensaje

**Flujo:**

```
Usuario crea campaña → Clic en "Generar contenido con IA"
    ↓
IA analiza:
    - Productos seleccionados
    - Historial de campañas previas
    - Tono del negocio
    ↓
Genera contenido + hashtags
    ↓
Usuario revisa/edita/aprueba
```

### 4.3 Traducción Inteligente

**Ubicación:** Integrado en **Idiomas**

**Casos de uso:**

- Traducir productos completos
- Traducir categorías
- Traducir promociones
- Traducir campañas
- Completar idiomas faltantes en batch

**Entradas:**

- Texto origen
- Idioma origen
- Idioma(s) destino
- Contexto (producto, promoción, categoría)

**Salidas:**

- Traducción adaptada culturalmente
- Preservación de nombres propios (productos, marcas)

**Flujo:**

```
Usuario en panel de Idiomas → Selecciona producto(s) sin traducir
    ↓
Clic en "Traducir con IA"
    ↓
IA traduce preservando contexto gastronómico
    ↓
Usuario revisa traducciones idioma por idioma
    ↓
Aprueba/edita/descarta
```

**Diferenciadores:**

- **Contextualización gastronómica:** "Polvo na brasa" no se traduce literalmente
- **Preservación de nombres propios:** "Pizza Margarita" no se traduce
- **Adaptación cultural:** precios, medidas, expresiones locales

### 4.4 Optimización de Imágenes

**Ubicación:** Integrado en **Multimedia**

**Casos de uso:**

- Mejorar calidad visual
- Corregir iluminación
- Mejorar nitidez
- Optimizar colores
- Ajustar contraste
- Preparar imágenes para uso comercial

**Entradas:**

- Imagen original
- Tipo de mejora deseada

**Salidas:**

- Imagen optimizada (preview antes de reemplazar)
- Comparación lado a lado (antes/después)

**Flujo:**

```
Usuario selecciona imagen en Galería → Clic en "Mejorar con IA"
    ↓
IA procesa imagen
    ↓
Muestra preview con comparación antes/después
    ↓
Usuario aprueba → Reemplaza original (guarda backup automático)
Usuario descarta → Conserva original
```

### 4.5 Generación de Variantes

**Ubicación:** Disponible en **Catálogo de Productos** y **Marketing**

**Casos de uso:**

- Crear múltiples versiones de una descripción
- Probar diferentes tonos para una promoción
- A/B testing de contenido

**Ejemplos:**

| Versión | Tono | Ejemplo |
|---------|------|---------|
| Formal | Profesional | "Nuestra selección de carnes premium..." |
| Informal | Cercano | "Las mejores carnes para tu asado 🔥" |
| Juvenil | Dinámico | "Prepárate para el asado perfecto 🥩✨" |
| Premium | Exclusivo | "Experiencia gastronómica de autor..." |
| Conversión | Directo | "Ordena ahora y recibe 15% de descuento" |

**Flujo:**

```
Usuario solicita generar variantes
    ↓
IA genera 3-5 versiones con diferentes tonos
    ↓
Usuario compara lado a lado
    ↓
Selecciona la mejor → Guarda
O edita manualmente una variante → Guarda
```

---

## 5. Historial de IA

### 5.1 Propósito

Centralizar y auditar **todas las acciones realizadas por Inteligencia Artificial** en la plataforma.

### 5.2 Qué Registra

| Campo | Descripción |
|-------|-------------|
| **Fecha/Hora** | Timestamp de generación |
| **Usuario** | Quién solicitó la generación |
| **Tipo** | Descripción de producto, traducción, imagen, campaña |
| **Módulo Origen** | Catálogo, Marketing, Idiomas, Multimedia |
| **Contenido Generado** | Preview del texto/imagen generado |
| **Estado** | Generado, Editado, Aprobado, Publicado, Descartado |
| **Producto/Campaña Asociado** | Enlace al recurso modificado |

### 5.3 Filtros Disponibles

- **Por fecha** (última semana, último mes, rango personalizado)
- **Por módulo** (Catálogo, Marketing, Idiomas, Multimedia)
- **Por tipo** (Descripción, Traducción, Imagen, Campaña)
- **Por estado** (Aprobado, Descartado, Editado, Publicado)
- **Por usuario** (quién solicitó la generación)

### 5.4 Acciones desde el Historial

- **Ver detalle completo** (input → output generado → versión final publicada)
- **Ver comparación** (antes/después para ediciones)
- **Exportar historial** (CSV para auditoría)
- **Filtrar por performance** (contenido que aumentó conversión — si conecta con Estadísticas)

---

## 6. Automatización Inteligente

### 6.1 Disponibilidad

**Solo para plan Premium.**

### 6.2 Qué Permite

Configurar tareas programadas donde la IA genera contenido automáticamente según reglas predefinidas.

**Ejemplos:**

| Automatización | Trigger | Acción de IA |
|----------------|---------|--------------|
| **Promoción Semanal** | Cada lunes 9:00 AM | Generar promoción de producto destacado |
| **Campaña de Fecha Especial** | 7 días antes de Navidad | Generar campaña navideña con productos del catálogo |
| **Publicación Recurrente** | Cada viernes 17:00 | Generar publicación de fin de semana |
| **Traducción Automática** | Al crear nuevo producto | Traducir automáticamente a idiomas configurados |

### 6.3 Flujo de Automatización

```
Regla de Automatización configurada por Administrador
    ↓
Trigger se cumple (fecha/hora, evento)
    ↓
IA genera contenido según regla
    ↓
Opciones:
    A) Publicar automáticamente (requiere confirmación explícita del negocio)
    B) Enviar a cola de aprobación (modo seguro — recomendado)
    ↓
Si modo seguro → Administrador revisa antes de publicar
Si modo automático → Se publica y se notifica al negocio
```

### 6.4 Regla de Seguridad

**Por defecto, las Automatizaciones NO publican contenido automáticamente.**

Todo contenido generado va a una **cola de aprobación** donde el Administrador puede:

- Aprobar y publicar
- Editar antes de publicar
- Descartar

**Excepciones:**

Solo si el Administrador activa explícitamente el modo **"Publicación automática"** para una regla específica.

---

## 7. Conexión con Otros Módulos

### 7.1 Catálogo de Productos

**Integración:**

- Botón "Generar descripción con IA" en formulario de edición
- Botón "Traducir con IA" para completar idiomas
- Generación de variantes de descripción

**Datos que consume:**

- Nombre del producto
- Descripción actual
- Categoría
- Idioma principal

**Datos que devuelve:**

- Descripción optimizada
- Traducciones
- Variantes

### 7.2 Marketing

**Integración:**

- Botón "Generar contenido con IA" en creación de campaña/promoción
- Sugerencia de hashtags
- Generación de copy para redes sociales

**Datos que consume:**

- Tipo de campaña
- Producto(s) involucrado(s)
- Objetivo (conversión, engagement)
- Plataforma destino

**Datos que devuelve:**

- Texto de campaña
- Variantes de mensaje
- Hashtags sugeridos

### 7.3 Idiomas

**Integración:**

- Botón "Traducir con IA" en panel de traducciones
- Traducción batch de productos sin traducir
- Detección de inconsistencias en traducciones

**Datos que consume:**

- Texto origen
- Idioma origen
- Idioma(s) destino
- Contexto (producto, categoría, promoción)

**Datos que devuelve:**

- Traducciones contextualizadas
- Advertencias (nombres propios detectados, términos técnicos)

### 7.4 Multimedia

**Integración:**

- Botón "Mejorar con IA" en Galería
- Preview antes/después
- Backup automático de imagen original

**Datos que consume:**

- Imagen original
- Tipo de mejora (iluminación, nitidez, colores)

**Datos que devuelve:**

- Imagen optimizada
- Comparación visual

### 7.5 Automatizaciones

**Integración:**

- Panel de configuración de reglas inteligentes
- Cola de aprobación de contenido generado automáticamente
- Notificaciones de contenido pendiente de revisión

**Datos que consume:**

- Reglas configuradas (trigger, acción, parámetros)
- Estado de publicación automática (activado/desactivado)

**Datos que devuelve:**

- Contenido generado según regla
- Estado de aprobación

### 7.6 Planes y Suscripciones

**Integración:**

- Verificación de funcionalidades habilitadas según plan
- Límites de uso (generaciones mensuales en plan Business)
- Desbloqueo de Automatizaciones (solo Premium)

**Datos que consume:**

- Plan activo del negocio
- Cuota de generaciones usadas

**Datos que devuelve:**

- Permisos de acceso
- Advertencia de límite alcanzado

---

## 8. Reglas de Negocio Principales

### RN-01: Control Humano Obligatorio

**Descripción:** La IA nunca publicará contenido visible al cliente final sin aprobación humana previa.

**Excepciones:** Automatizaciones configuradas explícitamente en modo "Publicación automática" (solo Premium, requiere confirmación del Administrador).

**Validación:** Todo contenido generado pasa por estado "Generado" → Usuario aprueba → Estado "Publicado".

---

### RN-02: Trazabilidad Completa

**Descripción:** Toda acción de IA debe registrarse en el Historial.

**Validación:** Cada generación crea un registro con: fecha, usuario, módulo, tipo, contenido, estado.

---

### RN-03: Acceso por Plan

**Descripción:** Las funcionalidades de IA están limitadas por plan.

| Funcionalidad | Básico | Business | Premium |
|---------------|--------|----------|---------|
| Generación de descripciones | ❌ | ✅ | ✅ |
| Traducción inteligente | ❌ | ✅ | ✅ |
| Optimización de imágenes | ❌ | ✅ | ✅ |
| Generación de campañas | ❌ | ✅ | ✅ |
| Automatizaciones inteligentes | ❌ | ❌ | ✅ |

**Validación:** Al invocar función de IA, verificar plan activo. Si no está habilitado → Mostrar modal de upgrade.

---

### RN-04: Límites de Uso

**Descripción:** Plan Business tiene cuota mensual de generaciones.

| Plan | Generaciones/mes |
|------|------------------|
| Business | 100 |
| Premium | Ilimitadas |

**Validación:** Al alcanzar límite → Bloquear nuevas generaciones hasta próximo ciclo o upgrade a Premium.

---

### RN-05: Preservación de Nombres Propios en Traducción

**Descripción:** La IA no debe traducir nombres de productos, marcas o platos únicos.

**Ejemplos:**

- ✅ "Pizza Margarita" → No se traduce
- ✅ "Polvo na Brasa" → No se traduce (es nombre del plato)
- ❌ "Grilled Octopus" → SÍ se traduce (es descripción genérica)

**Validación:** IA detecta nombres propios antes de traducir y los preserva.

---

### RN-06: Edición Manual Prevalece

**Descripción:** Si el usuario edita contenido generado por IA antes de aprobar, la versión editada es la que se guarda.

**Validación:** Estado cambia de "Generado" → "Editado" → "Publicado".

---

### RN-07: No Sobrescritura sin Confirmación

**Descripción:** Si el usuario solicita generar contenido en un campo que ya tiene texto, debe confirmar sobrescritura.

**Validación:**

```
Campo actual: "Descripción existente"
Usuario: "Generar con IA"
Sistema: "¿Reemplazar descripción actual o generar como variante?"
    → Reemplazar
    → Generar nueva (mantiene actual)
```

---

### RN-08: Backup Automático de Imágenes

**Descripción:** Al optimizar una imagen con IA, la original se guarda como backup antes de reemplazar.

**Validación:** Al aprobar optimización → Original se mueve a carpeta `backups/` con timestamp.

---

### RN-09: Descarte No Elimina Registro

**Descripción:** Si el usuario descarta contenido generado, este NO se elimina del Historial.

**Validación:** Estado cambia a "Descartado" pero el registro persiste para auditoría.

---

### RN-10: Notificación de Contenido Pendiente

**Descripción:** Si una Automatización genera contenido en modo seguro, el Administrador recibe notificación.

**Validación:** Email/notificación in-app: "Tienes 3 campañas generadas pendientes de revisión".

---

## 9. Flujos de Usuario

### FU-01: Generar Descripción de Producto con IA

**Actor:** Administrador de Negocio

**Precondición:** Plan Business o Premium activo

**Flujo principal:**

1. Usuario navega a **Catálogo de Productos**
2. Clic en **Editar Producto** (o Crear Nuevo Producto)
3. En campo "Descripción" → Clic en botón **"✨ Generar con IA"**
4. Modal se abre con opciones:
   - **Tono:** [Formal | Informal | Juvenil | Premium]
   - **Longitud:** [Corta | Media | Larga]
   - **Idioma:** [Español (por defecto)]
5. Usuario selecciona opciones → Clic en **"Generar"**
6. Sistema muestra spinner: "Generando descripción..."
7. IA devuelve 1-3 variantes
8. Usuario visualiza variantes lado a lado
9. Usuario selecciona una variante → Clic en **"Usar esta"**
10. Descripción se inserta en campo de texto (editable)
11. Usuario puede editar manualmente antes de guardar
12. Clic en **"Guardar producto"**
13. Sistema guarda producto + Registra en Historial de IA:
    - Tipo: "Descripción de producto"
    - Estado: "Aprobado" (si no editó) o "Editado" (si modificó)
    - Producto asociado: [ID del producto]

**Flujo alternativo 1:** Usuario descarta variantes

- Paso 9: Usuario cierra modal sin seleccionar → Descripción no cambia
- Sistema registra en Historial: Estado "Descartado"

**Flujo alternativo 2:** Usuario solicita regenerar

- Paso 9: Usuario clic en "Regenerar" → Vuelve a paso 7 con nuevas variantes

---

### FU-02: Traducir Producto con IA

**Actor:** Administrador de Negocio

**Precondición:** Plan Business o Premium activo

**Flujo principal:**

1. Usuario navega a **Idiomas**
2. Filtra por "Productos sin traducir al Inglés"
3. Selecciona 5 productos → Clic en **"Traducir con IA"**
4. Modal se abre:
   - **Idioma destino:** Inglés (detectado)
   - **Preservar nombres propios:** ✅ (activado por defecto)
5. Usuario confirma → Clic en **"Traducir"**
6. Sistema muestra progreso: "Traduciendo 5 productos..."
7. IA traduce cada producto preservando nombres propios
8. Sistema muestra tabla comparativa:

   | Producto | Español (original) | Inglés (generado) | Acción |
   |----------|--------------------|-------------------|--------|
   | Pizza Margarita | "Tomate, mozzarella..." | "Tomato, mozzarella..." | ✅ Aprobar |
   | Polvo na Brasa | "Pulpo a la parrilla..." | "Polvo na Brasa (Grilled octopus)..." | ✅ Aprobar |

9. Usuario revisa traducciones una por una
10. Usuario puede:
    - Aprobar todas
    - Editar manualmente antes de aprobar
    - Descartar algunas
11. Clic en **"Guardar traducciones"**
12. Sistema guarda traducciones + Registra en Historial:
    - Tipo: "Traducción"
    - Idioma destino: "Inglés"
    - Cantidad: 5 productos
    - Estado: "Aprobado" o "Editado"

---

### FU-03: Optimizar Imagen con IA

**Actor:** Administrador de Negocio

**Precondición:** Plan Business o Premium activo

**Flujo principal:**

1. Usuario navega a **Multimedia**
2. Selecciona imagen de producto → Clic derecho → **"Mejorar con IA"**
3. Modal se abre con opciones:
   - ✅ Mejorar iluminación
   - ✅ Aumentar nitidez
   - ✅ Optimizar colores
   - ⬜ Ajustar contraste
4. Usuario selecciona mejoras → Clic en **"Procesar"**
5. Sistema muestra spinner: "Optimizando imagen..."
6. IA devuelve imagen mejorada
7. Modal muestra comparación lado a lado:
   - **Antes** (original) | **Después** (optimizada)
   - Slider para comparar
8. Usuario revisa → Opciones:
   - **"Aplicar"** → Reemplaza original (guarda backup automático)
   - **"Descartar"** → Conserva original
   - **"Ajustar"** → Vuelve a paso 3 con diferentes opciones
9. Usuario clic en **"Aplicar"**
10. Sistema:
    - Guarda original en `backups/imagen-producto-123_2026-06-07.jpg`
    - Reemplaza archivo con versión optimizada
    - Registra en Historial:
      - Tipo: "Optimización de imagen"
      - Mejoras aplicadas: "Iluminación, Nitidez, Colores"
      - Estado: "Aprobado"

---

### FU-04: Generar Campaña de Marketing con IA

**Actor:** Administrador de Negocio

**Precondición:** Plan Business o Premium activo

**Flujo principal:**

1. Usuario navega a **Marketing**
2. Clic en **"Nueva Campaña"**
3. Selecciona tipo: **"Promoción 2x1"**
4. Selecciona productos: **"Pizza Margarita"** + **"Pizza Napolitana"**
5. En sección "Contenido" → Clic en **"✨ Generar con IA"**
6. Modal se abre:
   - **Plataforma destino:** [Instagram | Facebook | WhatsApp]
   - **Objetivo:** [Conversión | Engagement | Branding]
   - **Tono:** [Informal | Juvenil | Premium]
7. Usuario selecciona:
   - Instagram
   - Conversión
   - Informal
8. Clic en **"Generar"**
9. IA genera:
   - **Texto:** "🍕🍕 ¡Martes de pizzas! Lleva 2 por el precio de 1 🔥 Pizza Margarita + Napolitana. Válido solo hoy 👉 Ordena ya"
   - **Hashtags sugeridos:** #PromoPizzas #MartesDeOfertas #LaPiazza
10. Usuario visualiza preview del post
11. Usuario puede:
    - Aceptar
    - Editar texto manualmente
    - Regenerar con otro tono
12. Usuario edita: agrega emoji 🍕 extra
13. Clic en **"Guardar campaña"**
14. Sistema guarda campaña + Registra en Historial:
    - Tipo: "Campaña de marketing"
    - Plataforma: "Instagram"
    - Estado: "Editado"
    - Productos asociados: [Pizza Margarita, Pizza Napolitana]

---

### FU-05: Configurar Automatización Inteligente (Solo Premium)

**Actor:** Administrador de Negocio

**Precondición:** Plan Premium activo

**Flujo principal:**

1. Usuario navega a **Automatizaciones**
2. Clic en **"Nueva Automatización Inteligente"**
3. Modal se abre:
   - **Nombre:** "Promoción Semanal Automática"
   - **Trigger:** [Cada lunes 9:00 AM]
   - **Acción:** [Generar promoción]
   - **Parámetros:**
     - Producto: [Producto más vendido de la semana]
     - Tipo de promoción: [Descuento 15%]
     - Plataforma: [WhatsApp]
     - Tono: [Informal]
   - **Modo de publicación:**
     - ⬤ **Enviar a cola de aprobación** (recomendado)
     - ⬜ Publicar automáticamente (requiere confirmación)
4. Usuario selecciona "Enviar a cola de aprobación"
5. Clic en **"Crear Automatización"**
6. Sistema guarda regla
7. **Lunes siguiente, 9:00 AM:**
   - Trigger se ejecuta
   - IA genera promoción según parámetros
   - Promoción va a **Cola de Aprobación**
   - Administrador recibe notificación: "Tienes 1 promoción pendiente de revisión"
8. Usuario navega a **Automatizaciones** → **Cola de Aprobación**
9. Visualiza promoción generada:
   - Producto: "Pizza Margarita" (más vendida la semana pasada)
   - Texto: "🍕 Feliz lunes! Hoy Pizza Margarita con 15% OFF 🔥 Solo por WhatsApp"
10. Usuario revisa → Opciones:
    - **Aprobar y publicar**
    - **Editar antes de publicar**
    - **Descartar**
11. Usuario clic en **"Aprobar y publicar"**
12. Sistema:
    - Publica promoción en WhatsApp Business
    - Registra en Historial:
      - Tipo: "Automatización inteligente"
      - Regla: "Promoción Semanal Automática"
      - Estado: "Aprobado"

---

## 10. Wireframes Conceptuales

### Wireframe 1: Botón de IA Integrado en Formulario de Producto

```
┌─────────────────────────────────────────────────────┐
│ Editar Producto: Pizza Margarita                    │
├─────────────────────────────────────────────────────┤
│ Nombre del Producto                                 │
│ ┌───────────────────────────────────────────────┐   │
│ │ Pizza Margarita                               │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│ Descripción                                         │
│ ┌───────────────────────────────────────────────┐   │
│ │ Tomate, mozzarella fresca, albahaca...        │   │
│ │                                               │   │
│ └───────────────────────────────────────────────┘   │
│ [✨ Generar con IA]  [🌐 Traducir]                  │
│                                                     │
│ Precio                Categoría                     │
│ ┌─────────┐          ┌──────────────┐              │
│ │ $12.90  │          │ Pizzas ▼     │              │
│ └─────────┘          └──────────────┘              │
│                                                     │
│ [Cancelar]                    [Guardar Producto]    │
└─────────────────────────────────────────────────────┘
```

---

### Wireframe 2: Modal de Generación de Descripción con IA

```
┌───────────────────────────────────────────────────────┐
│ ✨ Generar Descripción con IA                         │
├───────────────────────────────────────────────────────┤
│                                                       │
│ Producto: Pizza Margarita                             │
│                                                       │
│ Tono                                                  │
│ ○ Formal    ⬤ Informal    ○ Juvenil    ○ Premium     │
│                                                       │
│ Longitud                                              │
│ ○ Corta     ⬤ Media       ○ Larga                    │
│                                                       │
│ Idioma                                                │
│ ┌─────────────────────┐                              │
│ │ Español ▼           │                              │
│ └─────────────────────┘                              │
│                                                       │
│ ┌──────────────────────────────────────────────────┐ │
│ │ ✅ Resaltar ingredientes principales             │ │
│ │ ✅ Incluir sugerencia de maridaje                │ │
│ │ ⬜ Mencionar preparación artesanal               │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│                   [Cancelar]  [Generar]               │
└───────────────────────────────────────────────────────┘
```

---

### Wireframe 3: Selección de Variantes Generadas

```
┌─────────────────────────────────────────────────────────────┐
│ Selecciona la descripción que mejor represente tu producto  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⬤ Variante 1 (Recomendada)                             │ │
│ │ ────────────────────────────────────────────────────    │ │
│ │ Una pizza clásica que nunca falla: tomate, mozzarella   │ │
│ │ fresca y albahaca sobre masa artesanal. Simple,         │ │
│ │ deliciosa y perfecta para cualquier ocasión. 🍕         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ○ Variante 2                                            │ │
│ │ ────────────────────────────────────────────────────    │ │
│ │ La reina de las pizzas. Salsa de tomate casera,         │ │
│ │ mozzarella de búfala y hojas frescas de albahaca.       │ │
│ │ Sencilla pero inolvidable.                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ○ Variante 3                                            │ │
│ │ ────────────────────────────────────────────────────    │ │
│ │ ¿Por qué complicarse? Tomate, queso, albahaca. Tres     │ │
│ │ ingredientes, sabor infinito. La pizza que conquistó    │ │
│ │ el mundo. 🌍🍕                                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│        [Regenerar]     [Cancelar]     [Usar Seleccionada]   │
└─────────────────────────────────────────────────────────────┘
```

---

### Wireframe 4: Historial de IA (Pantalla Administrativa)

```
┌───────────────────────────────────────────────────────────────────────┐
│ 🤖 Historial de Inteligencia Artificial                              │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ Filtros:  [Todos ▼]  [Última semana ▼]  [Catálogo ▼]  [🔍 Buscar]   │
│                                                                       │
├──────────┬────────────┬──────────────┬───────────────┬──────────────┤
│ Fecha    │ Tipo       │ Módulo       │ Estado        │ Usuario      │
├──────────┼────────────┼──────────────┼───────────────┼──────────────┤
│ 07/06/26 │ Descripción│ Catálogo     │ ✅ Aprobado   │ Admin        │
│ 10:35 AM │ Producto   │ de Productos │               │              │
│          │            │              │               │              │
│ 📝 Pizza Margarita                                                   │
│ "Una pizza clásica que nunca falla: tomate, mozzarella..."           │
│                                                  [Ver Detalle]        │
├──────────┼────────────┼──────────────┼───────────────┼──────────────┤
│ 07/06/26 │ Traducción │ Idiomas      │ ✏️ Editado    │ Admin        │
│ 09:12 AM │            │              │               │              │
│          │            │              │               │              │
│ 🌐 5 productos → Inglés                                              │
│ "Pizza Margarita, Polvo na Brasa, Carpaccio..."                      │
│                                                  [Ver Comparación]    │
├──────────┼────────────┼──────────────┼───────────────┼──────────────┤
│ 06/06/26 │ Campaña    │ Marketing    │ 🚀 Publicado  │ Admin        │
│ 05:20 PM │ Marketing  │              │               │              │
│          │            │              │               │              │
│ 📢 Promoción 2x1 Pizzas - Instagram                                  │
│ "🍕🍕 ¡Martes de pizzas! Lleva 2 por el precio de 1..."              │
│                                                  [Ver Campaña]        │
├──────────┼────────────┼──────────────┼───────────────┼──────────────┤
│ 05/06/26 │ Imagen     │ Multimedia   │ ❌ Descartado │ Editor       │
│ 02:45 PM │ Optimizada │              │               │              │
│          │            │              │               │              │
│ 🖼️ pizza-napolitana.jpg                                             │
│ Mejoras: Iluminación, Nitidez                                        │
│                                                  [Ver Antes/Después]  │
└──────────┴────────────┴──────────────┴───────────────┴──────────────┘
│                                                                       │
│ Mostrando 4 de 47 registros                            [< 1 2 3 >]   │
└───────────────────────────────────────────────────────────────────────┘
```

---

### Wireframe 5: Optimización de Imagen - Comparación Antes/Después

```
┌─────────────────────────────────────────────────────────────┐
│ 🖼️ Mejorar Imagen con IA                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌────────────────────┐         ┌────────────────────┐      │
│ │                    │         │                    │      │
│ │    ANTES           │         │    DESPUÉS         │      │
│ │                    │         │                    │      │
│ │  [Imagen original] │ 〈═══〉  │ [Imagen mejorada]  │      │
│ │   (más oscura)     │         │  (más iluminada)   │      │
│ │                    │         │                    │      │
│ │                    │         │                    │      │
│ └────────────────────┘         └────────────────────┘      │
│                                                             │
│ Mejoras aplicadas:                                          │
│ ✅ Iluminación (+25%)                                       │
│ ✅ Nitidez (+15%)                                           │
│ ✅ Optimización de colores                                  │
│                                                             │
│ 💾 La imagen original se guardará como backup automático    │
│                                                             │
│                [Descartar]  [Ajustar]  [Aplicar Mejora]     │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. Consideraciones Técnicas

### 11.1 Proveedor de IA

**Opciones arquitectónicas:**

- **OpenAI GPT-4** (generación de texto)
- **Claude (Anthropic)** (generación de texto contextual)
- **Stable Diffusion / DALL-E** (generación/optimización de imágenes)
- **Modelo propio fine-tuned** (opcional, para mayor control)

**Recomendación:** Iniciar con OpenAI GPT-4 para texto + servicio de optimización de imágenes (Cloudinary AI, Imgix, etc.).

### 11.2 Arquitectura de API

```
Cliente (Frontend)
    ↓
API Gateway
    ↓
Servicio de IA (Backend)
    ↓
    ├─> OpenAI API (texto)
    ├─> Servicio de Optimización de Imágenes (imágenes)
    └─> Base de Datos (Historial de IA)
```

**Endpoints principales:**

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/ai/generate-description` | POST | Generar descripción de producto |
| `/api/ai/translate` | POST | Traducir contenido |
| `/api/ai/generate-campaign` | POST | Generar contenido de marketing |
| `/api/ai/optimize-image` | POST | Optimizar imagen |
| `/api/ai/history` | GET | Obtener historial de IA |
| `/api/ai/approve` | POST | Aprobar contenido generado |
| `/api/ai/discard` | POST | Descartar contenido generado |

### 11.3 Estructura de Datos - Historial de IA

```json
{
  "id": "ai-history-12345",
  "timestamp": "2026-06-07T10:35:00Z",
  "userId": "user-admin-001",
  "businessId": "business-la-piazza",
  "type": "product_description",
  "module": "catalog",
  "inputData": {
    "productId": "product-pizza-margarita",
    "productName": "Pizza Margarita",
    "existingDescription": null,
    "parameters": {
      "tone": "informal",
      "length": "medium",
      "language": "es"
    }
  },
  "outputData": {
    "variants": [
      {
        "id": "variant-1",
        "text": "Una pizza clásica que nunca falla: tomate, mozzarella fresca y albahaca sobre masa artesanal. Simple, deliciosa y perfecta para cualquier ocasión. 🍕",
        "selected": true
      },
      {
        "id": "variant-2",
        "text": "La reina de las pizzas. Salsa de tomate casera, mozzarella de búfala y hojas frescas de albahaca. Sencilla pero inolvidable.",
        "selected": false
      }
    ]
  },
  "finalContent": "Una pizza clásica que nunca falla: tomate, mozzarella fresca y albahaca sobre masa artesanal. Simple, deliciosa y perfecta para cualquier ocasión. 🍕",
  "status": "approved",
  "edited": false,
  "associatedResourceId": "product-pizza-margarita",
  "associatedResourceType": "product"
}
```

### 11.4 Seguridad

**Consideraciones:**

- **API Keys de IA:** Nunca exponer en frontend, manejar en backend
- **Rate Limiting:** Limitar generaciones por negocio según plan (100/mes Business, ilimitado Premium)
- **Validación de Input:** Sanitizar texto de entrada para evitar prompt injection
- **Auditoría:** Todo contenido generado debe registrarse (compliance, auditoría)

### 11.5 Performance

**Optimizaciones:**

- **Caché de traducciones comunes:** Si 10 negocios piden traducir "Pizza Margarita" → cachear resultado
- **Procesamiento asíncrono de imágenes:** No bloquear UI mientras optimiza
- **Batch processing para traducciones:** Traducir múltiples productos en una sola llamada a la API
- **CDN para imágenes optimizadas:** Servir desde CDN después de optimizar

### 11.6 Escalabilidad

**Arquitectura multi-tenant:**

- Cada negocio tiene su propia cuota de generaciones
- Historial de IA particionado por `businessId`
- Cache compartido (traducciones comunes) pero contenido privado por negocio

**Estimación de carga:**

- 1000 negocios activos
- Promedio 50 generaciones/mes por negocio (plan Business)
- Total: ~50,000 llamadas a API de IA/mes
- Costo estimado: $0.002/llamada → ~$100/mes en IA (escalable)

---

## 12. Casos de Uso Prácticos

### Caso 1: Restaurante Premium con Poco Tiempo

**Contexto:**

"La Piazza" acaba de contratar plan Premium. Tienen 40 productos sin descripciones. Necesitan lanzar menú digital en 48 horas.

**Flujo con IA:**

1. Administrador va a Catálogo de Productos
2. Selecciona los 40 productos → Clic en "Generar descripciones con IA (batch)"
3. Sistema muestra modal:
   - Tono: **Premium** (seleccionado automáticamente por tipo de negocio)
   - Longitud: **Media**
   - Idioma: **Español + Inglés** (restaurante en zona turística)
4. IA genera 40 descripciones en 2 minutos
5. Administrador revisa las 5 primeras → Aprueba estilo
6. Clic en "Aprobar todas" → 40 productos ahora tienen descripciones profesionales
7. **Tiempo total:** 15 minutos vs 4 horas manualmente

**Resultado:** Menú publicado el mismo día con contenido de calidad.

---

### Caso 2: Cafetería con Promociones Semanales

**Contexto:**

"Café Central" quiere promociones automáticas cada lunes en Instagram. Plan Premium.

**Flujo con Automatización Inteligente:**

1. Administrador va a **Automatizaciones**
2. Crea regla:
   - **Trigger:** Cada lunes 8:00 AM
   - **Acción:** Generar promoción del producto más vendido la semana pasada
   - **Plataforma:** Instagram
   - **Tono:** Juvenil
   - **Modo:** Enviar a cola de aprobación
3. **Lunes siguiente:**
   - IA detecta que "Cappuccino Vainilla" fue el más vendido
   - Genera post: "☕ ¡Feliz lunes! Cappuccino Vainilla con 20% OFF hoy 🔥 El favorito de la semana pasada ahora con descuento. Solo hasta las 18:00 ⏰"
   - Administrador recibe notificación
   - Revisa → Aprueba → Publica
4. **Resultado:** Promoción semanal automática sin trabajo manual.

---

### Caso 3: Negocio Multiidioma sin Traductor

**Contexto:**

"Sushi Tokyo" en zona turística. Necesita menú en Español, Inglés, Portugués, Japonés. No tiene traductor.

**Flujo con IA:**

1. Administrador carga productos en Español (idioma principal)
2. Va a **Idiomas** → Selecciona todos los productos
3. Clic en "Traducir a múltiples idiomas"
4. Selecciona: **Inglés, Portugués, Japonés**
5. IA traduce preservando nombres japoneses de platos (e.g., "Nigiri de Salmón" → "Salmon Nigiri" en inglés)
6. Administrador revisa traducciones al Japonés (idioma sensible) → Edita 2 productos
7. Aprueba el resto
8. **Resultado:** Menú completo en 4 idiomas en 30 minutos vs semanas esperando traductor profesional.

---

### Caso 4: Mejora de Fotos de Productos

**Contexto:**

"Burger House" tiene 20 fotos de productos tomadas con celular en luz pobre.

**Flujo con IA:**

1. Administrador va a **Multimedia**
2. Selecciona las 20 fotos → Clic en "Optimizar con IA (batch)"
3. IA procesa imágenes:
   - Mejora iluminación
   - Aumenta nitidez
   - Optimiza colores
4. Sistema muestra galería antes/después
5. Administrador revisa → Aprueba 18, descarta 2 (sobre-procesadas)
6. **Resultado:** 18 fotos profesionales sin fotógrafo ni edición manual.

---

## 13. Roadmap de Desarrollo

### Fase 1: MVP (Mes 1-2)

**Objetivo:** Funcionalidades básicas de IA integradas en Catálogo y Marketing.

**Entregables:**

- ✅ Generación de descripciones de productos (con variantes)
- ✅ Traducción inteligente (preservando nombres propios)
- ✅ Generación de contenido de marketing (Instagram, Facebook)
- ✅ Historial de IA básico (registro de generaciones)
- ✅ Integración con OpenAI GPT-4
- ✅ Límites por plan (100 generaciones/mes Business, ilimitado Premium)

**No incluye:** Optimización de imágenes, Automatizaciones.

---

### Fase 2: Optimización Visual (Mes 3)

**Objetivo:** Añadir mejora inteligente de imágenes.

**Entregables:**

- ✅ Optimización de imágenes con IA
- ✅ Preview antes/después
- ✅ Backup automático de originales
- ✅ Integración con servicio de procesamiento de imágenes (Cloudinary AI)

---

### Fase 3: Automatizaciones Inteligentes (Mes 4-5)

**Objetivo:** Automatizaciones programadas con IA (solo Premium).

**Entregables:**

- ✅ Configuración de reglas de automatización
- ✅ Cola de aprobación de contenido generado automáticamente
- ✅ Notificaciones de contenido pendiente
- ✅ Modo "Publicación automática" (con confirmación explícita)

---

### Fase 4: Mejoras Avanzadas (Mes 6+)

**Objetivo:** IA contextual y sugerencias proactivas.

**Entregables:**

- ✅ Sugerencias proactivas ("Producto X no tiene descripción en Inglés — ¿generar?")
- ✅ Generación de hashtags inteligentes (análisis de tendencias)
- ✅ Detección de inconsistencias (producto sin imagen, descripción incompleta)
- ✅ A/B testing automático de variantes de contenido (conectado con Estadísticas)
- ✅ IA contextual: "Hoy es Día de la Madre — ¿generar campaña?"

---

## 14. Métricas de Éxito

### KPIs del Módulo

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| **Tasa de adopción de IA** | 60% de negocios usan IA al menos 1 vez/mes | % de negocios con registros en Historial |
| **Tasa de aprobación de contenido** | 70% de contenido generado es aprobado sin editar | (Aprobados sin editar) / Total generado |
| **Tiempo ahorrado** | 50% reducción en tiempo de creación de contenido | Comparación antes/después de usar IA |
| **Satisfacción del usuario** | NPS > 8 en funcionalidades de IA | Encuesta post-uso |
| **Uso de Automatizaciones** | 30% de usuarios Premium usan Automatizaciones | % de Premium con al menos 1 regla activa |

---

## 15. Consideraciones de UX

### UX-01: IA Invisible

**Principio:** La IA no debe ser protagonista, sino asistente.

**Implementación:**

- No crear pantalla "IA" separada
- Integrar botones de IA contextualmente en cada módulo
- Usar iconos sutiles (✨) sin saturar la interfaz
- Evitar términos técnicos ("GPT", "modelo", "tokens")

---

### UX-02: Transparencia

**Principio:** El usuario debe saber siempre cuándo la IA está actuando.

**Implementación:**

- Indicador claro "Generado con IA" en contenido
- Historial completo de acciones de IA
- Notificaciones cuando Automatizaciones generan contenido

---

### UX-03: Control Total

**Principio:** El usuario siempre tiene la última palabra.

**Implementación:**

- Todo contenido generado es editable
- Opción de descartar sin penalización
- Modo "Regenerar" cuando el resultado no convence
- Confirmación explícita antes de publicar automáticamente

---

### UX-04: Feedback Inmediato

**Principio:** El usuario debe ver progreso mientras la IA trabaja.

**Implementación:**

- Spinners con mensajes: "Generando descripción...", "Traduciendo productos..."
- Progress bar en batch processing: "Traduciendo 5/20 productos..."
- Preview antes de aprobar (especialmente en imágenes)

---

## 16. Preguntas Frecuentes (FAQ)

### ¿La IA reemplazará el contenido sin permiso?

**Respuesta:** No. Toda acción de IA requiere aprobación explícita del usuario, excepto en Automatizaciones configuradas con modo "Publicación automática" (requiere confirmación del Administrador).

---

### ¿Qué sucede si el plan se degrada de Premium a Business?

**Respuesta:**

- Las Automatizaciones se pausan automáticamente
- El Historial de IA se conserva (solo lectura)
- Las funcionalidades básicas (generación, traducción) siguen disponibles
- Las generaciones se limitan a 100/mes

---

### ¿La IA puede generar contenido ofensivo o inapropiado?

**Respuesta:** La plataforma implementa filtros de contenido y moderación automática. Además, todo contenido pasa por revisión humana antes de publicarse (excepto Automatizaciones en modo automático, las cuales son responsabilidad del negocio).

---

### ¿Las traducciones son exactas?

**Respuesta:** La IA genera traducciones contextualizadas preservando nombres propios y terminología gastronómica. Sin embargo, siempre se recomienda revisión manual para idiomas sensibles o contenido legal.

---

### ¿Qué sucede si la API de IA falla?

**Respuesta:**

- Sistema muestra mensaje: "Servicio de IA temporalmente no disponible"
- Usuario puede:
  - Crear contenido manualmente
  - Intentar nuevamente más tarde
- No afecta contenido ya aprobado

---

## 17. Glosario

| Término | Definición |
|---------|------------|
| **IA Transversal** | Servicio que opera en múltiples módulos sin pantalla propia |
| **Generación** | Creación de contenido (texto/imagen) por IA |
| **Variante** | Versión alternativa de contenido generado con diferente tono/estilo |
| **Historial de IA** | Registro centralizado de todas las acciones de IA |
| **Automatización Inteligente** | Regla programada donde IA genera contenido según triggers |
| **Cola de Aprobación** | Contenido generado automáticamente pendiente de revisión |
| **Batch Processing** | Procesar múltiples elementos simultáneamente (ej: traducir 20 productos) |
| **Prompt Injection** | Intento malicioso de manipular IA con inputs específicos (mitigado con validación) |

---

## 18. Conclusión

El **Motor de Inteligencia Artificial** es el diferenciador competitivo de la plataforma.

**Valor principal:**

- **Reducción de tiempo:** Automatiza tareas repetitivas
- **Mejora de calidad:** Genera contenido profesional consistente
- **Escalabilidad:** Permite a negocios pequeños competir con grandes cadenas
- **Experiencia multiidioma:** Elimina barrera del idioma para negocios turísticos

**Principios arquitectónicos:**

- ✅ Asistencia silenciosa (no protagonismo)
- ✅ Control humano siempre prevalece
- ✅ Trazabilidad completa
- ✅ Sin publicación automática sin autorización

---

**Documento preparado para:**

- Equipo de desarrollo (backend, frontend, DevOps)
- Product Managers
- UX/UI Designers
- Stakeholders técnicos

**Próximos pasos:**

1. Validar especificaciones con equipo técnico
2. Definir arquitectura de microservicios
3. Seleccionar proveedor de IA (OpenAI vs Anthropic vs propio)
4. Priorizar Fase 1 (MVP) para desarrollo

---

**Fin del documento**
