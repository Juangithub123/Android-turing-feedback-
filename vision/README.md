# Turing Vision

Tercera app del repo, junto a **Turing Feedback** (`../index.html`) y **Turing YOLO** (`../yolo/`): efectos de **segmentación de objetos** y **mapa de profundidad** en tiempo real, corriendo 100 % en el navegador.

## Qué hace

- **Fuentes:** cámara en tiempo real (trasera/frontal), videos y fotos de la galería.
- **Capa de profundidad:** Mapa (con paletas Inferno, Turbo, Viridis, Magma, Plasma o Gris), Niebla, Foco (desenfoque por distancia), Curvas de nivel, 3D (paralaje animado), Recorte por distancia, Relieve (luz que gira sobre el relieve) y Escáner (una banda tipo lidar que barre la escena). Se ajustan intensidad, distancia, rango, velocidad y cantidad de líneas.
- **Capa de segmentación:** Color (objetos en color y fondo en blanco y negro), Retrato (fondo desenfocado), Silueta, Neón, Recorte (fondo liso), Pixelar y Térmico; con contorno, borde suave, confianza mínima, etiquetas y filtro por grupo (personas, vehículos, animales, objetos).
- **Estilos rápidos** que combinan las dos capas: Lidar, Térmica, Retrato, Topografía, Holograma, Niebla, Aislar y Relieve.
- **Tocá la imagen** para elegir la distancia de enfoque en Foco, Recorte y Niebla.
- **Guardar:** `Foto` (JPG) y `REC` (graba el resultado en MP4/WebM).

## Modelos

| Archivo | Modelo | Tamaño | Licencia |
|---|---|---|---|
| `yolo11n-seg.onnx` | Ultralytics YOLO11n-seg (80 clases COCO), entrada dinámica | 12 MB | AGPL-3.0 |
| `depth-anything-v2-small-q8.onnx` | Depth Anything V2 Small, pesos en int8 por canal (se expanden a float al cargar) | 27 MB | Apache-2.0 |

Solo se descarga el modelo de la capa que esté activa, y queda guardado en la caché del navegador. El motor es ONNX Runtime Web 1.20.1: usa WebGPU si está disponible y si no WebAssembly en un worker. Los efectos se dibujan con WebGL2.

Sin GPU, la profundidad tarda alrededor de 1 segundo por cuadro: en fotos no importa, pero en video conviene bajar la resolución a 196.

## Uso en Android

Igual que Turing YOLO: la cámara necesita **https**. Con GitHub Pages activado, abrí `https://<usuario>.github.io/<repo>/vision/` en Chrome.
