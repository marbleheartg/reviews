# Security Hardening Log

Date: 2025-10-11
Branch: audit/workflow-hardening

## Summary
- No plaintext secrets detected in tracked files or the last 30 commits by regex scan. No `.gitleaks.toml` found.
- Applied minimal workflow hardening edits:
  - Pinned reusable actions to immutable SHAs.
  - Added fork-safety guards to PR-triggered jobs to avoid exposing tokens to forks.
  - Replaced `curl | bash` with TLS+retries download to file and `set -euo pipefail`.

## Workflow edits
- `.github/workflows/dependency-review.yml`
  - Pin `actions/checkout` to `08eba0b27e820071cde6df949e0beb9ba4906955` (v4).
  - Pin `actions/dependency-review-action` to `56339e523c0409420f6c2c9a2f4292bbb3c07dd3` (v4).
- `.github/workflows/translate-keys.yml`
  - Add job-level condition: `${{ !startsWith(github.head_ref, 'translate/') && github.event.pull_request.head.repo.fork == false }}`.
  - Pin `actions/checkout` to `08eba0b27e820071cde6df949e0beb9ba4906955`.
  - Harden install step by downloading to file with `curl --fail --tlsv1.2 --location --retry 3` and `set -euo pipefail`.
- `.github/workflows/secret-audit.yml`
  - Pin `actions/checkout` to `08eba0b27e820071cde6df949e0beb9ba4906955`.
  - Harden install step as above.
- `.github/workflows/cursor-code-review.yml`
  - Add fork guard: `github.event.pull_request.head.repo.fork == false`.
  - Pin `actions/checkout` to `08eba0b27e820071cde6df949e0beb9ba4906955`.
  - Harden install step as above.
- `.github/workflows/update-docs.yml`
  - Add fork guard: `github.event.pull_request.head.repo.fork == false`.
  - Pin `actions/checkout` to `08eba0b27e820071cde6df949e0beb9ba4906955`.
  - Harden install step as above.

## Notes on permissions
- Existing `permissions:` blocks are present across workflows. Keep `contents: write` only where commits are pushed by the workflow (e.g., translate/docs/cursor flows). Otherwise prefer `contents: read`.

## Next steps
- Review these changes. If your repository enforces workflow changes via protected rulesets, ensure the responsible actors have the `workflows` permission. If any jobs require different permissions, adjust minimally per job.
- To propose merging: open a compare view `https://github.com/marbleheartg/reviews/compare/main...audit/workflow-hardening?quick_pull=1`.
