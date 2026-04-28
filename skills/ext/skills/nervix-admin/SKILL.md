---
name: nervix-admin
description: NERVIX platform administration — member management, credit tracking, Stripe webhooks, ad play analytics, and marketplace operations.
trigger: NERVIX, member, credits, stripe, ad play, checkout, dashboard, nervix platform
metadata:
  loaded: auto
  placement: system
---

# NERVIX Admin

## Platform Overview

NERVIX is an AI agent marketplace with TON blockchain payments and Stripe credit purchases.

- **Landing**: `http://100.79.10.102:8080/` (currently unreachable — service may not be running)
- **Health**: `http://100.79.10.102:8080/api/health`
- **Stack**: FastAPI, Jinja2, SQLite, Stripe

## Data Model

| Entity | Fields |
|--------|--------|
| Member | id, email, name, created_at, credits, stripe_customer_id |
| Project | id, member_id, title, description, url, clicks |
| CreditTransaction | id, member_id, amount, description, stripe_payment_intent_id, created_at |
| AdPlayEvent | id, project_id, completed, duration_sec, created_at |

## Credit Tiers (from stripe_client.py)

| Tier | Credits | Price |
|------|---------|-------|
| Starter | 100 | ~$5 |
| Pro | 500 | ~$20 |
| Enterprise | 2000 | ~$50 |

## Admin Operations

### Check platform health
```bash
curl http://100.79.10.102:8080/api/health
```

### List members (via SQLite directly)
```bash
ssh mac-studio "sqlite3 ~/SemeClaw/nervix_platform/data/nervix.db 'SELECT id, email, name, credits, created_at FROM members ORDER BY created_at DESC LIMIT 20;'"
```

### Credit balance check
```bash
ssh mac-studio "sqlite3 ~/SemeClaw/nervix_platform/data/nervix.db 'SELECT m.email, m.credits, COUNT(t.id) as tx_count FROM members m LEFT JOIN credit_transactions t ON m.id = t.member_id GROUP BY m.id;'"
```

### Ad play analytics
```bash
ssh mac-studio "sqlite3 ~/SemeClaw/nervix_platform/data/nervix.db 'SELECT p.title, COUNT(a.id) as plays, SUM(CASE WHEN a.completed THEN 1 ELSE 0 END) as completed FROM projects p LEFT JOIN ad_plays a ON p.id = a.project_id GROUP BY p.id;'"
```

### Recent transactions
```bash
ssh mac-studio "sqlite3 ~/SemeClaw/nervix_platform/data/nervix.db 'SELECT member_id, amount, description, created_at FROM credit_transactions ORDER BY created_at DESC LIMIT 20;'"
```

## Stripe Webhook Handling

The Stripe webhook endpoint is at `POST /api/webhooks/stripe`. It handles:
- `checkout.session.completed` → credits the member's account
- Idempotency via in-memory `_processed_stripe_events` set

If credits aren't appearing after purchase, check:
1. Stripe webhook is configured to POST to the correct URL
2. `STRIPE_WEBHOOK_SECRET` is set in `.env`
3. The webhook signature validates

## When to Use

- User asks about "NERVIX members" or "credits" → Query SQLite
- User asks about "ad plays" or "revenue" → Aggregate ad_play + transaction tables
- User asks about "Stripe issues" → Check webhook config + logs
- User asks to "add credits" → Direct DB update (emergency only) or create Stripe checkout
