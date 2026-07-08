#!/bin/bash
set -euo pipefail

PRUNE_SCHEDULE="${PRUNE_SCHEDULE:-0 3 * * *}"

echo "$PRUNE_SCHEDULE root /usr/local/bin/prune.sh >/proc/1/fd/1 2>/proc/1/fd/2" > /etc/cron.d/polis-prune
chmod 0644 /etc/cron.d/polis-prune

echo "Starting cron daemon (prune schedule: $PRUNE_SCHEDULE)..."
cron

exec "$@"
