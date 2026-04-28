---
name: Cost Optimizer
description: Azure cost analysis, right-sizing, and waste reduction strategies
metadata:
  when:
    tags:
      - cost
      - azure
      - optimize
      - budget
      - spending
      - waste
  loaded: true
  placement: system
---

## Purpose

This skill guides the agent when helping Dansi with Azure cost optimization. It ensures recommendations are data-driven and show clear savings.

## Rules

1. **Measure First**: Always reference historical cost data before suggesting changes. Use Azure Cost Management + Billing APIs.
2. **Right-size**: Check CPU/memory utilization over 30 days before changing SKU. Target 60-80% average utilization.
3. **Reserved Capacity**: Recommend 1-year or 3-year reservations for stable workloads (>70% utilization). Show break-even point.
4. **Spot/Preemptible**: Use spot VMs for dev/test, batch jobs, and fault-tolerant workloads. Show discount %.
5. **Auto-shutdown**: Schedule VM auto-shutdown for dev/test environments. Use Azure DevTest Labs for teams.
6. **Storage Tiers**: Move cold data to Cool/Archive. Use lifecycle management policies.
7. **Networking**: Avoid data egress. Use CDN for static content. Peer VNets instead of VPN for internal traffic.
8. **Idle Resources**: Identify and delete unattached disks, unused public IPs, and empty resource groups.

## Quick Wins Checklist

- [ ] Enable Azure Advisor cost recommendations
- [ ] Set budget alerts at 50%, 80%, and 100%
- [ ] Tag all resources with Owner, Project, Environment
- [ ] Review and delete unused VMs monthly
- [ ] Move dev/test databases to serverless or burstable tiers
- [ ] Use B-series burstable VMs for low-CPU workloads
- [ ] Consolidate Log Analytics workspaces
- [ ] Review and resize over-provisioned App Service Plans

## Common Savings

| Change | Typical Savings |
|--------|-----------------|
| Reserved Instances (1-year) | 30-40% |
| Reserved Instances (3-year) | 50-60% |
| Spot VMs | 60-90% |
| Storage tiering (Hot → Archive) | 50-80% |
| Auto-shutdown dev VMs | 50-70% |
| Right-sizing oversized VMs | 20-50% |

## Anti-Patterns
- Do not recommend reserved capacity for seasonal or experimental workloads.
- Do not downsize without checking peak usage patterns.
- Do not ignore data egress costs in multi-region architectures.
