# Turing — exploraciones visuales

Apps web que corren en el navegador del teléfono (todo se procesa en el equipo). Se publican con GitHub Pages y se abren en Chrome para Android.

| App | Carpeta | Qué hace |
|---|---|---|
| **Turing Studio** | [`studio/`](studio/) | Looks para fotos y videos ya sacados: revelado, película, riso, clones con desfase de tiempo y capa de archivo. Exporta para Instagram. Se instala y recibe archivos desde **Compartir**. |
| Turing Feedback | [`index.html`](index.html) | Feedback visual generativo (reacción-difusión, caleidoscopio) en tiempo real. |
| Turing YOLO | [`yolo/`](yolo/) | Detección de objetos con recuadros, uniones y estilos HUD. |
| Turing Vision | [`vision/`](vision/) | Segmentación y mapa de profundidad. |

`export-video.js` es el exportador de video cuadro por cuadro (WebCodecs + MP4) que comparten las apps.

Para probar en la computadora: `python3 -m http.server` en la raíz y abrir `http://localhost:8000/studio/`.
