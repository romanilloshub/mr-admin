#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR/.."
ENV_NAME=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV_NAME="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --env <environment>"
      exit 1
      ;;
  esac
done

if [ -z "$ENV_NAME" ]; then
  echo "ERROR: --env flag is required (e.g. --env production)"
  echo "Usage: $0 --env <environment>"
  exit 1
fi

ENV_FILE="$ROOT_DIR/.env.$ENV_NAME"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: env file not found at $ENV_FILE"
  exit 1
fi

export $(grep -v '^#' "$ENV_FILE" | grep -v '^$' | xargs)

: "${BUNNY_API_KEY:?BUNNY_API_KEY is not set in $ENV_FILE}"
: "${BUNNY_STORAGE_ZONE:?BUNNY_STORAGE_ZONE is not set in $ENV_FILE}"
: "${BUNNY_STORAGE_REGION:=storage.bunnycdn.com}"

BUILD_DIR="$ROOT_DIR/build.$ENV_NAME"

echo "Building project for environment: $ENV_NAME..."
cd "$ROOT_DIR"
cp "$ENV_FILE" .env.local
BUILD_PATH="$BUILD_DIR" npm run build
rm -f .env.local

echo "Uploading to Bunny.net storage zone: $BUNNY_STORAGE_ZONE ($BUNNY_STORAGE_REGION)..."

get_content_type() {
  case "${1##*.}" in
    html) echo "text/html" ;;
    css)  echo "text/css" ;;
    js)   echo "application/javascript" ;;
    json) echo "application/json" ;;
    png)  echo "image/png" ;;
    jpg|jpeg) echo "image/jpeg" ;;
    svg)  echo "image/svg+xml" ;;
    ico)  echo "image/x-icon" ;;
    txt)  echo "text/plain" ;;
    woff) echo "font/woff" ;;
    woff2) echo "font/woff2" ;;
    *)    echo "application/octet-stream" ;;
  esac
}

FAILED=0

set +e
while IFS= read -r file; do
  remote_path="${file#$BUILD_DIR/}"
  remote_path="${remote_path// /%20}"
  content_type=$(get_content_type "$file")
  response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT \
    "https://$BUNNY_STORAGE_REGION/$BUNNY_STORAGE_ZONE/$remote_path" \
    -H "AccessKey: $BUNNY_API_KEY" \
    -H "Content-Type: $content_type" \
    --data-binary "@$file")

  if [[ "$response" == "201" ]]; then
    echo "  OK [$response] $remote_path"
  else
    echo "  FAIL [$response] $remote_path"
    FAILED=$((FAILED + 1))
  fi
done < <(find "$BUILD_DIR" -type f | sort)
set -e

if [ "$FAILED" -gt 0 ]; then
  echo "ERROR: $FAILED file(s) failed to upload."
  exit 1
fi

echo "Deploy complete."
