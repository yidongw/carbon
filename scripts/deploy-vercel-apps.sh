#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
SCOPE="alans-projects-5f50925a"

for project in carbon-erp carbon-mes carbon-academy; do
  echo "Deploying $project..."
  vercel link --yes --scope "$SCOPE" --project "$project" >/dev/null
  vercel deploy --prod --yes --archive=tgz 2>&1 | tail -5
  echo ""
done

echo "All deployments finished."
