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

## Looks incluidos

Natural+, Tibio, Tibio corrido, Archivo, Archivo riso, Cronos, Cronos riso y Riso ámbar. Los looks propios se guardan en el teléfono con **Guardar look actual**.

## Notas

- Chrome no abre fotos HEIC: si tu cámara las guarda así, cambiala a JPEG.
- Para que aparezcan las coordenadas, la cámara tiene que tener activada la ubicación.
- Los clones funcionan mejor con el teléfono quieto (trípode o apoyado).
