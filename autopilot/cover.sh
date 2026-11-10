#!/usr/bin/env bash
# Setzt das Thumbnail als allererstes Bild (0,1 s) ins Video. TikTok nimmt bei privaten Konten
# das erste Bild als Cover, ein eigenes videoThumbnailUrl wird dort ignoriert.
#   autopilot/cover.sh out/<slug>.mp4 out/<slug>.jpg
set -euo pipefail
MP4="$1"; JPG="$2"; TMP="$(mktemp -d)"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")
VK=$(python3 -c "d=float('$DUR')+0.1; print(max(1500,min(8000,int(10.4e6*8/(d+0.5)/1000)-170)))")
FC="[0:v]scale=1080:1920,setsar=1,format=yuv420p,fps=30[c];[1:v]setsar=1,format=yuv420p,fps=30[v];[c][v]concat=n=2:v=1:a=0[vo];[1:a]adelay=100|100[ao]"
ENC=(-c:v libx264 -preset slow -b:v ${VK}k -maxrate $((VK*16/10))k -bufsize $((VK*2))k -pix_fmt yuv420p -passlogfile "$TMP/p")
ffmpeg -y -loglevel error -loop 1 -framerate 30 -t 0.1 -i "$JPG" -i "$MP4" -filter_complex "${FC%%;\[1:a\]*}" -map "[vo]" "${ENC[@]}" -pass 1 -an -f null -
ffmpeg -y -loglevel error -loop 1 -framerate 30 -t 0.1 -i "$JPG" -i "$MP4" -filter_complex "$FC" -map "[vo]" -map "[ao]" "${ENC[@]}" -pass 2 -c:a aac -b:a 128k -movflags +faststart "$TMP/out.mp4"
mv "$TMP/out.mp4" "$MP4"; rm -rf "$TMP"
echo "OK Cover gesetzt: $MP4 ($(du -h "$MP4" | cut -f1))"
