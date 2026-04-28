---
name: Azure Workflow
description: Azure cloud architecture, cost optimization, and infrastructure-as-code guidance
metadata:
  when:
    tags:
      - azure
      - infrastructure
      - bicep
      - terraform
      - cost
      - deploy
  loaded: true
  placement: system
---

## Purpose

This skill guides the agent when helping Dansi with Azure cloud tasks. It ensures recommendations follow Azure best practices, cost-conscious decisions, and secure defaults.

## Rules

1. **Managed Identity First**: Always suggest managed identity over connection strings, SAS tokens, or service principals with secrets.
2. **Least Privilege RBAC**: When suggesting role assignments, prefer built-in roles with the narrowest scope. Mention custom roles only when built-in roles are too broad.
3. **Cost Consciousness**: Every resource recommendation must include:
   - Estimated tier/SKU
   - One-line cost justification or warning
   - A cheaper alternative if applicable (e.g., Consumption vs Premium, Spot vs Pay-as-you-go)
4. **Private by Default**: Suggest private endpoints and VNet integration for production. Public access is acceptable only for dev/test with explicit acknowledgment.
5. **IaC Preference**: Bicep for Azure-native greenfield. Terraform for multi-cloud or brownfield existing estates.
6. **Secrets Management**: Azure Key Vault with RBAC (not access policies). Never hardcode secrets in Bicep/Terraform—use parameters or AZD environment injection.
7. **Monitoring**: Always wire up Application Insights and structured logging (Pino, Serilog, or OpenTelemetry) for new services.
8. **Regions**: Default to West Europe for production near Romania. Mention paired regions for DR when relevant.

## Common Patterns

### Serverless HTTP API
- Use Azure Functions Flex Consumption for HTTP triggers (best cold-start + scale).
- Use API Management (Consumption) only when rate limiting, custom domains, or multiple backends are needed.

### Containerized Workloads
- Use Azure Container Apps for microservices and web apps.
- Use AKS only when advanced networking, custom operators, or node pools are required.

### Static Sites
- Use Azure Static Web Apps with GitHub Actions for JAMstack.
- Use Blob Storage + CDN for simple static hosting without CI/CD integration.

### Databases
- PostgreSQL Flexible Server for relational ( Burstable B1ms for dev, GP_Standard_D2s_v3 for prod).
- Cosmos DB only when global distribution or NoSQL document model is required; warn about RU costs.

## Anti-Patterns to Avoid
- Do not recommend Azure App Service Plans for new containerized work; suggest Container Apps instead.
- Do not use Classic Application Insights; use Workspace-based.
- Do not use Access Policy mode in Key Vault; use RBAC.
