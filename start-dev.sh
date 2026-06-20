#!/bin/bash

# Load .env files into environment before starting node
set -a  # automatically export all variables
[ -f .env ] && source .env
[ -f .env.development ] && source .env.development
[ -f .env.local ] && source .env.local
set +a

# Ensure critical vars are set
export NODE_ENV="${NODE_ENV:-development}"
export VERCEL_ENV="${VERCEL_ENV:-development}"

# Start the dev server
cd apps/erp
exec pnpm dev:app
