#!/bin/bash

# Error handling
set -e

# Configuration
MANIFEST_FILE="manifest.json"
RELEASE_DIR="release"

# Check if manifest exists
if [ ! -f "$MANIFEST_FILE" ]; then
    echo "Error: manifest.json not found in current directory."
    exit 1
fi

# Extract version from manifest.json
VERSION=$(grep '"version":' "$MANIFEST_FILE" | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')
ZIP_NAME="site-storage-cleaner-v${VERSION}.zip"

# Create release directory if it doesn't exist
mkdir -p "$RELEASE_DIR"

# Clean up old release file if it exists
if [ -f "$RELEASE_DIR/$ZIP_NAME" ]; then
    echo "Removing existing release file..."
    rm "$RELEASE_DIR/$ZIP_NAME"
fi

echo "📦 Packaging Site Storage Cleaner v${VERSION}..."

# Create the zip file
# Excluding development files, documentation that isn't needed for the extension itself, and system files
zip -r "$RELEASE_DIR/$ZIP_NAME" \
    manifest.json \
    background.js \
    content-script.js \
    popup.html \
    popup.css \
    popup.js \
    storage-cleaner.js \
    icons/ \
    LICENSE \
    README.md \
    -x "*.DS_Store" \
    -x "icons/*.html"

echo "---------------------------------------------------"
if [ -f "$RELEASE_DIR/$ZIP_NAME" ]; then
    echo "✅ Success! Release package created:"
    echo "   📁 Path: $(pwd)/$RELEASE_DIR/$ZIP_NAME"
    echo "   📄 Size: $(du -h "$RELEASE_DIR/$ZIP_NAME" | cut -f1)"
else
    echo "❌ Error: Failed to create zip file."
    exit 1
fi
echo "---------------------------------------------------"
