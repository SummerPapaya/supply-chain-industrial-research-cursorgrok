#!/usr/bin/env bash
# Pre-commit guard: blocks commits containing credentials or vendored binaries.
# Install:  cp scripts/pre-commit-secret-scan.sh .git/hooks/pre-commit
#           chmod +x .git/hooks/pre-commit
# Bypass (deliberate, logged in your shell history):  git commit --no-verify
set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
PATTERNS="$REPO_ROOT/scripts/lib/secret-patterns.sh"

if [ ! -f "$PATTERNS" ]; then
  echo "[pre-commit] fatal: $PATTERNS is missing - refusing to allow an unscanned commit." >&2
  exit 1
fi

# shellcheck source=scripts/lib/secret-patterns.sh
. "$PATTERNS"
scan_engine_init

FAILED=0

# Text content of the staged diff. Binary files appear only as "Binary files
# differ", which is why the path check below blocks binaries outright instead of
# trying to scan inside them.
if ! git diff --cached --quiet 2>/dev/null; then
  if git diff --cached --no-color | scan_stream "$SECRET_PATTERNS_STRICT"; then
    echo "[pre-commit] BLOCKED: staged changes contain a known credential format." >&2
    FAILED=1
  fi
fi

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR)

if [ -n "$STAGED_FILES" ]; then
  if printf '%s\n' "$STAGED_FILES" | scan_file_list "$BINARY_PATH_PATTERN"; then
    echo "[pre-commit] BLOCKED: vendored dependencies or prebuilt binaries are staged." >&2
    FAILED=1
  fi

  if printf '%s\n' "$STAGED_FILES" | scan_file_list "$CREDENTIAL_PATH_PATTERN"; then
    echo "[pre-commit] BLOCKED: a credential-bearing file is staged." >&2
    FAILED=1
  fi

  while IFS= read -r f; do
    [ -f "$f" ] || continue
    kb=$(du -k "$f" | awk '{print $1}')
    if [ "${kb:-0}" -gt 5120 ]; then
      awk -v k="$kb" -v n="$f" 'BEGIN{printf "  %.1f MB  %s\n", k/1024, n}' >&2
      echo "[pre-commit] BLOCKED: file over 5 MB would enter history permanently." >&2
      FAILED=1
    fi
  done <<< "$STAGED_FILES"
fi

if [ "$FAILED" -ne 0 ]; then
  echo "[pre-commit] Commit aborted. Rotate any exposed credential before retrying." >&2
  exit 1
fi

echo "[pre-commit] secret scan passed (engine: $SCAN_ENGINE)"
