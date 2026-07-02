#!/usr/bin/env bash
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ERP_DIR="$REPO/apps/erp"
ENV="$REPO/.env"
ENV_LOCAL="/Users/xinjuan/git/carbon/.env.local"

# Kill any existing ERP and tunnel
pkill -f "react-router dev" 2>/dev/null || true
pkill -f "cloudflared tunnel" 2>/dev/null || true
sleep 2

# Start ERP
cd "$ERP_DIR"
npm run dev:app > /tmp/erp.log 2>&1 &
echo "Waiting for ERP..."
for i in $(seq 1 30); do sleep 1; grep -q "Local:" /tmp/erp.log 2>/dev/null && break; done
echo "ERP ready on :3000"

# Start tunnel
cloudflared tunnel --url "http://127.0.0.1:3000" --no-autoupdate > /tmp/cf-erp.log 2>&1 &
echo "Waiting for tunnel..."
for i in $(seq 1 30); do
  URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cf-erp.log | head -1)
  [ -n "$URL" ] && break; sleep 1
done

CB="$URL/auth/wechat-callback"
sed -i '' "s|WECHAT_REDIRECT_URL=.*|WECHAT_REDIRECT_URL=\"$CB\"|" "$ENV"
sed -i '' "s|GTM_URL=.*|GTM_URL=$URL|"   "$ENV_LOCAL"
sed -i '' "s|ERP_URL=.*|ERP_URL=$URL|"   "$ENV_LOCAL"

# Restart GoTrue with correct env
docker compose -f "/Users/xinjuan/git/carbon/docker-compose.dev.yml" \
  -p carbon-carbon --env-file "$ENV_LOCAL" up -d --no-deps gotrue 2>&1 | tail -2

# Restart ERP to pick up new WECHAT_REDIRECT_URL
kill $(lsof -ti :3000) 2>/dev/null; sleep 2
cd "$ERP_DIR" && npm run dev:app > /tmp/erp.log 2>&1 &
for i in $(seq 1 30); do sleep 1; grep -q "Local:" /tmp/erp.log 2>/dev/null && break; done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Login URL : $URL/login"
echo "  Callback  : $CB"
echo ""
echo "  WeChat sandbox domain to set:"
echo "  $(echo $URL | sed 's|https://||')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
