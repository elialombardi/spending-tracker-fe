#!/bin/sh
set -e

# Generate a small JS file that exposes runtime env to the browser
# Prefer `API_URL` then `API_BASE` environment variable
API_VALUE="${API_URL:-${API_BASE:-}}"

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = {
  API_BASE: "${API_VALUE}"
};
EOF

# Exec the CMD (nginx) so container behaves like before
exec "$@"
