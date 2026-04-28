---
name: fleet-commander
description: Command the DansLab fleet — SSH into droplets via Tailscale, run diagnostics, restart services, check logs, and execute fleet-wide operations.
trigger: ssh, droplet, fleet, restart service, check logs, tailscale, dexter, memo, sienna, nano, mac studio
metadata:
  loaded: auto
  placement: system
---

# Fleet Commander

## Tailscale Network

All machines are reachable via Tailscale SSH without passwords (Tailscale handles auth):

| Host | Tailscale IP | SSH User | Role | SSH Status |
|------|-------------|----------|------|-----------|
| dans-mac-studio | 100.79.10.102 | dansi | Main hub — David, SemeClaw, Ollama | 🔴 BLOCKED |
| memo-droplet | 100.88.192.48 | root | Strategy/agent host | 🔴 ACL blocked |
| dexter-droplet | 100.94.135.19 | root | Research/development | 🟢 WORKS |
| nano-droplet | 100.105.148.29 | root | Creator agent | 🔴 ACL blocked |
| sienna-droplet | 100.124.88.93 | root | Crypto/blockchain | 🔴 ACL blocked |

## SSH Aliases (from ~/.ssh/config)

```bash
ssh mac-studio      # dans-mac-studio (currently fails)
ssh memo            # memo-droplet (ACL blocked)
ssh dexter          # dexter-droplet (works!)
ssh nano            # nano-droplet (ACL blocked)
ssh sienna          # sienna-droplet (ACL blocked)
```

## Current Fleet Issues & Fixes

### 🔴 Paperclip DISCONNECTED
**Root cause**: SemeClaw on Mac Studio is configured to connect to `http://127.0.0.1:13100/api`. Port 13100 returns 502 Bad Gateway — a proxy is running but its upstream Paperclip board API is dead. The Paperclip adapter running on Dexter:4281 is a DIFFERENT service (task runner with /status /heartbeat /task /metrics, NOT a board API).

**Fix** (requires Mac Studio access):
```bash
# On Mac Studio — find what's supposed to be on port 13100
sudo lsof -i :13100
docker ps | grep paperclip
cat /etc/nginx/conf.d/* | grep -A5 13100

# Or update SemeClaw config to point to correct Paperclip
nano ~/SemeClaw/.env
# Change: PAPERCLIP_API_URL=http://correct-host:correct-port/api
```

### 🔴 Coordinator: 3/8 backends OPEN
**Root cause**:
- **claude-balancer (8997)**: Returns 503 — upstream "seme" backend is healthy (18,513 successes) but actual requests fail. Likely the balancer is overloaded or misrouting.
- **claude-proxy2 (8998)** & **claude-proxy1 (8999)**: Return 401 — missing `ZAI_API_KEY` in Mac Studio environment.
- **ollama-coder/qwen3**: Ollama on port 11434 is not reachable from outside Mac Studio. It may be running on localhost only.
- **openrouter-qwen / gemini-flash / zai-glm5**: Missing API keys (`OPENROUTER_API_KEY`, `GOOGLE_API_KEY`, `ZHIPU_API_KEY`).

**Fix** (requires Mac Studio access):
```bash
# On Mac Studio — check which API keys are set
cat ~/SemeClaw/.env | grep -E "ZAI|OPENROUTER|GOOGLE|ZHIPU|OLLAMA"

# Check balancer upstream health
curl -s http://127.0.0.1:8997/health | jq .backends

# Check if Ollama is running
ollama list
launchctl list | grep ollama

# Reset all coordinator backends
curl -X POST http://127.0.0.1:8996/chain/reset/claude-balancer
curl -X POST http://127.0.0.1:8996/chain/reset/claude-proxy1
curl -X POST http://127.0.0.1:8996/chain/reset/claude-proxy2
```

### 🔴 Mac Studio SSH Unreachable
**Root cause**: SSH daemon closes connection immediately OR requires specific keys not in authorized_keys. Even Dexter (another Tailscale node) gets "Permission denied".

**Fix** (requires physical Mac Studio access):
```bash
# On Mac Studio
sudo systemsetup -setremotelogin on

# Add your SSH key
cat ~/.ssh/id_ed25519_tailscale_team.pub >> ~/.ssh/authorized_keys

# Or configure Tailscale SSH
tailscale up --ssh
```

### 🟡 NERVIX Platform (8080) Down
**Root cause**: NERVIX FastAPI service is not running.

**Fix** (requires Mac Studio access):
```bash
cd ~/SemeClaw && uv run python -m nervix_platform.main &
# Or check if there's a launchd service:
launchctl list | grep nervix
```

### 🟡 Memo/Sienna/Nano SSH Blocked
**Root cause**: Tailscale ACL policy only permits SSH to Dexter, not the other droplets.

**Fix**: Update Tailscale ACL at https://login.tailscale.com/admin/acls
```json
{
  "action": "accept",
  "src": ["DansiDanutz"],
  "dst": ["*:*"],
  "users": ["root", "autogroup:nonroot"]
}
```

### 🟢 GSD Agent 80% Health
**Root cause**: Historical — 2 failures out of 10 runs on 2026-04-17. Reasons: "Redis connection lost" and "Supabase rate limit". Agent has been idle since.

**Fix**: Will auto-recover on next successful run. No action needed unless you want to trigger GSD manually via Supabase cron.

## Dexter (Working SSH)

Since Dexter is the only reachable droplet, use it as a jump host and diagnostic source:

```bash
# Check Dexter services
ssh dexter "ps aux | grep -E 'python|node|docker' | grep -v grep"

# Check Dexter Paperclip adapter
ssh dexter "curl -s http://127.0.0.1:4281/status"

# Check Dexter resources
ssh dexter "free -h && df -h / && uptime"
```

## Common Fleet Commands

### Check disk and memory on Dexter
```bash
ssh dexter "df -h / && free -h && uptime"
```

### Check Paperclip adapter on Dexter
```bash
ssh dexter "curl -s http://127.0.0.1:4281/status | jq ."
```

### Restart SemeClaw (requires Mac Studio)
```bash
ssh mac-studio "launchctl unload ~/Library/LaunchAgents/com.danslab.war-room-dashboard.plist 2>/dev/null; launchctl load ~/Library/LaunchAgents/com.danslab.war-room-dashboard.plist"
```

### Tailscale status
```bash
tailscale status
```
