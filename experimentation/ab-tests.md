# A/B tests <Badge type="warning" text="to learn" />

## The idea

An A/B test randomly splits users between the current version (A) and a change (B), and
compares a metric. Because chance alone decides who gets what, a difference beyond noise
was **caused** by the change. This is the most reliable way to measure the effect of a
product or model change.

## Look-up

- **Before starting:** fix the primary metric, guardrail metrics (things that must not get
  worse), the minimum effect worth detecting, and the sample size.
- **Sample size per group**, for 80% power at α = 0.05 (two-sided):
  `n ≈ 16 · σ² / δ²`, where `δ` is the smallest effect to detect. For a conversion rate
  `p`, use `σ² = p · (1 - p)`.
- **Analysis:** the difference in means with a confidence interval, e.g. a t-test or z-test
  for proportions.

```python
from scipy import stats

stats.ttest_ind(metric_b, metric_a, equal_var=False)
```

**Pitfalls**

- **Peeking:** stopping as soon as p < 0.05 inflates false positives. Fix the duration, or
  use sequential tests.
- **Sample ratio mismatch:** if a planned 50/50 split comes out as 52/48, the assignment is
  broken.
- **Novelty effects:** run full weeks and long enough for the excitement to wear off.
- **Many metrics:** correct for multiple testing, or declare one primary metric.
- **CUPED:** using pre-experiment data as a covariate reduces variance, so tests need fewer
  users.

## Where I used it

Not yet.

## Sources

- Kohavi, Tang & Xu (2020), [Trustworthy Online Controlled Experiments](https://experimentguide.com/), Cambridge University Press
- Evan Miller: [Sample size calculator](https://www.evanmiller.org/ab-testing/sample-size.html)
