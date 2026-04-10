#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <input.csv> [output.csv]" >&2
    exit 1
fi

IN="$1"
if [ ! -f "$IN" ]; then
    echo "Error: input file not found: $IN" >&2
    exit 1
fi

OUT="${2:-${IN%.csv}-decrypted.csv}"
mkdir -p "$(dirname "$OUT")"

if [ ! -f .env ]; then
    echo "Error: .env file not found in project root" >&2
    exit 1
fi

KEY_B64=$(grep '^BASE64_ENCODED_DECRYPT_KEY=' .env | cut -d'"' -f2)
if [ -z "$KEY_B64" ]; then
    echo "Error: BASE64_ENCODED_DECRYPT_KEY not set in .env" >&2
    exit 1
fi

TEMP_KEY=$(mktemp)
trap 'rm -f "$TEMP_KEY"' EXIT
echo "$KEY_B64" | base64 -d > "$TEMP_KEY"

python3 - "$IN" "$OUT" "$TEMP_KEY" <<'PY'
import csv, sys, base64, subprocess

in_path, out_path, key_path = sys.argv[1:4]

def decrypt(b64):
    if not b64:
        return b64
    raw = base64.b64decode(b64)
    result = subprocess.run(
        ["openssl", "pkeyutl", "-decrypt", "-inkey", key_path,
         "-pkeyopt", "rsa_padding_mode:oaep"],
        input=raw, capture_output=True, check=True,
    )
    return result.stdout.decode("utf-8")

with open(in_path, newline="") as fin, open(out_path, "w", newline="") as fout:
    reader = csv.reader(fin)
    writer = csv.writer(fout)
    header = next(reader)
    enc_idx = header.index("identificationDocumentEncrypted")
    header[enc_idx] = "identificationDocument"
    writer.writerow(header)
    count = 0
    for row in reader:
        row[enc_idx] = decrypt(row[enc_idx])
        writer.writerow(row)
        count += 1

print(f"Decrypted {count} rows into {out_path}")
PY
