# MÓDULO 05 · MULTIMEDIA

## Visión General

El módulo **Multimedia** es la biblioteca central de recursos visuales de cada negocio dentro de la plataforma SaaS multiempresa de menús digitales.

Su función principal es:
- Almacenar, organizar y administrar todas las imágenes y videos
- Optimizar automáticamente archivos para garantizar rendimiento
- Servir como fuente única de recursos visuales para todos los módulos
- Habilitar mejoras visuales asistidas por IA según el plan contratado
- Mantener trazabilidad de dónde se utiliza cada archivo

Este módulo garantiza una experiencia rápida, visualmente atractiva y consistente en toda la plataforma.

---

## Roles y Permisos

### Administrador de Negocio
Tiene control total sobre la biblioteca multimedia de su negocio:
- ✅ Subir imágenes y videos
- ✅ Organizar, etiquetar y clasificar archivos
- ✅ Reemplazar archivos existentes
- ✅ Eliminar archivos no utilizados
- ✅ Asignar recursos a productos, promociones y campañas
- ✅ Utilizar herramientas de mejora visual con IA (según plan)
- ✅ Ver estadísticas de uso de cada archivo
- ✅ Exportar archivos cuando sea necesario

### Editor
Acceso limitado según permisos asignados:
- ✅ Puede gestionar únicamente los recursos autorizados
- ✅ Puede subir archivos dentro de su ámbito permitido
- ✅ Puede reemplazar archivos solo si tiene permisos
- ⛔ No puede eliminar archivos fuera de su ámbito
- ⛔ No puede acceder a archivos institucionales o de campañas globales

### Super Administrador
Acceso total multiplataforma con fines de soporte:
- ✅ Puede acceder a cualquier biblioteca multimedia de cualquier negocio
- ✅ Puede corregir problemas técnicos
- ✅ Puede brindar asistencia operativa
- ✅ Puede auditar uso de almacenamiento
- ⛔ Solo interviene cuando sea necesario para soporte o correcciones

---

## Pantalla Principal · Galería de Multimedia

### Qué Muestra

**Galería Central de Recursos Visuales**
Todos los archivos del negocio organizados visualmente en formato galería tipo "media library".

Cada elemento muestra:
- **Miniatura optimizada** (thumbnail)
- **Nombre del archivo**
- **Tipo de archivo** (JPG, PNG, WEBP, MP4, etc.)
- **Fecha de carga**
- **Tamaño del archivo**
- **Estado de uso** (utilizado / sin utilizar)
- **Indicador visual** si está siendo usado en productos, promociones o campañas

---

### Tipos de Contenido Soportados

#### Imágenes
- Fotografías de productos
- Fotografías promocionales
- Fotografías institucionales (logo, fachada, equipo, etc.)
- Material de campañas
- Banners y gráficos

#### Videos
- Videos promocionales
- Videos de productos (preparación, presentación)
- Videos institucionales
- Material de campañas

---

### Sistema de Filtros

Permitir filtrar por:
- **Tipo de archivo**: Imágenes / Videos
- **Estado de uso**: Utilizados / Sin utilizar
- **Fecha**: Últimos agregados / Más antiguos
- **Popularidad**: Más utilizados / Menos utilizados
- **Asociación**: Productos / Promociones / Campañas
- **Búsqueda libre**: Por nombre o etiqueta

Los filtros deben poder combinarse para búsquedas avanzadas.

---

### Panel de Información Detallada

Al **seleccionar un archivo**, mostrar panel lateral o modal con:

**Información Técnica:**
- Vista previa ampliada
- Dimensiones (ancho × alto)
- Tamaño del archivo (KB/MB)
- Formato original
- Fecha de carga
- Usuario que cargó el archivo

**Estado de Uso:**
- Productos asociados (lista con nombres y links)
- Promociones asociadas
- Campañas asociadas
- Secciones del menú donde aparece
- Total de referencias activas

**Acciones Disponibles:**
- Reemplazar archivo
- Mejorar con IA (si disponible)
- Editar nombre y etiquetas
- Descargar archivo original
- Eliminar (solo si no está en uso)

Este panel permite conocer el **impacto de cualquier modificación** antes de realizar cambios.

---

## Flujos de Usuario Principales

### Flujo 1: Subir Nuevo Archivo

**Actor:** Administrador / Editor (según permisos)

**Pasos:**
1. Usuario hace clic en "Subir archivo" o arrastra archivos a la galería
2. Sistema muestra zona de drop o abre selector de archivos
3. Usuario selecciona uno o múltiples archivos
4. Sistema valida:
   - Formato permitido (JPG, PNG, WEBP, MP4, MOV, etc.)
   - Tamaño máximo (según plan contratado)
   - Cuota de almacenamiento disponible
5. Sistema inicia subida con barra de progreso
6. Durante la subida, el sistema:
   - Genera thumbnail optimizado
   - Comprime archivo si excede umbrales definidos
   - Mantiene calidad visual adecuada
   - Extrae metadatos técnicos (dimensiones, formato, peso)
7. Archivo aparece en galería inmediatamente disponible
8. Usuario puede:
   - Editar nombre
   - Agregar etiquetas
   - Asignar a productos o promociones

**Resultado esperado:**
Archivo optimizado, indexado y listo para usar en toda la plataforma.

---

### Flujo 2: Optimización Automática al Cargar

**Actor:** Sistema (automático)

**Pasos:**
1. Usuario sube un archivo de imagen o video
2. Sistema evalúa:
   - **Si es imagen > 2 MB**: comprime a calidad 85% JPEG / convierte a WEBP
   - **Si es imagen > 4000px ancho**: redimensiona manteniendo ratio
   - **Si es video > 50 MB**: reduce bitrate y resolución si excede 1080p
3. Sistema genera versiones optimizadas:
   - Thumbnail (200×200px)
   - Pequeña (600px ancho)
   - Mediana (1200px ancho)
   - Original (según plan, puede conservarse o no)
4. Guarda versión optimizada como archivo principal
5. Registra metadatos: dimensiones, peso original, peso final, % reducción
6. Archivo queda disponible para uso

**Regla de negocio:**
La optimización debe ser **imperceptible visualmente** pero **significativa en peso**, garantizando tiempos de carga rápidos en móviles y conexiones lentas.

---

### Flujo 3: Reemplazar Archivo Existente

**Actor:** Administrador / Editor (según permisos)

**Pasos:**
1. Usuario selecciona archivo en galería
2. Usuario hace clic en "Reemplazar archivo"
3. Sistema muestra:
   - Vista previa del archivo actual
   - Lista de dónde está siendo utilizado (productos, promociones, campañas)
   - Advertencia si está en uso activo
4. Usuario sube nuevo archivo
5. Sistema valida que el nuevo archivo sea del mismo tipo (imagen por imagen, video por video)
6. Sistema muestra confirmación:
   - "Este archivo está siendo utilizado en 8 productos y 2 promociones"
   - "¿Deseas reemplazarlo en todas las referencias automáticamente?"
7. Usuario confirma
8. Sistema:
   - Reemplaza archivo
   - Actualiza todas las referencias automáticamente
   - Mantiene historial de versiones (opcional según plan)
   - Notifica cambio exitoso

**Resultado esperado:**
Todas las referencias al archivo quedan actualizadas instantáneamente sin necesidad de editar producto por producto.

---

### Flujo 4: Mejorar Archivo con IA

**Actor:** Administrador (solo disponible en planes con IA)

**Pasos:**
1. Usuario selecciona una imagen en galería
2. Usuario hace clic en "Mejorar con IA"
3. Sistema muestra opciones de mejora:
   - 🎨 Mejorar iluminación
   - 🌈 Optimizar colores
   - ✨ Aumentar nitidez
   - 📸 Mejorar calidad general
   - 🔲 Corregir perspectiva
   - 🎭 Remover fondo (opcional)
4. Usuario selecciona opciones deseadas
5. Sistema envía imagen al motor de IA
6. Mientras procesa, muestra indicador de progreso
7. Sistema devuelve imagen mejorada
8. Muestra vista comparativa lado a lado:
   - Imagen original | Imagen mejorada
9. Usuario puede:
   - Aceptar (reemplaza original)
   - Guardar como nueva (conserva ambas)
   - Cancelar (descarta mejora)
10. Usuario confirma acción
11. Sistema actualiza archivo según elección

**Resultado esperado:**
Usuario conserva control total sobre la versión final, pudiendo comparar antes de aplicar cambios.

---

### Flujo 5: Eliminar Archivo

**Actor:** Administrador / Editor (según permisos)

**Pasos:**
1. Usuario selecciona archivo en galería
2. Usuario hace clic en "Eliminar"
3. Sistema verifica si el archivo está en uso
4. **Caso A: Archivo NO está en uso**
   - Sistema muestra confirmación simple
   - Usuario confirma
   - Archivo se mueve a papelera (recuperable 30 días)
   - Notificación de eliminación exitosa
5. **Caso B: Archivo SÍ está en uso**
   - Sistema muestra advertencia:
     - "Este archivo está siendo utilizado en:"
     - Lista de productos / promociones / campañas
   - Sistema bloquea eliminación
   - Sugiere: "Primero desasocia este archivo o reemplázalo"
6. Usuario debe desasociar manualmente o reemplazar antes de eliminar

**Resultado esperado:**
Ningún archivo en uso activo puede eliminarse accidentalmente, protegiendo la integridad del menú público.

---

### Flujo 6: Asignar Archivo a Producto

**Actor:** Administrador / Editor

**Pasos:**
1. Usuario navega a módulo Catálogo de Productos
2. Usuario selecciona producto
3. Usuario hace clic en "Agregar imagen" o "Cambiar imagen"
4. Sistema abre selector de multimedia
5. Muestra galería completa de archivos disponibles
6. Usuario puede:
   - Seleccionar archivo existente
   - Subir nuevo archivo directamente
7. Usuario selecciona imagen deseada
8. Sistema asocia imagen al producto
9. Imagen aparece inmediatamente en:
   - Vista previa del producto
   - Menú público (si producto está activo)

**Resultado esperado:**
Integración fluida entre módulo Multimedia y Catálogo de Productos sin duplicar archivos.

---

### Flujo 7: Ver Estadísticas de Uso

**Actor:** Administrador

**Pasos:**
1. Usuario accede a módulo Multimedia
2. Usuario hace clic en "Estadísticas" o ícono de análisis
3. Sistema muestra dashboard con:
   - **Archivos más utilizados** (top 10)
   - **Archivos sin utilizar** (candidatos a eliminar)
   - **Uso de almacenamiento** (MB usados / MB disponibles según plan)
   - **Distribución por tipo** (60% imágenes, 40% videos)
   - **Crecimiento mensual** de biblioteca
4. Usuario puede:
   - Filtrar por rango de fechas
   - Exportar reporte
   - Identificar archivos huérfanos

**Resultado esperado:**
Visibilidad clara del estado de la biblioteca multimedia para optimizar espacio y detectar archivos innecesarios.

---

## Estructura de Datos

### Tabla: `multimedia_files`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único del archivo |
| `business_id` | UUID | Referencia al negocio propietario |
| `uploaded_by` | UUID | Usuario que subió el archivo |
| `file_type` | ENUM | image / video |
| `mime_type` | VARCHAR | image/jpeg, video/mp4, etc. |
| `file_name` | VARCHAR | Nombre del archivo |
| `file_url` | TEXT | URL del archivo almacenado (CDN) |
| `thumbnail_url` | TEXT | URL del thumbnail optimizado |
| `original_size_kb` | INT | Tamaño original del archivo en KB |
| `optimized_size_kb` | INT | Tamaño final optimizado en KB |
| `width` | INT | Ancho en píxeles |
| `height` | INT | Alto en píxeles |
| `tags` | JSON | Etiquetas asignadas ["producto", "promo"] |
| `is_used` | BOOLEAN | Si está siendo utilizado actualmente |
| `usage_count` | INT | Número de referencias activas |
| `created_at` | TIMESTAMP | Fecha de carga |
| `updated_at` | TIMESTAMP | Última modificación |
| `deleted_at` | TIMESTAMP | Soft delete (papelera) |

---

### Tabla: `multimedia_usage`

Registra dónde se usa cada archivo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `file_id` | UUID | Referencia a multimedia_files |
| `entity_type` | ENUM | product / promotion / campaign / menu_section |
| `entity_id` | UUID | ID del producto, promoción, etc. |
| `usage_type` | ENUM | main_image / gallery / banner / video |
| `created_at` | TIMESTAMP | Fecha de asociación |

**Uso:**
Permite rastrear exactamente dónde está siendo utilizado cada archivo y bloquear eliminaciones accidentales.

---

### Tabla: `multimedia_ai_enhancements`

Historial de mejoras aplicadas con IA.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `file_id` | UUID | Archivo original |
| `enhanced_file_id` | UUID | Archivo mejorado resultante |
| `enhancement_type` | JSON | ["lighting", "color", "sharpness"] |
| `user_id` | UUID | Usuario que aplicó mejora |
| `ai_model_version` | VARCHAR | Versión del modelo de IA utilizado |
| `created_at` | TIMESTAMP | Fecha de mejora |

**Uso:**
Auditoría de mejoras aplicadas y posibilidad de revertir si es necesario.

---

## Reglas de Negocio

### RN-MM-01: Cuota de Almacenamiento por Plan
Cada plan tiene un límite de almacenamiento:
- **Plan Básico**: 1 GB
- **Plan Pro**: 10 GB
- **Plan Enterprise**: 100 GB o ilimitado

El sistema debe:
- Mostrar uso actual vs disponible
- Alertar cuando se acerque al límite (80%)
- Bloquear subidas si se excede cuota
- Ofrecer upgrade de plan si es necesario

---

### RN-MM-02: Optimización Automática Obligatoria
Todo archivo cargado debe:
- Optimizarse automáticamente para web
- Reducir peso sin pérdida visual significativa
- Generar thumbnail inmediatamente
- Convertir a formatos modernos (WEBP) cuando sea posible

**Excepción:**
Planes Enterprise pueden optar por conservar originales sin compresión.

---

### RN-MM-03: Protección de Archivos en Uso
Un archivo **NO puede eliminarse** si:
- Está asignado a un producto activo
- Está asignado a una promoción vigente
- Está siendo utilizado en una campaña activa

El sistema debe:
- Bloquear eliminación
- Mostrar lista de referencias activas
- Sugerir desasociar antes de eliminar

---

### RN-MM-04: Reemplazo Automático de Referencias
Al reemplazar un archivo:
- Todas las referencias deben actualizarse automáticamente
- No requiere edición manual de cada producto
- Debe mostrarse confirmación previa del impacto

---

### RN-MM-05: Mejora con IA Solo en Planes Habilitados
La funcionalidad de mejora visual con IA:
- Solo está disponible en planes Pro y Enterprise
- Consume créditos de IA del plan
- Debe mostrar vista previa antes de aplicar cambios
- Usuario siempre conserva control final

---

### RN-MM-06: Soft Delete con Papelera
Archivos eliminados:
- Se mueven a papelera (soft delete)
- Permanecen recuperables por 30 días
- Después de 30 días se eliminan permanentemente
- Administrador puede restaurar desde papelera

---

### RN-MM-07: Versionado de Archivos (Opcional)
En planes Enterprise:
- Se puede conservar historial de versiones
- Permite revertir a versión anterior
- Útil para auditoría y correcciones

---

### RN-MM-08: Formatos Permitidos
**Imágenes:**
- JPG, JPEG
- PNG
- WEBP
- GIF (solo si no excede 5 MB)

**Videos:**
- MP4
- MOV
- WEBM

Cualquier otro formato será rechazado.

---

### RN-MM-09: CDN para Entrega Rápida
Todos los archivos deben:
- Almacenarse en CDN (Content Delivery Network)
- Servirse desde ubicación geográfica más cercana al usuario
- Garantizar tiempos de carga < 2 segundos

---

### RN-MM-10: Metadatos Automáticos
El sistema debe extraer automáticamente:
- Dimensiones (ancho × alto)
- Tamaño del archivo
- Formato y tipo MIME
- Fecha de creación (si está en EXIF)
- Información de cámara (opcional)

---

## Conexión con Otros Módulos

### Catálogo de Productos
**Relación:** Consume recursos multimedia
- Productos seleccionan imágenes desde biblioteca multimedia
- Galería de productos usa múltiples archivos
- Videos de productos se almacenan aquí

**Flujo:**
1. Usuario edita producto
2. Hace clic en "Seleccionar imagen"
3. Abre galería multimedia
4. Selecciona archivo o sube nuevo
5. Archivo se asocia al producto

---

### Marketing y Promociones
**Relación:** Utiliza recursos para campañas
- Banners promocionales
- Gráficos de redes sociales
- Videos promocionales
- Material de email marketing

**Flujo:**
1. Usuario crea campaña
2. Selecciona recursos visuales desde multimedia
3. Recursos se asocian a campaña
4. Pueden reutilizarse en múltiples campañas

---

### IA (Inteligencia Artificial)
**Relación:** Recibe solicitudes de mejora
- Módulo multimedia envía imagen al motor de IA
- IA devuelve versión mejorada
- Usuario aprueba o descarta resultado

**Flujo:**
1. Usuario solicita mejora de imagen
2. Multimedia envía archivo a módulo IA
3. IA procesa y devuelve resultado
4. Multimedia muestra comparación
5. Usuario confirma y archivo se actualiza

---

### Menú Público
**Relación:** Consume recursos optimizados
- Todas las imágenes y videos del menú público provienen de multimedia
- CDN sirve archivos optimizados
- Garantiza carga rápida para clientes finales

**Flujo:**
1. Cliente accede a menú digital
2. Menú público solicita imágenes de productos
3. Multimedia sirve versiones optimizadas desde CDN
4. Cliente ve menú con imágenes de carga rápida

---

### Planes y Suscripciones
**Relación:** Controla cuotas de almacenamiento
- Cada plan define límite de almacenamiento
- Multimedia consulta cuota disponible
- Bloquea subidas si se excede límite
- Sugiere upgrade si es necesario

**Flujo:**
1. Usuario intenta subir archivo
2. Multimedia consulta cuota disponible
3. Si excede límite → bloquea subida y sugiere upgrade
4. Si hay espacio → permite subida

---

### Usuarios y Permisos
**Relación:** Controla acceso a archivos
- Administradores tienen acceso completo
- Editores solo ven archivos autorizados
- Super Administradores pueden auditar cualquier biblioteca

**Flujo:**
1. Usuario accede a multimedia
2. Sistema filtra archivos según permisos
3. Muestra solo archivos permitidos
4. Bloquea acciones no autorizadas

---

## Casos de Uso

### Caso 1: Restaurante Premium Actualiza Galería de Productos

**Contexto:**
Un restaurante premium desea actualizar las fotografías de sus platos estrella porque ahora cuenta con un fotógrafo profesional.

**Flujo:**
1. Administrador accede a Multimedia
2. Filtra por "Productos más utilizados"
3. Identifica 12 platos estrella con fotos antiguas
4. Para cada uno:
   - Selecciona archivo
   - Hace clic en "Reemplazar"
   - Sube nueva fotografía profesional
   - Sistema optimiza automáticamente
   - Sistema actualiza todas las referencias (menú público, promociones, redes sociales)
5. En menos de 10 minutos, el menú completo luce renovado
6. Clientes que escanean el QR ven las nuevas imágenes inmediatamente

**Resultado:**
Actualización masiva de imágenes sin necesidad de editar producto por producto.

---

### Caso 2: Cafetería Utiliza IA para Mejorar Fotos con Smartphone

**Contexto:**
Una cafetería pequeña no tiene presupuesto para fotógrafo profesional, pero quiere que sus fotos luzcan mejor.

**Flujo:**
1. Administrador toma fotos de productos con su smartphone
2. Sube 20 imágenes a Multimedia
3. Sistema optimiza automáticamente (reduce peso, ajusta dimensiones)
4. Para cada imagen:
   - Selecciona archivo
   - Hace clic en "Mejorar con IA"
   - Selecciona: "Mejorar iluminación + Optimizar colores"
   - IA procesa en 5-10 segundos
   - Sistema muestra comparación lado a lado
   - Administrador aprueba
5. Imágenes mejoradas se reemplazan automáticamente
6. Menú público luce profesional sin inversión en fotógrafo

**Resultado:**
Fotos amateur convertidas en presentación profesional mediante IA.

---

### Caso 3: Cadena de Restaurantes Audita Uso de Almacenamiento

**Contexto:**
Una cadena con múltiples sucursales nota que está cerca del límite de almacenamiento de su plan.

**Flujo:**
1. Administrador accede a Multimedia → Estadísticas
2. Sistema muestra:
   - **Uso actual:** 8.7 GB / 10 GB (87%)
   - **Archivos sin utilizar:** 145 archivos (2.3 GB)
   - **Archivos duplicados detectados:** 18 archivos (340 MB)
3. Administrador filtra por "Archivos sin utilizar"
4. Revisa galería de archivos huérfanos
5. Identifica fotos antiguas de promociones vencidas
6. Selecciona en lote y elimina
7. Libera 2.3 GB de espacio
8. Uso baja a 6.4 GB / 10 GB (64%)

**Resultado:**
Optimización de almacenamiento sin necesidad de upgrade de plan.

---

### Caso 4: Food Truck Gestiona Videos Promocionales

**Contexto:**
Un food truck desea mostrar videos cortos de preparación de sus productos para atraer clientes.

**Flujo:**
1. Administrador graba 5 videos cortos (15-30 segundos cada uno)
2. Sube videos a Multimedia
3. Sistema:
   - Comprime automáticamente (reduce de 80 MB a 12 MB cada uno)
   - Genera thumbnail de cada video
   - Extrae duración
4. Administrador asigna videos a productos específicos:
   - Video de preparación de hamburguesa → Producto "Burger Clásica"
   - Video de preparación de tacos → Producto "Tacos al Pastor"
5. Videos aparecen en menú público
6. Clientes pueden reproducir videos al ver producto
7. Tasa de conversión aumenta 30% (dato hipotético)

**Resultado:**
Contenido dinámico en menú público sin afectar rendimiento gracias a optimización automática.

---

## Wireframes Conceptuales

### Wireframe 1: Galería Principal de Multimedia

```
┌─────────────────────────────────────────────────────────┐
│ 📁 Multimedia                    [Subir archivos] [🔍] │
├─────────────────────────────────────────────────────────┤
│ Filtros:                                                │
│ [Todos] [Imágenes] [Videos] [Utilizados] [Sin usar]   │
│                                                         │
│ ┌──────┬──────┬──────┬──────┬──────┬──────┐          │
│ │ 🖼️   │ 🖼️   │ 🎬   │ 🖼️   │ 🖼️   │ 🖼️   │          │
│ │Img-1 │Img-2 │Vid-1 │Img-3 │Img-4 │Img-5 │          │
│ │250KB │180KB │4.2MB │320KB │410KB │190KB │          │
│ │✅ Usado│✅ Usado│⚪ Nuevo│✅ Usado│⚪ Sin  │✅ Usado│          │
│ └──────┴──────┴──────┴──────┴──────┴──────┘          │
│ ┌──────┬──────┬──────┬──────┬──────┬──────┐          │
│ │ 🖼️   │ 🖼️   │ 🖼️   │ 🖼️   │ 🎬   │ 🖼️   │          │
│ │Img-6 │Img-7 │Img-8 │Img-9 │Vid-2 │Img10 │          │
│ └──────┴──────┴──────┴──────┴──────┴──────┘          │
│                                                         │
│ Almacenamiento: ████████░░ 6.4 GB / 10 GB (64%)       │
└─────────────────────────────────────────────────────────┘
```

---

### Wireframe 2: Panel de Información de Archivo

```
┌─────────────────────────────────────────────────────────┐
│ ✖️ Cerrar                         Panel de Información  │
├─────────────────────────────────────────────────────────┤
│ ┌───────────────────────┐                              │
│ │                       │ Nombre: pizza-margarita.jpg  │
│ │   [Vista Previa]      │ Tipo: Imagen JPEG            │
│ │                       │ Dimensiones: 1200 × 800 px   │
│ │                       │ Tamaño: 320 KB               │
│ └───────────────────────┘ Subido: 15/01/2026           │
│                           Por: admin@negocio.com        │
│ Estado: ✅ Utilizado                                    │
│                                                         │
│ ┌─ Usado en ─────────────────────────────────────────┐ │
│ │ 📦 Productos (3)                                   │ │
│ │    • Pizza Margarita (Imagen principal)            │ │
│ │    • Combo Pizzas (Galería)                        │ │
│ │    • Promoción 2×1 (Banner)                        │ │
│ │ 🎯 Campañas (1)                                    │ │
│ │    • Campaña Verano 2026                           │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ [Reemplazar] [Mejorar con IA] [Descargar] [Eliminar]  │
└─────────────────────────────────────────────────────────┘
```

---

### Wireframe 3: Flujo de Mejora con IA

```
┌─────────────────────────────────────────────────────────┐
│ ✨ Mejorar Imagen con IA                               │
├─────────────────────────────────────────────────────────┤
│ Selecciona mejoras a aplicar:                          │
│                                                         │
│ ☑️ Mejorar iluminación                                 │
│ ☑️ Optimizar colores                                   │
│ ☑️ Aumentar nitidez                                    │
│ ☐ Remover fondo                                        │
│ ☐ Corregir perspectiva                                 │
│                                                         │
│ [Procesar imagen]                                      │
│                                                         │
│ ⏳ Procesando... 78%                                   │
│                                                         │
│ ┌─────────────────┬─────────────────┐                 │
│ │   Original      │   Mejorada      │                 │
│ │  [Imagen 1]     │  [Imagen 2]     │                 │
│ └─────────────────┴─────────────────┘                 │
│                                                         │
│ [Cancelar] [Guardar como nueva] [Reemplazar original] │
└─────────────────────────────────────────────────────────┘
```

---

### Wireframe 4: Selector de Multimedia desde Producto

```
┌─────────────────────────────────────────────────────────┐
│ Seleccionar Imagen para: Pizza Margarita               │
├─────────────────────────────────────────────────────────┤
│ [Subir nueva] [Buscar...                          ] 🔍 │
│                                                         │
│ Recientes:                                             │
│ ┌──────┬──────┬──────┬──────┬──────┐                 │
│ │ 🖼️✅ │ 🖼️   │ 🖼️   │ 🖼️   │ 🖼️   │                 │
│ │Pizza │Pasta │Carne │Postre│Bebida│                 │
│ └──────┴──────┴──────┴──────┴──────┘                 │
│                                                         │
│ Todas las imágenes:                                    │
│ [Galería completa similar a Wireframe 1]               │
│                                                         │
│ [Cancelar]                        [Seleccionar imagen] │
└─────────────────────────────────────────────────────────┘
```

---

### Wireframe 5: Dashboard de Estadísticas

```
┌─────────────────────────────────────────────────────────┐
│ 📊 Estadísticas de Multimedia                          │
├─────────────────────────────────────────────────────────┤
│ Almacenamiento                                         │
│ ████████░░ 6.4 GB / 10 GB (64%)                        │
│                                                         │
│ Distribución por tipo:                                 │
│ 🖼️ Imágenes: 5.8 GB (156 archivos)                    │
│ 🎬 Videos:   0.6 GB (8 archivos)                       │
│                                                         │
│ ┌─ Archivos más utilizados ────────────────────────┐  │
│ │ 1. pizza-margarita.jpg      (12 referencias)     │  │
│ │ 2. pasta-carbonara.jpg      (9 referencias)      │  │
│ │ 3. carne-asada.jpg          (8 referencias)      │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌─ Archivos sin utilizar ───────────────────────────┐  │
│ │ Total: 145 archivos (2.3 GB)                      │  │
│ │ [Ver detalles] [Eliminar en lote]                │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ [Exportar reporte]                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Consideraciones Técnicas

### Arquitectura de Almacenamiento

**Opción recomendada: CDN + Object Storage**
- **Object Storage** (S3, Google Cloud Storage, Azure Blob):
  - Almacenamiento escalable
  - Costo por GB bajo
  - Alta disponibilidad
- **CDN** (Cloudflare, CloudFront, Fastly):
  - Distribución geográfica global
  - Cacheo automático
  - Tiempos de carga < 2 segundos

**Flujo:**
1. Usuario sube archivo
2. Backend optimiza y procesa
3. Archivo se almacena en Object Storage
4. URL pública apunta a CDN
5. CDN cachea archivo en múltiples ubicaciones
6. Cliente final descarga desde ubicación más cercana

---

### Optimización de Imágenes

**Estrategia recomendada:**
- Conversión automática a WEBP (soporte moderno)
- Fallback a JPEG para navegadores antiguos
- Compresión inteligente con calidad 85%
- Lazy loading en menú público
- Generación de múltiples tamaños (responsive images)

**Herramientas sugeridas:**
- **Sharp** (Node.js): procesamiento de imágenes rápido
- **ImageMagick**: conversiones avanzadas
- **FFMPEG**: procesamiento de videos

---

### Optimización de Videos

**Estrategia recomendada:**
- Conversión a MP4 con codec H.264
- Reducción de bitrate manteniendo calidad visual
- Resolución máxima: 1080p (Full HD)
- Generación de thumbnail estático
- Streaming adaptativo (HLS) para videos largos

**Límites recomendados:**
- Tamaño máximo por video: 50 MB
- Duración máxima: 60 segundos (menú público)
- Duración ilimitada para videos institucionales

---

### API de Multimedia

**Endpoints principales:**

```
GET    /api/multimedia              - Listar archivos
POST   /api/multimedia              - Subir archivo
GET    /api/multimedia/:id          - Obtener detalles
PUT    /api/multimedia/:id          - Actualizar metadatos
DELETE /api/multimedia/:id          - Eliminar archivo
POST   /api/multimedia/:id/replace  - Reemplazar archivo
POST   /api/multimedia/:id/enhance  - Mejorar con IA
GET    /api/multimedia/stats        - Estadísticas de uso
GET    /api/multimedia/unused       - Archivos sin utilizar
```

---

### Seguridad

**Validaciones obligatorias:**
- Verificar tipo MIME real (no solo extensión)
- Escanear archivos con antivirus (ClamAV, VirusTotal)
- Limitar tamaño máximo de subida
- Restringir formatos permitidos
- Validar permisos antes de cualquier operación

**Protección contra ataques:**
- Firmar URLs de CDN con tiempo de expiración
- Rate limiting en endpoints de subida
- Validar dimensiones máximas de imágenes
- Bloquear scripts embebidos en archivos

---

### Escalabilidad

**Consideraciones:**
- Separar procesamiento de imágenes en workers asíncronos
- Cola de tareas para optimización (RabbitMQ, Redis)
- Cacheo agresivo de thumbnails
- Índices en base de datos para búsquedas rápidas
- Paginación en galería (cargar 50 archivos a la vez)

---

### Auditoría y Trazabilidad

**Registrar:**
- Quién subió cada archivo
- Cuándo fue subido
- Modificaciones realizadas (reemplazos, mejoras)
- Intentos de eliminación bloqueados
- Accesos a archivos (opcional para planes Enterprise)

**Propósito:**
- Compliance y auditoría
- Soporte al cliente
- Resolución de disputas

---

## Roadmap de Evolución

### Fase 1: MVP (Lanzamiento Inicial)
- ✅ Subida de imágenes y videos
- ✅ Galería con filtros básicos
- ✅ Optimización automática
- ✅ Asignación a productos
- ✅ Soft delete con papelera
- ✅ Cuotas de almacenamiento por plan

### Fase 2: Mejoras de UX
- 🔄 Búsqueda avanzada por etiquetas
- 🔄 Organización en carpetas
- 🔄 Carga múltiple con drag & drop
- 🔄 Vista previa ampliada con zoom
- 🔄 Exportación masiva de archivos

### Fase 3: IA y Automatización
- 🚀 Mejora de imágenes con IA
- 🚀 Generación automática de descripciones (alt text)
- 🚀 Detección de duplicados inteligente
- 🚀 Sugerencias de recorte óptimo
- 🚀 Remoción de fondo automática

### Fase 4: Analytics y Optimización
- 📊 Dashboard de estadísticas avanzadas
- 📊 Heatmaps de clics en imágenes
- 📊 Análisis de rendimiento por archivo
- 📊 Recomendaciones de optimización
- 📊 Reportes exportables

---

## Conclusión

El módulo **Multimedia** es el corazón visual de la plataforma.

Su diseño garantiza:
- ✅ Gestión centralizada y organizada de recursos visuales
- ✅ Optimización automática para rendimiento máximo
- ✅ Integración fluida con todos los módulos
- ✅ Escalabilidad para negocios de cualquier tamaño
- ✅ Mejoras visuales asistidas por IA
- ✅ Protección contra eliminaciones accidentales
- ✅ Experiencia rápida para clientes finales

Este módulo permite que cualquier negocio, sin importar su presupuesto fotográfico, pueda presentar un menú digital visualmente atractivo, profesional y de carga rápida.

**Siguiente paso:** Implementar prototipo funcional de galería administrativa para validar experiencia de usuario.
