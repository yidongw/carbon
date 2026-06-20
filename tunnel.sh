#!/usr/bin/env bash
# tunnel.sh — Start Cloudflare Quick Tunnels for all crbn up services.
#
# Usage:  ./tunnel.sh   (or: pnpm tunnel)
#
# Tunnels every service port found in .env.local, points the browser-facing
# Supabase URL at the API tunnel (so realtime works remotely), updates GTM_URL
# so GoTrue allows the ERP tunnel as an auth redirect, then restarts GoTrue.

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_LOCAL="$REPO/.env.local"
DOCKER="${DOCKER:-docker}"

die()  { echo "❌  $*" >&2; exit 1; }

require() {
  command -v "$1" &>/dev/null || die "'$1' not found. Install it first."
}

env_get() {
  grep -E "^${1}=" "$ENV_LOCAL" 2>/dev/null | tail -1 | cut -d= -f2- | tr -d '"'
}

env_set() {
  local key=$1 val=$2
  if grep -q "^${key}=" "$ENV_LOCAL" 2>/dev/null; then
    sed -i '' "s|^${key}=.*|${key}=${val}|" "$ENV_LOCAL"
  else
    echo "${key}=${val}" >> "$ENV_LOCAL"
  fi
}

# Start a cloudflared quick tunnel for a local port.
# Echoes the trycloudflare.com URL once it's ready.
start_tunnel() {
  local port=$1
  local logfile
  logfile=$(mktemp /tmp/cf-tunnel-XXXXXX)

  # Replace only the tunnel for THIS port — never touch other worktrees' tunnels.
  pkill -f "cloudflared tunnel --url http://127.0.0.1:${port} " 2>/dev/null || true

  cloudflared tunnel --url "http://127.0.0.1:${port}" --no-autoupdate \
    >"$logfile" 2>&1 &

  local url="" elapsed=0
  while [ -z "$url" ]; do
    sleep 1
    elapsed=$((elapsed + 1))
    url=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$logfile" | head -1)
    if [ $elapsed -ge 30 ]; then
      echo "--- cloudflared output (port $port) ---" >&2
      cat "$logfile" >&2
      die "Timed out waiting for tunnel on port $port"
    fi
  done

  echo "$url"
}

# ── main ───────────────────────────────────────────────────────────────────

require cloudflared
[ -f "$ENV_LOCAL" ] || die ".env.local not found — run 'crbn up' first."

# Services to tunnel: label, PORT_* key, skip if port is absent.
# Supabase (Kong on PORT_API) must be tunnelled too: the browser builds its
# Supabase client — including the realtime websocket — from a public URL, and
# can't reach localhost through the tunnel.
declare -a SERVICES=(
  "ERP        PORT_ERP"
  "MES        PORT_MES"
  "Supabase   PORT_API"
  "Studio     PORT_STUDIO"
  "Inbucket   PORT_INBUCKET"
  "Inngest    PORT_INNGEST"
)

# Per-port replacement happens inside start_tunnel; we never blanket-kill other
# worktrees' tunnels. Track the ports we manage so we can wait on just those.
declare -a MY_PORTS=()

for entry in "${SERVICES[@]}"; do
  label=$(echo "$entry" | awk '{print $1}')
  key=$(echo "$entry"   | awk '{print $2}')
  port=$(env_get "$key")

  if [ -z "$port" ]; then
    echo "  $label  — skipped ($key not set)"
    continue
  fi

  MY_PORTS+=("$port")
  printf "  %-10s port %-5s  →  starting…" "$label" "$port"
  url=$(start_tunnel "$port")
  printf -v "URL_${label}" '%s' "$url"
  printf "\r  %-10s port %-5s  →  %s\n" "$label" "$port" "$url"
done

echo ""

# Point the browser-facing Supabase URL at the API tunnel so the client (and
# its realtime websocket) connects to a reachable origin. Server-side code keeps
# using SUPABASE_URL=localhost, so only the browser is routed through the tunnel.
API_URL="${URL_Supabase:-}"
if [ -n "$API_URL" ]; then
  env_set "SUPABASE_URL_PUBLIC" "$API_URL"
  echo "Updated .env.local → SUPABASE_URL_PUBLIC=$API_URL"
  echo ""
fi

# Update GTM_URL so GoTrue allows the ERP tunnel as an auth redirect
ERP_URL="${URL_ERP:-}"
if [ -n "$ERP_URL" ]; then
  env_set "GTM_URL" "$ERP_URL"
  echo "Updated .env.local → GTM_URL=$ERP_URL"
  echo ""

  if command -v "$DOCKER" &>/dev/null; then
    # Restart THIS worktree's GoTrue (derived project, not a hardcoded stack),
    # and pass --env-file so ${SUPABASE_JWT_SECRET} etc. aren't blanked — an
    # empty JWT secret crash-loops GoTrue and 503s all auth.
    project="carbon-$(env_get CARBON_WORKTREE)"
    echo "Restarting GoTrue ($project) to apply new allow list…"
    "$DOCKER" compose \
      -f "$REPO/docker-compose.dev.yml" \
      -p "$project" \
      --env-file "$ENV_LOCAL" \
      up -d --no-deps gotrue 2>/dev/null
    echo "GoTrue restarted."
    echo ""
  fi
fi

# The ERP/MES dev servers snapshot env at startup, so a server already running
# from `crbn up` won't see the SUPABASE_URL_PUBLIC we just wrote. Touch each vite
# config to trigger a Vite restart — on restart the config re-reads .env.local
# (apps/*/vite.config.ts: applyDotenvToProcessEnv) and the browser-side Supabase
# client picks up the tunnel URL. Harmless if no dev server is running.
if [ -n "$API_URL" ]; then
  echo "Restarting app dev servers to apply tunnel env…"
  for cfg in "$REPO/apps/erp/vite.config.ts" "$REPO/apps/mes/vite.config.ts"; do
    [ -f "$cfg" ] && touch "$cfg"
  done
  echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for label in ERP MES Supabase Studio Inbucket Inngest; do
  varname="URL_${label}"
  url="${!varname:-}"
  [ -n "$url" ] && printf "  %-10s  %s\n" "$label" "$url"
done
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
trap 'echo ""; echo "Tunnels still running. Re-run to restart with new URLs."; exit 0' INT TERM

echo "Press Ctrl+C to stop all tunnels."

# Wait only on the tunnels this worktree started, not every worktree's.
while :; do
  alive=0
  for p in "${MY_PORTS[@]}"; do
    pgrep -f "cloudflared tunnel --url http://127.0.0.1:${p} " >/dev/null 2>&1 && alive=1
  done
  [ "$alive" = "1" ] || break
  sleep 2
done
