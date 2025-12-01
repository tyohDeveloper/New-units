#!/bin/bash

# Generate base64 versions
for f in downloaded/*.woff2; do
  name=$(basename "$f" .woff2)
  base64 -w0 "$f" > "downloaded/${name}.b64"
done

echo "Base64 files created:"
ls -la downloaded/*.b64
