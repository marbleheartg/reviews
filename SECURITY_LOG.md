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

Date: 2025-10-05

This run performed a secrets scan and workflow hardening review.

- No suspected plaintext secrets found in working tree or last 100 commits (AWS, GitHub PAT, Slack, private keys, generic tokens/passwords). No allowlist file `.gitleaks.toml` was found.
- Recommended immutable pinning (unchanged since prior run):
  - `actions/checkout@08eba0b27e820071cde6df949e0beb9ba4906955`
  - `actions/dependency-review-action@56339e523c0409420f6c2c9a2f4292bbb3c07dd3`
- Recommended fork-PR guardrails on write-capable jobs running on `pull_request`:
  - Add: `if: ${{ !github.event.pull_request.head.repo.fork }}` to jobs using secrets or writing to repo/PRs.
- Permissions: consider least privilege per job; many jobs can use `contents: read` and omit `pull-requests: write` unless posting summaries.
- Note: Workflow file edits could not be pushed by this automation due to missing `workflows` permission; recommendations are recorded here and can be applied via PR.

Quick compare to open a PR from `audit/hardening` against `main`: https://github.com/marbleheartg/reviews/compare/main...audit/hardening?expand=1
