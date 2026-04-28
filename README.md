# Space Agent — DansLab Customware

This repository contains the complete L2/user customware for [Space Agent](https://github.com/agent0ai/space-agent), configured for the DansLab operational environment.

## Spaces

| Space | ID | Description |
|-------|-----|-------------|
| **Daily News** | `space-1` | AI news aggregation — GitHub trending, Hacker News, Dev.to, arXiv, Product Hunt |
| **Dev Workspace** | `dev-workspace` | Development hub — GitHub PRs, Azure status, Docker trends, quick commands |
| **War Room** | `war-room` | DansLab command center — live fleet monitoring, SemeClaw control, meeting convening |
| **Big Bang** | `big-bang` | System initialization space |

## War Room Architecture

The War Room connects to live DansLab infrastructure over Tailscale:

| Service | Tailscale IP | Port | Purpose |
|---------|-------------|------|---------|
| SemeClaw War Room | `dans-mac-studio` | `:8765` | Agent API, meetings, reports |
| Sentinel | `dans-mac-studio` | `:18790` | Fleet health probes |
| Coordinator | `dans-mac-studio` | `:8996` | LLM circuit-breaker proxy |
| Paperclip Adapter | `dexter-droplet` | `:4281` | Task runner |

### War Room Widgets

| Widget | Data Source | Actions |
|--------|-------------|---------|
| `agent-registry` | SemeClaw `/api/agent/health` | Live health %, run counts, timelines |
| `system-health` | Sentinel `/probes` + Coordinator `/health` | RAM, disk, latency, backend status |
| `paperclip-board` | SemeClaw `/api/state` | Connection status, tasks, metrics |
| `nervix-status` | SemeClaw manifest + state | Capabilities, meetings, LLM backends |
| `meeting-convene` | SemeClaw `POST /api/reports` | Type topic → auto-generates meeting |
| `coordinator-control` | Coordinator `/chain` | Reset buttons for failed backends |
| `sentinel-command` | Sentinel `/probe/trigger` | Trigger probes, check status, baseline |
| `fleet-diagnosis` | All of the above | Root-cause analysis for every issue |

## Skills

All skills auto-load into the onscreen agent system prompt.

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `azure-workflow` | azure, bicep, deploy | Azure architecture patterns |
| `web-dashboard` | dashboard, web app | Web development workflows |
| `space-optimizer` | optimize, space, layout | Space Agent optimization |
| `docker-workflow` | docker, container, compose | Docker best practices |
| `security-audit` | security, vault, auth | Security hardening |
| `cost-optimizer` | cost, budget, waste | Azure cost optimization |
| `danslab-company` | DansLab, NERVIX, SemeClaw | Company context & topology |
| `semeclaw-controller` | SemeClaw, war room, convene | Full SemeClaw API/CLI control |
| `fleet-commander` | ssh, droplet, restart, logs | Tailscale fleet operations |
| `nervix-admin` | NERVIX, credits, stripe | NERVIX platform admin |

## Memory

- `memory/behavior.system.include.md` — Core behavior context
- `memory/tech-stack.transient.include.md` — Tech stack preferences
- `memory/memories.transient.include.md` — Transient working memory

## Configuration

- `conf/onscreen-agent.yaml` — z.ai API config (glm-5.1, 120K tokens)
- `user.yaml` — User profile, timezone (Europe/Bucharest), role

## Fleet Network

```
seme (Windows)  100.107.91.110   ← Space Agent host
mac-studio      100.79.10.102    ← SemeClaw, Sentinel, Coordinator, Ollama
mac-mini        100.112.31.86    ← Secondary Mac
memo            100.88.192.48    ← Strategy/agent host
dexter          100.94.135.19    ← Research/development, Paperclip adapter
nano            100.105.148.29   ← Creator agent
sienna          100.124.88.93    ← Crypto/blockchain
```

## API Keys

API keys are stored in the local `.env` (not committed) and referenced by the onscreen agent config. The War Room widgets fetch from live Tailscale endpoints — no keys needed for read access. Write endpoints on SemeClaw are currently in open mode.

## Git History

This repo mirrors the L2/user customware directory. Auto-commits are enabled in Space Agent's Time Travel feature. Manual commits are made via `git` in the customware directory.
