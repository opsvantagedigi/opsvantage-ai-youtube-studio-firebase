#!/usr/bin/env bash
set -euo pipefail
# Usage: set VERCEL_TOKEN, VERCEL_TEAM (optional), VERCEL_PROJECT then run from apps/web
if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "ERROR: VERCEL_TOKEN must be set in environment"
  exit 1
fi
if [ -z "${VERCEL_PROJECT:-}" ]; then
  echo "ERROR: VERCEL_PROJECT must be set to the existing Vercel project name or id"
  exit 1
fi
echo "Pulling Production env -> .env.production"
vercel env pull .env.production --environment=production --yes --token "$VERCEL_TOKEN" ${VERCEL_TEAM:+--scope "$VERCEL_TEAM"} --project "$VERCEL_PROJECT"
echo "Pulling Preview env -> .env.preview"
vercel env pull .env.preview --environment=preview --yes --token "$VERCEL_TOKEN" ${VERCEL_TEAM:+--scope "$VERCEL_TEAM"} --project "$VERCEL_PROJECT"
echo "Pulling Development env -> .env.development"
vercel env pull .env.development --environment=development --yes --token "$VERCEL_TOKEN" ${VERCEL_TEAM:+--scope "$VERCEL_TEAM"} --project "$VERCEL_PROJECT"

echo "Converting .env files to vercel-env-export.json"
python - <<'PY'
import os, json
def parse(path):
    d={}
    if not os.path.exists(path):
        return d
    with open(path,'r',encoding='utf8') as f:
        for line in f:
            line=line.strip()
            if not line or line.startswith('#'): continue
            if '=' not in line: continue
            k,v=line.split('=',1)
            d[k]=v
    return d
data={
    'production': parse('.env.production'),
    'preview': parse('.env.preview'),
    'development': parse('.env.development')
}
with open('vercel-env-export.json','w',encoding='utf8') as out:
    json.dump(data,out,indent=2)
print('Wrote vercel-env-export.json')
PY

echo "Export complete: vercel-env-export.json"
