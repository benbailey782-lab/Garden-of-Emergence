#!/usr/bin/env bash
# Start a local development server for Garden of Emergence
# Usage: ./serve.sh [port]

PORT=${1:-8080}

echo "🌿 Garden of Emergence — dev server"
echo "   http://localhost:$PORT"
echo "   Press Ctrl+C to stop"
echo ""

# Try Python 3 first, fall back to Python 2
if command -v python3 &>/dev/null; then
  python3 -m http.server $PORT
elif command -v python &>/dev/null; then
  python -m SimpleHTTPServer $PORT
else
  echo "Error: Python is required to run the dev server."
  echo "Install Python or use any HTTP server (e.g. 'npx serve')"
  exit 1
fi
