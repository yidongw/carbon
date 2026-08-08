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
set -euo pipefail

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

# Root-level static files (logos, favicons, PWA icons, web manifest) referenced
# from the app root — served at "/..." not "/assets/...", so bundle them too.
STATICS=$(grep -oE '(src|href)="/[^"]+\.(svg|png|jpg|jpeg|webp|ico|gif|woff2?|ttf|webmanifest)"' \
  "$work/login.html" 2>/dev/null | sed -E 's/.*"(\/[^"]+)"/\1/' | sort -u)
STATICS="$STATICS /favicon.ico /favicon.svg /site.webmanifest /android-chrome-192x192.png /android-chrome-512x512.png"
for s in $(echo "$STATICS" | tr ' ' '\n' | sort -u); do
  [ -z "$s" ] && continue
  mkdir -p "$WEBROOT$(dirname "$s")"
  curl -sf --max-time 40 -o "$WEBROOT$s" "$BASE$s" || true
done
# Any icons the web manifest lists.
if [ -f "$WEBROOT/site.webmanifest" ]; then
  grep -oE '"/[^"]+\.(png|svg|ico|webp)"' "$WEBROOT/site.webmanifest" | tr -d '"' | sort -u | while read -r s; do
    [ -n "$s" ] && [ ! -f "$WEBROOT$s" ] && { mkdir -p "$WEBROOT$(dirname "$s")"; curl -sf --max-time 40 -o "$WEBROOT$s" "$BASE$s" || true; }
  done
fi

rm -rf "$work"
echo "Bundled $(find "$WEBROOT" -type f | wc -l) files total, $(du -sh "$WEBROOT" | cut -f1) into $WEBROOT"
