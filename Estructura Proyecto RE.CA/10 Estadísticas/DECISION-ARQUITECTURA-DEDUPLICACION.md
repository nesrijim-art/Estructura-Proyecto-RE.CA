# Decisión de Arquitectura — Deduplicación de Visitas (M10)

**Módulo:** M10 · Estadísticas  
**Fecha:** 2026-06-10  
**Estado:** Aprobado con condición documentada

---

## Descripción

La deduplicación de visitas al menú público garantiza que cada sesión anónima (`session_id`) genere como máximo **una fila por día** en la tabla `menu_visitas`. El mecanismo actual se basa en un `SELECT` previo al `INSERT`:

```js
// backend/src/routes/estadisticas.js
const existe = db.prepare(
  'SELECT id FROM menu_visitas WHERE empresa_id = ? AND session_id = ? AND date(created_at) = ?'
).get(empresa.id, session_id, hoy);

if (!existe) {
  db.prepare('INSERT INTO menu_visitas ...').run(...);
}
```

No existe una `UNIQUE CONSTRAINT` en la base de datos que refuerce esta restricción a nivel de esquema.

---

## Garantía actual

La ausencia de constraint es **válida exclusivamente bajo la arquitectura oficial de esta fase**:

- **Runtime:** Node.js instancia única (un solo proceso)
- **Base de datos:** SQLite con `better-sqlite3` (API síncrona, sin callbacks)
- **Concurrencia:** El event loop de Node.js es monohilo — el bloque `SELECT + INSERT` se ejecuta de forma atómica dentro del mismo tick, sin posibilidad de interleaving entre dos requests simultáneos

Bajo esta arquitectura, dos requests con el mismo `session_id` en el mismo milisegundo **no pueden intercalarse**. La garantía es estructural, no probabilística.

---

## Condición aprobada

> La deduplicación actual es válida exclusivamente bajo la arquitectura de instancia única definida para esta fase del proyecto. Cualquier cambio futuro hacia múltiples procesos o réplicas **requiere reforzar la deduplicación mediante restricciones únicas a nivel de base de datos** antes de entrar en producción.

---

## Acción requerida ante escalado horizontal

Si en el futuro se despliega RE.CA con más de un proceso Node.js (cluster, PM2 multi-core, contenedores múltiples, réplicas), se debe aplicar la siguiente migración **antes** del despliegue:

```sql
-- Agregar UNIQUE constraint para forzar deduplicación a nivel de base de datos
CREATE UNIQUE INDEX IF NOT EXISTS idx_visitas_dedup
  ON menu_visitas(empresa_id, session_id, date(created_at));
```

Y reemplazar el patrón `SELECT + INSERT` por:

```sql
INSERT OR IGNORE INTO menu_visitas (id, empresa_id, session_id, lang)
VALUES (?, ?, ?, ?);
```

Esto elimina la condición de carrera bajo cualquier topología de despliegue.

---

## Archivos afectados

| Archivo | Líneas | Descripción |
|---|---|---|
| `backend/src/routes/estadisticas.js` | 83–94 | Lógica de deduplicación actual (SELECT + INSERT condicional) |
| `backend/src/db/database.js` | 230–256 | Schema de `menu_visitas` — aquí se agregaría el UNIQUE INDEX |
