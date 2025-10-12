# Security Hardening Log

Date: 2025-10-12
Branch: audit/gha-hardening

Summary of changes
- Proposed: Pin GitHub Actions to immutable commit SHAs for supply-chain safety.
- Proposed: Tighten workflow steps for forked PRs to avoid writing from forks.
- Proposed: Normalize installer invocations with safer curl flags.

Details (proposed edits for maintainers)
- .github/workflows/dependency-review.yml
  - Pin actions/checkout to 08eba0b27e820071cde6df949e0beb9ba4906955
  - Pin actions/dependency-review-action to 45529485b5eb76184ced07362d2331fd9d26f03f
- .github/workflows/translate-keys.yml
  - Pin actions/checkout
  - Add fork guard on steps that write (git config, cursor-agent)
  - Harden curl flags and quoting
- .github/workflows/update-docs.yml
  - Pin actions/checkout
  - Add fork guard on steps that write (git config, cursor-agent)
  - Harden curl flags and quoting
- .github/workflows/cursor-code-review.yml
  - Pin actions/checkout
- .github/workflows/secret-audit.yml
  - Pin actions/checkout
  - Harden curl flags and quoting

Notes
- No secrets found in tracked files or in recent 90-day history by regex scan. Consider enabling gitleaks in CI for broader coverage.
- Some jobs request write on pull-requests; if not strictly needed, reduce to minimal scopes.
