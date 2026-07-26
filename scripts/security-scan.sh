#!/usr/bin/env bash
# Pre-publication security scan: secrets, committable junk, and oversized blobs.
# Exit 0 = clean, 2 = findings that block publishing, 3 = the scan could not run.
#
# Self-test:  ./scripts/security-scan.sh --self-test
set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$REPO_ROOT"

# shellcheck source=scripts/lib/secret-patterns.sh
. "$REPO_ROOT/scripts/lib/secret-patterns.sh"
scan_engine_init

# --self-test plants known-bad content in a temp dir, confirms the scan blocks,
# then cleans up. A scanner that can only ever print "clean" is worthless.
if [ "${1:-}" = "--self-test" ]; then
  probe=".security-scan-selftest"
  trap 'rm -rf "$REPO_ROOT/$probe"' EXIT
  mkdir -p "$probe"
  # Fixtures are assembled at runtime, with the parts that make each pattern
  # match supplied as arguments, so this file contains no literal string its own
  # patterns would flag.
  printf 'key = as_sk%s\n' "_0123456789abcdef0123456789abcdef" > "$probe/planted.txt"
  printf 'remote = https://user:s3cretpw%sgit.internal.test/x.git\n' "@" >> "$probe/planted.txt"

  echo "[self-test] planted a fake credential; expecting the scan to BLOCK"
  set +e
  "$0" > /dev/null 2>&1
  rc=$?
  set -e
  rm -rf "$REPO_ROOT/$probe"
  trap - EXIT

  if [ "$rc" -eq 2 ]; then
    echo "[self-test] PASS - detection works (scan exited 2)"
    exit 0
  fi
  echo "[self-test] FAIL - planted credential was not detected (scan exited $rc)" >&2
  exit 1
fi

FINDINGS=0
WARNINGS=0

echo "=== 1. High-confidence secret formats (committable files) ==="
if scan_paths "$SECRET_PATTERNS_STRICT"; then
  echo "  ^ BLOCKING: known credential format found."
  FINDINGS=$((FINDINGS + 1))
else
  echo "  clean"
fi

echo
echo "=== 2. Heuristic credential assignments (review manually) ==="
if scan_paths "$SECRET_PATTERNS_HEURISTIC" --allowlist; then
  echo "  ^ WARNING: verify these are not real values."
  WARNINGS=$((WARNINGS + 1))
else
  echo "  clean"
fi

echo
echo "=== 3. Credential-bearing files that .gitignore would not stop ==="
if git ls-files --cached --others --exclude-standard | scan_file_list "$CREDENTIAL_PATH_PATTERN"; then
  echo "  ^ BLOCKING: credential-bearing file is committable."
  FINDINGS=$((FINDINGS + 1))
else
  echo "  clean"
fi

echo
echo "=== 4. Unreviewable binaries and vendored dependencies ==="
if git ls-files --cached --others --exclude-standard | scan_file_list "$BINARY_PATH_PATTERN"; then
  echo "  ^ BLOCKING: prebuilt binaries and vendored deps must not be committed."
  FINDINGS=$((FINDINGS + 1))
else
  echo "  clean"
fi

echo
echo "=== 5. Files larger than 2 MB ==="
LARGE=""
while IFS= read -r f; do
  [ -f "$f" ] || continue
  kb=$(du -k "$f" | awk '{print $1}')
  if [ "${kb:-0}" -gt 2048 ]; then
    LARGE="$LARGE$(awk -v k="$kb" -v n="$f" 'BEGIN{printf "  %.1f MB  %s", k/1024, n}')"$'\n'
  fi
done < <(git ls-files --cached --others --exclude-standard)
if [ -n "$LARGE" ]; then
  printf '%s' "$LARGE"
  echo "  ^ WARNING: large files stay in git history permanently."
  WARNINGS=$((WARNINGS + 1))
else
  echo "  clean"
fi

echo
echo "=== 6. Git remotes ==="
REMOTES=$(git remote -v || true)
if [ -z "$REMOTES" ]; then
  echo "  none configured"
elif printf '%s\n' "$REMOTES" | rg -N --pcre2 '://[^/@]*:[^/@]*@'; then
  echo "  ^ BLOCKING: remote URL embeds credentials."
  FINDINGS=$((FINDINGS + 1))
else
  printf '%s\n' "$REMOTES" | sed 's/^/  /'
  echo "  no embedded credentials"
fi

echo
echo "=== 7. Staged changes ==="
if git diff --cached --quiet 2>/dev/null; then
  echo "  nothing staged - this check is a no-op until you run 'git add'"
elif git diff --cached --no-color | scan_stream "$SECRET_PATTERNS_STRICT"; then
  echo "  ^ BLOCKING: secret in staged changes."
  FINDINGS=$((FINDINGS + 1))
else
  echo "  clean"
fi

echo
echo "──────────────────────────────────────────"
if [ "$FINDINGS" -gt 0 ]; then
  echo "FAILED: $FINDINGS blocking finding(s), $WARNINGS warning(s)."
  echo "Rotate any exposed credential - deleting it from a file does not remove"
  echo "it from git history or from anywhere it has already been sent."
  exit 2
fi
echo "PASSED with $WARNINGS warning(s). Engine: $SCAN_ENGINE"
