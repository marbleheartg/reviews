# Security Hardening Log

Date: 2025-10-10
Branch: audit/workflow-hardening

## Summary
- No plaintext secrets detected in tracked files or the last 30 commits by regex scan. No `.gitleaks.toml` found.
- Proposed workflow hardening edits identified (not auto-applied due to missing `workflows` permission on this GitHub App token):
  - Pin reusable actions to immutable SHAs.
  - Add fork-safety guards to PR-triggered jobs to avoid exposing tokens to forks.
  - Replace `curl | bash` with TLS+retries download to file and `set -euo pipefail`.

## Proposed workflow edits
- `.github/workflows/dependency-review.yml`
  - Pin `actions/checkout` to `08eba0b27e820071cde6df949e0beb9ba4906955` (v4.3.0).
  - Pin `actions/dependency-review-action` to `56339e523c0409420f6c2c9a2f4292bbb3c07dd3` (v4.8.0).
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

## Why changes were not auto-applied
- The push was rejected by GitHub with: "refusing to allow a GitHub App to create or update workflow ... without `workflows` permission". This runner's token lacks the `workflows` scope.

## Next steps
- To apply the above edits: either grant `workflows` permission to the GH App/token used by this workflow, or apply the listed edits manually in the referenced files.
- Compare and quick-create a PR from this branch once the edits are applied: use the compare link posted on the latest open PR, or `https://github.com/marbleheartg/reviews/compare/main...audit/workflow-hardening?quick_pull=1`.
