# Escenarios del Corazón — Inspirado en *El Libro de la Vida* (V1.1)

Herramienta **estática** (HTML/CSS/JS) para usar en **videollamada** (Sergio comparte pantalla).

## Cambios que pediste (hechos)
- Título y tono más **evocativo / teatral**
- Interfaz **más colorida**
- Se eliminaron “píldoras” tipo *sin diagnósticos / sin etiquetas / solo para sesión*
- Resultados: **un solo resumen con sentido** (incluye inferencia suave basada en valores)
- Detalles para registro: se muestran en un desplegable y se pueden descargar en JSON
- Nuevo **Modo teatro**: duplica preguntas (personaje → tú). Puedes desactivarlo para ir más rápido.

## Archivos
- `index.html`
- `styles.css`
- `app.js`

## Ejecutar local
Abre `index.html` en tu navegador.

## GitHub Pages
1. Crea repo y sube estos archivos.
2. Settings → Pages → Deploy from branch → `main` / root.

## Personalización sin complicarte
En `app.js`, sección `ALTERS`:
- edita preguntas y opciones
- edita las preguntas de personaje (`refPrompt`)
- la inferencia está en `buildValueInference()` (reglas simples; no diagnóstica)
