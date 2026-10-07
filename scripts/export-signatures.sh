#!/usr/bin/env bash
# Export the `signatures` table from Neon Postgres to a timestamped CSV.
#
# The connection string is NOT stored here. Provide it one of two ways:
#   1. Environment:  DATABASE_URL='postgresql://...' ./scripts/export-signatures.sh
#   2. A line in the gitignored .env file:  DATABASE_URL=postgresql://...
#
# Use Neon's direct (non "-pooler") host.
# Output goes to exports/ (gitignored). It contains personal data (UK GDPR).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -z "${DATABASE_URL:-}" && -f .env ]]; then
  DATABASE_URL="$(grep -E '^DATABASE_URL=' .env | head -n1 | cut -d= -f2- | sed -e "s/^['\"]//" -e "s/['\"]$//")"
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set (env var or .env)." >&2
  exit 1
fi

command -v psql >/dev/null || { echo "psql not found (brew install libpq)." >&2; exit 1; }

mkdir -p exports
OUT="exports/signatures-$(date +%Y%m%d-%H%M%S).csv"

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c \
  "\copy (SELECT id, name, email, consent, consent_at, created_at FROM signatures ORDER BY id) TO '$OUT' WITH CSV HEADER"

COUNT=$(( $(wc -l < "$OUT") - 1 ))
echo "Exported $COUNT signature(s) to $OUT"
