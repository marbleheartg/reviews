# Security Hardening Log

Date: 2025-10-14
Branch: audit/gha-hardening

Summary of minimal, safe changes:

- Pinned reusable Actions to immutable commit SHAs for supply-chain safety:
  - actions/checkout@08eba0b27e820071cde6df949e0beb9ba4906955
  - actions/dependency-review-action@45529485b5eb76184ced07362d2331fd9d26f03f
- Added fork pull request guards to workflows that use write permissions and secrets to avoid exposure in forked PR contexts.
- Scanned tracked files and recent history for common secrets; no matches were found with the current patterns.

Recommendations and next steps:

- Prefer least-privilege `permissions:` at workflow or job scope; restrict `pull-requests`/`contents` to only what is needed. Consider read-only by default with job-level elevation when necessary.
- Avoid using `pull_request_target` unless absolutely required and audited. None detected.
- Consider adding `.gitleaks.toml` with allowlist for intentional test tokens or patterns, and running gitleaks in CI for continuous scanning.
- Review any third-party scripts fetched via curl; pin to checksummed artifacts where possible.

Audit methodology:
- Reviewed `.github/workflows/*.yml` for unpinned actions, permissions, fork contexts, and deprecated commands.
- Searched working tree and last 200 commit diffs for common high-signal secret patterns.
