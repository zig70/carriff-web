#!/usr/bin/env bash
# Upload blog content JSON files to GCS bucket.
# Usage: ./scripts/upload-content.sh
# Requires: gcloud CLI authenticated with appropriate permissions.

set -euo pipefail

BUCKET="gs://carriffdigital-content"
ARTICLES_DIR="$(dirname "$0")/content/articles"

echo "Uploading article index..."
gsutil -h "Content-Type:application/json" -h "Cache-Control:public, max-age=300" \
  cp "$ARTICLES_DIR/index.json" "$BUCKET/articles/index.json"

echo "Uploading individual articles..."
for f in "$ARTICLES_DIR"/*.json; do
  name="$(basename "$f")"
  if [ "$name" = "index.json" ]; then
    continue
  fi
  echo "  -> $name"
  gsutil -h "Content-Type:application/json" -h "Cache-Control:public, max-age=3600" \
    cp "$f" "$BUCKET/articles/$name"
done

echo "Applying CORS configuration..."
gsutil cors set "$(dirname "$0")/cors.json" "$BUCKET"

echo "Done. Making objects publicly readable..."
gsutil iam ch allUsers:objectViewer "$BUCKET"

echo "Upload complete."
