## Security Hardening Log

### 2025-10-17

Summary of proposed hardening from scheduled audit (workflow edits require `workflows` permission):

- Pinned GitHub Actions to immutable SHAs:
  - `actions/checkout@08eba0b27e820071cde6df949e0beb9ba4906955` (v4)
  - `actions/dependency-review-action@45529485b5eb76184ced07362d2331fd9d26f03f` (v4)
- Added fork protection guards on PR-triggered jobs that write to the repo to avoid exposing write tokens on forked pull requests: `translate-keys.yml`, `update-docs.yml`, `cursor-code-review.yml`.

Rationale:

- Pinning actions mitigates supply-chain risk from tag retargeting. SHAs sourced via `gh api` for the referenced tags.
- Guarding against forked PRs prevents repository write permissions or secrets from being used in an untrusted context.

Observations:

- No obvious plaintext secrets found in tracked files or the last 200 commits using common token patterns. Consider running a full scan with gitleaks and maintaining an allowlist via `.gitleaks.toml` if needed.

### 2025-10-18

Scope: Repository secrets exposure scan and workflow hardening.

Summary of applied changes
- Pinned `actions/checkout@v4` to commit `08c6903cd8c0fde910a37f88322edcfb5dd907a8` in all workflows.
- Pinned `actions/dependency-review-action@v4` to commit `40c09b7dc99638e5ddb0bfd91c1673effc064d8a`.
- Added fork-safety guards to PR-triggered jobs that modify the repo or may post comments.
- Tightened permissions to least-privilege (e.g., `issues: read`).

Secrets audit
- No suspected plaintext secrets found in tracked files using common patterns (AWS keys, GitHub PATs, Slack tokens, PEM private keys, generic JWT/token/password patterns).
- No `.gitleaks.toml` allowlist found. Consider adding if you maintain test tokens.
- `.env.template` lists expected keys; keep real values only in repository or environment secrets, never committed.

Recommendations
- Add `.gitleaks.toml` to document allowlisted patterns and run gitleaks in CI for continuous scanning.
- Review workflow permissions per job to the minimum needed; elevate only when a step requires it.
- Avoid `pull_request_target` unless strictly necessary with robust gating.

Operational notes
- Compare and open a PR from `audit/hardening` into `main` when ready.
