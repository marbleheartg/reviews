Security Hardening Log

Date: 2025-09-29

Summary
- Recommended pinning `actions/checkout@v4` to commit SHA `08eba0b27e820071cde6df949e0beb9ba4906955` across all workflows.
- Recommended pinning `actions/dependency-review-action@v4` to commit SHA `56339e523c0409420f6c2c9a2f4292bbb3c07dd3`.
- Reviewed workflows for risky patterns: no `pull_request_target`, no deprecated `::set-output`/`::add-path`, and permissions blocks present where needed.
- Ran repository secret scans (tracked files and recent history) using regex heuristics; no high-confidence secrets were detected.

Details
1) Action pinning
   - Rationale: Pinning to a full commit SHA prevents supply chain attacks via tag mutation.
   - Proposed updates (cannot auto-push workflows due to permissions):
     - `.github/workflows/dependency-review.yml`
     - `.github/workflows/translate-keys.yml`
     - `.github/workflows/secret-audit.yml`
     - `.github/workflows/cursor-code-review.yml`
     - `.github/workflows/update-docs.yml`

2) Permissions and triggers
   - Checked for overbroad permissions; current workflows specify only what they need.
   - Verified no usage of `pull_request_target` and no direct use of secrets in forked PR contexts beyond standard `GITHUB_TOKEN` and scoped secrets.

3) Secrets exposure
   - Patterns scanned: PEM private keys, AWS AKIA IDs/secret pairs, GitHub PATs, Slack tokens, Google API keys.
   - No matches in tracked files. No matches in the last 50 commits for these patterns.

Follow-up guidance
- To apply the recommendations, pin action versions to SHAs in the files above in a follow-up commit.
- Consider enabling repository protection rules and Dependabot security updates.
- If allowlist rules are needed for false positives (e.g., test data), add a `.gitleaks.toml` with ignore rules.
