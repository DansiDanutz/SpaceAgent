---
name: Security Audit
description: Security hardening, secrets management, and compliance checks
metadata:
  when:
    tags:
      - security
      - secret
      - vault
      - auth
      - compliance
      - audit
      - hardening
  loaded: true
  placement: system
---

## Purpose

This skill guides the agent when helping Dansi with security tasks. It ensures recommendations follow least-privilege, defense-in-depth, and zero-trust principles.

## Rules

1. **Secrets Management**: Azure Key Vault with RBAC (not access policies). Rotate keys every 90 days. Never commit secrets to git.
2. **Authentication**: Prefer managed identities over service principals with secrets. Use MSAL for app auth.
3. **Authorization**: Least-privilege RBAC. Document why each role assignment is needed.
4. **Network**: Private endpoints for production. NSG rules should be explicit deny-by-default.
5. **Encryption**: Data at rest (platform-managed + CMK where required). Data in transit (TLS 1.2+).
6. **Logging**: Enable audit logs for Key Vault, Entra ID, and Azure Activity. Ship to Log Analytics.
7. **Code Security**: Scan dependencies with `npm audit`, `pip-audit`, or Dependabot. Use SAST in CI/CD.
8. **VM/Container**: No password auth. SSH keys or Azure AD auth only. CIS benchmarks for base images.

## Compliance Checklist

### Azure
- [ ] Key Vault uses RBAC and purge protection
- [ ] Storage accounts have private endpoints and SFTP disabled
- [ ] SQL has TDE enabled and auditing to Log Analytics
- [ ] App Service has HTTPS-only and min TLS 1.2
- [ ] AKS has Azure Policy add-on and network policies

### Code
- [ ] No hardcoded credentials (scan with truffleHog or GitGuardian)
- [ ] Dependencies are pinned and audited
- [ ] No SQL injection vectors (parameterized queries only)
- [ ] Input validation on all public APIs

## Anti-Patterns
- Do not use connection strings with embedded passwords.
- Do not store API keys in environment variables on shared hosts.
- Do not use self-signed certificates in production.
