#!/bin/bash
set -euo pipefail

API_URL="http://localhost:5000/api/v3/prune"
PRUNE_OLDER_THAN="${PRUNE_OLDER_THAN:-172800}"

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"max-age\": $PRUNE_OLDER_THAN}")

http_code=$(echo "$response" | tail -1)
body=$(echo "$response" | head -n -1)

echo "prune: HTTP $http_code — $body"

if [ "$http_code" != "200" ]; then
  exit 1
fi
