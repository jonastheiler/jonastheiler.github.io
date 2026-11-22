# Docker <Badge type="tip" text="used" />

## The idea

An **image** packages an application with its runtime and dependencies, so it runs the same
everywhere. A **container** is a running image. **Docker Compose** starts several services
together from one file.

## Look-up

```dockerfile
FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev --no-install-project   # dependencies: cached layer
COPY src ./src
RUN uv sync --locked --no-dev                        # the project itself
CMD ["uv", "run", "python", "-m", "myproject"]
```

| Command | Does |
|---|---|
| `docker build -t app .` | Build an image |
| `docker run -p 8080:8080 app` | Run it, forwarding a port |
| `docker logs <container>` | Show its output |
| `docker exec -it <container> sh` | Open a shell inside |
| `docker compose up -d` | Start all services in the background |

- Copy the dependency files before the code, so code changes don't reinstall everything.
- Use small base images, never bake secrets into an image, and run as a non-root user.
- Limit resources: `docker run --cpus 4 --memory 4g`, or `deploy.resources.limits` in Compose.
- Pin the uv image to a version in real projects, not `latest`.

## Where I used it

- [shiny-k8s-lab](https://github.com/jonastheiler/shiny-k8s-lab): an R Shiny app image, built
  in CI and pushed to ghcr.io.
- [privacy-gateway](https://github.com/jonastheiler/privacy-gateway): llama.cpp in Docker
  Compose, capped at 4 CPUs and 4 GB RAM.

## Sources

- Docker: [Get started](https://docs.docker.com/get-started/)
- Docker: [Building best practices](https://docs.docker.com/build/building/best-practices/)
