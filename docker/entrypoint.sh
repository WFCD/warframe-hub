#!/bin/sh
set -eu

RUNTIME_ENV_PATH="${RUNTIME_ENV_PATH:-/app/dist/client/runtime-env.js}"

# Host-specific public env (never bake into the image). Escapes for JS string literal.
js_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/'"'"'/\\'"'"'/g; s/`/\\`/g'
}

DSN_ESCAPED="$(js_escape "${NEXT_PUBLIC_DSN:-}")"

cat > "$RUNTIME_ENV_PATH" <<EOF
window.__HUB_RUNTIME_ENV__ = {
  NEXT_PUBLIC_DSN: "${DSN_ESCAPED}"
};
EOF

exec "$@"
