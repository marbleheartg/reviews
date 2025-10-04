# Security Audit Log

Date: 2025-10-04
Branch: audit

Summary
- Proposed workflow hardening: pin actions to SHAs and add fork PR guards where secrets or write permissions are used.
- No plaintext secrets were detected in tracked files or simple regex pass of recent content.

Proposed changes (not applied due to workflow permission restrictions on this runner)
- `.github/workflows/update-docs.yml`
  - Pin `actions/checkout` to commit SHA.
  - Add fork protection: `github.event.pull_request.head.repo.fork == false`.
- `.github/workflows/translate-keys.yml`
  - Pin `actions/checkout` to commit SHA.
  - Add fork protection.
- `.github/workflows/dependency-review.yml`
  - Pin `actions/checkout` and `actions/dependency-review-action` to SHAs.
- `.github/workflows/cursor-code-review.yml`
  - Enforce fork guard to avoid secrets exposure.
  - Pin `actions/checkout` to SHA.
- `.github/workflows/secret-audit.yml`
  - Pin `actions/checkout` to SHA.

Guidance
- Apply the above minimal edits in a PR from `audit` to `main` when workflows permission allows.
- Consider adding a `.gitleaks.toml` allowlist if false positives arise.
- Scope `permissions` per job to least privilege.
