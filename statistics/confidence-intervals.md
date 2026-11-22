# Confidence intervals & bootstrap <Badge type="tip" text="used" />

## The idea

A score on a test set is an estimate, and a different sample would give a different
number. A confidence interval shows how far it could move.

The **bootstrap** makes such an interval without formulas: resample the test cases with
replacement, recompute the metric each time, and take the percentiles. It works for any
metric, including F1.

## Look-up

```python
rng = np.random.default_rng(0)
n = len(y)
stats = []
for _ in range(1000):
    i = rng.integers(0, n, n)          # resample rows with replacement
    stats.append(metric(y[i], p[i]))
lo, hi = np.percentile(stats, [2.5, 97.5])
```

- **Cluster bootstrap:** if rows aren't independent (one document in four languages, or
  several rows per patient), resample whole clusters.
- **Paired comparison:** to compare two models, resample once, compute both scores on the
  same sample and bootstrap their **difference**. If its interval excludes 0, one model
  is better.
- Overlapping intervals don't prove that two models are equal. Non-overlapping intervals
  are a conservative sign that they differ.
- The width shrinks with `1/√n`, so four times the test data halves the interval.
- For simple cases, use `scipy.stats.bootstrap`.

## Where I used it

- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): 95% intervals for F1 by
  resampling bulletins, each together with its translations. With 300 bulletins the
  intervals are about ±0.03, which is why Qwen and Haiku count as tied.

## Sources

- Efron & Tibshirani (1993), *An Introduction to the Bootstrap*, Chapman & Hall
- SciPy: [scipy.stats.bootstrap](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html)
