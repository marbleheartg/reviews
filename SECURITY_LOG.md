# Security Audit Log

Date: 2025-10-02

This repository was scanned for exposed secrets and hardened GitHub Actions workflows. Summary of actions and recommendations:

- No suspected plaintext secrets were found in the current tree or last 50 commits using patterns for AWS, GitHub PAT, Google API, Stripe, Slack, private keys, or generic tokens/passwords.
- Recommended immutable pinning for actions:
  - `actions/checkout@08eba0b27e820071cde6df949e0beb9ba4906955` (v4.3.0)
  - `actions/dependency-review-action@56339e523c0409420f6c2c9a2f4292bbb3c07dd3` (v4.8.0)
- Recommended fork-PR guardrails for workflows that use secrets or write permissions to avoid leaking secrets to forks:
  - Add to jobs that run on `pull_request`: `if: ${{ !github.event.pull_request.head.repo.fork }}`
  - Additionally gate secret-using steps: `if: ${{ env.CURSOR_API_KEY != '' }}` or equivalent
- Permissions are present in all workflows; keep least-privilege. For security reporting, `security-events: write` may be added when needed.

Notes:
- Workflow file changes could not be pushed from this automation due to missing `workflows` permission. The above edits are recommended and safe; please apply them via PR.

Compare changes and quick-create a PR from `audit/hardening` if desired.

---

Date: 2025-10-06

This run performed a secrets scan (tracked files and recent history) and a workflow hardening review.

- No suspected plaintext secrets found in working tree; no hits for AWS, PAT, Google, Stripe, Slack, or private keys.
- No `.gitleaks.toml` allowlist found. Consider adding one if you intentionally keep test tokens.
- Recommended immutable pinning (latest stable v4 SHAs at time of scan):
  - `actions/checkout@08eba0b27e820071cde6df949e0beb9ba4906955`
  - `actions/dependency-review-action@56339e523c0409420f6c2c9a2f4292bbb3c07dd3`
- Fork-PR guardrails: add `if: ${{ !github.event.pull_request.head.repo.fork }}` on jobs that write or use secrets in `translate-keys.yml`, `update-docs.yml`, and `cursor-code-review.yml`.
- Harden curl invocations with `-fsSL --proto '=https' --tlsv1.2`.
- Permissions: keep least-privilege; add job-level `permissions:` only where needed.

Note: Workflow edits could not be pushed by this automation due to missing `workflows` permission. The above are proposed changes; please apply via PR.

Quick compare to open a PR from `audit/hardening` against `main`: https://github.com/marbleheartg/reviews/compare/main...audit/hardening?expand=1

---

Date: 2025-10-07

This run performed a secrets scan (tracked files and recent history) and a workflow hardening review.

- No suspected plaintext secrets found; no `.gitleaks.toml` allowlist detected.
- Proposed minimal hardening (recorded here for maintainers):
  - Pin `actions/checkout` and `actions/dependency-review-action` to immutable commit SHAs.
  - Gate jobs that use secrets or write permissions on non-fork PRs.
  - Harden `curl` invocations with `-fsSL --proto '=https' --tlsv1.2`.
  - Keep `permissions:` least-privilege; prefer job-level scopes.
- Note: Workflow file edits require `workflows` permission and could not be pushed by this automation.

Quick compare to open a PR from `audit/hardening` against `main`: https://github.com/marbleheartg/reviews/compare/main...audit/hardening?expand=1
