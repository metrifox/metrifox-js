#!/usr/bin/env bash
# Auto-discovers every package-lock.json in the repo and audits each. Shipped
# paths block the PR; test/demo/example/blind-spot paths are report-only. Writes
# a findings table (parsed from `npm audit --json`) to the PR check's Summary.
# npm audit reads the lockfile only — no install/lifecycle scripts run.
#
# Kept in a script file (not inline) so the Actions log stays clean — the
# workflow step only echoes "bash .github/scripts/npm-audit.sh".
set -uo pipefail

shipped_failed=0
printf '## 🔒 npm audit (high/critical)\n\n' >> "$GITHUB_STEP_SUMMARY"
while IFS= read -r lock; do
  dir=$(dirname "$lock")
  # Classify the directory: test/demo/example/blind-spot => report-only.
  case "$dir" in
    *demo*|*example*|*e2e*|*fixture*|*sample*|*test*|*spec*) mode=report-only ;;
    *) mode=blocking ;;
  esac
  json=$(cd "$dir" && npm audit --json 2>/dev/null || true)
  count=$(printf '%s' "$json" | jq '[.vulnerabilities[]? | select(.severity=="high" or .severity=="critical")] | length' 2>/dev/null || echo 0)
  if [ "${count:-0}" -eq 0 ]; then
    printf -- '- ✅ `%s` — no high/critical advisories\n' "$dir" >> "$GITHUB_STEP_SUMMARY"
    continue
  fi
  if [ "$mode" = blocking ]; then badge='🔴 blocking'; shipped_failed=1; else badge='🟡 report-only'; fi
  {
    printf '\n### `%s` — %s\n\n' "$dir" "$badge"
    printf '| Package | Severity | Vulnerable range | What to do |\n'
    printf '|---------|----------|------------------|------------|\n'
    printf '%s' "$json" | jq -r '
      .vulnerabilities[]? | select(.severity=="high" or .severity=="critical")
      | "| \(.name) | \(.severity) | `\(.range)` | " +
        (if (.fixAvailable|type)=="object"
           then "update \(.fixAvailable.name) to \(.fixAvailable.version)" + (if .fixAvailable.isSemVerMajor then " (major)" else "" end)
         elif .fixAvailable == true then "run npm audit fix"
         else "no fix available" end) + " |"'
  } >> "$GITHUB_STEP_SUMMARY"
  if [ "$mode" = blocking ]; then
    printf '::error::high/critical npm vulnerabilities in shipped path: %s\n' "$dir"
  else
    printf '::warning::high/critical npm vulnerabilities in report-only path: %s (not blocking)\n' "$dir"
  fi
done < <(find . -name package-lock.json -not -path '*/node_modules/*' | sort)
if [ "$shipped_failed" = 1 ]; then
  printf '\n> ❌ **Fix the 🔴 blocking packages above** (apply the "What to do" column) before this PR can merge.\n' >> "$GITHUB_STEP_SUMMARY"
fi
exit $shipped_failed
