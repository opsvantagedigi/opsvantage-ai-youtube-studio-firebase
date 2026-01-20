#!/usr/bin/env bash
set -euo pipefail
echo "Installing Supabase CLI..."
if command -v pnpm >/dev/null 2>&1; then
  if [ "${1-}" = "--global" ]; then
    pnpm add -g supabase
  else
    pnpm add -D supabase -w
  fi
  exit 0
fi

if command -v npm >/dev/null 2>&1; then
  npm i -g supabase
  exit 0
fi

echo "Could not find pnpm or npm. Please install Supabase CLI manually: https://supabase.com/docs/reference/cli"
exit 1
