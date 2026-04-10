#!/bin/bash
set -euo pipefail

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <encrypted_string>"
    exit 1
fi

cd "$(dirname "$0")/.."

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

printf "%s\n" "$(echo "$1" | base64 -d | openssl pkeyutl -decrypt \
  -inkey "$TEMP_KEY" \
  -pkeyopt rsa_padding_mode:oaep)"
