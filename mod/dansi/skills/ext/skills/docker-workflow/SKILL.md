---
name: Docker Workflow
description: Container best practices, multi-stage builds, and Docker Compose patterns
metadata:
  when:
    tags:
      - docker
      - container
      - compose
      - kubernetes
      - image
      - build
  loaded: true
  placement: system
---

## Purpose

This skill guides the agent when helping Dansi with containerization tasks. It ensures Dockerfiles, Compose files, and container orchestration follow production-ready patterns.

## Rules

1. **Multi-stage Builds**: Always prefer multi-stage builds for compiled languages. Final stage should use `distroless`, `slim`, or `alpine` base images.
2. **Image Size**: Keep production images under 200 MB where possible. Use `dive` to analyze layers.
3. **Non-root**: Run containers as non-root user. Create a dedicated user in the Dockerfile.
4. **Health Checks**: Add `HEALTHCHECK` instructions for long-running services.
5. **Layer Caching**: Order Dockerfile instructions by change frequency (least-changing first). Copy `package.json` before source code.
6. **Secrets**: Never bake secrets into images. Use BuildKit secrets, runtime env vars, or mounted volumes.
7. **Compose**: Use `docker compose` (v2) not `docker-compose` (v1). Pin image tags, never use `:latest` in production.
8. **Resource Limits**: Always set `deploy.resources.limits` in Compose for production.

## Common Patterns

### Node.js Multi-stage
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"
CMD ["node", "server.js"]
```

### Python Multi-stage
```dockerfile
FROM python:3.11-slim AS builder
WORKDIR /app
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-slim
RUN groupadd -r appuser && useradd -r -g appuser appuser
COPY --from=builder /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH
USER appuser
CMD ["python", "app.py"]
```

## Anti-Patterns
- Do not use `apt-get upgrade` in Dockerfiles.
- Do not install dev tools (gcc, make) in final stage.
- Do not use `ADD` for remote URLs; use `curl` or `wget` with checksum verification.
