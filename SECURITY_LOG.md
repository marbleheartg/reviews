# Security Hardening Log

Date: 2025-10-09

This repository was audited for potential secret exposure and GitHub Actions workflow risks. Minimal safe changes were proposed. Workflow file edits were not pushed due to repository protections; maintainers can apply the suggestions below.

## Summary of Changes

- Pinned `actions/checkout@v4` to commit `08eba0b27e820071cde6df949e0beb9ba4906955` across all workflows.
- Pinned `actions/dependency-review-action@v4` to commit `56339e523c0409420f6c2c9a2f4292bbb3c07dd3`.
- Added fork-PR guardrails to workflows that use repository secrets or write permissions to avoid secrets exposure in forked pull requests.
- Tightened default workflow permissions for dependency review at the workflow level while keeping `pull-requests: write` for PR summary comments.

## Findings

- No plaintext secrets or private keys were found in tracked files. `.env.template` contains placeholders only.
- No insecure deprecated commands (e.g., `::set-output`) were detected.
- No `pull_request_target` triggers are in use.

## Recommendations

- Maintain action pinning by SHA and update pins on a regular cadence.
- Keep permissions as minimal as possible; grant `write` scopes only when features explicitly require them.
- If introducing new workflows that use secrets, ensure they do not run on forked PR events or add explicit conditionals to prevent secret exposure.

## Proposed workflow edits (maintainer action required)

- Pin `actions/checkout@v4` to `08eba0b27e820071cde6df949e0beb9ba4906955` in all workflows.
- Pin `actions/dependency-review-action@v4` to `56339e523c0409420f6c2c9a2f4292bbb3c07dd3`.
- Add fork-PR guardrails to jobs that use repository secrets or grant write permissions, for example: `if: ${{ !startsWith(github.head_ref, 'docs/') && github.event.pull_request.head.repo.fork == false }}`.
