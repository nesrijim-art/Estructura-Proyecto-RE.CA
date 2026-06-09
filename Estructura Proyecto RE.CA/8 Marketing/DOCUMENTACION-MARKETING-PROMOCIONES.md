# MÓDULO 08 · MARKETING Y PROMOCIONES

**Versión:** 1.0  
**Fecha:** 2026-06-08  
**Autor:** Arquitectura SaaS Menús Digitales

---

## 1. PROPÓSITO DEL MÓDULO

**Marketing y Promociones** es el centro de gestión comercial de la plataforma SaaS de menús digitales.

Su objetivo es permitir que cualquier negocio gastronómico pueda crear campañas, promociones y publicaciones profesionales sin conocimientos de marketing ni diseño, ayudando a:

- Aumentar la visibilidad de productos.
- Impulsar ventas mediante promociones estratégicas.
- Destacar productos clave en el menú público.
- Generar contenido comercial de forma rápida y profesional.
- Planificar y programar campañas comerciales.

**Filosofía de diseño:**  
Simplicidad visual + IA asistida + Automatización opcional = Marketing accesible para todos.

---

## 2. DISPONIBILIDAD POR PLAN

### Plan Start
- Promociones básicas.
- Productos destacados.
- Banners promocionales.

### Plan Business
- Todo lo anterior.
- Generación de contenido mediante IA.
- Programación de publicaciones.
- Calendario comercial.

### Plan Premium
- Todo lo anterior.
- Automatizaciones comerciales.
- Campañas programadas.
- Integración completa con IA y Automatizaciones.

**Regla de acceso:**  
Los planes inferiores podrán visualizar funcionalidades avanzadas como características disponibles para actualización, pero no podrán ejecutarlas.

---

## 3. PANTALLA PRINCIPAL

La interfaz se divide en **cuatro áreas funcionales principales:**

### 3.1. Promociones Activas

**Objetivo:**  
Mostrar todas las promociones vigentes del negocio.

**Información mostrada por promoción:**
- Nombre de la promoción.
- Producto asociado.
- Fecha de inicio.
- Fecha de finalización.
- Estado (Activa / Programada / Finalizada / Pausada).
- Alcance estimado (visitas proyectadas).
- Visualizaciones recibidas (dato real desde Estadísticas).

**Estados disponibles:**
- **Activa:** Promoción visible en el menú público.
- **Programada:** Configurada para activarse en fecha futura.
- **Finalizada:** Promoción expirada por fecha.
- **Pausada:** Promoción desactivada temporalmente por el usuario.

**Acciones disponibles:**
- Editar promoción.
- Pausar/Reactivar.
- Duplicar.
- Eliminar.
- Ver rendimiento.

---

### 3.2. Calendario Comercial

**Objetivo:**  
Visualizar toda la actividad promocional en perspectiva temporal.

**Vistas disponibles:**
- Mensual.
- Semanal.
- Diaria.

**Elementos visibles en el calendario:**
- Promociones activas.
- Publicaciones programadas.
- Fechas especiales (San Valentín, Navidad, eventos locales).
- Campañas futuras.
- Eventos comerciales personalizados.

**Beneficio:**  
Permite al negocio tener una visión clara de toda su actividad promocional y planificar mejor sus estrategias comerciales.

---

### 3.3. Contenido Generado

**Objetivo:**  
Biblioteca centralizada de contenido comercial.

**Contenido almacenado:**
- Posts para redes sociales.
- Textos promocionales.
- Textos generados con IA.
- Borradores.
- Publicaciones aprobadas.
- Publicaciones descartadas.

**Información mostrada por contenido:**
- Fecha de creación.
- Producto asociado.
- Estado (Borrador / Pendiente de revisión / Aprobado / Publicado / Descartado).
- Autor (Usuario / IA).
- Fuente (Manual / IA).
- Última modificación.

**Beneficio:**  
Reutilizar campañas exitosas en el futuro sin recrearlas desde cero.

---

### 3.4. Productos Destacados

**Objetivo:**  
Seleccionar manualmente productos que aparecerán en posiciones prioritarias del menú público.

**Categorías disponibles:**
- Más vendidos.
- Promoción de la semana.
- Recomendación del chef.
- Producto estrella.
- Nuevo.
- Popular.

**Comportamiento:**
- Los productos destacados se muestran automáticamente en zonas prioritarias del menú público.
- Pueden tener etiquetas visuales especiales (ej: "⭐ Destacado", "🔥 Popular").
- Pueden aparecer primero en su categoría.

**Limitaciones:**
- Plan Start: hasta 3 productos destacados simultáneos.
- Plan Business: hasta 6 productos destacados simultáneos.
- Plan Premium: productos destacados ilimitados.

---

## 4. CREACIÓN DE PROMOCIONES

**Método:**  
Asistente visual paso a paso.

**Campos disponibles:**

1. **Producto:**  
   Selección desde el catálogo de productos existente.

2. **Título promocional:**  
   Texto corto y atractivo (ej: "🍕 2x1 en Pizzas todos los Martes").

3. **Descripción:**  
   Detalle de la promoción (ej: "Compra una pizza grande y lleva la segunda gratis. Válido solo los martes de 18:00 a 22:00").

4. **Descuento:**  
   Porcentaje (%) o monto fijo (ej: "50%" o "-$5.00").

5. **Imagen:**  
   Selección desde el módulo Multimedia o subida nueva.

6. **Fecha de inicio:**  
   Fecha y hora de activación.

7. **Fecha de finalización:**  
   Fecha y hora de expiración.

8. **Estado inicial:**  
   - Activar inmediatamente.
   - Programar para fecha futura.

**Reglas:**
- Toda promoción debe estar asociada a un producto existente.
- Una promoción sin fecha de finalización permanece activa indefinidamente hasta ser pausada manualmente.
- Las promociones programadas se activan automáticamente en la fecha/hora configurada.

---

## 5. GENERACIÓN DE CONTENIDO CON IA

**Disponibilidad:**  
Plan Business y Premium.

**Flujo de generación:**

1. Usuario selecciona un producto.
2. Usuario elige el tipo de contenido:
   - Texto promocional.
   - Publicación para Instagram.
   - Publicación para Facebook.
   - Campaña de temporada.
   - Oferta especial.
   - Texto para WhatsApp.
3. IA genera contenido basado en:
   - Información del producto.
   - Tono del negocio.
   - Idioma principal del negocio.
   - Contexto temporal (ej: fin de semana, festividad).
4. Usuario revisa y edita el contenido generado.
5. Usuario aprueba o descarta.

**Regla crítica:**  
La IA **nunca publicará contenido automáticamente** sin aprobación manual o automatización previamente configurada por el usuario.

**Ejemplo de generación:**

**Entrada:**  
Producto: "Pizza Margherita"  
Tipo de contenido: "Publicación para Instagram"  
Contexto: "Fin de semana"

**Salida IA:**
```
🍕 ¡El fin de semana pide Pizza Margherita! 🍅🧀

Masa artesanal, salsa de tomate natural y mozzarella de primera calidad.

📍 Ordena ahora y recibe en 30 minutos.

#PizzaMargherita #FinDeSemana #DeliziaItaliana
```

Usuario puede:
- Editar el texto.
- Cambiar emojis.
- Ajustar hashtags.
- Aprobar y publicar.
- Descartar.

---

## 6. HISTORIAL DE CONTENIDO

**Objetivo:**  
Mantener registro completo de todo contenido generado.

**Estados del contenido:**

| Estado | Descripción |
|---|---|
| **Borrador** | Contenido creado pero no revisado. |
| **Pendiente de revisión** | Contenido generado por IA esperando aprobación. |
| **Aprobado** | Contenido validado por el usuario. |
| **Publicado** | Contenido utilizado en promoción activa. |
| **Descartado** | Contenido rechazado por el usuario. |

**Beneficio:**  
Reutilizar campañas exitosas en el futuro, analizar qué contenidos funcionan mejor y mantener coherencia en el tono comercial del negocio.

---

## 7. CONEXIÓN CON OTROS MÓDULOS

### 7.1. Catálogo de Productos

**Relación:**  
Las promociones se vinculan directamente a productos existentes.

**Comportamiento cuando un producto entra en promoción:**
- Puede destacarse automáticamente en el menú público.
- Puede aparecer primero en su categoría.
- Puede mostrar etiquetas promocionales (ej: "🔥 Promoción", "% Descuento").

**Regla:**  
Si un producto se elimina del catálogo, sus promociones asociadas pasan automáticamente a estado "Finalizada" y se archivan en el historial.

---

### 7.2. Multimedia

**Relación:**  
Todas las imágenes y videos utilizados en campañas se obtienen desde el módulo Multimedia.

**Flujo:**
1. Usuario crea promoción.
2. Selecciona imagen desde biblioteca multimedia o sube nueva.
3. Imagen se asocia a la promoción.
4. Imagen se muestra en el menú público mientras la promoción esté activa.

**Regla:**  
Si una imagen se elimina de la biblioteca multimedia, las promociones asociadas muestran una imagen placeholder hasta que se reemplace.

---

### 7.3. IA (Motor de Inteligencia Artificial)

**Relación:**  
Genera contenido comercial adaptado al negocio.

**Funciones:**
- Generar textos promocionales.
- Sugerir promociones basadas en productos populares (dato desde Estadísticas).
- Generar textos adaptados a distintos idiomas (integración con módulo Multiidioma).
- Sugerir campañas de temporada (ej: "¿Quieres crear una campaña para Navidad?").

**Regla:**  
La IA actúa como asistente, nunca como decisor autónomo. Toda acción requiere aprobación o automatización previa.

---

### 7.4. Automatizaciones

**Relación:**  
Permite programar campañas futuras y acciones recurrentes.

**Ejemplos de automatizaciones:**
- Publicar promoción cada viernes a las 18:00.
- Activar oferta de fin de semana automáticamente.
- Lanzar campaña en fechas especiales (ej: San Valentín, Día del Padre).
- Destacar automáticamente el producto más visto de la semana.

**Regla:**  
Las automatizaciones solo están disponibles en Plan Premium.

---

### 7.5. Estadísticas

**Relación:**  
Mide el rendimiento de todas las acciones comerciales.

**Indicadores disponibles:**
- Visualizaciones de productos promocionados.
- Productos promocionados más vistos.
- Clics en WhatsApp/redes sociales desde promoción.
- Horarios de mayor interacción con promociones.
- Rendimiento comparativo entre promociones.
- Incremento de visitas durante período promocional vs. período sin promoción.

**Beneficio:**  
Permite al negocio identificar qué promociones funcionan mejor y optimizar futuras campañas.

---

### 7.6. Menú Público

**Relación:**  
Las promociones aprobadas se reflejan automáticamente en el menú público.

**Comportamiento durante vigencia de promoción:**
- El producto puede destacarse visualmente (borde amarillo, fondo suave).
- Puede mostrar etiquetas especiales (ej: "🔥 Promoción", "% Descuento").
- Puede aparecer en secciones promocionales especiales.

**Comportamiento al finalizar promoción:**
- El sistema revierte automáticamente la visualización normal del producto.
- La etiqueta promocional se oculta.
- El producto vuelve a su posición original en el menú.

**Regla:**  
Ninguna promoción permanece visible en el menú público después de su fecha de finalización.

---

## 8. REGLAS ARQUITECTÓNICAS

### 8.1. Autonomía modular
Este módulo coordina acciones con múltiples módulos, pero no debe convertirse en dependencia obligatoria para ninguno de ellos.

**Implicación:**  
Si Marketing y Promociones se desactiva, el resto de la plataforma debe continuar funcionando normalmente.

---

### 8.2. Aprobación antes de publicación
La IA nunca publicará contenido automáticamente sin aprobación manual o automatización previamente configurada.

**Implicación:**  
Todo contenido generado por IA pasa por estado "Pendiente de revisión" antes de poder utilizarse.

---

### 8.3. Reversibilidad automática
Al finalizar una promoción, el sistema revierte automáticamente todos los cambios visuales en el menú público.

**Implicación:**  
No es necesaria intervención manual para "limpiar" promociones expiradas.

---

### 8.4. Preservación del historial
Todo contenido generado permanece almacenado incluso si se descarta.

**Implicación:**  
Permite auditoría completa de campañas pasadas y reutilización de contenido exitoso.

---

### 8.5. Sincronización con Estadísticas
Toda promoción activa debe registrar métricas en tiempo real.

**Implicación:**  
El módulo Estadísticas debe recibir eventos cada vez que un producto promocionado es visualizado o interactuado.

---

## 9. FLUJOS OPERATIVOS CLAVE

### 9.1. Crear promoción manual

```
[Usuario] → Crear promoción
           ↓
       Seleccionar producto
           ↓
       Completar campos
           ↓
       Subir/seleccionar imagen
           ↓
       Configurar fechas
           ↓
       Activar o programar
           ↓
       [Sistema] → Promoción creada
                  ↓
              (Si activa) → Reflejar en menú público
                  ↓
              (Si programada) → Agendar activación
```

---

### 9.2. Generar contenido con IA

```
[Usuario] → Solicitar generación de contenido
           ↓
       Seleccionar producto
           ↓
       Elegir tipo de contenido
           ↓
       [IA] → Generar contenido
           ↓
       [Sistema] → Mostrar contenido en estado "Pendiente de revisión"
           ↓
       [Usuario] → Editar (opcional)
           ↓
       [Usuario] → Aprobar o Descartar
           ↓
       (Si aprobado) → Contenido pasa a "Aprobado"
                     ↓
                 Puede utilizarse en promoción
```

---

### 9.3. Automatización de promoción recurrente

```
[Usuario Plan Premium] → Configurar automatización
                        ↓
                    Definir condición temporal (ej: "Cada viernes 18:00")
                        ↓
                    Seleccionar producto
                        ↓
                    Configurar contenido promocional
                        ↓
                    Activar automatización
                        ↓
                    [Sistema] → Agendar ejecución
                        ↓
                    (En fecha/hora programada) → Activar promoción automáticamente
                        ↓
                    Reflejar en menú público
                        ↓
                    Registrar en historial
```

---

### 9.4. Finalización automática de promoción

```
[Sistema] → Monitorear fecha de finalización de promociones activas
           ↓
       (Al llegar fecha de finalización)
           ↓
       Cambiar estado de promoción a "Finalizada"
           ↓
       Revertir cambios visuales en menú público
           ↓
       Ocultar etiquetas promocionales
           ↓
       Restaurar posición original del producto
           ↓
       Registrar métricas finales en Estadísticas
           ↓
       Archivar promoción en historial
```

---

## 10. CASOS DE USO PRINCIPALES

### 10.1. Restaurante desea promocionar plato del día

**Actor:** Administrador de Negocio (Plan Start)

**Flujo:**
1. Accede a Marketing y Promociones.
2. Clic en "Crear promoción".
3. Selecciona producto "Lasagna Bolognesa".
4. Título: "🍝 Plato del día: Lasagna Bolognesa".
5. Descripción: "Lasagna casera con salsa bolognesa tradicional. ¡Solo hoy!".
6. Descuento: Sin descuento (solo destacar).
7. Selecciona imagen desde biblioteca.
8. Fecha inicio: Hoy.
9. Fecha fin: Hoy 23:59.
10. Activa promoción.
11. Producto aparece destacado en menú público inmediatamente.

**Resultado:**  
Producto visible en posición prioritaria durante el día.

---

### 10.2. Cafetería desea generar contenido para Instagram

**Actor:** Administrador de Negocio (Plan Business)

**Flujo:**
1. Accede a Contenido Generado.
2. Clic en "Generar con IA".
3. Selecciona producto "Cappuccino Especiado".
4. Elige tipo de contenido: "Publicación para Instagram".
5. IA genera:
   ```
   ☕ Cappuccino Especiado · El favorito del otoño 🍂

   Espresso italiano + leche vaporizada + toque de canela y vainilla.

   📍 Ordena ahora y disfruta en nuestra terraza.

   #CappuccinoEspeciado #CaféArtesanal #OtoñoPerfecto
   ```
6. Usuario edita: cambia "otoño" por "invierno".
7. Aprueba contenido.
8. Contenido pasa a estado "Aprobado".
9. Usuario puede:
   - Copiarlo y publicarlo manualmente en Instagram.
   - Usarlo en una promoción dentro de la plataforma.

**Resultado:**  
Contenido profesional generado en segundos, listo para publicar.

---

### 10.3. Restaurante desea promoción recurrente cada fin de semana

**Actor:** Administrador de Negocio (Plan Premium)

**Flujo:**
1. Accede a Automatizaciones (integrado con Marketing).
2. Crea regla:
   - **Condición:** "Cada viernes a las 18:00".
   - **Acción:** "Activar promoción 'Especial Fin de Semana'".
   - **Producto:** "Parrillada Familiar".
   - **Título:** "🍖 Especial Fin de Semana".
   - **Descuento:** "20%".
   - **Duración:** Hasta domingo 23:59.
3. Activa automatización.
4. Cada viernes a las 18:00:
   - Sistema activa promoción automáticamente.
   - Producto aparece destacado en menú público.
   - Promoción se desactiva automáticamente el domingo 23:59.
5. Ciclo se repite cada semana.

**Resultado:**  
Promoción recurrente sin intervención manual semanal.

---

## 11. MÉTRICAS DE ÉXITO DEL MÓDULO

### Indicadores clave:
- **Tasa de creación de promociones:** % de negocios que crean al menos 1 promoción al mes.
- **Tasa de adopción de IA:** % de negocios (Plan Business/Premium) que utilizan generación de contenido con IA.
- **Rendimiento de promociones:** Incremento promedio de visualizaciones en productos promocionados vs. no promocionados.
- **Tasa de conversión de contenido IA:** % de contenido generado por IA que se aprueba y utiliza.
- **Uso de automatizaciones:** % de negocios Premium que configuran al menos 1 automatización comercial.

---

## 12. CONSIDERACIONES TÉCNICAS

### 12.1. Performance
- Las promociones activas deben cargarse en memoria para consulta rápida en el menú público.
- El calendario comercial debe usar paginación al mostrar más de 3 meses de actividad.

### 12.2. Escalabilidad
- Un negocio puede tener hasta 100 promociones activas simultáneas (Plan Premium).
- La biblioteca de contenido generado puede almacenar hasta 1000 registros por negocio antes de archivar automáticamente contenido antiguo descartado.

### 12.3. Seguridad
- Solo usuarios con rol "Administrador de Negocio" pueden crear, editar y eliminar promociones.
- El contenido generado por IA debe pasar por filtro de moderación antes de mostrarse al usuario (evitar contenido inapropiado).

---

## 13. RESULTADO ESPERADO

Diseñar un **centro de marketing simple, visual y orientado a resultados** que permita a cualquier negocio:

- Promocionar sus productos de forma profesional.
- Aumentar la visibilidad de su menú.
- Generar contenido comercial sin conocimientos de diseño o marketing.
- Planificar campañas futuras desde una única pantalla.
- Medir el impacto real de sus acciones comerciales.

Todo integrado con el resto de la plataforma SaaS de menús digitales.

---

**FIN DEL DOCUMENTO**
