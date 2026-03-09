#!/usr/bin/env bash
# Upload blog content JSON files to GCS bucket.
# Usage: ./scripts/upload-content.sh
# Requires: gcloud CLI authenticated with appropriate permissions.
# Uses `gcloud storage` (no Python dependency) instead of gsutil.

set -euo pipefail

BUCKET="gs://carriffdigital-content"
ARTICLES_DIR="$(dirname "$0")/content/articles"

echo "Uploading article index..."
gcloud storage cp "$ARTICLES_DIR/index.json" "$BUCKET/articles/index.json" \
  --cache-control="public, max-age=300" \
  --content-type="application/json"

echo "Uploading individual articles..."
for f in "$ARTICLES_DIR"/*.json; do
  name="$(basename "$f")"
  if [ "$name" = "index.json" ]; then
    continue
  fi
  echo "  -> $name"
  gcloud storage cp "$f" "$BUCKET/articles/$name" \
    --cache-control="public, max-age=3600" \
    --content-type="application/json"
done

echo "Applying CORS configuration..."
gcloud storage buckets update "$BUCKET" --cors-file="$(dirname "$0")/cors.json"

echo "Done. Making objects publicly readable..."
gcloud storage buckets add-iam-policy-binding "$BUCKET" \
  --member="allUsers" \
  --role="roles/storage.objectViewer"

echo "Upload complete."
