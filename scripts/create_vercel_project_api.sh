#!/usr/bin/env bash
set -euo pipefail
# Creates a new Vercel project via Vercel API. Run from apps/web
# Requirements: VERCEL_TOKEN (team-scoped token), VERCEL_TEAM (team id slug), GITHUB integration for the team

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "ERROR: VERCEL_TOKEN must be set"
  exit 1
fi
if [ -z "${VERCEL_TEAM:-}" ]; then
  echo "ERROR: VERCEL_TEAM must be set to the Vercel team id (opsvantagedigi-6056)"
  exit 1
fi

PROJECT_NAME="ai-youtube-studio"
GIT_REPO="opsvantagedigi/AI-YouTube-Studio"
ROOT_DIR="apps/web"
BUILD_CMD="next build"
OUT_DIR=".next"

echo "Creating Vercel project for repo ${GIT_REPO} under team ${VERCEL_TEAM}..."

read -r -d '' PAYLOAD <<EOF || true
{
  "name": "${PROJECT_NAME}",
  "gitRepository": {
    "type": "github",
    "repo": "${GIT_REPO}"
  },
  "rootDirectory": "${ROOT_DIR}",
  "buildCommand": "${BUILD_CMD}",
  "outputDirectory": "${OUT_DIR}",
  "framework": "nextjs",
  "teamId": "${VERCEL_TEAM}"
}
EOF

res=$(curl -s -X POST "https://api.vercel.com/v9/projects" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

echo "$res" | jq .

projectId=$(echo "$res" | jq -r '.id // .uid // empty')
if [ -z "$projectId" ]; then
  echo "Project creation may have failed. Inspect output above."
  exit 1
fi

echo "Created project id: $projectId"
echo "Next: connect the GitHub repo to the project in the Vercel dashboard if not auto-linked."
echo "You can now run the import script to add env vars: set NEW_VERCEL_PROJECT_ID=$projectId and run import_vercel_env.js"
