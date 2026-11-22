# Promotion gates <Badge type="tip" text="used" />

## The idea

A promotion gate is an automatic check a new model has to pass before it replaces the
current one. Typically it has to beat the baselines and not be worse than the current model,
scored on the same data.

The gate makes automatic retraining safe. When a model fails it, the failure should be loud.

## Look-up

```python
def passes_gate(new: float, current: float | None, baselines: dict[str, float],
                margin: float = 0.0) -> bool:
    """Scores are losses: lower is better."""
    beats_baselines = all(new < score for score in baselines.values())
    not_worse = current is None or new <= current + margin
    return beats_baselines and not_worse
```

- Score candidate and current model on the **same** evaluation set or backtest.
- Add checks beyond accuracy: calibration, latency, input schema, model size.
- Record the decision and the scores, e.g. in the model card or as run tags.
- When the gate rejects a model, fail the job, so a human notices.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): a new model must beat both
  baselines and must not be clearly worse than the current model. Otherwise the retrain job
  fails visibly.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): the `champion` alias
  only moves if the new model beats the current champion on the test set.

## Sources

- Google: [Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml)
- Breck et al. (2017), *The ML test score: a rubric for ML production readiness*, IEEE Big Data
