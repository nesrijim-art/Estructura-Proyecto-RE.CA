# MÓDULO 04 · CATÁLOGO DE PRODUCTOS
## Plataforma SaaS de Menús Digitales Multiempresa

---

## 1. DESCRIPCIÓN GENERAL

### 1.1 Propósito del Módulo

El **Catálogo de Productos** representa el núcleo comercial del negocio y la principal experiencia que visualizará el cliente final al escanear un código QR o acceder mediante un enlace público.

Su función es mostrar los productos de forma clara, atractiva, rápida y adaptada automáticamente al idioma del visitante.

### 1.2 Objetivos Principales

- **Gestión Centralizada:** Administrar todos los productos del negocio desde una única interfaz.
- **Experiencia Multiidioma:** Detectar automáticamente el idioma del dispositivo del visitante y mostrar el catálogo en dicho idioma.
- **Disponibilidad Inteligente:** Controlar cuándo y cómo se muestran los productos según horarios, días y temporadas.
- **Organización Visual:** Permitir al negocio ordenar productos mediante drag & drop con reflejo inmediato en el menú público.
- **Indicadores de Completitud:** Mostrar visualmente el estado de cada producto (imagen, descripción, precio, traducciones).
- **Sincronización Automática:** Toda modificación se refleja instantáneamente en el menú público sin procesos adicionales.

### 1.3 Alcance del Módulo

**Dentro del alcance:**
- Creación, edición y eliminación de productos
- Gestión de categorías personalizables
- Control de disponibilidad (siempre, por horario, por días, temporal)
- Estados del producto (Activo, Pausado, Destacado)
- Traducciones multiidioma
- Etiquetas destacadas (Más vendido, Recomendado, Nuevo, Promoción)
- Reorganización visual drag & drop
- Detección automática de idioma del visitante
- Galería multimedia por producto
- Integración con IA para generación de contenido
- Indicadores de completitud
- Sincronización automática con el menú público

**Fuera del alcance:**
- Gestión de inventario físico
- Sistema de pedidos (módulo separado)
- Procesamiento de pagos (módulo separado)
- Programa de fidelización (módulo separado)
- Sistema de reservas (módulo separado)

---

## 2. ROLES Y PERMISOS DE ACCESO

### 2.1 Administrador de Negocio

**Permisos completos:**
- ✅ Crear productos
- ✅ Editar productos
- ✅ Eliminar productos
- ✅ Organizar categorías (crear, editar, eliminar)
- ✅ Activar o pausar productos
- ✅ Gestionar promociones
- ✅ Actualizar precios
- ✅ Gestionar disponibilidad
- ✅ Reorganizar orden visual (drag & drop)
- ✅ Configurar etiquetas destacadas
- ✅ Gestionar traducciones
- ✅ Acceder a indicadores de completitud
- ✅ Utilizar IA para generación de contenido (según plan)
- ✅ Ver estadísticas de productos

**Restricciones:**
- Ninguna dentro del módulo

### 2.2 Editor

**Permisos limitados:**
- ✅ Editar productos autorizados según permisos asignados
- ✅ Actualizar precios (si el permiso está habilitado)
- ✅ Pausar/activar productos (si el permiso está habilitado)
- ✅ Gestionar traducciones de productos asignados
- ✅ Reorganizar orden visual de productos asignados
- ❌ No puede crear nuevos productos (excepto si el permiso está habilitado)
- ❌ No puede eliminar productos
- ❌ No puede crear o eliminar categorías
- ❌ No puede modificar productos fuera de su alcance

**Restricciones:**
- Solo ve y gestiona productos según permisos definidos en el Módulo de Usuarios y Permisos
- Las acciones permitidas dependen de los permisos granulares asignados por el Administrador

### 2.3 Cliente Final

**Acceso público:**
- ✅ Visualizar catálogo completo en idioma automático
- ✅ Navegar por categorías
- ✅ Ver detalles de productos
- ✅ Ver galería de imágenes
- ✅ Cambiar idioma manualmente (selector opcional)
- ✅ Buscar productos (funcionalidad opcional según plan)
- ❌ No requiere autenticación
- ❌ No puede modificar nada
- ❌ No ve productos pausados o fuera de disponibilidad

**Restricciones:**
- Solo visualiza productos activos y dentro de su disponibilidad configurada
- No tiene acceso al panel de administración

---

## 3. ESTRUCTURA DEL MÓDULO

### 3.1 Componentes Principales

#### A. Gestor de Categorías
- Lista completa de categorías creadas
- Botón para crear nueva categoría
- Opciones de edición y eliminación por categoría
- Reorganización drag & drop de categorías
- Contador de productos por categoría
- Estado de visibilidad (Visible/Oculta)

#### B. Gestor de Productos
- Vista de tarjetas (grid) o lista
- Filtros por categoría, estado, disponibilidad, etiquetas
- Búsqueda por nombre o descripción
- Reorganización drag & drop
- Acciones rápidas (Activar/Pausar, Editar, Duplicar, Eliminar)
- Indicadores visuales de completitud
- Vista previa rápida del producto

#### C. Editor de Producto
- Formulario de creación/edición
- Selector de categoría
- Campos de nombre y descripción
- Gestor de precio
- Cargador de imagen principal
- Galería de imágenes adicionales
- Selector de estado (Activo/Pausado/Destacado)
- Configurador de disponibilidad
- Gestor de etiquetas destacadas
- Panel de traducciones
- Asistente IA (según plan)
- Vista previa en tiempo real

#### D. Configurador de Disponibilidad
- Opción: Disponible siempre
- Opción: Disponible por horario (rangos personalizables)
- Opción: Disponible por días específicos (L, M, M, J, V, S, D)
- Opción: Disponible temporalmente (fecha inicio - fecha fin)
- Zona horaria del negocio
- Vista previa del calendario de disponibilidad

#### E. Panel de Traducciones
- Lista de idiomas disponibles en el plan
- Estado de traducción por idioma (Completo, Parcial, Vacío)
- Editor multiidioma en pestañas
- Botón de generación automática vía IA (según plan)
- Idioma principal (referencia para traducciones)
- Indicador de idioma detectado por defecto

#### F. Indicadores de Completitud
- ✅ Imagen principal cargada
- ✅ Descripción completa
- ✅ Precio configurado
- ✅ Categoría asignada
- ✅ Traducciones disponibles (lista de idiomas)
- ✅ Disponibilidad configurada
- Barra de progreso visual (0-100%)
- Recomendaciones para completar

#### G. Vista Previa Pública
- Simulador del menú público
- Selector de idioma para probar traducciones
- Vista desktop/tablet/mobile
- Modo de previsualización antes de publicar

---

## 4. FLUJOS DE USUARIO

### 4.1 Flujo: Crear un Nuevo Producto

**Actor:** Administrador de Negocio

**Precondiciones:**
- Usuario autenticado como Administrador
- Negocio seleccionado (contexto multiempresa)
- Al menos una categoría creada

**Pasos:**
1. Administrador accede al módulo "Catálogo de Productos"
2. Sistema muestra el listado actual de productos y categorías
3. Administrador hace clic en "Crear Producto"
4. Sistema muestra el Editor de Producto vacío
5. Administrador completa:
   - Nombre del producto (obligatorio)
   - Descripción (obligatorio)
   - Precio (obligatorio)
   - Categoría (obligatorio)
   - Imagen principal (opcional pero recomendado)
   - Galería de imágenes (opcional)
   - Estado inicial (Activo por defecto)
   - Disponibilidad (Siempre por defecto)
   - Etiquetas destacadas (opcional)
6. Administrador revisa indicadores de completitud
7. Si desea usar IA (y el plan lo permite):
   - Hace clic en "Generar con IA"
   - Sistema genera descripción mejorada
   - Administrador revisa y edita si es necesario
8. Administrador hace clic en "Guardar"
9. Sistema valida campos obligatorios
10. Sistema crea el producto
11. Sistema sincroniza automáticamente con el menú público (si está Activo)
12. Sistema muestra confirmación
13. Sistema regresa a la lista de productos con el nuevo producto visible

**Postcondiciones:**
- Producto creado en la base de datos
- Producto visible en el panel de administración
- Si el producto está Activo y dentro de disponibilidad, aparece automáticamente en el menú público

**Flujos alternativos:**

**4.1.1 Campos obligatorios incompletos:**
- En paso 9, si faltan campos obligatorios:
  - Sistema muestra mensajes de error específicos
  - Sistema marca los campos faltantes
  - Administrador completa los campos
  - Retorna al paso 7

**4.1.2 Categoría no existe:**
- En paso 5, si no hay categorías creadas:
  - Sistema muestra mensaje "Crea tu primera categoría"
  - Administrador hace clic en "Crear Categoría"
  - Sistema abre modal de creación de categoría
  - Administrador completa nombre y descripción
  - Sistema crea la categoría
  - Sistema retorna al Editor de Producto
  - Retorna al paso 5

**4.1.3 Uso de IA sin disponibilidad:**
- En paso 7, si el plan no incluye IA:
  - Botón "Generar con IA" aparece deshabilitado con tooltip "Mejora tu plan para usar IA"
  - Administrador completa manualmente
  - Retorna al paso 8

---

### 4.2 Flujo: Editar un Producto Existente

**Actor:** Administrador de Negocio o Editor (con permisos)

**Precondiciones:**
- Usuario autenticado
- Producto existe
- Usuario tiene permisos para editar el producto

**Pasos:**
1. Usuario accede al listado de productos
2. Usuario localiza el producto a editar (por búsqueda o navegación)
3. Usuario hace clic en el producto o en el ícono de edición
4. Sistema carga el Editor de Producto con los datos actuales
5. Usuario modifica los campos deseados:
   - Nombre
   - Descripción
   - Precio
   - Categoría
   - Imágenes
   - Estado
   - Disponibilidad
   - Etiquetas
   - Traducciones
6. Sistema actualiza indicadores de completitud en tiempo real
7. Usuario revisa vista previa
8. Usuario hace clic en "Guardar cambios"
9. Sistema valida los datos
10. Sistema actualiza el producto
11. Sistema sincroniza automáticamente con el menú público
12. Sistema muestra confirmación
13. Sistema regresa al listado de productos con los cambios reflejados

**Postcondiciones:**
- Producto actualizado en la base de datos
- Cambios reflejados instantáneamente en el menú público
- Registro de auditoría de la modificación (quién, cuándo, qué cambió)

**Flujos alternativos:**

**4.2.1 Editor sin permisos suficientes:**
- En paso 5, si el Editor intenta modificar un campo para el que no tiene permiso:
  - Sistema muestra el campo como solo lectura
  - Sistema muestra tooltip "No tienes permiso para editar este campo"
  - Usuario solo puede modificar campos permitidos

**4.2.2 Cambio de estado a Pausado:**
- En paso 5, si el usuario cambia el estado a "Pausado":
  - Sistema muestra advertencia "Este producto dejará de mostrarse en el menú público"
  - Usuario confirma o cancela
  - Si confirma, retorna al paso 6
  - Si cancela, mantiene estado anterior

---

### 4.3 Flujo: Configurar Disponibilidad Inteligente

**Actor:** Administrador de Negocio

**Precondiciones:**
- Usuario autenticado como Administrador
- Producto existe
- Usuario está en el Editor de Producto

**Pasos:**
1. Administrador hace clic en la sección "Disponibilidad"
2. Sistema muestra las opciones de disponibilidad:
   - Disponible siempre (seleccionada por defecto)
   - Disponible por horario
   - Disponible por días específicos
   - Disponible temporalmente
3. Administrador selecciona una opción

**Opción A: Disponible por horario**
4a. Sistema muestra configurador de horarios
5a. Administrador define rangos horarios (ejemplo: 12:00 - 15:00, 19:00 - 23:00)
6a. Administrador puede definir horarios diferentes por día de la semana
7a. Sistema muestra vista previa del calendario de disponibilidad
8a. Administrador confirma configuración

**Opción B: Disponible por días específicos**
4b. Sistema muestra selector de días de la semana
5b. Administrador selecciona los días (L, M, M, J, V, S, D)
6b. Sistema muestra vista previa del calendario
7b. Administrador confirma configuración

**Opción C: Disponible temporalmente**
4c. Sistema muestra selector de fechas
5c. Administrador define fecha de inicio
6c. Administrador define fecha de fin
7c. Sistema calcula días restantes
8c. Sistema muestra vista previa del calendario
9c. Administrador confirma configuración

**Pasos finales:**
9. Sistema guarda la configuración de disponibilidad
10. Sistema actualiza los indicadores de completitud
11. Sistema programa la visibilidad automática del producto según la configuración
12. Sistema muestra confirmación

**Postcondiciones:**
- Configuración de disponibilidad guardada
- Producto se mostrará/ocultará automáticamente según la configuración
- Sistema ejecuta tareas programadas para activar/desactivar visibilidad

**Flujos alternativos:**

**4.3.1 Fechas inválidas (disponibilidad temporal):**
- En paso 6c, si la fecha de fin es anterior a la fecha de inicio:
  - Sistema muestra error "La fecha de fin debe ser posterior a la fecha de inicio"
  - Administrador corrige las fechas
  - Retorna al paso 5c

**4.3.2 Horarios solapados:**
- En paso 5a, si el usuario define horarios que se solapan:
  - Sistema muestra advertencia "Los horarios se solapan"
  - Sistema sugiere unificar los rangos
  - Administrador ajusta o confirma
  - Retorna al paso 7a

---

### 4.4 Flujo: Gestionar Traducciones de un Producto

**Actor:** Administrador de Negocio o Editor (con permisos)

**Precondiciones:**
- Usuario autenticado
- Producto existe
- Plan contratado incluye soporte multiidioma
- Al menos un idioma adicional configurado en el negocio

**Pasos:**
1. Usuario accede al Editor de Producto
2. Usuario hace clic en la pestaña "Traducciones"
3. Sistema muestra:
   - Idioma principal (ejemplo: Español) con contenido completo
   - Lista de idiomas disponibles según el plan
   - Estado de traducción por idioma (Completo, Parcial, Vacío)
4. Usuario selecciona un idioma (ejemplo: Inglés)
5. Sistema muestra formulario con campos traducibles:
   - Nombre del producto
   - Descripción
   - Etiquetas destacadas (si aplica)
6. Usuario tiene dos opciones:

**Opción A: Traducción manual**
7a. Usuario escribe las traducciones manualmente
8a. Sistema guarda automáticamente (auto-save)
9a. Sistema actualiza el estado de traducción (Parcial → Completo)

**Opción B: Traducción con IA (si el plan lo permite)**
7b. Usuario hace clic en "Traducir con IA"
8b. Sistema muestra modal de confirmación "¿Traducir todos los campos vacíos al Inglés?"
9b. Usuario confirma
10b. Sistema envía contenido del idioma principal a la IA
11b. Sistema recibe traducciones generadas
12b. Sistema rellena los campos traducidos
13b. Sistema marca las traducciones como "Generadas por IA" (indicador visual)
14b. Usuario revisa y edita si es necesario
15b. Sistema guarda las traducciones
16b. Sistema actualiza el estado de traducción a "Completo"

**Pasos finales:**
10. Usuario repite el proceso para otros idiomas si es necesario
11. Sistema actualiza los indicadores de completitud
12. Sistema sincroniza las traducciones con el menú público
13. Sistema muestra confirmación

**Postcondiciones:**
- Traducciones guardadas en la base de datos
- Producto disponible en múltiples idiomas en el menú público
- Sistema de detección automática de idioma puede mostrar la versión correcta al visitante

**Flujos alternativos:**

**4.4.1 Plan no incluye multiidioma:**
- En paso 2, si el plan no incluye soporte multiidioma:
  - Pestaña "Traducciones" aparece deshabilitada
  - Sistema muestra mensaje "Mejora tu plan para habilitar traducciones"
  - Flujo termina

**4.4.2 IA no disponible para traducciones:**
- En paso 7b, si el plan no incluye IA:
  - Botón "Traducir con IA" no aparece
  - Usuario solo puede traducir manualmente
  - Retorna a opción A, paso 7a

**4.4.3 Error en traducción automática:**
- En paso 11b, si la IA no puede generar la traducción:
  - Sistema muestra error "No se pudo generar la traducción automática"
  - Sistema sugiere traducción manual
  - Usuario retorna a opción A, paso 7a

---

### 4.5 Flujo: Reorganizar Productos (Drag & Drop)

**Actor:** Administrador de Negocio

**Precondiciones:**
- Usuario autenticado como Administrador
- Al menos dos productos existen en una categoría
- Vista de productos en modo "Organizar"

**Pasos:**
1. Administrador accede al módulo "Catálogo de Productos"
2. Administrador selecciona una categoría o vista "Todos los productos"
3. Administrador hace clic en el botón "Reorganizar"
4. Sistema cambia a modo de reorganización drag & drop
5. Sistema muestra todos los productos de la categoría en su orden actual
6. Administrador arrastra un producto a una nueva posición
7. Sistema muestra indicador visual de la nueva posición
8. Administrador suelta el producto
9. Sistema actualiza el orden visual inmediatamente
10. Sistema guarda automáticamente el nuevo orden
11. Administrador repite el proceso con otros productos si es necesario
12. Administrador hace clic en "Finalizar reorganización"
13. Sistema sincroniza el nuevo orden con el menú público
14. Sistema muestra confirmación "Orden actualizado"
15. Sistema regresa a la vista normal de productos

**Postcondiciones:**
- Orden de productos actualizado en la base de datos
- Orden reflejado instantáneamente en el menú público
- El cliente final ve los productos en el nuevo orden definido

**Flujos alternativos:**

**4.5.1 Cancelar reorganización:**
- En cualquier paso entre 6-11, si el Administrador hace clic en "Cancelar":
  - Sistema descarta los cambios no guardados
  - Sistema restaura el orden original
  - Sistema regresa a la vista normal
  - Flujo termina

**4.5.2 Reorganización por categorías:**
- En paso 2, si el Administrador desea reorganizar categorías completas:
  - Hace clic en "Reorganizar categorías"
  - Sistema muestra las categorías en tarjetas arrastrables
  - Administrador arrastra categorías a nuevas posiciones
  - Sistema actualiza el orden de categorías
  - Orden de categorías se refleja en el menú público
  - Retorna al paso 12

---

### 4.6 Flujo: Cliente Final Visualiza el Catálogo (Menú Público)

**Actor:** Cliente Final (visitante sin autenticación)

**Precondiciones:**
- Negocio tiene al menos un producto activo y dentro de disponibilidad
- Cliente escanea QR o accede mediante enlace público
- Dispositivo del cliente tiene configuración de idioma

**Pasos:**
1. Cliente escanea código QR o accede a enlace público (ejemplo: menu.app/la-piazza)
2. Sistema detecta el idioma configurado en el dispositivo del cliente
3. Sistema verifica si existe traducción del catálogo en ese idioma
4. **Caso A: Idioma disponible**
   - Sistema carga el catálogo en el idioma detectado
5. **Caso B: Idioma no disponible**
   - Sistema carga el catálogo en el idioma principal del negocio
   - Sistema muestra selector de idioma opcional
6. Sistema muestra:
   - Nombre del negocio
   - Logo (si está configurado)
   - Lista de categorías
   - Productos organizados por categoría
7. Cliente navega por las categorías
8. Sistema muestra solo productos que cumplan:
   - Estado: Activo
   - Disponibilidad: Dentro del horario/día/período configurado
9. Cliente hace clic en un producto
10. Sistema muestra modal o página de detalle con:
    - Imagen principal
    - Galería de imágenes (si existe)
    - Nombre del producto
    - Descripción completa
    - Precio
    - Etiquetas destacadas (🔥 Más vendido, ⭐ Recomendado, etc.)
    - Botón de acción (según configuración: "Agregar", "Ver más", "Contactar")
11. Cliente puede:
    - Ver otros productos
    - Cambiar idioma manualmente (si el selector está habilitado)
    - Buscar productos (si la función está habilitada según el plan)
12. Cliente cierra el menú o sale naturalmente

**Postcondiciones:**
- Sistema registra la visualización del catálogo (estadísticas)
- Sistema registra los productos vistos
- Sistema registra el idioma utilizado
- Datos disponibles en el módulo de Estadísticas

**Flujos alternativos:**

**4.6.1 Cambio manual de idioma:**
- En paso 6, si el cliente desea cambiar de idioma:
  - Cliente hace clic en el selector de idioma
  - Sistema muestra lista de idiomas disponibles
  - Cliente selecciona un idioma
  - Sistema recarga el catálogo en el nuevo idioma
  - Retorna al paso 6

**4.6.2 No hay productos disponibles:**
- En paso 8, si ningún producto cumple los criterios de disponibilidad:
  - Sistema muestra mensaje amigable "Estamos preparando nuestro menú. Vuelve pronto"
  - Sistema muestra horarios de disponibilidad (si está configurado)
  - Flujo termina

**4.6.3 Búsqueda de productos:**
- En paso 11, si el cliente desea buscar un producto específico:
  - Cliente escribe en el campo de búsqueda
  - Sistema filtra productos en tiempo real
  - Sistema muestra resultados coincidentes
  - Cliente selecciona un producto de los resultados
  - Retorna al paso 10

---

### 4.7 Flujo: Pausar un Producto Temporalmente

**Actor:** Administrador de Negocio o Editor (con permisos)

**Precondiciones:**
- Usuario autenticado
- Producto existe y está en estado Activo
- Usuario tiene permisos para cambiar el estado del producto

**Pasos:**
1. Usuario accede al listado de productos
2. Usuario localiza el producto que desea pausar
3. Usuario hace clic en el botón de acción rápida "Pausar" o accede al Editor de Producto
4. Sistema muestra modal de confirmación:
   - "¿Pausar [Nombre del Producto]?"
   - "Este producto dejará de mostrarse en el menú público"
5. Usuario confirma
6. Sistema cambia el estado del producto a "Pausado"
7. Sistema guarda el cambio
8. Sistema sincroniza con el menú público
9. Sistema oculta inmediatamente el producto del menú público
10. Sistema muestra confirmación "Producto pausado"
11. Sistema actualiza la vista del listado mostrando el producto con etiqueta "Pausado"

**Postcondiciones:**
- Producto en estado Pausado en la base de datos
- Producto no visible en el menú público
- Producto visible en el panel de administración con indicador "Pausado"
- Registro de auditoría del cambio de estado

**Flujos alternativos:**

**4.7.1 Cancelar pausa:**
- En paso 5, si el usuario cancela:
  - Sistema cierra el modal
  - Sistema mantiene el estado Activo
  - Flujo termina

**4.7.2 Reactivar producto pausado:**
- Si el usuario desea reactivar un producto pausado:
  - Usuario hace clic en el botón "Activar" en un producto pausado
  - Sistema cambia el estado a "Activo"
  - Sistema sincroniza con el menú público
  - Producto vuelve a mostrarse en el menú público (si está dentro de disponibilidad)
  - Sistema muestra confirmación "Producto activado"

---

### 4.8 Flujo: Eliminar un Producto

**Actor:** Administrador de Negocio

**Precondiciones:**
- Usuario autenticado como Administrador
- Producto existe
- Usuario tiene permisos de eliminación (solo Administrador)

**Pasos:**
1. Administrador accede al listado de productos
2. Administrador localiza el producto a eliminar
3. Administrador hace clic en el botón de acción "Eliminar" (ícono de papelera)
4. Sistema muestra modal de confirmación:
   - "¿Eliminar [Nombre del Producto]?"
   - "Esta acción no se puede deshacer"
   - "El producto se eliminará permanentemente del catálogo y del menú público"
5. Administrador escribe el nombre del producto para confirmar (medida de seguridad)
6. Administrador confirma
7. Sistema valida la confirmación
8. Sistema elimina el producto de la base de datos
9. Sistema elimina las traducciones asociadas
10. Sistema elimina las asociaciones con el producto en otros módulos (estadísticas, multimedia)
11. Sistema sincroniza con el menú público
12. Sistema elimina inmediatamente el producto del menú público
13. Sistema muestra confirmación "Producto eliminado"
14. Sistema actualiza el listado de productos

**Postcondiciones:**
- Producto eliminado permanentemente de la base de datos
- Producto no visible en el panel de administración
- Producto no visible en el menú público
- Registro de auditoría de la eliminación
- Recursos multimedia asociados marcados como huérfanos (pueden ser reutilizados)

**Flujos alternativos:**

**4.8.1 Cancelar eliminación:**
- En paso 6, si el Administrador cancela:
  - Sistema cierra el modal
  - Sistema mantiene el producto sin cambios
  - Flujo termina

**4.8.2 Confirmación incorrecta:**
- En paso 7, si el texto ingresado no coincide con el nombre del producto:
  - Sistema muestra error "El nombre no coincide"
  - Sistema mantiene el botón de confirmación deshabilitado
  - Administrador corrige el texto
  - Retorna al paso 6

**4.8.3 Producto con pedidos históricos:**
- En paso 8, si el producto tiene pedidos asociados en el historial:
  - Sistema no elimina físicamente el producto
  - Sistema lo marca como "Eliminado" (soft delete)
  - Producto no visible en catálogo ni menú público
  - Producto mantiene integridad referencial en pedidos históricos
  - Retorna al paso 13

---

## 5. CATEGORÍAS DE PRODUCTOS

### 5.1 Estructura de Categoría

Cada categoría contiene:

**Campos obligatorios:**
- **ID único:** Identificador interno
- **Nombre:** Título de la categoría (traducible)
- **Negocio ID:** Referencia al negocio propietario

**Campos opcionales:**
- **Descripción:** Breve descripción de la categoría (traducible)
- **Ícono:** Representación visual de la categoría
- **Imagen de portada:** Banner visual para la categoría
- **Orden:** Posición en la lista de categorías
- **Estado:** Visible / Oculta
- **Color de acento:** Color personalizado para la categoría
- **Traducciones:** Versiones del nombre y descripción en otros idiomas

### 5.2 Gestión de Categorías

**Operaciones permitidas:**
- Crear nueva categoría
- Editar categoría existente
- Eliminar categoría (solo si no tiene productos asignados)
- Reorganizar categorías (drag & drop)
- Ocultar/mostrar categoría
- Asignar ícono personalizado
- Gestionar traducciones

**Reglas de negocio:**
- Una categoría no puede eliminarse si tiene productos asignados
- Antes de eliminar, el sistema debe mostrar cuántos productos están asignados
- El usuario debe reasignar los productos a otra categoría o eliminarlos primero
- Una categoría oculta no se muestra en el menú público, pero sus productos siguen existiendo
- El orden de las categorías se refleja en el menú público
- Cada negocio puede crear categorías ilimitadas (o según límite del plan)

### 5.3 Categorías por Defecto

Al crear un nuevo negocio, el sistema puede sugerir categorías predeterminadas según el tipo de negocio:

**Restaurante:**
- Entradas
- Platos principales
- Bebidas
- Postres
- Promociones

**Cafetería:**
- Café
- Bebidas frías
- Pastelería
- Snacks
- Promociones

**Bar:**
- Cócteles
- Cervezas
- Vinos
- Bebidas sin alcohol
- Piqueos

**Usuario puede:**
- Aceptar las categorías sugeridas
- Modificarlas
- Eliminarlas
- Crear las suyas propias desde cero

---

## 6. ESTRUCTURA DE PRODUCTO

### 6.1 Campos del Producto

**Campos obligatorios:**
- **ID único:** Identificador interno
- **Negocio ID:** Referencia al negocio propietario
- **Nombre:** Título del producto
- **Descripción:** Texto descriptivo del producto
- **Precio:** Valor monetario
- **Categoría ID:** Referencia a la categoría asignada
- **Estado:** Activo / Pausado / Destacado
- **Fecha de creación:** Timestamp de creación
- **Fecha de modificación:** Timestamp de última actualización

**Campos opcionales:**
- **Imagen principal:** URL o referencia a imagen
- **Galería de imágenes:** Array de URLs o referencias
- **Etiquetas destacadas:** Array de etiquetas (Más vendido, Recomendado, Nuevo, Promoción, Limitado)
- **Disponibilidad:** Objeto con configuración de disponibilidad
- **Traducciones:** Objeto con versiones en otros idiomas
- **SKU:** Código de identificación interno
- **Precio promocional:** Precio alternativo temporal
- **Inicio de promoción:** Fecha de inicio de precio promocional
- **Fin de promoción:** Fecha de fin de precio promocional
- **Orden:** Posición en la lista de productos
- **Notas internas:** Información visible solo para el equipo
- **Creado por:** Usuario que creó el producto
- **Modificado por:** Usuario que realizó la última modificación

### 6.2 Objeto de Disponibilidad

Estructura del objeto de disponibilidad:

```
Disponibilidad {
  tipo: "siempre" | "horario" | "dias" | "temporal"
  
  // Si tipo = "horario"
  horarios: [
    {
      dia: "lunes" | "martes" | ... | "domingo",
      rangos: [
        { inicio: "12:00", fin: "15:00" },
        { inicio: "19:00", fin: "23:00" }
      ]
    }
  ]
  
  // Si tipo = "dias"
  diasPermitidos: ["lunes", "martes", "miercoles", ...]
  
  // Si tipo = "temporal"
  fechaInicio: "2026-06-15",
  fechaFin: "2026-08-31"
  
  zonaHoraria: "America/Caracas"
}
```

### 6.3 Objeto de Traducciones

Estructura del objeto de traducciones:

```
Traducciones {
  idiomaPrincipal: "es",
  
  idiomas: {
    "en": {
      nombre: "Grilled Octopus",
      descripcion: "Fresh octopus grilled to perfection...",
      etiquetas: ["Recommended", "House Special"],
      estado: "completo" | "parcial" | "vacio",
      generadoPorIA: true | false,
      fechaTraduccion: "2026-06-07T10:30:00Z"
    },
    "pt": {
      nombre: "Polvo Grelhado",
      descripcion: "Polvo fresco grelhado na perfeição...",
      etiquetas: ["Recomendado", "Especialidade da Casa"],
      estado: "completo",
      generadoPorIA: true,
      fechaTraduccion: "2026-06-07T10:30:00Z"
    }
  }
}
```

---

## 7. ESTADOS DEL PRODUCTO

### 7.1 Definición de Estados

**Activo:**
- Producto visible en el panel de administración
- Producto visible en el menú público (si está dentro de disponibilidad)
- Puede recibir pedidos (si el módulo de pedidos está habilitado)
- Estado por defecto al crear un producto

**Pausado:**
- Producto visible en el panel de administración con etiqueta "Pausado"
- Producto NO visible en el menú público
- No puede recibir pedidos
- Se mantiene toda la información del producto
- Puede reactivarse en cualquier momento

**Destacado:**
- Producto visible en el panel de administración con etiqueta "Destacado"
- Producto visible en el menú público con posición prioritaria
- Puede tener un diseño visual diferenciado en el menú público
- Puede aparecer en sección especial "Productos destacados"
- Se comporta como Activo + indicador especial

### 7.2 Transiciones de Estado

**Activo → Pausado:**
- Usuario hace clic en "Pausar"
- Sistema oculta el producto del menú público inmediatamente
- Sistema registra la fecha de pausa

**Pausado → Activo:**
- Usuario hace clic en "Activar"
- Sistema muestra el producto en el menú público inmediatamente (si está dentro de disponibilidad)
- Sistema registra la fecha de reactivación

**Activo → Destacado:**
- Usuario marca el producto como destacado
- Sistema mantiene visibilidad pública
- Sistema añade indicador visual de destacado
- Sistema puede mover el producto a sección prioritaria

**Destacado → Activo:**
- Usuario desmarca el producto como destacado
- Sistema mantiene visibilidad pública
- Sistema remueve indicador visual de destacado
- Sistema regresa el producto a su posición normal

**Destacado → Pausado:**
- Usuario pausa un producto destacado
- Sistema remueve el indicador de destacado
- Sistema oculta el producto del menú público
- Al reactivar, el usuario debe volver a marcarlo como destacado si lo desea

---

## 8. ETIQUETAS DESTACADAS

### 8.1 Tipos de Etiquetas

**🔥 Más vendido:**
- Indica que el producto es uno de los más populares
- Puede ser asignada manualmente o automáticamente según estadísticas de ventas
- Color sugerido: Rojo/Naranja

**⭐ Recomendado:**
- Indica que el negocio recomienda especialmente ese producto
- Asignación manual por el administrador
- Color sugerido: Amarillo/Dorado

**🆕 Nuevo:**
- Indica que el producto fue añadido recientemente
- Puede ser asignada automáticamente (productos creados en los últimos 30 días)
- Puede ser asignada manualmente
- Color sugerido: Verde/Azul

**🎯 Promoción:**
- Indica que el producto tiene un precio promocional activo
- Asociada con precio promocional temporal
- Color sugerido: Púrpura/Magenta

**⏰ Limitado:**
- Indica que el producto tiene disponibilidad temporal
- Se muestra automáticamente si el tipo de disponibilidad es "temporal"
- Puede mostrar cuenta regresiva
- Color sugerido: Naranja/Rojo

**🌱 Vegano / Vegetariano:**
- Indica características dietéticas especiales
- Asignación manual
- Color sugerido: Verde

**🌶️ Picante:**
- Indica nivel de picante del producto
- Asignación manual con niveles (suave, medio, picante, muy picante)
- Color sugerido: Rojo

**Sin Gluten / Sin Lácteos:**
- Indica restricciones alimentarias
- Asignación manual
- Color sugerido: Azul

### 8.2 Gestión de Etiquetas

**Reglas de negocio:**
- Un producto puede tener múltiples etiquetas simultáneamente
- Las etiquetas se muestran en orden de prioridad en el menú público
- El negocio puede crear etiquetas personalizadas según su plan
- Las etiquetas son traducibles a otros idiomas
- El sistema puede sugerir etiquetas basándose en datos (ejemplo: estadísticas de ventas)

**Prioridad de visualización (orden sugerido):**
1. Limitado (si aplica)
2. Nuevo (si aplica)
3. Promoción (si aplica)
4. Más vendido
5. Recomendado
6. Etiquetas dietéticas (Vegano, Sin Gluten, etc.)
7. Etiquetas personalizadas

---

## 9. DETECCIÓN AUTOMÁTICA DE IDIOMA

### 9.1 Flujo de Detección

**En el lado del cliente (navegador):**
1. Cliente accede al menú público mediante QR o enlace
2. Sistema detecta el idioma configurado en el navegador del cliente mediante:
   - Header HTTP `Accept-Language`
   - Configuración del navegador `navigator.language`
   - Preferencias de idioma del sistema operativo
3. Sistema extrae el código de idioma (ejemplo: "en", "es", "pt", "fr", "de")
4. Sistema consulta si existe traducción del catálogo en ese idioma
5. **Si existe:** Sistema carga el catálogo en ese idioma
6. **Si no existe:** Sistema carga el catálogo en el idioma principal configurado por el negocio

### 9.2 Idioma Principal del Negocio

Cada negocio debe configurar un **idioma principal** durante su registro:
- Idioma por defecto para todos los contenidos
- Idioma de referencia para traducciones
- Idioma que se muestra si el idioma del visitante no está disponible

**Configuración:**
- Se define en el módulo de configuración del negocio
- Puede cambiarse en cualquier momento
- Al cambiar el idioma principal, el sistema sugiere revisar las traducciones existentes

### 9.3 Idiomas Disponibles Según el Plan

**Plan Básico:**
- 1 idioma (idioma principal solamente)
- Sin detección automática
- Sin traducciones

**Plan Profesional:**
- Hasta 3 idiomas
- Detección automática habilitada
- Traducciones manuales
- Selector de idioma opcional

**Plan Premium:**
- Idiomas ilimitados
- Detección automática habilitada
- Traducciones manuales y automáticas (IA)
- Selector de idioma personalizable
- Estadísticas por idioma

### 9.4 Selector Manual de Idioma

**Características:**
- Componente opcional que puede habilitarse en el menú público
- Muestra banderas o códigos de idioma
- Permite al visitante cambiar manualmente el idioma
- Preferencia se guarda en localStorage del navegador
- En la siguiente visita, el sistema prioriza la preferencia guardada sobre el idioma del navegador

**Posición sugerida:**
- Esquina superior derecha del menú público
- Puede ser un dropdown o botones de idioma
- Diseño discreto que no interfiere con la experiencia principal

### 9.5 Fallbacks de Idioma

**Escenario 1: Traducción parcial**
- Si un producto tiene solo algunos campos traducidos:
  - Sistema muestra los campos traducidos disponibles
  - Campos no traducidos se muestran en el idioma principal
  - Sistema marca visualmente que hay contenido en idioma mixto (opcional)

**Escenario 2: Idioma no disponible**
- Si el idioma detectado no tiene ninguna traducción:
  - Sistema muestra todo el catálogo en el idioma principal
  - Sistema no muestra mensaje de error (experiencia fluida)
  - Si el selector de idioma está habilitado, el visitante puede elegir otro idioma manualmente

**Escenario 3: Categorías vs Productos**
- Si las categorías están traducidas pero los productos no:
  - Categorías se muestran en el idioma detectado
  - Productos se muestran en el idioma principal
  - Sistema mantiene coherencia visual

---

## 10. INDICADORES DE COMPLETITUD

### 10.1 Definición de Completitud

Un producto se considera "completo" cuando cumple con todos los criterios esenciales para una experiencia óptima del cliente final.

### 10.2 Criterios de Completitud

**Nivel 1 - Básico (Mínimo requerido):**
- ✅ Nombre del producto
- ✅ Descripción
- ✅ Precio
- ✅ Categoría asignada
- **Progreso:** 40%

**Nivel 2 - Estándar (Recomendado):**
- ✅ Nivel 1 completo
- ✅ Imagen principal
- ✅ Disponibilidad configurada
- **Progreso:** 70%

**Nivel 3 - Completo (Óptimo):**
- ✅ Nivel 2 completo
- ✅ Al menos una traducción adicional
- ✅ Galería de imágenes (mínimo 2 imágenes)
- ✅ Al menos una etiqueta destacada
- **Progreso:** 100%

### 10.3 Visualización de Indicadores

**En la lista de productos:**
- Barra de progreso visual (0-100%)
- Código de color:
  - Rojo: 0-39% (Incompleto)
  - Amarillo: 40-69% (Básico)
  - Verde: 70-100% (Completo)
- Íconos rápidos:
  - 📷 Imagen presente
  - 🌐 Traducciones disponibles
  - 🏷️ Etiquetas asignadas
  - ⏰ Disponibilidad configurada

**En el editor de producto:**
- Panel lateral con checklist de completitud
- Cada criterio marcado como ✅ Completo o ⚠️ Pendiente
- Recomendaciones contextuales:
  - "Añade una imagen para que el producto sea más atractivo"
  - "Traduce al inglés para alcanzar más clientes"
  - "Configura la disponibilidad para controlar cuándo se muestra"

### 10.4 Filtros por Completitud

El administrador puede filtrar productos por nivel de completitud:
- Incompletos (0-39%)
- Básicos (40-69%)
- Completos (70-100%)
- Sin imagen
- Sin traducciones
- Sin disponibilidad configurada

Esto facilita la identificación de productos que requieren atención.

---

## 11. INTEGRACIÓN CON OTROS MÓDULOS

### 11.1 Módulo de Multimedia

**Relación:**
- El Catálogo de Productos consume imágenes y videos del Módulo de Multimedia
- Cada producto puede tener una imagen principal y una galería
- Las imágenes se almacenan centralizadamente en Multimedia

**Operaciones:**
- Desde el Editor de Producto, el usuario puede:
  - Seleccionar imágenes existentes de la biblioteca multimedia
  - Subir nuevas imágenes directamente
  - Editar/recortar imágenes antes de asignarlas
  - Ver metadatos de las imágenes (tamaño, formato, fecha)

**Sincronización:**
- Si una imagen se elimina del módulo Multimedia:
  - Sistema detecta que está en uso por productos
  - Sistema muestra advertencia antes de eliminar
  - Usuario puede reemplazarla o confirmar eliminación
  - Si se elimina, el producto pierde la referencia pero no se rompe

### 11.2 Módulo de Idiomas

**Relación:**
- El Catálogo de Productos utiliza el Módulo de Idiomas para gestionar traducciones
- Los idiomas disponibles dependen del plan contratado y la configuración del negocio

**Operaciones:**
- Configuración de idioma principal del negocio
- Activación de idiomas adicionales
- Gestión de traducciones por producto
- Traducción automática vía IA (según plan)

**Sincronización:**
- Si se desactiva un idioma en el módulo de Idiomas:
  - Traducciones de productos en ese idioma se mantienen (no se eliminan)
  - Menú público deja de mostrar ese idioma
  - Selector de idioma deja de mostrar esa opción
  - Administrador puede reactivar el idioma sin perder traducciones

### 11.3 Módulo de IA

**Relación:**
- El Catálogo de Productos puede usar IA para generar y mejorar contenido
- Disponibilidad según el plan contratado

**Casos de uso:**
- Generar descripciones de productos a partir del nombre
- Mejorar descripciones existentes (hacerlas más atractivas)
- Traducir automáticamente contenido a otros idiomas
- Generar etiquetas destacadas basándose en el tipo de producto
- Sugerir precios basándose en productos similares (función avanzada)

**Flujo típico:**
1. Usuario crea un producto y escribe solo el nombre
2. Usuario hace clic en "Generar descripción con IA"
3. Sistema envía el nombre a la IA con contexto (tipo de negocio, categoría)
4. IA genera una descripción atractiva
5. Sistema muestra la descripción generada
6. Usuario revisa, edita si es necesario, y guarda

**Restricciones:**
- IA nunca guarda contenido automáticamente sin revisión del usuario
- Usuario siempre puede editar el contenido generado
- Sistema marca visualmente contenido generado por IA
- Uso de IA consume créditos o está limitado según el plan

### 11.4 Módulo de Marketing

**Relación:**
- El Módulo de Marketing utiliza productos del catálogo para campañas y promociones
- Estadísticas de marketing influyen en etiquetas como "Más vendido"

**Operaciones:**
- Seleccionar productos para campañas promocionales
- Crear códigos de descuento vinculados a productos específicos
- Generar contenido para redes sociales con productos destacados
- Programar publicaciones automáticas cuando se añaden productos nuevos

**Sincronización:**
- Si un producto está en una campaña activa:
  - Sistema muestra advertencia antes de pausarlo o eliminarlo
  - Usuario puede confirmar o cancelar la acción
  - Si se pausa, la campaña puede verse afectada

### 11.5 Módulo de Estadísticas

**Relación:**
- El Catálogo de Productos alimenta el Módulo de Estadísticas con eventos y métricas

**Datos registrados:**
- Visualizaciones de producto (cuántas veces se vio)
- Clics en producto (cuántas veces se abrió el detalle)
- Idioma en que se visualizó
- Hora y día de la visualización
- Productos más vistos
- Productos menos vistos
- Tasas de conversión (si hay integración con pedidos)

**Feedback al Catálogo:**
- Sistema puede sugerir automáticamente etiquetas "Más vendido" basándose en estadísticas
- Administrador puede ver métricas directamente en el listado de productos
- Filtros avanzados por rendimiento (más vistos, menos vistos, mejores conversiones)

### 11.6 Módulo de Pedidos (futuro)

**Relación:**
- Cuando el Módulo de Pedidos esté implementado, consumirá productos del catálogo
- Los productos activos y disponibles pueden añadirse al carrito

**Operaciones:**
- Cliente añade producto al carrito desde el menú público
- Sistema verifica disponibilidad en tiempo real
- Sistema bloquea productos pausados o fuera de disponibilidad
- Sistema registra el pedido con referencia al producto

**Reglas de negocio:**
- Un producto no puede eliminarse si tiene pedidos pendientes o históricos
- Si un producto se pausa, no puede añadirse a nuevos pedidos
- Si un producto cambia de precio, los pedidos históricos mantienen el precio original

---

## 12. REGLAS DE NEGOCIO PRINCIPALES

### 12.1 Regla: Sincronización Automática

**Enunciado:**
Toda modificación realizada en el Catálogo de Productos debe reflejarse automáticamente en el Menú Público sin necesidad de procesos manuales de publicación.

**Implicaciones:**
- No existe concepto de "borrador" vs "publicado" (o es opcional según plan avanzado)
- Al guardar un producto Activo, se muestra inmediatamente en el menú público
- Al pausar un producto, desaparece inmediatamente del menú público
- Al cambiar el orden de productos, el cambio es instantáneo
- Al actualizar traducciones, las nuevas versiones se muestran inmediatamente

**Excepciones:**
- Planes avanzados pueden incluir una función "Vista Previa" antes de publicar cambios
- Productos en estado Pausado no se sincronizan con el menú público

### 12.2 Regla: Disponibilidad Automática

**Enunciado:**
El sistema debe evaluar automáticamente la disponibilidad de cada producto y mostrarlo u ocultarlo en el menú público sin intervención manual.

**Implicaciones:**
- Sistema ejecuta tareas programadas (cron jobs) que evalúan disponibilidad
- Al entrar en el horario configurado, el producto aparece automáticamente
- Al salir del horario configurado, el producto desaparece automáticamente
- Si la disponibilidad es temporal y la fecha de fin se alcanza, el producto se oculta
- Sistema considera la zona horaria del negocio para evaluaciones precisas

**Ejemplo:**
- Producto: "Menú de almuerzo"
- Disponibilidad: Lunes a Viernes, 12:00 - 15:00
- Resultado: El producto solo aparece en el menú público de L-V entre las 12:00 y 15:00

### 12.3 Regla: Idioma Detectado Tiene Prioridad

**Enunciado:**
El sistema debe mostrar automáticamente el catálogo en el idioma configurado en el dispositivo del visitante, si dicha traducción existe.

**Implicaciones:**
- No se requiere que el visitante seleccione manualmente el idioma
- Si el idioma no está disponible, se usa el idioma principal sin mostrar error
- Si el visitante cambia manualmente el idioma, esa preferencia se guarda y tiene prioridad en futuras visitas
- Sistema optimiza la experiencia para turistas y visitantes extranjeros

### 12.4 Regla: Integridad Referencial

**Enunciado:**
No se puede eliminar una categoría que tenga productos asignados.

**Implicaciones:**
- Antes de eliminar una categoría, el sistema valida si tiene productos
- Si tiene productos, se muestra mensaje de error con el número de productos asignados
- Usuario debe reasignar los productos a otra categoría o eliminarlos primero
- Esto evita productos huérfanos sin categoría

**Alternativa (soft delete):**
- En lugar de eliminar físicamente la categoría, se marca como "Eliminada"
- Los productos mantienen la referencia, pero la categoría no se muestra
- Usuario puede restaurar la categoría si fue un error

### 12.5 Regla: Productos Pausados No Se Eliminan

**Enunciado:**
Pausar un producto es una acción reversible; eliminarlo es permanente.

**Implicaciones:**
- Pausar: Oculta el producto del menú público, pero mantiene toda la información
- Eliminar: Borra permanentemente el producto (o soft delete si hay historial de pedidos)
- Usuario debe confirmar explícitamente la eliminación
- Sistema sugiere pausar en lugar de eliminar cuando es la primera vez

### 12.6 Regla: Un Producto, Un Negocio

**Enunciado:**
Cada producto pertenece a un único negocio dentro del contexto multiempresa.

**Implicaciones:**
- Los productos no se comparten entre negocios
- Un negocio no puede ver productos de otro negocio
- Si un usuario administra múltiples negocios, debe cambiar de contexto para gestionar productos de cada uno
- Evita contaminación de datos entre negocios independientes

### 12.7 Regla: Precio Obligatorio, Pero Puede Ser Cero

**Enunciado:**
Todo producto debe tener un precio definido, pero puede ser $0 (gratis).

**Implicaciones:**
- Campo precio es obligatorio
- Valor $0 es válido (ejemplo: degustaciones, cortesías, muestras gratis)
- Sistema muestra "Gratis" en lugar de "$0.00" en el menú público
- Si hay precio promocional, debe ser menor al precio regular

### 12.8 Regla: Límites Según el Plan

**Enunciado:**
Las funcionalidades y límites del Catálogo de Productos varían según el plan contratado.

**Implicaciones:**

**Plan Básico:**
- Hasta 50 productos
- 1 idioma
- 3 categorías
- Sin IA
- Sin etiquetas personalizadas
- Sin disponibilidad inteligente (solo Activo/Pausado)

**Plan Profesional:**
- Hasta 200 productos
- 3 idiomas
- 10 categorías
- IA limitada (50 generaciones/mes)
- Etiquetas personalizadas (hasta 5)
- Disponibilidad inteligente completa

**Plan Premium:**
- Productos ilimitados
- Idiomas ilimitados
- Categorías ilimitadas
- IA ilimitada
- Etiquetas personalizadas ilimitadas
- Disponibilidad inteligente completa
- Función de vista previa antes de publicar
- Estadísticas avanzadas por producto

---

## 13. CASOS DE USO DETALLADOS

### 13.1 Caso de Uso: Restaurante de Alta Cocina

**Contexto:**
Restaurante premium con menú cambiante, platos de temporada, y clientela internacional.

**Necesidades:**
- Actualización frecuente de productos
- Traducciones en múltiples idiomas (inglés, portugués, francés)
- Platos destacados del chef
- Disponibilidad por temporada (ejemplo: "Trufa blanca" solo en otoño)
- Imágenes de alta calidad para cada plato

**Solución con el módulo:**
1. Administrador crea categorías: "Entradas", "Platos principales", "Postres", "Vinos"
2. Añade productos con descripciones gourmet generadas por IA y luego refinadas manualmente
3. Configura traducciones en 4 idiomas (español, inglés, portugués, francés)
4. Sube imágenes profesionales de cada plato
5. Marca platos como "Recomendado por el Chef"
6. Configura disponibilidad temporal para platos de temporada
7. Reorganiza productos para destacar los nuevos primero
8. Cliente escanea QR, ve el menú en su idioma automáticamente, y aprecia imágenes de calidad

**Resultado:**
Experiencia premium que refleja la calidad del restaurante, accesible para turistas internacionales.

---

### 13.2 Caso de Uso: Cafetería Rápida

**Contexto:**
Cafetería con menú fijo, rotación rápida de clientes, enfoque en velocidad y claridad.

**Necesidades:**
- Catálogo simple y directo
- Precios claros
- Combos y promociones visibles
- Horarios de disponibilidad para desayuno/almuerzo/cena

**Solución con el módulo:**
1. Administrador crea categorías: "Desayunos", "Almuerzos", "Bebidas", "Postres"
2. Añade productos con nombres cortos y descripciones breves
3. Configura disponibilidad por horario:
   - Desayunos: 7:00 - 11:00
   - Almuerzos: 11:30 - 15:00
4. Marca combos como "Promoción"
5. No usa traducciones (solo idioma local)
6. Usa imágenes simples de archivo o placeholders
7. Cliente escanea QR, ve solo lo disponible en ese momento, y elige rápidamente

**Resultado:**
Menú eficiente que reduce confusión y acelera la decisión de compra.

---

### 13.3 Caso de Uso: Bar de Cócteles

**Contexto:**
Bar especializado en coctelería, menú creativo, ambiente nocturno, público joven.

**Necesidades:**
- Catálogo visualmente atractivo
- Descripciones creativas de cócteles
- Etiquetas como "Creación del bartender", "Clásico", "Nuevo"
- Disponibilidad solo en horario nocturno
- Traducciones para turistas

**Solución con el módulo:**
1. Administrador crea categorías: "Clásicos", "Creaciones de la casa", "Sin alcohol", "Shots"
2. Añade productos con descripciones atractivas (usa IA para inspiración)
3. Configura disponibilidad por horario: 18:00 - 02:00
4. Marca cócteles destacados como "Creación del bartender"
5. Sube imágenes de alta calidad de cada cóctel
6. Configura traducciones en inglés y portugués
7. Reorganiza para que las creaciones de la casa estén primero
8. Cliente escanea QR, ve el menú en su idioma, y se siente atraído por las descripciones y fotos

**Resultado:**
Menú que refleja la creatividad del bar y convierte el catálogo en una herramienta de marketing.

---

### 13.4 Caso de Uso: Food Truck

**Contexto:**
Food truck itinerante, menú limitado, presencia en eventos, cambios frecuentes de ubicación.

**Necesidades:**
- Catálogo simple con pocos productos
- Actualización rápida de disponibilidad según ubicación
- Precios accesibles
- Sin traducciones (audiencia local)

**Solución con el módulo:**
1. Administrador crea categorías: "Tacos", "Bebidas", "Extras"
2. Añade 10-15 productos con descripciones cortas
3. Configura disponibilidad temporal cuando el food truck opera en eventos específicos
4. Marca productos populares como "Más vendido"
5. Usa imágenes simples tomadas con teléfono móvil
6. Pausa productos que se agotaron ese día
7. Cliente escanea QR, ve solo lo disponible en ese momento y lugar

**Resultado:**
Menú ágil que se adapta a la naturaleza itinerante del negocio.

---

## 14. WIREFRAMES CONCEPTUALES (DESCRIPCIÓN TEXTUAL)

> **Nota:** Los wireframes se describen conceptualmente. No se genera código visual en este documento.

### 14.1 Pantalla: Listado de Productos (Administrador)

**Elementos:**
- **Header superior:**
  - Título "Catálogo de Productos"
  - Selector de negocio (si multiempresa)
  - Botón "Crear Producto" (primario, color de acento)
  - Botón "Gestionar Categorías" (secundario)
  - Botón "Reorganizar" (terciario)
  
- **Barra de filtros:**
  - Dropdown "Todas las categorías" / "Entradas" / "Bebidas" / etc.
  - Dropdown "Todos los estados" / "Activo" / "Pausado" / "Destacado"
  - Dropdown "Completitud" / "Completos" / "Incompletos" / "Sin imagen" / etc.
  - Campo de búsqueda "Buscar producto..."

- **Vista de productos (tarjetas en grid):**
  - Cada tarjeta muestra:
    - Imagen principal (o placeholder si no hay)
    - Nombre del producto
    - Categoría (etiqueta pequeña)
    - Precio
    - Estado (etiqueta: Activo/Pausado/Destacado)
    - Barra de completitud (0-100%)
    - Íconos de indicadores (📷 🌐 🏷️ ⏰)
    - Acciones rápidas: Editar, Pausar/Activar, Duplicar, Eliminar
  - Hover sobre tarjeta: resalta con sombra
  - Orden visual refleja el orden en el menú público

- **Paginación o scroll infinito** (según cantidad de productos)

- **Vista alternativa: Lista (tabla)**
  - Columnas: Imagen, Nombre, Categoría, Precio, Estado, Completitud, Acciones
  - Más densa, ideal para negocios con muchos productos

---

### 14.2 Pantalla: Editor de Producto

**Estructura de dos columnas:**

**Columna izquierda (formulario):**
- **Sección 1: Información básica**
  - Campo "Nombre del producto" (obligatorio)
  - Campo "Descripción" (textarea, obligatorio)
  - Botón "Generar con IA" (si disponible)
  - Dropdown "Categoría" (obligatorio)
  - Campo "Precio" (numérico, obligatorio)
  - Campo "SKU" (opcional)

- **Sección 2: Imágenes**
  - Cargador de imagen principal (drag & drop o seleccionar)
  - Galería de imágenes adicionales (hasta 5-10 según plan)
  - Botón "Seleccionar de Multimedia" (abre modal con biblioteca)

- **Sección 3: Estado y visibilidad**
  - Radio buttons: Activo / Pausado / Destacado
  - Checkbox "Mostrar en página principal"

- **Sección 4: Disponibilidad**
  - Radio buttons: Siempre / Por horario / Por días / Temporal
  - Configurador dinámico según opción seleccionada
  - Vista previa del calendario de disponibilidad

- **Sección 5: Etiquetas destacadas**
  - Checkboxes: Más vendido, Recomendado, Nuevo, Promoción, Limitado
  - Campo de etiquetas personalizadas (si plan lo permite)

- **Sección 6: Traducciones**
  - Pestañas por idioma (Español, Inglés, Portugués, etc.)
  - Formulario de traducción por idioma
  - Botón "Traducir con IA" por idioma
  - Indicador de estado (Completo/Parcial/Vacío)

- **Botones de acción (sticky footer):**
  - "Guardar" (primario)
  - "Guardar y crear otro" (secundario)
  - "Cancelar" (terciario)

**Columna derecha (vista previa y métricas):**
- **Panel de vista previa:**
  - Simulación de cómo se verá el producto en el menú público
  - Selector de idioma para probar traducciones
  - Vista desktop/móvil

- **Panel de indicadores de completitud:**
  - Checklist visual de completitud
  - Barra de progreso general
  - Recomendaciones contextuales

- **Panel de estadísticas (si disponible):**
  - Visualizaciones en los últimos 30 días
  - Clics en el producto
  - Pedidos realizados (si aplica)

---

### 14.3 Pantalla: Configurador de Disponibilidad

**Modal o sección expandible:**

- **Título:** "Configurar disponibilidad de [Nombre del Producto]"

- **Opción 1: Disponible siempre** (seleccionada por defecto)
  - Radio button
  - Texto: "Este producto estará visible en todo momento"

- **Opción 2: Disponible por horario**
  - Radio button
  - Configurador de horarios:
    - Por cada día de la semana (L, M, M, J, V, S, D):
      - Toggle activar/desactivar día
      - Selector de horario inicio (HH:MM)
      - Selector de horario fin (HH:MM)
      - Botón "Añadir otro rango" (para múltiples rangos en un día)
  - Ejemplo visual: "Lunes a Viernes: 12:00 - 15:00 y 19:00 - 23:00"

- **Opción 3: Disponible por días específicos**
  - Radio button
  - Selector de días de la semana (checkboxes: L, M, M, J, V, S, D)
  - Texto: "El producto estará disponible solo en los días seleccionados"

- **Opción 4: Disponible temporalmente**
  - Radio button
  - Selector de fecha de inicio (datepicker)
  - Selector de fecha de fin (datepicker)
  - Indicador de días restantes
  - Texto: "El producto se ocultará automáticamente después de la fecha de fin"

- **Vista previa del calendario:**
  - Calendario mensual visual mostrando días/horarios en que el producto estará disponible
  - Días disponibles en verde, no disponibles en gris

- **Botones:**
  - "Guardar configuración" (primario)
  - "Cancelar" (secundario)

---

### 14.4 Pantalla: Menú Público (Cliente Final)

**Vista móvil (responsive):**

- **Header:**
  - Logo del negocio (si está configurado)
  - Nombre del negocio
  - Selector de idioma (opcional, dropdown o banderas)
  - Ícono de búsqueda (opcional, según plan)

- **Navegación de categorías:**
  - Tabs horizontales con scroll
  - Cada categoría es un tab
  - Categoría activa resaltada
  - Al hacer clic, scroll automático a esa categoría

- **Lista de productos:**
  - Por cada categoría:
    - Título de la categoría
    - Lista de productos en esa categoría
  - Por cada producto:
    - Imagen principal (o placeholder)
    - Nombre del producto
    - Descripción corta (primeras 100 caracteres)
    - Precio
    - Etiquetas destacadas (🔥 Más vendido, ⭐ Recomendado, etc.)
    - Botón "Ver más" o clic en la tarjeta para abrir detalle

- **Modal de detalle de producto:**
  - Imagen principal grande
  - Galería de imágenes (swipeable)
  - Nombre del producto
  - Descripción completa
  - Precio (destacado)
  - Etiquetas destacadas
  - Botón de acción (según configuración: "Agregar al carrito", "Contactar", etc.)
  - Botón "Cerrar"

- **Footer:**
  - Powered by [Nombre de la plataforma]
  - Enlace a redes sociales del negocio (si están configuradas)

**Interacciones:**
- Scroll vertical para navegar por categorías y productos
- Clic en producto abre modal de detalle
- Cambio de idioma recarga el catálogo en el nuevo idioma
- Búsqueda (si está habilitada) filtra productos en tiempo real

---

### 14.5 Pantalla: Gestión de Categorías

**Modal o página completa:**

- **Header:**
  - Título "Gestionar Categorías"
  - Botón "Crear Categoría" (primario)
  - Botón "Reorganizar" (secundario)

- **Lista de categorías:**
  - Cada fila muestra:
    - Ícono de drag handle (para reorganizar)
    - Ícono de la categoría (si tiene)
    - Nombre de la categoría
    - Número de productos asignados
    - Estado (Visible/Oculta)
    - Acciones: Editar, Ocultar/Mostrar, Eliminar

- **Modal de creación/edición de categoría:**
  - Campo "Nombre de la categoría" (obligatorio)
  - Campo "Descripción" (opcional, textarea)
  - Selector de ícono (opcional, librería de íconos)
  - Cargador de imagen de portada (opcional)
  - Selector de color de acento (opcional, color picker)
  - Panel de traducciones (si multiidioma está habilitado)
  - Botones: "Guardar" / "Cancelar"

- **Confirmación de eliminación:**
  - Si la categoría tiene productos asignados:
    - Mensaje: "No puedes eliminar esta categoría porque tiene [N] productos asignados"
    - Opción 1: "Reasignar productos a otra categoría"
    - Opción 2: "Eliminar productos y categoría"
  - Si no tiene productos:
    - Mensaje: "¿Estás seguro de eliminar [Nombre de la Categoría]?"
    - Botones: "Eliminar" / "Cancelar"

---

## 15. CONSIDERACIONES TÉCNICAS (SIN IMPLEMENTACIÓN)

### 15.1 Arquitectura de Datos

**Modelo de datos conceptual:**

**Entidad: Producto**
- id (UUID)
- negocio_id (FK)
- categoria_id (FK)
- nombre (String, obligatorio)
- descripcion (Text, obligatorio)
- precio (Decimal, obligatorio)
- precio_promocional (Decimal, opcional)
- fecha_inicio_promocion (Date, opcional)
- fecha_fin_promocion (Date, opcional)
- sku (String, opcional)
- imagen_principal_id (FK a Multimedia)
- galeria_imagenes (Array de FK a Multimedia)
- estado (Enum: activo, pausado, destacado)
- disponibilidad (JSON, estructura definida en sección 6.2)
- etiquetas (Array de Strings)
- orden (Integer)
- creado_por (FK a Usuario)
- modificado_por (FK a Usuario)
- fecha_creacion (Timestamp)
- fecha_modificacion (Timestamp)
- eliminado (Boolean, para soft delete)
- fecha_eliminacion (Timestamp, opcional)

**Entidad: Categoría**
- id (UUID)
- negocio_id (FK)
- nombre (String, obligatorio)
- descripcion (Text, opcional)
- icono (String, opcional)
- imagen_portada_id (FK a Multimedia)
- color_acento (String, hex color)
- orden (Integer)
- estado (Enum: visible, oculta)
- fecha_creacion (Timestamp)
- fecha_modificacion (Timestamp)

**Entidad: Traducción de Producto**
- id (UUID)
- producto_id (FK)
- idioma (String, código ISO 639-1)
- nombre (String)
- descripcion (Text)
- etiquetas (Array de Strings)
- generado_por_ia (Boolean)
- fecha_traduccion (Timestamp)

**Entidad: Traducción de Categoría**
- id (UUID)
- categoria_id (FK)
- idioma (String, código ISO 639-1)
- nombre (String)
- descripcion (Text)
- fecha_traduccion (Timestamp)

**Relaciones:**
- Un Negocio tiene muchas Categorías (1:N)
- Un Negocio tiene muchos Productos (1:N)
- Una Categoría tiene muchos Productos (1:N)
- Un Producto tiene una Imagen Principal (1:1)
- Un Producto tiene muchas Imágenes en Galería (1:N)
- Un Producto tiene muchas Traducciones (1:N)
- Una Categoría tiene muchas Traducciones (1:N)

### 15.2 Caché y Optimización

**Consideraciones:**
- Catálogo público debe estar altamente optimizado (cache CDN)
- Traducciones deben precargarse para evitar latencia
- Imágenes deben servirse optimizadas según el dispositivo (responsive images)
- Sistema debe detectar idioma con mínima latencia (headers HTTP)
- Evaluación de disponibilidad debe ser eficiente (índices en base de datos)

**Estrategias sugeridas:**
- Cache de catálogo público por negocio y idioma
- Invalidación de cache al modificar productos
- Lazy loading de imágenes en el menú público
- Precarga de traducciones más comunes
- WebP/AVIF para imágenes modernas

### 15.3 Tareas Programadas (Cron Jobs)

**Tareas necesarias:**
- **Evaluación de disponibilidad:**
  - Ejecutar cada minuto o cada 5 minutos
  - Revisar productos con disponibilidad por horario/temporal
  - Activar/desactivar visibilidad según configuración
  
- **Limpieza de cache:**
  - Invalidar cache de catálogos modificados
  - Regenerar cache precalentado
  
- **Estadísticas:**
  - Agregar eventos de visualización/clic
  - Calcular productos más vistos del día/semana/mes
  - Actualizar etiquetas automáticas "Más vendido"

- **Notificaciones:**
  - Alertar al negocio cuando productos temporales están por expirar
  - Recordar completar productos incompletos

### 15.4 API REST (Endpoints Conceptuales)

**Gestión de Productos (Admin):**
- GET /api/v1/negocios/{negocio_id}/productos
- GET /api/v1/negocios/{negocio_id}/productos/{producto_id}
- POST /api/v1/negocios/{negocio_id}/productos
- PUT /api/v1/negocios/{negocio_id}/productos/{producto_id}
- DELETE /api/v1/negocios/{negocio_id}/productos/{producto_id}
- PATCH /api/v1/negocios/{negocio_id}/productos/{producto_id}/estado
- PATCH /api/v1/negocios/{negocio_id}/productos/orden

**Gestión de Categorías (Admin):**
- GET /api/v1/negocios/{negocio_id}/categorias
- POST /api/v1/negocios/{negocio_id}/categorias
- PUT /api/v1/negocios/{negocio_id}/categorias/{categoria_id}
- DELETE /api/v1/negocios/{negocio_id}/categorias/{categoria_id}
- PATCH /api/v1/negocios/{negocio_id}/categorias/orden

**Traducciones (Admin):**
- GET /api/v1/productos/{producto_id}/traducciones
- POST /api/v1/productos/{producto_id}/traducciones/{idioma}
- PUT /api/v1/productos/{producto_id}/traducciones/{idioma}
- POST /api/v1/productos/{producto_id}/traducciones/{idioma}/generar-ia

**Catálogo Público:**
- GET /api/v1/public/menu/{slug_negocio}?idioma={codigo_idioma}
- GET /api/v1/public/menu/{slug_negocio}/producto/{producto_id}?idioma={codigo_idioma}
- GET /api/v1/public/menu/{slug_negocio}/buscar?q={query}&idioma={codigo_idioma}

**Estadísticas:**
- POST /api/v1/public/menu/{slug_negocio}/evento (para registrar visualizaciones)

### 15.5 Seguridad

**Consideraciones:**
- Autenticación requerida para endpoints de administración
- Validación de permisos según rol (Administrador/Editor)
- Validación de propiedad del negocio en contexto multiempresa
- Rate limiting en endpoints públicos para evitar scraping
- Sanitización de inputs (XSS, SQL injection)
- Validación de tipos de archivo en carga de imágenes
- HTTPS obligatorio para toda comunicación

**Permisos específicos:**
- Solo Administrador puede eliminar productos/categorías
- Editor solo puede modificar productos asignados
- Cliente final solo puede leer catálogo público
- Validación de límites según el plan contratado

### 15.6 Escalabilidad

**Consideraciones:**
- Sistema debe soportar miles de negocios simultáneamente
- Cada negocio puede tener cientos o miles de productos
- Menú público debe soportar picos de tráfico (eventos, promociones virales)
- Búsqueda debe ser rápida incluso con catálogos grandes

**Estrategias sugeridas:**
- Índices en base de datos (negocio_id, categoria_id, estado, orden)
- Paginación en listados de administración
- Lazy loading en menú público
- CDN para servir catálogos públicos
- Cache distribuido (Redis/Memcached)
- Búsqueda full-text optimizada (Elasticsearch, PostgreSQL FTS)

### 15.7 Auditoría y Logs

**Eventos a registrar:**
- Creación de producto (quién, cuándo, datos)
- Modificación de producto (quién, cuándo, qué cambió)
- Eliminación de producto (quién, cuándo)
- Cambio de estado (Activo/Pausado/Destacado)
- Cambio de orden (reorganización)
- Generación de contenido con IA
- Traducciones creadas o modificadas

**Propósito:**
- Cumplimiento legal (trazabilidad)
- Resolución de conflictos (quién cambió qué)
- Análisis de uso (estadísticas internas)
- Debugging y troubleshooting

---

## 16. MENSAJES Y NOTIFICACIONES

### 16.1 Mensajes al Administrador

**Éxito:**
- "Producto creado exitosamente"
- "Producto actualizado"
- "Producto pausado. Ya no es visible en el menú público"
- "Producto activado. Ahora es visible en el menú público"
- "Producto eliminado permanentemente"
- "Orden actualizado"
- "Categoría creada exitosamente"
- "Traducción guardada"
- "Contenido generado por IA. Revisa y edita antes de guardar"

**Error:**
- "Faltan campos obligatorios: [lista de campos]"
- "No puedes eliminar esta categoría porque tiene [N] productos asignados"
- "El precio promocional debe ser menor al precio regular"
- "La fecha de fin debe ser posterior a la fecha de inicio"
- "Has alcanzado el límite de productos de tu plan ([N] productos). Mejora tu plan para añadir más"
- "Has alcanzado el límite de idiomas de tu plan. Mejora tu plan para añadir más traducciones"
- "Error al generar contenido con IA. Intenta nuevamente o escribe manualmente"
- "No tienes permisos para realizar esta acción"

**Advertencias:**
- "Este producto no tiene imagen. Añade una para mejorar la presentación"
- "Este producto no tiene traducciones. Configúralas para llegar a más clientes"
- "La disponibilidad de este producto expirará en [N] días"
- "Este producto está en una campaña activa. Si lo pausas, la campaña se verá afectada"

### 16.2 Mensajes al Cliente Final

**Información:**
- "Estamos preparando nuestro menú. Vuelve pronto" (cuando no hay productos disponibles)
- "Menú disponible de [horario] a [horario]" (cuando el catálogo tiene horarios limitados)
- "Este producto solo está disponible en [días/temporada]"

**Acciones:**
- "Agregar al carrito"
- "Contactar por WhatsApp"
- "Ver más información"
- "Cerrar"

**Feedback:**
- "Producto añadido al carrito" (si hay integración con pedidos)
- "No hay resultados para tu búsqueda" (si hay función de búsqueda)

---

## 17. INTERNACIONALIZACIÓN (i18n)

### 17.1 Idiomas Soportados en la Interfaz de Administración

La plataforma debe soportar múltiples idiomas para la interfaz de administración:
- Español (es)
- Inglés (en)
- Portugués (pt)

**Elementos traducibles:**
- Menús y navegación
- Botones y acciones
- Etiquetas de formularios
- Mensajes de error/éxito
- Tooltips y ayudas contextuales
- Documentación integrada

### 17.2 Idiomas para el Menú Público

El menú público puede soportar cualquier idioma según la configuración del negocio y el plan contratado.

**Idiomas más comunes:**
- Español (es)
- Inglés (en)
- Portugués (pt)
- Francés (fr)
- Alemán (de)
- Italiano (it)
- Chino simplificado (zh)
- Japonés (ja)

**Reglas:**
- El negocio define su idioma principal
- El negocio activa idiomas adicionales según su plan
- Las traducciones las gestiona el negocio (manual o con IA)
- El sistema detecta automáticamente el idioma del visitante

### 17.3 Formatos de Moneda y Números

**Consideraciones:**
- Precios deben mostrarse en la moneda configurada por el negocio
- Formato de números según la región (separador decimal: . o ,)
- Símbolo de moneda antes o después según la convención local

**Ejemplos:**
- USA: $10.50
- Venezuela: Bs. 10,50
- Brasil: R$ 10,50
- Europa: 10,50 €

**Configuración:**
- El negocio define su moneda en la configuración inicial
- Sistema adapta el formato automáticamente
- Sin conversión de moneda (cada negocio gestiona sus precios en su moneda local)

---

## 18. ACCESIBILIDAD (a11y)

### 18.1 Principios de Accesibilidad

El módulo debe ser accesible para personas con discapacidades visuales, motoras o cognitivas.

**Estándares:**
- WCAG 2.1 Nivel AA (mínimo)
- ARIA labels en elementos interactivos
- Navegación por teclado completa
- Contraste de color suficiente (mínimo 4.5:1)
- Textos alternativos en imágenes

### 18.2 Características de Accesibilidad

**Panel de administración:**
- Navegación por teclado (Tab, Enter, Esc)
- Shortcuts de teclado para acciones frecuentes
- Lectores de pantalla compatibles (NVDA, JAWS, VoiceOver)
- Etiquetas claras en formularios
- Mensajes de error accesibles
- Focus visible en elementos interactivos

**Menú público:**
- Alto contraste entre texto y fondo
- Tamaño de fuente mínimo 16px
- Botones con área de clic suficiente (44x44px mínimo en móvil)
- Textos alternativos en imágenes de productos
- Navegación por teclado
- Compatible con lectores de pantalla

**Imágenes:**
- Campo "Texto alternativo" obligatorio al subir imagen
- Descripción breve para productos sin imagen
- Iconos con etiquetas ARIA

---

## 19. MÉTRICAS DE ÉXITO

### 19.1 KPIs del Módulo

**Adopción:**
- % de negocios que han creado al menos 1 producto
- Promedio de productos por negocio
- % de productos con completitud >= 70%

**Engagement:**
- Frecuencia de actualización de productos (ediciones por mes)
- % de productos con traducciones
- % de productos con disponibilidad inteligente configurada

**Experiencia del cliente final:**
- Tiempo promedio de carga del menú público
- % de visitantes que ven el menú en su idioma nativo
- Tasa de rebote en el menú público
- Productos más vistos por negocio
- Productos con mayor tasa de clic

**Uso de IA:**
- % de productos con descripciones generadas por IA
- % de traducciones generadas por IA
- Satisfacción con contenido generado (encuesta)

### 19.2 Objetivos de Rendimiento

**Tiempo de carga:**
- Menú público: < 2 segundos (First Contentful Paint)
- Panel de administración: < 3 segundos
- Búsqueda de productos: < 500ms

**Disponibilidad:**
- Uptime: 99.9%
- Sincronización catálogo-menú público: < 1 segundo

**Escalabilidad:**
- Soportar 10,000 negocios activos simultáneamente
- Soportar 100,000 visitantes concurrentes en menús públicos
- Soportar catálogos de hasta 10,000 productos por negocio sin degradación

---

## 20. ROADMAP FUTURO

### 20.1 Fase 1 — MVP (Producto Mínimo Viable)

**Incluido:**
- Creación, edición, eliminación de productos
- Gestión básica de categorías
- Estados: Activo/Pausado
- Disponibilidad: Siempre/Por horario
- 1 idioma por negocio
- Carga de imagen principal
- Listado de productos con filtros básicos
- Menú público responsive
- Detección automática de idioma (con fallback al idioma principal)

**Excluido (para fases posteriores):**
- IA para generación de contenido
- Traducciones multiidioma
- Etiquetas destacadas personalizadas
- Disponibilidad temporal/por días
- Galería de imágenes
- Reorganización drag & drop
- Indicadores de completitud

### 20.2 Fase 2 — Mejoras de UX

**Incluido:**
- Reorganización drag & drop
- Indicadores de completitud
- Vista previa en tiempo real
- Galería de imágenes (hasta 5 por producto)
- Etiquetas destacadas predefinidas
- Disponibilidad temporal y por días
- Búsqueda de productos en el menú público
- Estadísticas básicas por producto

### 20.3 Fase 3 — Multiidioma e IA

**Incluido:**
- Soporte multiidioma (hasta 3 idiomas según plan)
- Traducciones manuales
- Generación de descripciones con IA
- Traducción automática con IA
- Selector de idioma en menú público
- Etiquetas personalizadas
- Precios promocionales

### 20.4 Fase 4 — Funcionalidades Avanzadas

**Incluido:**
- Idiomas ilimitados (plan Premium)
- Variantes de productos (tallas, colores, extras)
- Productos con opciones personalizables
- Recomendaciones automáticas de productos
- Análisis predictivo (productos que se agotarán pronto)
- Integración con inventario físico
- QR por producto individual
- Modo de vista previa antes de publicar cambios
- Importación masiva de productos (CSV, Excel)
- Exportación de catálogo (PDF, CSV)
- API pública para integraciones de terceros

---

## 21. CONCLUSIÓN

El **Módulo de Catálogo de Productos** es el corazón de la plataforma SaaS de menús digitales. Su diseño prioriza:

1. **Simplicidad para el negocio:** Gestión intuitiva que no requiere conocimientos técnicos.
2. **Experiencia fluida para el cliente:** Menú público rápido, atractivo y en el idioma correcto.
3. **Flexibilidad:** Adaptable a diferentes tipos de negocios (restaurantes, cafeterías, bares, food trucks).
4. **Automatización:** Sincronización instantánea, detección automática de idioma, disponibilidad inteligente.
5. **Escalabilidad:** Soporta desde pequeños negocios con 10 productos hasta grandes cadenas con miles.

La arquitectura modular permite evolucionar el sistema con nuevas funcionalidades sin romper la base existente, asegurando que el módulo pueda crecer junto con las necesidades de los negocios y los clientes finales.

---

**Fin de la Documentación del Módulo 04 · Catálogo de Productos**
