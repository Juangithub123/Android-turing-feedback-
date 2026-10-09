# Turing YOLO

App paralela a **Turing Feedback** (`../index.html`): overlay por detección de objetos con YOLO11n, corriendo 100 % en el navegador (nada se sube a ningún servidor).

## Qué hace

- **Fuentes:** cámara en tiempo real (trasera/frontal), videos y fotos de la galería.
- **Efectos de overlay:** Cajas, HUD, Neón, Foco (oscurece lo que no se detectó), Color (fondo en blanco y negro), Pixelar y Desenfoque.
- **Detección:** confianza mínima, NMS, suavizado de cajas con IDs estables, resolución del modelo (320/480/640) y filtro de las 80 clases COCO (en español).
- **Guardar:** `Foto` descarga el cuadro actual en JPG; `REC` graba el lienzo con el overlay (MP4 o WebM según el navegador).

## Cómo funciona

- Modelo: `yolo11n.onnx` (Ultralytics YOLO11n exportado a ONNX con entrada dinámica, opset 17).
- Motor: [ONNX Runtime Web](https://onnxruntime.ai/) 1.20.1 desde jsDelivr. Usa **WebGPU** si el navegador lo soporta y si no **WebAssembly** en un worker (para que la interfaz no se trabe).
- El modelo se guarda en la caché del navegador después de la primera carga.

## Uso en Android

La cámara solo funciona en una dirección **https** (o `localhost`). La forma más simple es activar GitHub Pages en el repo (Settings → Pages → rama principal, carpeta raíz) y abrir `https://<usuario>.github.io/<repo>/yolo/` en Chrome.

Para probar en la computadora: `python3 -m http.server` en la raíz del repo y abrir `http://localhost:8000/yolo/`.

## Licencia del modelo

YOLO11 de Ultralytics se distribuye bajo AGPL-3.0.
