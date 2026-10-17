# Módulo 07 · Vigilancia bibliográfica EII

App que muestra el Sheet **«Vigilancia bibliográfica EII · PubMed semanal»** (lo llena cada lunes la búsqueda programada de PubMed).

- App: `vigilancia/index.html` → https://moropezah.github.io/repositorio-eii-2026/vigilancia/
- Conexión con el Sheet: `fuentes/vigilancia/Code.gs` (Apps Script)
- Datos de respaldo: `vigilancia/datos-respaldo.json` (carga inicial del 16 oct 2026). Se muestran solo mientras la app no esté conectada o si el Sheet no responde y no hay copia local.

## Qué lee y qué escribe

| Pestaña del Sheet | La app | Quién la llena |
|---|---|---|
| Registro, Lectura obligatoria, Bitácora semanal | solo lee | la búsqueda semanal de los lunes |
| Mi lectura | lee y escribe (estado, destacado, nota por PMID) | tú, desde la app en modo edición |

Cualquiera con el link de la app ve todo (incluidas tus marcas y notas). Solo quien tenga la clave puede marcar y anotar. El Sheet sigue privado.

## Conectar la app (una sola vez, ~5 minutos)

1. Abre el Sheet → **Extensiones → Apps Script**.
2. Borra el contenido de `Código.gs` y pega todo `fuentes/vigilancia/Code.gs`.
3. En la línea `const CLAVE = 'CAMBIA-ESTA-CLAVE';` escribe tu clave (la que usarás en la app). Guarda (💾).
4. Arriba, elige la función **probar** → **Ejecutar**. Acepta los permisos (Revisar permisos → tu cuenta → Configuración avanzada → Ir a … → Permitir). En el registro debe aparecer «Registro: 141 · Lectura obligatoria: 20…».
5. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
   - Implementar → copia la **URL de la aplicación web** (termina en `/exec`).
6. Envía esa URL para dejarla escrita en la constante `API` de `vigilancia/index.html`. Mientras tanto puedes probarla en tu dispositivo: app → Acerca → «Probar otra URL en este dispositivo».
7. En la app, toca 🔒, escribe la clave y quedas en modo edición en ese dispositivo.

Si cambias el código del script después: **Implementar → Gestionar implementaciones → editar (✎) → Versión: Nueva versión → Implementar**. Así la URL no cambia.

## Cómo actualizar el módulo sin tocar los demás

- Se edita directamente `vigilancia/index.html` (y `fuentes/vigilancia/Code.gs` si cambia la conexión).
- Commit solo de `vigilancia/` y `fuentes/vigilancia/`: `git add vigilancia/ fuentes/vigilancia/`.
- Al cambiar `index.html`, subir también la versión en `vigilancia/sw.js` (constante `CACHE`) para que las apps instaladas tomen la nueva copia sin conexión.
