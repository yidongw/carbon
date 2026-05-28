#!/usr/bin/env bash
# Sync env vars from .env.dev to Vercel projects (erp, mes, academy).
# All variables are added with --no-sensitive so values stay readable in the dashboard.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="${ENV_FILE:-.env.dev}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE at repo root"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source "$ENV_FILE"
set +a

SCOPE="alans-projects-5f50925a"
VERCEL_ENV="${VERCEL_ENV:-production}"

declare -A PROJECT_URLS=(
  ["carbon-erp"]="https://carbon-erp.vercel.app"
  ["carbon-mes"]="https://carbon-mes.vercel.app"
  ["carbon-academy"]="https://carbon-academy-orpin.vercel.app"
)

declare -A PROJECT_ONLY=(
  ["carbon-erp:NODE_OPTIONS"]="--max-old-space-size=6144"
)

SKIP_KEYS=(
  NODE_ENV
  GOTRUE_SMTP_HOST
  GOTRUE_SMTP_PORT
  GOTRUE_SMTP_USER
  GOTRUE_SMTP_PASS
  GOTRUE_SMTP_ADMIN_EMAIL
)

should_skip() {
  local key="$1"
  for skip in "${SKIP_KEYS[@]}"; do
    [[ "$key" == "$skip" ]] && return 0
  done
  return 1
}

ENV_KEYS=()
while IFS= read -r key; do
  ENV_KEYS+=("$key")
done < <(
  grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$ENV_FILE" \
    | sed 's/=.*//' \
    | awk '!seen[$0]++'
)

add_env() {
  local cwd="$1"
  local key="$2"
  local value="$3"
  if vercel --cwd "$cwd" env ls "$VERCEL_ENV" 2>/dev/null | grep -q "^ ${key} "; then
    vercel --cwd "$cwd" env rm "$key" "$VERCEL_ENV" --yes >/dev/null 2>&1 || true
  fi
  printf '%s' "$value" | vercel --cwd "$cwd" env add "$key" "$VERCEL_ENV" --no-sensitive --yes >/dev/null
  echo "  + $key"
}

for project in "${!PROJECT_URLS[@]}"; do
  echo "=== $project ($VERCEL_ENV) ==="
  workdir="$(mktemp -d)"
  vercel --cwd "$workdir" link --yes --scope "$SCOPE" --project "$project" >/dev/null

  for key in "${ENV_KEYS[@]}"; do
    if should_skip "$key"; then
      continue
    fi
    value="${!key:-}"
    if [[ -z "$value" ]]; then
      echo "  skip $key (empty)"
      continue
    fi
    add_env "$workdir" "$key" "$value"
  done

  add_env "$workdir" "VERCEL_URL" "${PROJECT_URLS[$project]}"

  project_node_options="${PROJECT_ONLY[${project}:NODE_OPTIONS]:-}"
  if [[ -n "$project_node_options" ]]; then
    add_env "$workdir" "NODE_OPTIONS" "$project_node_options"
  fi

  rm -rf "$workdir"
done

echo "Done."
