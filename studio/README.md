# Turing Studio

App para darle una identidad visual a fotos y videos ya sacados con la cámara del teléfono, y exportarlos listos para Instagram. Se instala como app en Android (PWA) y aparece en el menú **Compartir** de la galería.

## Uso

1. Abrí `…/studio/` en Chrome para Android y, desde el menú ⋮, **Agregar a la pantalla principal** (o **Instalar app**).
2. Desde la galería: elegí una o varias fotos o videos → **Compartir** → **Studio**. También podés usar **+ Abrir** dentro de la app.
3. Elegí un **look**, ajustá las **capas**, el **formato** (4:5, 1:1, 9:16, 16:9 u original) y arrastrá la imagen para mover el encuadre. Mantené apretado para ver el original.
4. **Exportar** → **Compartir** (directo a Instagram o a la galería) o **Descargar**. Con varios archivos cargados, **Exportar todas con este look** arma el carrusel completo y lo comparte de una vez.

En video: recortá el inicio y el fin, elegí 24, 30 o 60 fps y usá **Vista previa renderizada** para ver el resultado en baja resolución (con los clones incluidos) antes de exportar en calidad final. La exportación es cuadro por cuadro, con el audio original.

## Capas

- **Revelado:** exposición, contraste, luces, sombras, temperatura, tinte, saturación, desvanecer, blanco y negro y tono partido.
- **Película:** grano (cantidad y tamaño), halación, difusión, viñeta y nitidez.
- **Riso / desfase:** tintas RGB corridas, o duotono riso con dos tintas sobre papel, desfase con ángulo y semitono opcional.
- **Clones** (video): recorta personas u objetos con YOLO11n-seg (el modelo de `../vision/`) y los repite con desfase de tiempo; copias, desfase, opacidad, color por copia (tintas riso, ámbar, arcoíris), corrimiento, mezcla y desvanecido.
- **Archivo:** fecha y hora, coordenadas GPS (leídas del EXIF de las fotos y de los metadatos de los videos), código de tiempo, marcas de esquina y texto propio.

- **Manchas:** seguimiento de manchas por movimiento (lo que cambia entre cuadros), luces o sombras, con IDs estables, recuadro, esquinas o mira, uniones (cadena, vecinos, todas), etiquetas con coordenadas e inversión adentro. Funciona en la vista previa en vivo.

## Movimiento (pestaña de video)

- **Seguimiento de punto:** pausá, tocá **Elegir punto** y tocá en la imagen lo que querés seguir. La app recorre el video hacia adelante y hacia atrás buscando ese punto (correlación de parches en dos escalas, con ajuste subpíxel y modelo que se actualiza de a poco) y avisa en qué porcentaje de los cuadros lo encontró.
  - **Marcador:** mira, esquinas o punto, con estela y etiqueta con coordenadas.
  - **Centrar encuadre:** el recorte sigue al punto (con suavizado). Necesita margen para moverse: si el punto se va lejos, la app avisa y sugiere subir el **Margen** o el **Zoom**.
- **Estabilizar:** estima el movimiento de la cámara entre cuadros (traslación, giro y escala, descartando lo que se mueve distinto), lo suaviza y recorta para compensar el temblor.
- **Hyperlapse:** velocidad 2× a 16×, combinable con estabilizar y centrar en un punto (hyperlapse anclado). **Mezcla de cuadros** promedia cuadros intermedios para dar desenfoque de movimiento. En hyperlapse no se copia el audio.

El análisis se hace solo al exportar; con **Analizar movimiento** se puede ver antes en la vista previa.

## Looks incluidos

Natural+, Tibio, Tibio corrido, Archivo, Archivo riso, Vigilancia, Cronos, Cronos riso y Riso ámbar. Los looks propios se guardan en el teléfono con **Guardar look actual**.

## Notas

- Chrome no abre fotos HEIC: si tu cámara las guarda así, cambiala a JPEG.
- Para que aparezcan las coordenadas, la cámara tiene que tener activada la ubicación.
- Los clones funcionan mejor con el teléfono quieto (trípode o apoyado).
