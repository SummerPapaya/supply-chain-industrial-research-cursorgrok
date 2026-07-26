#!/usr/bin/env bash
# Shared secret-detection patterns and helpers.
# Sourced by scripts/security-scan.sh and the installed pre-commit hook so the
# two can never drift apart.

# High confidence: these formats are secrets by construction. Any match blocks,
# and no placeholder allowlist is applied - a real key on a line that happens to
# say "example" must still be reported.
SECRET_PATTERNS_STRICT='as_sk_[A-Za-z0-9]{16,}|AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,}|glpat-[A-Za-z0-9_-]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|sk-ant-[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{32,}|sk_live_[A-Za-z0-9]{16,}|rk_live_[A-Za-z0-9]{16,}|SG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}|npm_[A-Za-z0-9]{36}|dop_v1_[a-f0-9]{64}|-----BEGIN [A-Z ]*PRIVATE KEY-----|[a-z][a-z0-9+.-]*://[^/\s:@]+:[^/\s:@]+@'

# Heuristic: a credential-ish name assigned a value that looks real. Warns only,
# because config keys and source code legitimately contain these words.
SECRET_PATTERNS_HEURISTIC='(?i)\b(api[_-]?key|apikey|secret|access[_-]?token|auth[_-]?token|password|passwd|credential|bearer)\b\s*[:=]\s*["'"'"']?[A-Za-z0-9/+_.-]{12,}'

# Values that look like secrets but are placeholders or runtime lookups.
# Applied to heuristic matches only.
SECRET_ALLOWLIST='(?i)(your[_-]?|example|placeholder|changeme|dummy|sample|redacted|xxxx|<[^>]+>|\$\{|process\.env|os\.environ|getenv|secrets\.|vault:|\*\*\*)'

# Paths that must never be committed: vendored deps and prebuilt binaries.
BINARY_PATH_PATTERN='(^|/)(\.vendor|vendor|node_modules|__pycache__|site-packages|\.venv|venv)/|\.(dylib|so|dll|pyd|whl|pyc)$'

# Paths that typically carry credentials.
CREDENTIAL_PATH_PATTERN='(^|/)(\.env($|\.)|\.netrc|\.npmrc|\.pypirc|credentials\.json|service-account.*\.json|id_rsa|id_ed25519)|\.(pem|key|p12|pfx|jks)$'

# Require ripgrep with PCRE2. The previous version fell back silently and could
# report "clean" when the engine was unavailable or failing.
scan_engine_init() {
  if ! command -v rg >/dev/null 2>&1; then
    echo "[fatal] ripgrep (rg) is required and was not found." >&2
    echo "        install it with 'brew install ripgrep' - refusing to report a passing scan." >&2
    exit 3
  fi
  if ! printf 'x' | rg --pcre2 -q 'x' 2>/dev/null; then
    echo "[fatal] this ripgrep build lacks PCRE2 support - refusing to report a passing scan." >&2
    exit 3
  fi
  SCAN_ENGINE="rg $(rg --version | head -1 | awk '{print $2}')"
}

# Truncate each reported match so the scan output does not itself become a
# place where the full credential is written down.
scan_mask() {
  sed -E 's/(.{0,10})[A-Za-z0-9_./+-]{6,}$/\1…[redacted]/'
}

# scan_paths <pattern> [--allowlist]
# Scans committable files in the working tree. rg honours .gitignore, so this is
# exactly the set of files that could reach a commit.
# Returns 0 when something was found, 1 when clean, exits 3 on engine failure.
scan_paths() {
  local pattern="$1" use_allowlist="${2:-}" out status
  set +e
  out=$(rg --hidden --line-number --with-filename --pcre2 --only-matching \
          --max-columns 200 --glob '!.git/' "$pattern" . 2>&1)
  status=$?
  set -e

  if [ "$status" -gt 1 ]; then
    echo "[fatal] rg failed (exit $status): $out" >&2
    exit 3
  fi
  [ -z "$out" ] && return 1

  if [ "$use_allowlist" = "--allowlist" ]; then
    set +e
    out=$(printf '%s\n' "$out" | rg --pcre2 --invert-match "$SECRET_ALLOWLIST")
    set -e
    [ -z "$out" ] && return 1
  fi

  printf '%s\n' "$out" | scan_mask
  return 0
}

# scan_stream <pattern> [--allowlist]
# Same contract as scan_paths but reads text (e.g. a staged diff) on stdin.
scan_stream() {
  local pattern="$1" use_allowlist="${2:-}" input out status
  input=$(cat)
  [ -z "$input" ] && return 1

  set +e
  out=$(printf '%s\n' "$input" \
        | rg --line-number --pcre2 --only-matching --max-columns 200 "$pattern" 2>&1)
  status=$?
  set -e

  if [ "$status" -gt 1 ]; then
    echo "[fatal] rg failed on stream (exit $status): $out" >&2
    exit 3
  fi
  [ -z "$out" ] && return 1

  if [ "$use_allowlist" = "--allowlist" ]; then
    set +e
    out=$(printf '%s\n' "$out" | rg --pcre2 --invert-match "$SECRET_ALLOWLIST")
    set -e
    [ -z "$out" ] && return 1
  fi

  printf '%s\n' "$out" | scan_mask
  return 0
}

# scan_file_list <pattern>
# Filters a newline-separated file list on stdin. Deliberately avoids xargs,
# which is not portable here and previously failed silently.
scan_file_list() {
  local pattern="$1" out status
  set +e
  out=$(rg -N --pcre2 "$pattern" 2>&1)
  status=$?
  set -e
  if [ "$status" -gt 1 ]; then
    echo "[fatal] rg failed on file list (exit $status): $out" >&2
    exit 3
  fi
  [ -z "$out" ] && return 1
  printf '%s\n' "$out" | sed 's/^/  /'
  return 0
}
