# Data leakage <Badge type="tip" text="used" />

## The idea

Leakage means a model sees information during training or evaluation that it won't have
when it makes real predictions. The offline results look great, and the model fails in use.
With time-dependent data the most common leak is the future.

## Look-up

**Checklist**

- For every feature, ask: *would I know this value at the moment of prediction?* Store
  as-of timestamps so you can check.
- Split by time whenever the data changes over time, and never shuffle across time.
- Fit preprocessing (scalers, TF-IDF vocabulary, target encoding) inside a pipeline, so it
  only sees the training folds.
- Look for duplicates and near-duplicates across splits, such as translations or several
  rows per customer.
- Remove target proxies: fields that are only filled in after the outcome.
- Use data as it was available at the time, such as issued forecasts and not later
  revisions.
- Write a test that fails when a feature comes from after the issue time.

```python
from sklearn.pipeline import make_pipeline

# The vocabulary is fitted on the training folds only.
pipe = make_pipeline(TfidfVectorizer(), LogisticRegression())
```

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): it trains on ECMWF forecasts
  as they were issued a day ahead, and `recent_error` only uses measurements already
  published. A test checks that no feature uses an observation from after the issue time.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): it only uses what is
  known when a Motion is submitted, and trains only on answers given before the cut-off date.
- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): the test winter is later
  than all training data, and translations of a bulletin stay together.

## Sources

- Kaufman, Rosset & Perlich (2012), [Leakage in data mining: formulation, detection, and avoidance](https://doi.org/10.1145/2382577.2382579), ACM TKDD
- scikit-learn: [Common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html)
