## Security Hardening Log

Date: 2025-10-17

Summary of proposed hardening from scheduled audit (workflow edits require `workflows` permission):

- Pinned GitHub Actions to immutable SHAs:
  - `actions/checkout@08eba0b27e820071cde6df949e0beb9ba4906955` (v4)
  - `actions/dependency-review-action@45529485b5eb76184ced07362d2331fd9d26f03f` (v4)

- Added fork protection guards on PR-triggered jobs that write to the repo to avoid exposing write tokens on forked pull requests:
  - Added `if: ${{ github.event.pull_request.head.repo.fork == false }}` to jobs in `translate-keys.yml`, `update-docs.yml`, and `cursor-code-review.yml`.

Risk rationale:

- Pinning actions mitigates supply-chain risk from tag retargeting. SHAs sourced via `gh api` for the referenced tags.
- Guarding against forked PRs prevents repository write permissions or secrets from being used in an untrusted context.

Observations:

- No obvious plaintext secrets found in tracked files or the last 200 commits using common token patterns. Consider running a full scan with gitleaks and maintaining an allowlist via `.gitleaks.toml` if needed.

Recommended follow-ups (manual):

- Review workflow permissions to ensure least privilege; add explicit `permissions:` blocks where missing and reduce `write` where not required.
- Periodically re-pin actions to latest secure SHAs as upstream releases are vetted.
