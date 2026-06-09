# MÓDULO: ESTADÍSTICAS E INTELIGENCIA COMERCIAL

**Plataforma SaaS:** Menús Digitales Multiempresa  
**Versión:** 1.0  
**Fecha:** 2026-06-08  
**Autor:** Arquitecto de Software Senior

---

## 1. OBJETIVO DEL MÓDULO

Este módulo constituye el **centro neurálgico de análisis de comportamiento** de la plataforma.

Su misión es **transformar datos brutos en información accionable**, permitiendo a los negocios:

- Identificar oportunidades de crecimiento comercial
- Optimizar estrategias de promoción y marketing
- Comprender patrones de comportamiento de visitantes
- Tomar decisiones basadas en evidencia real
- Medir el impacto de acciones comerciales

**Diferenciador clave:** No muestra métricas por mostrar. Cada indicador debe vincularse a una acción comercial concreta.

---

## 2. ROLES Y ACCESO

### 2.1 Administrador de Negocio

**Alcance:**  
Visualiza exclusivamente las estadísticas correspondientes a su negocio.

**Permisos:**
- Acceso a panel de métricas propias
- Exportación de reportes de su negocio
- Configuración de alertas personalizadas
- Visualización de recomendaciones comerciales

**Restricciones:**
- No puede ver información de otros negocios
- No puede acceder a datos agregados de la plataforma

---

### 2.2 Super Administrador

**Alcance:**  
Visualización global de todos los negocios registrados en la plataforma.

**Permisos:**
- Acceso a panel consolidado multiempresa
- Filtros dinámicos multinivel
- Exportación de reportes comparativos
- Detección de tendencias macro
- Identificación de oportunidades de consultoría

**Capacidades de Filtrado:**

| Dimensión | Opciones |
|-----------|----------|
| **Empresa** | Individual / Múltiple / Todas |
| **Ciudad** | Lista de ciudades con negocios activos |
| **Región** | Agrupación geográfica |
| **Tipo de negocio** | Restaurante / Cafetería / Bar / Panadería / Heladería / Food Truck / Otro |
| **Plan contratado** | Free / Básico / Pro / Enterprise |
| **Período de tiempo** | Hoy / 7 días / 30 días / 90 días / Año / Personalizado |

---

## 3. ESTRUCTURA DEL MÓDULO

El módulo se organiza en **8 secciones principales**, cada una con un propósito comercial específico.

---

### 3.1 RESUMEN GENERAL

**Propósito:**  
Ofrecer una visión inmediata del estado actual del negocio.

#### Indicadores Clave (KPIs)

| Métrica | Descripción | Unidad |
|---------|-------------|--------|
| **Visitas totales al menú** | Contador acumulado desde el inicio | Número absoluto |
| **Visitas del día** | Visitas en las últimas 24 horas | Número + % variación vs día anterior |
| **Visitas de la semana** | Visitas en los últimos 7 días | Número + % variación vs semana anterior |
| **Visitas del mes** | Visitas en los últimos 30 días | Número + % variación vs mes anterior |
| **Tendencia de crecimiento** | Proyección basada en los últimos 90 días | % crecimiento / decrecimiento |
| **Última actividad** | Timestamp de última visita registrada | Fecha/hora relativa |

#### Visualización

- **Tarjetas de métrica** con número destacado + variación porcentual
- **Gráfico de línea temporal** mostrando tendencia de visitas (últimos 30 días)
- **Indicador visual de salud** (verde = crecimiento, amarillo = estable, rojo = decrecimiento)

#### Acción Comercial Sugerida

> **Ejemplo:**  
> "Tus visitas aumentaron 23% esta semana. Considera lanzar una promoción para capitalizar el interés."

---

### 3.2 ANÁLISIS DE TRÁFICO

**Propósito:**  
Comprender **cuándo** los clientes consultan el menú para planificar promociones y campañas en horarios estratégicos.

#### Dimensiones de Análisis

**A. Visitas por Hora**
- Gráfico de barras mostrando distribución de visitas en franjas horarias de 1 hora
- Identificación automática de "horas pico"
- Comparación entre días laborables y fines de semana

**B. Visitas por Día de la Semana**
- Gráfico de columnas comparando lunes a domingo
- Identificación de días de mayor y menor actividad
- Sugerencias de días óptimos para lanzar promociones

**C. Visitas por Semana**
- Evolución temporal semanal (últimas 12 semanas)
- Detección de patrones estacionales
- Identificación de semanas atípicas (picos o caídas)

**D. Horarios de Mayor Actividad**
- Top 3 franjas horarias con más visitas
- Clasificación por tipo de día (laborable / fin de semana / festivo)

**E. Días de Mayor Actividad**
- Top 3 días de la semana con más visitas
- Comparación entre períodos (este mes vs mes anterior)

#### Visualización

- **Heatmap** (mapa de calor) mostrando intensidad de visitas por día/hora
- **Gráficos de línea superpuestos** para comparar períodos
- **Badges destacados** con los 3 horarios y 3 días top

#### Acción Comercial Sugerida

> **Ejemplo:**  
> "El 68% de tus visitas ocurren entre 18:00 y 21:00. Programa promociones de happy hour en ese rango."

---

### 3.3 PRODUCTOS MÁS CONSULTADOS

**Propósito:**  
Detectar productos que **generan interés** incluso cuando no son necesariamente los más vendidos.

#### Métricas por Producto

| Campo | Descripción |
|-------|-------------|
| **Producto** | Nombre + categoría |
| **Visualizaciones** | Cantidad total de vistas del producto |
| **Tendencia** | Icono visual: ↑ creciendo / → estable / ↓ decreciendo |
| **Variación** | % de cambio vs período anterior |
| **Tiempo promedio de visualización** | Segundos que los visitantes permanecen en la ficha del producto |

#### Ranking Dinámico

- **Top 10 productos** más consultados del período seleccionado
- **Filtros:**
  - Por categoría
  - Por rango de precio
  - Por presencia de promoción
  - Por idioma del visitante

#### Visualización

- **Lista ordenada** con thumbnail del producto + métricas clave
- **Gráfico de barras horizontales** mostrando volumen de visualizaciones
- **Sparklines** (mini-gráficos) mostrando tendencia de los últimos 7 días

#### Acción Comercial Sugerida

> **Ejemplo:**  
> "Tu 'Pizza Rúcula' recibe 340% más vistas que el promedio. Es un producto estrella. Considera crear combos con ella."

---

### 3.4 PRODUCTOS CON BAJO RENDIMIENTO

**Propósito:**  
Identificar productos que **reciben poca atención** para tomar acciones correctivas.

#### Criterios de Identificación

Un producto se considera de "bajo rendimiento" cuando cumple al menos 2 de estos criterios:

1. **Visualizaciones** por debajo del 25% del promedio de la categoría
2. **Tendencia** negativa durante 2 semanas consecutivas
3. **Tiempo de visualización** inferior a 3 segundos
4. **Tasa de interacción** (clics en "más info" o WhatsApp) inferior al 1%

#### Métricas por Producto

| Campo | Descripción |
|-------|-------------|
| **Producto** | Nombre + categoría |
| **Visualizaciones** | Cantidad (con % respecto al promedio) |
| **Interacciones** | Clics en acciones (WhatsApp, más info, etc.) |
| **Variación** | % negativo vs período anterior |
| **Diagnóstico sugerido** | Texto explicativo automático |

#### Diagnósticos Automáticos

El sistema debe inferir posibles causas:

- "Sin imagen atractiva"
- "Precio por encima del promedio de la categoría"
- "Descripción poco clara"
- "Categoría poco visitada"
- "Competencia interna (otro producto similar con mejor rendimiento)"

#### Visualización

- **Lista de productos** con indicadores de alerta
- **Comparación** con productos similares de mejor rendimiento
- **Checklist de mejora** (imagen / descripción / precio / categoría)

#### Acción Comercial Sugerida

> **Ejemplo:**  
> "Tu 'Carpaccio de Res' recibe solo 12 visitas al mes. Considera mejorar la foto o lanzar una promoción temporal."

---

### 3.5 RENDIMIENTO DE PROMOCIONES

**Propósito:**  
Medir el **impacto real** de las promociones activas y pasadas.

#### Métricas de Comparación

| Fase | Métrica |
|------|---------|
| **Antes de la promoción** | Promedio de visitas diarias (7 días previos) |
| **Durante la promoción** | Promedio de visitas diarias durante el período activo |
| **Después de la promoción** | Promedio de visitas diarias (7 días posteriores) |
| **Incremento generado** | % de aumento durante vs antes |
| **Productos beneficiados** | Lista de productos incluidos en la promoción + su variación |

#### Análisis por Promoción

Para cada promoción se calcula:

- **ROI de visibilidad:** incremento de visualizaciones generado
- **Efecto arrastre:** aumento en productos relacionados no promocionados
- **Sostenibilidad:** si el tráfico se mantiene post-promoción o cae abruptamente

#### Ranking de Promociones

- **Top 3 promociones** con mayor impacto histórico
- **Comparación** entre tipos de promoción (descuento % / 2x1 / combo / envío gratis)

#### Visualización

- **Gráfico de línea temporal** con marca visual del período de promoción
- **Tarjetas comparativas** antes/durante/después
- **Lista de productos** con variación individual

#### Acción Comercial Sugerida

> **Ejemplo:**  
> "Tu promoción '2x1 en Pizzas' generó un aumento del 87% en visitas. Considera repetirla los jueves."

---

### 3.6 INTERACCIONES DE CONTACTO

**Propósito:**  
Registrar **acciones concretas** realizadas por los visitantes para medir **intención de compra**.

#### Tipos de Interacción

| Acción | Descripción |
|--------|-------------|
| **Clic en WhatsApp** | Visitante tocó el botón de WhatsApp desde un producto o página general |
| **Clic en Instagram** | Visitante accedió al perfil de Instagram del negocio |
| **Clic en Facebook** | Visitante accedió a la página de Facebook |
| **Clic en "Ver más" de producto** | Visitante expandió la ficha de un producto |
| **Clic en promoción destacada** | Visitante interactuó con un banner o tarjeta de promoción |
| **Compartir producto** | Visitante usó la función de compartir |
| **Cambio de idioma** | Visitante cambió el idioma del menú |

#### Métricas de Interacción

- **Total de interacciones** en el período
- **Tasa de conversión:** (interacciones / visitas totales) × 100
- **Ranking de acciones:** cuál es la interacción más frecuente
- **Productos con mayor tasa de interacción**

#### Visualización

- **Gráfico de dona** mostrando distribución porcentual de tipos de interacción
- **Lista de productos** ordenados por tasa de interacción
- **Timeline** de interacciones recientes (últimas 24 horas)

#### Acción Comercial Sugerida

> **Ejemplo:**  
> "El 42% de tus visitantes hace clic en WhatsApp. Asegúrate de responder rápido para no perder oportunidades."

---

### 3.7 IDIOMAS UTILIZADOS

**Propósito:**  
Identificar qué **idiomas priorizan los visitantes** para mejorar la experiencia multilingüe.

#### Métricas por Idioma

| Campo | Descripción |
|-------|-------------|
| **Idioma** | Código ISO + nombre (ej: pt-BR / Portugués Brasil) |
| **Visitas** | Cantidad de visitas en ese idioma |
| **% del total** | Proporción respecto al total de visitas |
| **Tendencia** | Crecimiento o decrecimiento del idioma |
| **Origen detectado** | IP geográfica / configuración del navegador |

#### Idiomas Soportados (Ejemplo)

- Portugués (pt-BR)
- Español (es-ES)
- Inglés (en-US)
- Francés (fr-FR)
- Alemán (de-DE)
- Italiano (it-IT)

#### Análisis Geográfico

Cruce de idioma con:
- Ciudad de origen (según IP)
- Horario de visita (detectar turistas vs locales)

#### Visualización

- **Gráfico de barras horizontales** ordenado por volumen
- **Mapa de calor geográfico** mostrando origen de visitas por idioma
- **Badge de idioma principal** destacado

#### Acción Comercial Sugerida

> **Ejemplo:**  
> "El 34% de tus visitas son en Inglés. Considera mejorar las traducciones de productos destacados."

---

### 3.8 TENDENCIAS DE CONSUMO

**Propósito:**  
Identificar **patrones de comportamiento** para facilitar decisiones comerciales basadas en datos reales.

#### Dimensiones de Análisis

**A. Productos en Crecimiento**
- Lista de productos con tendencia positiva sostenida (mínimo 3 semanas)
- Velocidad de crecimiento (% semanal)

**B. Productos con Mayor Interés Reciente**
- Productos que experimentaron un pico de visitas en los últimos 7 días
- Comparación vs su promedio histórico

**C. Categorías Más Visitadas**
- Ranking de categorías por volumen de visitas
- Distribución porcentual del tráfico

**D. Horarios Más Relevantes**
- Cruce de productos top con horarios pico
- Identificación de productos "de desayuno" / "de almuerzo" / "de cena"

#### Patrones Detectables

El sistema debe inferir automáticamente patrones como:

- **"Producto de fin de semana"** (recibe 80%+ de visitas sábado/domingo)
- **"Producto de happy hour"** (pico entre 18:00-20:00)
- **"Producto para turistas"** (alto % de visitas en idiomas extranjeros)
- **"Producto estacional"** (variación según época del año)

#### Visualización

- **Dashboard de tendencias** con íconos visuales (🔥 en crecimiento / ⭐ producto estrella / 📈 tendencia positiva)
- **Gráficos de línea comparativos** entre productos
- **Matriz de correlación** (ej: "clientes que ven Pizza también ven Cerveza")

#### Acción Comercial Sugerida

> **Ejemplo:**  
> "Tus 'Cervezas Artesanales' crecen 12% cada semana. Es momento de ampliar variedad o crear una categoría dedicada."

---

## 4. INTELIGENCIA COMERCIAL (INSIGHTS AUTOMÁTICOS)

Este módulo **no se limita a mostrar métricas**. Debe generar **recomendaciones prácticas** en lenguaje natural.

### 4.1 Tipos de Insights

#### A. Insights de Oportunidad

```
🎯 "Tu 'Polvo na Brasa' recibe 420 visitas al mes pero solo 8 clics en WhatsApp. 
    Considera agregar un botón de reserva o combo especial."
```

#### B. Insights de Optimización

```
⚡ "El 78% de tus visitas ocurren después de las 19:00, pero tu promoción 
    del almuerzo no está generando tráfico. Considera cambiarla a cena."
```

#### C. Insights de Crecimiento

```
📈 "Tus visitas crecieron 34% este mes. Es el momento ideal para lanzar 
    un producto nuevo o una campaña especial."
```

#### D. Insights de Retención

```
🔄 "Tus visitantes pasan en promedio 45 segundos en el menú. Esto es bajo. 
    Considera mejorar las fotos de productos."
```

#### E. Insights de Competencia (solo Super Admin)

```
🏆 "Los restaurantes similares al tuyo están promediando 1200 visitas/mes. 
    Tú estás en 340. Considera mejorar tu presencia en redes."
```

### 4.2 Panel de Recomendaciones

Sección dedicada que muestra:

- **Top 3 acciones recomendadas** ordenadas por impacto potencial
- **Botón de acción rápida** para aplicar la sugerencia (ej: "Crear promoción")
- **Histórico de recomendaciones** implementadas + su resultado

### 4.3 Lenguaje de Insights

Las recomendaciones deben:

- ✅ Ser **accionables** (indicar qué hacer, no solo qué pasa)
- ✅ Ser **específicas** (incluir números, productos, horarios concretos)
- ✅ Ser **comprensibles** (lenguaje simple, sin jerga técnica)
- ✅ Ser **priorizadas** (ordenadas por impacto esperado)
- ❌ NO ser genéricas ("mejora tu menú")
- ❌ NO ser técnicas ("aumenta tu CTR")

---

## 5. VISTA GLOBAL PARA SUPER ADMINISTRADOR

### 5.1 Panel Consolidado

El Super Admin accede a una vista adicional con:

#### A. Métricas Agregadas de Plataforma

| Métrica | Descripción |
|---------|-------------|
| **Total negocios activos** | Cantidad de negocios con al menos 1 visita en el mes |
| **Total visitas plataforma** | Suma de todas las visitas de todos los negocios |
| **Promedio visitas por negocio** | Visitas totales / negocios activos |
| **Crecimiento de la plataforma** | % de aumento de visitas mes a mes |

#### B. Ranking de Negocios

- **Top 10 negocios** con más visitas
- **Top 10 negocios** con mayor crecimiento
- **Negocios en riesgo** (visitas cayendo >30% en 2 semanas)

#### C. Tendencias Macro

- **Categorías de producto** más populares a nivel plataforma
- **Horarios pico** generales
- **Idiomas predominantes** según región
- **Efectividad promedio** de tipos de promoción

### 5.2 Filtros Multinivel

El Super Admin puede combinar filtros para análisis complejos:

**Ejemplo:**
```
Filtro: 
  - Tipo de negocio = Restaurante
  - Ciudad = Puerto Ordaz
  - Plan = Pro
  - Período = Últimos 30 días

Resultado: 
  - 8 negocios coinciden
  - Promedio de 1.240 visitas/mes
  - Producto más visto: "Carne a la Parrilla"
  - Horario pico: 19:00-21:00
```

### 5.3 Oportunidades de Consultoría

El sistema debe destacar:

- **Negocios con potencial no explotado** (alto tráfico, baja interacción)
- **Negocios listos para upgrade** (uso intensivo de funciones del plan actual)
- **Negocios en riesgo de churn** (caída sostenida de actividad)

### 5.4 Exportación de Reportes Comparativos

Generación de reportes en PDF/Excel que comparan:

- Negocios de una misma ciudad
- Negocios del mismo tipo
- Negocios del mismo plan
- Evolución temporal de un conjunto de negocios

---

## 6. CONEXIÓN CON OTROS MÓDULOS

### 6.1 Catálogo de Productos

**Flujo de datos:**

```
Estadísticas → Catálogo
```

**Información consumida:**
- Visualizaciones por producto
- Tasa de interacción
- Tendencia (crecimiento/decrecimiento)

**Visualización en Catálogo:**

Cada producto muestra badges:
- 🔥 "Producto popular" (top 10% de visitas)
- 📈 "En crecimiento" (tendencia positiva >15%)
- ⚠️ "Bajo rendimiento" (bajo 25% del promedio)

---

### 6.2 Marketing y Promociones

**Flujo de datos:**

```
Estadísticas ↔ Marketing
```

**Información compartida:**
- Efectividad de promociones pasadas
- Productos candidatos a promoción (bajo rendimiento + alto potencial)
- Horarios y días óptimos para lanzar campañas

**Funcionalidad:**

Al crear una promoción, el sistema sugiere:
- Productos ideales para incluir
- Duración óptima
- Horarios de mayor impacto
- Mensaje personalizado según idioma predominante

---

### 6.3 Automatizaciones

**Flujo de datos:**

```
Estadísticas → Automatizaciones (triggers)
```

**Disparadores Automáticos:**

| Condición | Acción Automática |
|-----------|-------------------|
| Producto con >500 visitas/semana y <5% interacción | Sugerir al admin: "Crear promoción urgente" |
| Producto con tendencia negativa >20% por 2 semanas | Enviar alerta: "Producto en riesgo" |
| Incremento de tráfico >50% en 24 horas | Notificar: "Pico de visitas detectado, considera ampliar stock" |
| Idioma nuevo con >10% del tráfico | Sugerir: "Revisar traducción de productos top" |

**Automatización de Reportes:**

- Envío semanal de resumen de estadísticas por email
- Alertas push cuando se detecta una oportunidad comercial
- Reportes mensuales comparativos (mes actual vs anterior)

---

### 6.4 Multiempresa

**Flujo de datos:**

```
Estadísticas (individual) → Multiempresa (consolidado)
```

**Funcionalidad:**

- Cada empresa ve solo sus métricas
- Super Admin ve métricas consolidadas + comparativas
- Filtrado por empresa/región/tipo para benchmarking
- Detección de "mejores prácticas" (qué hacen los negocios con mejor rendimiento)

---

### 6.5 Usuarios y Permisos

**Flujo de datos:**

```
Usuarios/Permisos ← Estadísticas (control de acceso)
```

**Reglas de Acceso:**

| Rol | Acceso |
|-----|--------|
| **Administrador de Negocio** | Solo estadísticas de su negocio |
| **Staff del Negocio** | Vista de solo lectura de estadísticas del negocio (sin exportar) |
| **Super Administrador** | Todas las estadísticas + filtros globales |
| **Consultor Externo** | Acceso temporal a estadísticas de negocios específicos (con permiso) |

---

## 7. REGLA ARQUITECTÓNICA PRINCIPAL

> **"Las estadísticas deben transformarse en información accionable."**

### 7.1 Principios de Diseño

1. **Claridad sobre Complejidad**  
   Priorizar visualizaciones simples que comuniquen la idea en 3 segundos.

2. **Acción sobre Dato**  
   Cada métrica debe vincularse a una acción concreta que el negocio pueda tomar.

3. **Contexto sobre Número**  
   Un número sin comparación es inútil. Siempre mostrar:
   - Variación vs período anterior
   - Comparación vs promedio
   - Tendencia temporal

4. **Lenguaje Humano sobre Jerga**  
   Evitar: "CTR", "bounce rate", "conversion funnel"  
   Preferir: "clics en WhatsApp", "visitantes que se fueron rápido", "proceso de compra"

5. **Recomendación Proactiva**  
   No esperar a que el usuario interprete. El sistema debe sugerir.

### 7.2 Ejemplo de Transformación

❌ **MAL (solo dato):**
```
Visitas: 1.240
```

✅ **BIEN (dato + contexto + acción):**
```
🎯 1.240 visitas este mes (+23% vs mes anterior)
   Tendencia: Crecimiento sostenido
   
   💡 Acción sugerida:
   Tus visitas están creciendo. Considera lanzar una promoción 
   para convertir ese interés en ventas.
   
   [Crear Promoción]
```

---

## 8. CONSIDERACIONES TÉCNICAS (SIN CÓDIGO)

### 8.1 Captura de Datos

El módulo debe registrar eventos sin afectar la experiencia del usuario:

- **Tracking asíncrono** (no bloquear carga del menú)
- **Respeto a privacidad** (GDPR/LGPD: anonimizar IPs, cookies opcionales)
- **Eventos rastreables:**
  - Visita a página principal del menú
  - Visita a ficha de producto
  - Tiempo de permanencia en producto
  - Clic en botón de WhatsApp/redes
  - Cambio de idioma
  - Búsqueda interna (si existe)
  - Scroll en categorías

### 8.2 Procesamiento de Datos

- **Agregación en tiempo real** para métricas del día
- **Procesamiento batch nocturno** para cálculos históricos y tendencias
- **Cálculo de insights** mediante reglas de negocio predefinidas
- **Detección de anomalías** (picos o caídas atípicas)

### 8.3 Almacenamiento

- **Datos brutos** (eventos): retención de 90 días
- **Datos agregados** (métricas diarias/semanales/mensuales): retención ilimitada
- **Reportes generados**: almacenamiento de últimos 12 meses

### 8.4 Escalabilidad

El sistema debe soportar:

- **100.000 visitas/día** a nivel plataforma
- **1.000 negocios activos** simultáneos
- **Consultas en tiempo real** con respuesta <2 segundos
- **Exportación de reportes** sin bloquear el sistema

---

## 9. RESULTADO ESPERADO

Al implementar este módulo, la plataforma contará con:

### ✅ Para el Administrador de Negocio:

- **Centro de mando comercial** que le dice qué está funcionando y qué no
- **Recomendaciones prácticas** que puede aplicar sin ser experto en marketing
- **Métricas simples** que le ayudan a tomar decisiones rápidas
- **Detección automática** de oportunidades de venta

### ✅ Para el Super Administrador:

- **Vista panorámica** de la salud de la plataforma
- **Herramienta de consultoría** para ayudar a negocios con problemas
- **Detección de tendencias macro** para mejorar la plataforma
- **Identificación de oportunidades** de upselling a planes superiores

### ✅ Para la Plataforma:

- **Diferenciador competitivo** (no solo menú digital, sino inteligencia comercial)
- **Argumento de venta** para planes superiores (acceso a analytics avanzados)
- **Reducción de churn** (negocios que ven resultados concretos se quedan)
- **Fuente de datos** para mejorar producto (qué features se usan más, qué necesitan los negocios)

---

## 10. MÉTRICAS DE ÉXITO DEL MÓDULO

El módulo será exitoso cuando:

1. **80%+ de administradores** visiten el módulo al menos 1 vez por semana
2. **50%+ de negocios** implementen al menos 1 recomendación sugerida por mes
3. **Negocios que usan analytics** tengan un churn 30% menor vs los que no lo usan
4. **Super Admin** identifique al menos 5 oportunidades de consultoría por mes
5. **Tiempo de decisión comercial** (crear promoción, cambiar producto) se reduzca 40%

---

## 11. ROADMAP FUTURO (POST-MVP)

Funcionalidades avanzadas para versiones posteriores:

- **Comparación con competencia** (benchmarking anónimo vs negocios similares)
- **Predicción de demanda** (IA que predice qué productos tendrán pico de interés)
- **Alertas inteligentes** vía WhatsApp/email cuando ocurra un evento relevante
- **Integración con POS** (cruzar visitas con ventas reales)
- **Análisis de sentimiento** (si se integran reseñas o comentarios)
- **Exportación a Google Analytics / Facebook Pixel** para remarketing

---

**FIN DE DOCUMENTO FUNCIONAL**

---

**Próximo entregable:** Diseño de experiencia visual (pantalla) del módulo.
