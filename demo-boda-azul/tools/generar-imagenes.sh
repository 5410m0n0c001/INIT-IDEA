#!/usr/bin/env bash
# Genera img/pases/pase-1..5.jpg, img/pases/og-1..20.jpg e img/og.jpg desde tools/tarjeta.html
# con Chrome sin ventana. Uso: bash tools/generar-imagenes.sh
set -e
cd "$(dirname "$0")/.."
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
BASE="file:///$(pwd -W 2>/dev/null || pwd)/tools/tarjeta.html"
TMP="$(mktemp -d)"
mkdir -p img/pases
captura() { # url ancho alto salida
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --mute-audio \
    --virtual-time-budget=6000 --window-size="$2,$3" --screenshot="$TMP/c.png" "$1" >/dev/null 2>&1
  ffmpeg -v error -y -i "$TMP/c.png" -q:v 3 "$4"
}
for n in 1 2 3 4 5; do captura "$BASE?tipo=pase&n=$n" 800 1000 "img/pases/pase-$n.jpg"; done
for n in $(seq 1 20); do captura "$BASE?tipo=og&n=$n" 1200 630 "img/pases/og-$n.jpg"; done
captura "$BASE?tipo=og" 1200 630 "img/og.jpg"
rm -rf "$TMP" 2>/dev/null || true
