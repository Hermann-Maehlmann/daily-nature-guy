#!/usr/bin/env bash
# Videos kurz öffentlich ablegen, damit Metricool sie abholen kann (Metricool kopiert sie beim Einplanen
# sofort auf eigene Server). Ablage = Branch "videos", der bei jedem Lauf per Force-Push ersetzt wird,
# damit das Repo nicht wächst.
#   autopilot/host.sh upload out/a.mp4 out/b.mp4   -> gibt je Datei die öffentliche URL aus
#   autopilot/host.sh clear                        -> leert die Ablage wieder (nach dem Einplanen)
set -euo pipefail
REPO="${GH_REPO:-Hermann-Maehlmann/daily-nature-guy}"
MODE="${1:-}"; shift || true
FILES=(); for f in "$@"; do FILES+=("$(realpath "$f")"); done
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
W="$(mktemp -d)/videos"
git -C "$ROOT" worktree add -f --orphan -b "videos-$$" "$W" >/dev/null 2>&1
cd "$W"
case "$MODE" in
  upload) cp "${FILES[@]}" . ;;
  clear) echo "Leer: Videos werden nach dem Einplanen gelöscht." > README.md ;;
  *) echo "usage: host.sh upload <dateien…> | clear" >&2; exit 2 ;;
esac
git add -A
git -c user.name="KI-Labor Autopilot" -c user.email="autopilot@users.noreply.github.com" commit -qm "Video-Ablage"
git push -q --force origin "HEAD:videos"
cd "$ROOT"; git worktree remove --force "$W"; git branch -D "videos-$$" >/dev/null
if [ "$MODE" = upload ]; then for f in "${FILES[@]}"; do echo "https://raw.githubusercontent.com/$REPO/videos/$(basename "$f")"; done; fi
