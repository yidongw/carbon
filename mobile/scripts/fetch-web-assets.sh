#!/usr/bin/env bash
# Download the hosted app's ENTIRE client bundle (/assets/* — every code-split
# route chunk + css) and bundle it into the APK
# (android/app/src/main/assets/webassets/) so OfflineAssetsWebViewClient serves
# them locally instead of over the network. Re-run after each web deploy so the
# bundled hashes match production, then rebuild the APK.
#
# The full asset list comes from the React Router route manifest
# (/assets/manifest-*.js), which references every route's module + imports.
#
# Usage: scripts/fetch-web-assets.sh [BASE_URL]   (default https://app.jilio.xyz)
# No `set -e`: greps with no matches (exit 1) are expected and handled inline;
# we don't want them to abort the whole fetch.
set -uo pipefail

BASE="${1:-https://app.jilio.xyz}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
WEBROOT="$HERE/android/app/src/main/assets/webassets"
DEST="$WEBROOT/assets"
rm -rf "$WEBROOT"; mkdir -p "$DEST"

work="$(mktemp -d)"
curl -sL --max-time 30 "$BASE/login" -o "$work/login.html"
MANIFEST=$(grep -oE '/assets/manifest-[A-Za-z0-9_-]+\.js' "$work/login.html" | head -1)
[ -n "$MANIFEST" ] && curl -sf --max-time 30 "$BASE$MANIFEST" -o "$work/manifest.js" || true

# Every /assets reference across the login HTML + the route manifest.
grep -ohE '/assets/[A-Za-z0-9_./-]+\.(js|css|woff2?|ttf|otf|png|svg|jpg|jpeg|webp|gif)' \
  "$work/login.html" "$work/manifest.js" 2>/dev/null | sort -u > "$work/list.txt"
echo "Assets to fetch: $(wc -l < "$work/list.txt")"

# Download in parallel: full URLs -> curl -O saves each under its basename.
sed "s#^#$BASE#" "$work/list.txt" > "$work/urls.txt"
( cd "$DEST" && xargs -P 16 -n 1 curl -sfOL --max-time 60 < "$work/urls.txt" ) || true
echo "Downloaded $(ls "$DEST" | wc -l) / $(wc -l < "$work/list.txt")"

# Follow url(...) references inside the CSS (fonts/images), one extra pass.
for css in "$DEST"/*.css; do
  [ -f "$css" ] || continue
  grep -ohE 'url\(/assets/[A-Za-z0-9_./-]+\)' "$css" | sed -E 's/url\((\/assets\/[^)]+)\)/\1/'
done | sort -u | while read -r a; do
  [ -n "$a" ] && [ ! -f "$DEST/$(basename "$a")" ] && curl -sf --max-time 40 -o "$DEST/$(basename "$a")" "$BASE$a" || true
done

# --- Comprehensive static-file bundling: miss nothing --------------------------
# Source of truth #1: EVERY file in apps/erp/public is served at the site root.
# Download all of them from prod (guaranteed complete list, not scraped).
REPO_PUBLIC="$HERE/../apps/erp/public"
staticList="$work/statics.txt"; : > "$staticList"
if [ -d "$REPO_PUBLIC" ]; then
  ( cd "$REPO_PUBLIC" && find . -type f ! -path '*/.*' | sed 's#^\./#/#' ) >> "$staticList"
fi
# Source #2: the login HTML's root references (favicon/logo/manifest links).
grep -ohE '(src|href|content)="/[^"]+\.[A-Za-z0-9]+"' "$work/login.html" 2>/dev/null \
  | sed -E 's/.*"(\/[^"]+)"/\1/' | grep -vE '^/assets/' >> "$staticList" || true
# Source #3: any same-origin static path referenced INSIDE the downloaded JS/CSS
# (fonts, images, workers, etc. under /fonts, /images, /… — belt and suspenders).
grep -rhoE '"/[A-Za-z0-9_./-]+\.(woff2?|ttf|otf|eot|png|svg|jpe?g|webp|gif|ico|json|txt|webmanifest|wasm|mp3|wav)"' "$DEST" 2>/dev/null \
  | tr -d '"' | grep -vE '^/assets/' >> "$staticList" || true
# Always include the standard PWA/icon set.
printf '%s\n' /favicon.ico /favicon.svg /site.webmanifest /manifest.json \
  /apple-touch-icon.png /android-chrome-192x192.png /android-chrome-512x512.png \
  /robots.txt >> "$staticList"

sort -u "$staticList" | while read -r s; do
  [ -z "$s" ] && continue
  [ -f "$WEBROOT$s" ] && continue
  mkdir -p "$WEBROOT$(dirname "$s")"
  curl -sf --max-time 60 -o "$WEBROOT$s" "$BASE$s" || rm -f "$WEBROOT$s"
done

rm -rf "$work"
echo "Bundled $(find "$WEBROOT" -type f | wc -l) files total, $(du -sh "$WEBROOT" | cut -f1)"
echo "Root static files:"; find "$WEBROOT" -maxdepth 1 -type f -exec basename {} \; | sort | tr '\n' ' '; echo
