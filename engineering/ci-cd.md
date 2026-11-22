# CI/CD with GitHub Actions <Badge type="tip" text="used" />

## The idea

**Continuous integration** runs the checks on every push and pull request. **Continuous
delivery** ships the artifacts automatically: an image, a site, a model. ML projects also
add scheduled jobs for data, forecasts and retraining.

In GitHub Actions, these are YAML workflows in `.github/workflows/`.

## Look-up

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: astral-sh/setup-uv@v6
      - run: uv sync --locked
      - run: uv run ruff check .
      - run: uv run pytest
```

- **Triggers:** `push`, `pull_request`, `schedule` (cron in UTC, and runs can start late),
  `workflow_dispatch` (manual).
- **Secrets** go in the repo settings and are read as `${{ secrets.NAME }}`. Grant minimal
  `permissions:`.
- To commit results back (data, reports), the workflow needs `contents: write`.
- To push images to `ghcr.io`, log in with `GITHUB_TOKEN` and grant `packages: write`.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): `daily.yml` (data, forecast,
  dashboard), `retrain.yml` and `ci.yml`. The workflows commit data and reports back to the repo.
- [shiny-k8s-lab](https://github.com/jonastheiler/shiny-k8s-lab): it builds the Docker image
  and pushes it to ghcr.io.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): CI on every push.
- This wiki: built and deployed to GitHub Pages by a workflow.

## Sources

- [GitHub Actions documentation](https://docs.github.com/en/actions)
