#!/bin/bash

# Antigravity Skills Installation Script for macOS & Linux

set -e

# Target directory for Antigravity skills
TARGET_DIR="$HOME/.gemini/antigravity/skills"

echo "🚀 Installing Minimalist Entrepreneur Skills for Antigravity..."

# Create target directory if it doesn't exist
if [ ! -d "$TARGET_DIR" ]; then
    echo "📂 Creating directory $TARGET_DIR..."
    mkdir -p "$TARGET_DIR"
fi

# Determine the source directory (current script location)
SOURCE_DIR="$(cd "$(dirname "$0")" && pwd)"

# Copy the skills to the target directory
echo "📦 Copying skills..."
cp -r "$SOURCE_DIR/skills/"* "$TARGET_DIR/"

echo "✅ Successfully installed 'Minimalist Entrepreneur' skills to $TARGET_DIR."
echo "💡 You can now use these skills in Antigravity."
