#!/usr/bin/env bash

set -euo pipefail

HOST="127.0.0.1"
PORT="8001"
LOG_FILE="/tmp/n3bula_api_local_smoke_8001.log"
UVICORN_PID=""
SMOKE_DB_FILE=""

section() {
  printf '\n=== %s ===\n' "$1"
}

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)"
EXPECTED_ROOT="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd -P)"

if ! GIT_ROOT="$(git -C "$EXPECTED_ROOT" rev-parse --show-toplevel 2>/dev/null)"; then
  printf 'ERROR: %s is not inside a Git repository.\n' "$EXPECTED_ROOT" >&2
  exit 1
fi

REPO_ROOT="$(CDPATH= cd -- "$GIT_ROOT" && pwd -P)"
if [ "$REPO_ROOT" != "$EXPECTED_ROOT" ]; then
  printf 'ERROR: expected repository root %s, got %s.\n' "$EXPECTED_ROOT" "$REPO_ROOT" >&2
  exit 1
fi

if [ ! -f "$REPO_ROOT/backend/app/main.py" ] || [ ! -f "$REPO_ROOT/frontend/package.json" ]; then
  printf 'ERROR: expected backend and frontend project files were not found.\n' >&2
  exit 1
fi

PYTHON="$REPO_ROOT/backend/.venv/bin/python"
BASE_URL="http://$HOST:$PORT"

cleanup() {
  exit_code=$?
  trap - EXIT
  set +e

  if [ -n "${UVICORN_PID:-}" ] && kill -0 "$UVICORN_PID" 2>/dev/null; then
    section "STOP UVICORN"
    kill "$UVICORN_PID" 2>/dev/null
    stop_attempt=0
    while kill -0 "$UVICORN_PID" 2>/dev/null && [ "$stop_attempt" -lt 20 ]; do
      sleep 0.1
      stop_attempt=$((stop_attempt + 1))
    done
    if kill -0 "$UVICORN_PID" 2>/dev/null; then
      kill -KILL "$UVICORN_PID" 2>/dev/null
    fi
    wait "$UVICORN_PID" 2>/dev/null
  fi

  if [ -n "${SMOKE_DB_FILE:-}" ] && [ -f "$SMOKE_DB_FILE" ]; then
    rm -f "$SMOKE_DB_FILE"
  fi

  section "ENDING GIT STATUS"
  git -C "$REPO_ROOT" status --short --branch --untracked-files=all
  exit "$exit_code"
}

trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

section "VERIFY REPOSITORY"
printf 'Repository: %s\n' "$REPO_ROOT"

section "STARTING GIT STATUS"
git -C "$REPO_ROOT" status --short --branch --untracked-files=all

section "VERIFY PREREQUISITES"
if [ ! -x "$PYTHON" ]; then
  printf 'ERROR: backend Python not found at %s.\n' "$PYTHON" >&2
  exit 1
fi
command -v npm >/dev/null 2>&1 || {
  printf 'ERROR: npm is not available.\n' >&2
  exit 1
}
command -v curl >/dev/null 2>&1 || {
  printf 'ERROR: curl is not available.\n' >&2
  exit 1
}
command -v mktemp >/dev/null 2>&1 || {
  printf 'ERROR: mktemp is not available.\n' >&2
  exit 1
}
SMOKE_DB_FILE="$(mktemp /tmp/n3bula_api_local_smoke_8001.XXXXXX)"
export DATABASE_URL="sqlite:///$SMOKE_DB_FILE"
export DEBUG="false"
export SECRET_KEY="$("$PYTHON" -c 'import secrets; print(secrets.token_urlsafe(48))')"
printf 'Using isolated process-local configuration (secret value not displayed).\n'
"$PYTHON" - "$HOST" "$PORT" <<'PY'
import socket
import sys

host = sys.argv[1]
port = int(sys.argv[2])

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind((host, port))
    except OSError as exc:
        raise SystemExit(f"ERROR: {host}:{port} is unavailable: {exc}") from exc
PY
printf 'Prerequisites OK; %s:%s is available.\n' "$HOST" "$PORT"

section "BACKEND TESTS"
(
  cd "$REPO_ROOT/backend"
  "$PYTHON" -m pytest -q
)

section "FRONTEND BUILD"
(
  cd "$REPO_ROOT/frontend"
  npm run build
)

section "START UVICORN"
umask 077
: > "$LOG_FILE"
(
  cd "$REPO_ROOT/backend"
  exec "$PYTHON" -m uvicorn app.main:app --host "$HOST" --port "$PORT"
) >"$LOG_FILE" 2>&1 &
UVICORN_PID=$!
printf 'PID: %s\nLog: %s\n' "$UVICORN_PID" "$LOG_FILE"

section "WAIT FOR API"
attempt=1
while [ "$attempt" -le 30 ]; do
  if ! kill -0 "$UVICORN_PID" 2>/dev/null; then
    printf 'ERROR: uvicorn exited before the API became ready. See %s.\n' "$LOG_FILE" >&2
    exit 1
  fi
  if curl --silent --fail --max-time 2 "$BASE_URL/api/health" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
  attempt=$((attempt + 1))
done

if [ "$attempt" -gt 30 ]; then
  printf 'ERROR: API did not become ready. See %s.\n' "$LOG_FILE" >&2
  exit 1
fi
printf 'API ready at %s.\n' "$BASE_URL"

check_endpoint() {
  endpoint="$1"
  curl --silent --show-error --fail --max-time 10 "$BASE_URL$endpoint" >/dev/null
  printf 'PASS %s\n' "$endpoint"
}

section "HTTP ENDPOINTS"
check_endpoint "/"
check_endpoint "/api/health"
check_endpoint "/openapi.json"

section "OPENAPI ROUTES"
"$PYTHON" - "$BASE_URL/openapi.json" <<'PY'
import json
import sys
from urllib.request import urlopen

url = sys.argv[1]
with urlopen(url, timeout=10) as response:
    document = json.load(response)

paths = document.get("paths")
if not isinstance(paths, dict) or not paths:
    raise SystemExit("ERROR: OpenAPI document contains no routes")

http_methods = {"delete", "get", "head", "options", "patch", "post", "put", "trace"}
for path in sorted(paths):
    operations = paths[path]
    methods = sorted(method.upper() for method in operations if method in http_methods)
    if methods:
        print(f"{','.join(methods)} {path}")
PY

section "SMOKE RESULT"
printf 'PASS: backend tests, frontend build, runtime endpoints, and OpenAPI validation.\n'
