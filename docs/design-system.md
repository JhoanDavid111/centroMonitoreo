# Sistema de diseño oscuro - Centro de Monitoreo

Este documento resume la estructura del tema oscuro unificado y las convenciones de estilos que se deben seguir al desarrollar nuevas vistas o refactorizar componentes existentes.

## Tokens centrales (`src/styles/theme.js`)

- `tokens.colors`: paleta semanticamente nombrada (`surface`, `border`, `text`, `accent`, `chart`).
- `tokens.font`, `tokens.spacing`, `tokens.radius`, `tokens.shadow`: tipografía, espaciados, bordes y sombras.
- `colors`: export auxiliar mantenido para componentes que aún usan constantes sencillas.

Siempre que se necesiten valores dinámicos (por ejemplo, en Highcharts o Recharts) se deben importar los tokens:

```javascript
import tokens from '../styles/theme.js';

const panelStyle = {
  backgroundColor: tokens.colors.surface.primary,
  color: tokens.colors.text.primary,
};
```

## Variables CSS globales (`src/index.css`)

El archivo registra los mismos tokens como `--surface-primary`, `--text-secondary`, etc. Esto permite referenciarlos desde Tailwind con clases utilitarias personalizadas:

- Fondos: `bg-surface-primary`, `bg-surface-secondary`.
- Bordes: `border-[color:var(--border-default)]`.
- Texto: `text-text-primary`, `text-text-muted`.
- Sombras: `shadow-soft`.

Evita usar códigos hex directos (`#262626`) en nuevos desarrollos.

## Configuración de Tailwind (`tailwind.config.js`)

Se extendieron las claves para mapear las variables CSS:

- `colors.surface.primary`, `colors.text.secondary`, etc.
- `fontFamily.sans` → `var(--font-family-base)`.
- `boxShadow.soft` y `borderRadius.md` para reutilizar en componentes.

Cuando sea posible, utiliza clases Tailwind sobre estilos inline.

## Componentes base (`src/components/ui/…`)

- `Card`: contenedor estándar con fondo oscuro, borde sutil y sombra suave.
- `Panel`: variante secundaria (por ahora poco usada, disponible para layouts).
- `Badge`: etiqueta redondeada con variantes semánticas.
- `TooltipModal`: modal estandarizada para tooltips extensos.

Al crear nuevas cards/tarjetas, reutiliza `Card` y amplía con clases adicionales (`className`).

### Sustitución masiva de clases con colores fijos

Para acelerar la migración de clases Tailwind con colores “quemados” se incluye el script:

```bash
node scripts/replace-hardcoded-colors.mjs
```

Reemplaza patrones comunes (p. ej. `bg-[#262626]`, `border-[#666666]`, `text-[#D1D1D0]`) por sus equivalentes basados en tokens. Ejecuta el script antes de refactors grandes y revisa el diff resultante; puede correrse múltiples veces sin efectos adversos.

- `scripts/replace-inline-styles.mjs`: sustituye propiedades inline (`backgroundColor: '#262626'`, `color: '#fff'`, etc.) por referencias a `tokens`. El script añade automáticamente la importación correcta en cada archivo:

```bash
node scripts/replace-inline-styles.mjs
```

Tras correr ambos scripts, revisa manualmente los casos donde los colores representan datos (por ejemplo, paletas de mapas) antes de reemplazarlos por tokens.

## Highcharts y tooltips

- `src/lib/highcharts-config.js`: apunta el tema global de Highcharts a los tokens (evita re-configurar en cada componente).
- `src/lib/chart-tooltips.js`: formatters HTML usan `tokens` para colores, tipografías y espaciados.
- Para componentes nuevos, importa `Highcharts` desde `lib/highcharts-config` y sobreescribe solo lo específico.

## DataTables

- `src/components/DataGrid/styles/darkTheme.js`: expone `registerDarkDataTableTheme()` (llamar una sola vez) y `darkTableStyles`.
- Al usar `react-data-table-component`, incluye:
  ```javascript
  registerDarkDataTableTheme();
  <DataTable theme="customDark" customStyles={customStyles} … />
  ```
- Cualquier ajuste adicional debe partir de `darkTableStyles` + tokens.

## Convenciones generales

1. **Sin hex directos**: usa tokens, variables CSS o clases Tailwind extendidas.
2. **Estructura consistente**:
   - Cards → `Card`.
   - Skeletons → `bg-surface-secondary` / `bg-[color:var(--surface-overlay)]`.
   - Textos secundarios → `text-text-secondary` o `text-text-muted`.
3. **Botones CTA**: `bg-[color:var(--accent-primary)]` con hover usando `accent-warning` cuando aplique.
4. **Documenta los overrides**: si un componente requiere colores especiales (p. ej. vectores SVG), comenta la razón para revertirlos luego.
5. **Centraliza helpers**: si necesitas nuevas variantes (p. ej. `Card` compacto, badges adicionales), crea variantes en `ui/` en vez de duplicar estilos inline.

## Checklist al crear refactors

- [ ] Importa `tokens` si el componente usa estilos inline.
- [ ] Usa componentes base (`Card`, `Badge`, etc.).
- [ ] Evita `backgroundColor: '#262626'` / `className="text-white"` → reemplaza por tokens/clases.
- [ ] Para gráficos: reutiliza `highcharts-config`, `chart-tooltips` y `darkTheme` en DataTables.
- [ ] Actualiza este documento si se añaden nuevos tokens o patrones.

Mantener estas pautas nos ayuda a conservar el look & feel consistente y a simplificar futuros cambios globales (ej. soportar tema claro).

