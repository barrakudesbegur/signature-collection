#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

DB="data/libsql/iku.db/dbs/default/data"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUT="exports/signators-$TIMESTAMP.csv"

if [ ! -f "$DB" ]; then
    echo "Error: database not found at $DB" >&2
    exit 1
fi

mkdir -p "$(dirname "$OUT")"

sqlite3 -header -csv "$DB" \
  "SELECT
     id,
     name,
     surname,
     date(birthDate) AS birthDate,
     municipality,
     comment,
     subscribed,
     email,
     public,
     iniciative,
     identificationDocumentEncrypted,
     identificationDocumentHash,
     createdAt
   FROM Signator
   ORDER BY id;" \
  > "$OUT"

echo "Wrote $(($(wc -l < "$OUT") - 1)) rows to $OUT (ID documents remain encrypted)"
