#!/usr/bin/env bash
# Download the hosted app's /assets/* build files and bundle them into the APK
# (android/app/src/main/assets/webassets/) so OfflineAssetsWebViewClient can
# serve them locally instead of over the network. Re-run after each web deploy
# so the bundled hashes match production, then rebuild the APK.
#
# Usage: scripts/fetch-web-assets.sh [BASE_URL]   (default https://app.jilio.xyz)
set -euo pipefail

BASE="${1:-https://app.jilio.xyz}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$HERE/android/app/src/main/assets/webassets/assets"

rm -rf "$DEST"; mkdir -p "$DEST"
tmp="$(mktemp)"
# The login page inlines the route manifest, so its HTML references the shared
# vendor/UI chunks + most route modules.
curl -sL --max-time 30 "$BASE/login" -o "$tmp"

mapfile -t ASSETS < <(grep -oE '/assets/[A-Za-z0-9_./-]+\.(js|css|woff2?|ttf|png|svg)' "$tmp" | sort -u)
n=0
for a in "${ASSETS[@]}"; do
  if curl -sf --max-time 30 -o "$DEST/$(basename "$a")" "$BASE$a"; then n=$((n+1)); fi
done
rm -f "$tmp"
echo "Bundled $n asset files into $DEST"
du -sh "$DEST"
