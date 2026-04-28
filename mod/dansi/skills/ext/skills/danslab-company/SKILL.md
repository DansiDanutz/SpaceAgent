---
name: DansLab Company
description: Complete DansLab company context, agent ecosystem, products, and operations
metadata:
  when:
    tags:
      - danslab
      - nervix
      - company
      - agent
      - semeclaw
      - crawdbot
      - paperclip
  loaded: true
  placement: system
---

# DansLab — Company Context

## Identity
- **Company**: DansLab (AI-native software company)
- **Founder**: Dan (Dansi) — based in Cluj-Napoca, Romania (EET/Europe/Bucharest)
- **Operating Model**: Human founder + AI orchestrator + machine-resident agents
- **Telegram**: @DandLabHermes_bot

## Products & Projects

| Product | Description | Status |
|---------|-------------|--------|
| **NERVIX** (nervix.ai) | AI agent marketplace — discover, buy, deploy agents | Active development |
| **CrawdBot** | Autonomous operational agent with monitoring, security, dashboards | Production-proven |
| **SemeClaw** | Open-source War Room — multi-agent meeting rooms | OSS, v0.4.0 |
| **MyWork AI** | Build tooling and workflow framework | Active |
| **ZmartyChat** | Chat product | Prototype |
| **DansLab OS** | Company operating system | Architectural |

## Infrastructure

- **Mac Studio** (Cluj-Napoca) — local backend, orchestration hub, runs David
- **4 DigitalOcean droplets**: Dexter, Memo, Sienna, Nano
- **Tailscale SSH** — secure connectivity between Mac Studio and droplets
- **Cloud**: Azure (primary), Vercel (frontend), DigitalOcean (VMs), Supabase (DB)

## Agent Ecosystem (Hub-and-Spoke)

### Human Layer
- **Dan** — Founder, strategy, quality, taste, final override

### Orchestration Layer
- **David** — Main orchestrator (OpenClaw-based), runs NERVIX orchestration logic
  - Associated with nervix.ai as primary orchestrator
  - Manages task decomposition, delegation, handoffs

### Execution Layer (VM Agents)
- **Dexter** — Research agent (DigitalOcean droplet)
- **Memo** — Strategist (DigitalOcean droplet)
- **Sienna** — Crypto specialist (DigitalOcean droplet)
- **Nano** — Agent Creator, builds new agents for NERVIX (DigitalOcean droplet)

### Communications Layer
- **Hermes** — Writer/communications pilot, Telegram bot (@DandLabHermes_bot)

### Specialist Layer (OpenClaw)
- Internal specialist agents for research, implementation, review, automation, moderation, operations, promotion
- **ManusClaw**, **KimiClaw**, **KiloClaw** — Channel/platform specialists

## Strategic Loop

```
idea -> orchestration -> execution -> review -> deployment -> visibility -> revenue -> learning -> improved execution
```

## Technology Stack

| Layer | Tech |
|-------|------|
| AI/LLM | qwen3.6-plus (DashScope), GPT-5.4, Gemini 2.5 Flash |
| Orchestration | OpenClaw, David (custom) |
| Backend | Python 3.11+, FastAPI, Node.js, Bun |
| Frontend | Next.js, Tailwind CSS, shadcn/ui |
| Database | SQLite (FTS5), PostgreSQL (Supabase), Drizzle ORM |
| Blockchain | TON (escrow, wallets) |
| Payments | Stripe, Skyfire |
| Voice | ElevenLabs Flash v2.5, edge-tts fallback |
| Search | Brave → SearXNG → DuckDuckGo |
| Container | Docker, Docker Compose |
| CI/CD | GitHub Actions |

## Key Integrations

- **Paperclip** — Kanban/task system with bidirectional sync
- **Moltica** — Secondary task source
- **Slack** — Team communications
- **GitHub** — Source control, CI/CD
- **Telegram** — Bot distribution, alerts
- **NERVIX Federation** — Full platform with A2A/MCP protocols

## Conventions
- Direct, concise communication — no fluff
- Proactive and honest about capabilities
- Python with `uv` for dependency management
- Atomic git commits with descriptive messages
- Security-first: managed identities, Key Vault, least privilege
