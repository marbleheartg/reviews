# Security Hardening Log

Date: 2025-09-28
Branch: `audit/workflow-hardening`

## Findings
- No hardcoded secrets detected in tracked files or last 90 days of history.
- Workflows use version tags (e.g., `@v4`) instead of immutable SHAs.
- PR-triggered jobs can run on forks and write using `${{ secrets.GITHUB_TOKEN }}`.
- Shell steps use `curl | bash` without strict flags; missing `set -euo pipefail`.

## Minimal Fixes Proposed
- Pin actions to SHAs:
  - `actions/checkout@08eba0b27e820071cde6df949e0beb9ba4906955` (v4)
  - `actions/dependency-review-action@56339e523c0409420f6c2c9a2f4292bbb3c07dd3` (v4)
- Add fork guards to PR workflows that write: `if: ${{ github.event.pull_request.head.repo.fork == false }}`
- Harden shell steps: add `set -euo pipefail` and use `curl --fail --show-error --silent --location --proto '=https' --tlsv1.2`.
- Review and reduce permissions to least-privilege; keep only required `pull-requests: write`/`issues: write`.

## Notes
- No `.gitleaks.toml` present; consider adding one if you need custom allowlists.
