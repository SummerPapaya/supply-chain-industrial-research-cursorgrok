#!/usr/bin/env bash
# Installs the pre-commit secret guard. Run once per clone:
#   ./scripts/install-hooks.sh
set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
HOOK="$REPO_ROOT/.git/hooks/pre-commit"

# The hook is a thin shim that execs the tracked script, so the guard is always
# whatever is committed rather than a stale copy taken at install time.
cat > "$HOOK" <<'SHIM'
#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT=$(git rev-parse --show-toplevel)
GUARD="$REPO_ROOT/scripts/pre-commit-secret-scan.sh"
if [ ! -x "$GUARD" ]; then
  echo "[pre-commit] fatal: $GUARD missing or not executable." >&2
  echo "             refusing to allow an unscanned commit." >&2
  exit 1
fi
exec "$GUARD"
SHIM

chmod +x "$HOOK"
echo "Installed pre-commit guard -> $HOOK"
echo
echo "Verifying the scanner can still detect a planted credential:"
"$REPO_ROOT/scripts/security-scan.sh" --self-test
