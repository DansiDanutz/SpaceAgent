---
name: semeclaw-controller
description: Control SemeClaw War Room — convene meetings, trigger Sentinel probes, reset LLM backends, manage reports, and monitor agent fleet health via live Tailscale API. Includes diagnosis and fix procedures.
trigger: SemeClaw, war room, convene meeting, trigger probe, reset backend, agent health, meeting audio, report, fix, diagnose, paperclip, coordinator
metadata:
  loaded: auto
  placement: system
---

# SemeClaw Controller

You have full control over the SemeClaw War Room via its HTTP API (reachable at `http://100.79.10.102` through Tailscale).

## Endpoints (No Auth Required — Open Mode)

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

## Commands

### Convene a War Room Meeting
```bash
# 1. Create a report
curl -X POST http://100.79.10.102:8765/api/reports \
  -H "Content-Type: application/json" \
  -d '{"name": "<topic-slug>.md", "content": "# <Topic>\n\n## Context\n...\n\n## Analysis\n...\n\n## Recommendation\n...\n"}'

# 2. Generate meeting script
curl "http://100.79.10.102:8765/api/meeting/script?name=<topic-slug>.md"

# 3. Generate audio MP3
curl "http://100.79.10.102:8765/api/meeting/audio?name=<topic-slug>.md" -o meeting.mp3

# 4. Pin it (save permanently)
curl -X POST "http://100.79.10.102:8765/api/meeting/pin?name=<topic-slug>.md"
```

### Trigger Sentinel Probe
```bash
curl -X POST http://100.79.10.102:18790/probe/trigger
```

### Reset a Coordinator Backend
```bash
curl -X POST "http://100.79.10.102:8996/chain/reset/<backend-name>"
# backend-name: claude-balancer, claude-proxy1, claude-proxy2, ollama-coder, ollama-qwen3, openrouter-qwen, gemini-flash, zai-glm5
```

### Reset ALL Coordinator Backends
```bash
for b in claude-balancer claude-proxy1 claude-proxy2 ollama-coder ollama-qwen3 openrouter-qwen gemini-flash zai-glm5; do
  curl -X POST "http://100.79.10.102:8996/chain/reset/$b"
  echo "Reset $b"
done
```

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

### Paperclip Trigger (creates meeting + audio + share link)
```bash
curl -X POST http://100.79.10.102:8765/api/paperclip/trigger \
  -H "Content-Type: application/json" \
  -d '{"task_markdown": "# Task Title\n\nDescription here...", "project": "nervix", "callback_url": "https://nervix.ai/webhooks/semeclaw"}'
```

## Response Patterns

When the user asks about fleet health, ALWAYS fetch live data rather than quoting cached knowledge.
When the user asks to "convene a meeting", create the report first, then generate script + audio.
When a backend is OPEN (failed), suggest resetting it via the coordinator API.
When the user asks "why is paperclip disconnected", explain the 502 proxy issue and that it requires Mac Studio access to fix.
