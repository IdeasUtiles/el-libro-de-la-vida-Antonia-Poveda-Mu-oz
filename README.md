# Autoevaluación lúdica — Inspirada en *El Libro de la Vida* (V1)

Herramienta **100% estática** (HTML/CSS/JS) pensada para usar **en videollamada**, compartiendo pantalla.
No hace diagnósticos ni etiquetas: **solo devuelve un resumen de lo que la adolescente elige y escribe**.

- **Duración**: 12–15 min (24 preguntas).
- **Formato**: 8 altares (Opción B).
- **Entradas**: elección + (opcional) una frase.
- **Salidas**: texto “Para ti” y texto “Para Sergio”, más descarga JSON.
- **Pausa / continuar**: guarda progreso automáticamente en `localStorage` (mismo navegador).

> Nota legal: estética “inspirada”, sin arte oficial. Uso privado/terapéutico. No afiliado.

## Archivos

- `index.html` — pantalla de inicio, preguntas y resultados
- `styles.css` — estilos visuales
- `app.js` — lógica del flujo, guardado y generación de textos

## Cómo ejecutar en tu ordenador

1. Descarga el repo como ZIP o clónalo.
2. Abre `index.html` en el navegador.

## Publicar en GitHub Pages (recomendado)

1. Crea un repositorio nuevo en GitHub (por ejemplo: `ldlv-autoevaluacion-v1`).
2. Sube estos archivos (`index.html`, `styles.css`, `app.js`, `README.md`).
3. En GitHub: **Settings → Pages**  
   - Source: **Deploy from a branch**  
   - Branch: **main** / folder **root**  
4. Guarda. GitHub te dará una URL del tipo `https://TUUSUARIO.github.io/ldlv-autoevaluacion-v1/`.

## Personalización rápida (sin programar)

En `app.js` puedes editar:

- Nombres (Laura, Ricardo, Julieta, Matías, David)
- Preguntas y opciones (sección `ALTERS`)
- Textos finales (función `summarize()`)

## Próximas mejoras (V2 sugeridas)

- “Capítulos” para hacer el juego en 2 sesiones.
- Banco de preguntas más grande y selección aleatoria por altar.
- Modo “teatro”: escenas y elecciones de guion.
- Exportación en PDF (seguiría siendo estático).
