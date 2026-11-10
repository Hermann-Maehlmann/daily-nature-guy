#!/usr/bin/env bash
# Natürliche Sprecherstimme (Chatterbox, frei, CPU) für ein Drehbuch erzeugen.
#   bash autopilot/v2/stimme.sh out/<slug>.json      -> out/vo_<slug>_XX.wav + out/<slug>-cb.json (damit rendern)
# Erster Aufruf pro Sitzung installiert das Modell (~5-10 Min), danach ~35 s pro Satz.
set -euo pipefail
SPEC="$1"; HERE="$(cd "$(dirname "$0")" && pwd)"; VENV="${CB_VENV:-$HOME/cbenv}"
if ! "$VENV/bin/python" -c "import chatterbox" 2>/dev/null; then
  command -v uv >/dev/null || pip install -q uv
  uv venv -q -p python3.11 "$VENV" 2>/dev/null || uv venv -q "$VENV"
  VIRTUAL_ENV="$VENV" uv pip install -q torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu
  VIRTUAL_ENV="$VENV" uv pip install -q chatterbox-tts "setuptools<81" --extra-index-url https://download.pytorch.org/whl/cpu --index-strategy unsafe-best-match
fi
# Modell-Cache aus dem Projektordner nutzen (spart 3 GB Download), sonst von Hugging Face laden
CACHE=/mnt/project-files/ki-labor/autopilot/hf
if [ ! -d "$HOME/.cache/huggingface/hub/models--ResembleAI--chatterbox" ] && [ -d "$CACHE/hub/models--ResembleAI--chatterbox" ]; then
  mkdir -p "$HOME/.cache/huggingface" && cp -r "$CACHE/hub" "$HOME/.cache/huggingface/" || true
fi
"$VENV/bin/python" "$HERE/tts_chatterbox.py" "$SPEC" "$(dirname "$SPEC")"
echo "OK Stimme: ${SPEC%.json}-cb.json"
