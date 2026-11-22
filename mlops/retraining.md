# Retraining <Badge type="tip" text="used" />

## The idea

Models go stale, so they are retrained on a schedule, on a trigger from monitoring, or both.
Retraining has to be automatic and safe: it runs the same pipeline as the backtest and then
passes a [promotion gate](/mlops/promotion-gates).

## Look-up

- **Schedule:** cheap and predictable. **Trigger:** reacts to drift. Combining both is common.
- **Training window:** expanding (all history) or sliding (recent data only, which adapts
  faster but forgets).
- **Pipeline:** fetch → validate → backtest and train → gate → promote → record.
- **Reproducible:** pinned dependencies, versioned data, fixed seeds.

```yaml
# GitHub Actions: monthly, and on demand
on:
  schedule:
    - cron: "0 3 1 * *"   # 03:00 UTC on the 1st; scheduled runs can start late
  workflow_dispatch:
```

One workflow can start another with `gh workflow run retrain.yml`. The workflow needs
`actions: write` permission for that.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): it retrains monthly, or when
  the daily job finds the model degraded and starts `retrain.yml`.

## Sources

- Google Cloud: [MLOps: continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
