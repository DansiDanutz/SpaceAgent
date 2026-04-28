---
name: Space Optimizer
description: Tips and automation for keeping Space Agent fast, organized, and well-maintained
metadata:
  when:
    tags:
      - space-agent
      - maintenance
      - optimize
      - cleanup
      - performance
  loaded: true
  placement: transient
---

## Purpose

This skill helps Dansi keep Space Agent running at peak performance and organizes the workspace over time.

## Maintenance Checklist

### Weekly
- Review `~/memory/memories.transient.include.md` and prune outdated notes.
- Check for Space Agent updates (desktop auto-updater or `node space update` on server installs).
- Archive old chat histories if they grow beyond 10 MB.

### Monthly
- Audit installed modules: remove unused ones to reduce startup time.
- Review widgets for broken external APIs and update endpoints.
- Consolidate duplicate skills or overlapping prompt includes.
- Run a git garbage collection on L2 history if Time Travel feels slow:
  ```bash
  cd ~/.space-agent/customware/L2/user
  git gc --aggressive
  ```

### Quarterly
- Evaluate if the current LLM provider/model still meets latency/quality needs.
- Back up `L2/` and critical `L1/` customware to a separate git repo or cloud storage.
- Review and update `~/memory/behavior.system.include.md` with new standing instructions.

## Performance Tips

1. **Widget Caching**: For widgets that hit rate-limited APIs, cache results in `localStorage` with a TTL (e.g., 5 minutes) to reduce requests.
2. **Lazy Loading**: If a space has many widgets, consider splitting them across multiple spaces or loading heavy widgets only on interaction.
3. **Module Size**: Keep custom modules under 1 MB. Large assets should be served from external CDN or blob storage, not embedded in `mod/`.
4. **Prompt Budget**: The onscreen agent has a token budget. Keep auto-loaded system skills concise. Offload long reference material to `*.transient.include.md` files that load only when relevant.

## Automation Ideas

- Create a scheduled job (via OS Task Scheduler or cron) to run `git commit` in the L2 directory weekly for extra backup safety.
- Use a "Dashboard Health" widget that shows disk usage of `customware/`, git status, and last backup date.
- Set up a skill that reminds Dansi to prune memories when `~/memory/` exceeds a certain size.

## Security Reminders
- Never store API keys in widget code or skill markdown that might be shared. Use `~/meta/` encrypted files or environment variables.
- Rotate z.ai API keys every 90 days.
- Review `meta/logins.json` periodically and revoke old sessions.
