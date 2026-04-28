# Tech Stack Memory

## Current Active Stack
- **Cloud**: Azure (primary), evaluating AWS/GCP for specific workloads
- **Compute**: Azure Functions (Flex Consumption), Container Apps, AKS for larger workloads
- **AI/LLM**: z.ai GLM-5.1 (Space Agent), Anthropic Claude (Claude Code), Kimi (Kimi CLI)
- **Frontend**: HTML5, Tailwind CSS, React/Next.js when needed, shadcn/ui components
- **Backend**: Node.js, Python (FastAPI / Azure Functions)
- **Data**: Azure Cosmos DB, PostgreSQL (Azure Flexible Server), Redis (Azure Cache)
- **Messaging**: Azure Service Bus, Event Hubs
- **Storage**: Azure Blob Storage, Azure Files
- **IaC**: Bicep (preferred for Azure), Terraform (for multi-cloud or existing estates)
- **CI/CD**: GitHub Actions, Azure DevOps pipelines
- **Monitoring**: Azure Application Insights, Log Analytics, Kusto (KQL)
- **Containers**: Docker, ACR, GitHub Container Registry
- **Auth**: Microsoft Entra ID, OAuth 2.0, MSAL

## Local Environment
- OS: Windows 11
- Shell: PowerShell
- Editor: VS Code with multiple AI extensions
- Node.js: v20+ (check with `node -v`)
- Python: 3.11+ (managed via uv or pyenv)
- Package Managers: npm, pip, uv

## Preferences Per Technology
- Azure: Use managed identity, private endpoints, and Azure RBAC with least privilege.
- Docker: Multi-stage builds, distroless or slim base images.
- JavaScript: Prefer ES modules, async/await, and strict mode.
- Python: Type hints with `typing`, `pydantic` for models, `pytest` for testing.
