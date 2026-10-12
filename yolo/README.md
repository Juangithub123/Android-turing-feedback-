# Turing YOLO

App paralela a **Turing Feedback** (`../index.html`): overlay por detección de objetos con YOLO11n, corriendo 100 % en el navegador (nada se sube a ningún servidor).

## Qué hace

- **Fuentes:** cámara en tiempo real (trasera/frontal), videos y fotos de la galería.
- **Estilos rápidos:** Clásico, HUD, Neón, Plexus, Circuito y Constelación (combinaciones listas que después se pueden ajustar).
- **Fondo:** Normal, Foco (oscurece lo que no se detectó), Color (fondo en blanco y negro), Pixelar y Desenfoque.
- **Recuadro:** forma (rectángulo, redondeado, esquinas, corchetes, elipse, mira o ninguno), trazo (sólido, guiones, puntos o doble), grosor, brillo y relleno.
- **Uniones entre detecciones:** líneas rectas, arcos, curvas S o codos; conectadas en cadena, por vecinos más cercanos, en árbol (distancia mínima), todas con todas o en estrella. Se ajustan curvatura, distancia máxima, trazo, grosor, brillo, animación (flujo o pulso) y velocidad, y si salen del centro o del borde del recuadro. También se puede unir solo objetos de la misma clase, marcar los extremos con puntos y usar un degradé entre los colores de cada clase.
- **Detección:** confianza mínima, NMS, suavizado de cajas con IDs estables, resolución del modelo (320/480/640) y filtro de las 80 clases COCO (en español).
- **Guardar:** `Foto` descarga el cuadro actual en JPG; `REC` graba el lienzo con el overlay (MP4 o WebM según el navegador).
- **Renderizar video cuadro por cuadro** (pestaña Fuente, con un video abierto): recorre el video a 24, 30 o 60 fps, corre la detección en todos los cuadros con todos los efectos, sin apuro, y arma un MP4 fluido con el audio original (WebCodecs + [mp4-muxer](https://github.com/Vanilagy/mp4-muxer)). Usa H.264/AAC si el teléfono los codifica; si no, VP9/Opus dentro del MP4. Se puede cancelar en cualquier momento.

## Cómo funciona

- Modelo: `yolo11n.onnx` (Ultralytics YOLO11n exportado a ONNX con entrada dinámica, opset 17).
- Motor: [ONNX Runtime Web](https://onnxruntime.ai/) 1.20.1 desde jsDelivr. Usa **WebGPU** si el navegador lo soporta y si no **WebAssembly** en un worker (para que la interfaz no se trabe).
- El modelo se guarda en la caché del navegador después de la primera carga.

## Uso en Android

La cámara solo funciona en una dirección **https** (o `localhost`). La forma más simple es activar GitHub Pages en el repo (Settings → Pages → rama principal, carpeta raíz) y abrir `https://<usuario>.github.io/<repo>/yolo/` en Chrome.

Para probar en la computadora: `python3 -m http.server` en la raíz del repo y abrir `http://localhost:8000/yolo/`.

## Licencia del modelo

YOLO11 de Ultralytics se distribuye bajo AGPL-3.0.
