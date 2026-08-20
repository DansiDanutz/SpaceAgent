---
name: semeclaw-controller
description: Monitor SemeClaw War Room health and reports through read-only Tailscale APIs. Write operations remain unavailable until authenticated operator authorization exists.
trigger: SemeClaw, war room, agent health, report, diagnose, paperclip, coordinator
metadata:
  loaded: auto
  placement: system
---

# SemeClaw Controller

You have read-only visibility into the SemeClaw War Room via its HTTP API (reachable at `http://100.79.10.102` through Tailscale).

## Endpoints (Read-Only Containment)

| Service | Base URL | Purpose |
|---------|----------|---------|
| War Room | `http://100.79.10.102:8765` | SemeClaw main API |
| Sentinel | `http://100.79.10.102:18790` | Fleet health monitor |
| Coordinator | `http://100.79.10.102:8996` | LLM circuit-breaker proxy |

## Current Fleet State

- **David (Mac Studio)**: RAM 4,074MB free, disk 19%, ollama✓, balancer✓, SSH✗
- **Dexter**: RAM 6,381MB free, disk 73%, latency 27ms
- **Memo**: latency 30ms
- **Sienna**: latency 33ms
- **Nano**: latency 27ms
- **Coordinator**: 5/8 backends CLOSED (working attempts). Claude balancers (3×) are OPEN (failed).

## Known Issues & Root Causes

### 📎 Paperclip DISCONNECTED
- **Symptom**: `paperclip.connected=false` in state, `last_sync=null`
- **Root cause**: SemeClaw configured for `http://127.0.0.1:13100/api`. Port 13100 on Mac Studio returns 502 Bad Gateway — proxy is up but upstream Paperclip board API is dead. The Dexter:4281 adapter is a different service (task runner, not board API).
- **Fix**: Requires Mac Studio access. Check proxy config or update `PAPERCLIP_API_URL` in `.env`.

### ⚡ Coordinator Backends OPEN
- **8997 (claude-balancer)**: Returns 503. Upstream "seme" has 18,513 successes but current requests fail. Health check passes, actual proxy fails.
- **8998/8999 (Z.ai proxies)**: Return 401. Missing `ZAI_API_KEY` in Mac Studio env.
- **Ollama (11434)**: Not reachable from outside. May be localhost-only.
- **OpenRouter/Gemini/Z.ai**: Missing API keys.
- **Fix**: Set API keys on Mac Studio. For 8997, check balancer upstream.

### 🖥️ Mac Studio SSH
- **Symptom**: Connection closed immediately or "Permission denied"
- **Root cause**: SSH requires specific keys not present, or Tailscale SSH not fully configured.
- **Fix**: `sudo systemsetup -setremotelogin on` on Mac Studio. Add SSH keys.

## Write Containment

Meeting creation, report mutation, probe triggering, backend resets, and Paperclip
triggers are unavailable. Do not construct or execute write requests until the
upstream service proves authenticated operator authorization and the repository
adds negative authorization regressions.

### Check Agent Health
```bash
curl http://100.79.10.102:8765/api/agent/health | jq '.agents[] | {name: .agent_name, health: .health_pct, runs: .total_runs, last_run: .last_run_at}'
```

### List All Reports
```bash
curl http://100.79.10.102:8765/api/reports
curl "http://100.79.10.102:8765/api/reports/content?name=<report-name>"
```

### Get Coordinator Chain Status
```bash
curl http://100.79.10.102:8996/chain | jq '.backends[] | {name: .name, state: .state, success_rate: .success_rate}'
```

## Response Patterns

When the user asks about fleet health, ALWAYS fetch live data rather than quoting cached knowledge.
When the user asks to convene a meeting, trigger a probe, or reset a backend, explain that writes are disabled pending authenticated authorization.
When the user asks "why is paperclip disconnected", explain the 502 proxy issue and that it requires Mac Studio access to fix.
