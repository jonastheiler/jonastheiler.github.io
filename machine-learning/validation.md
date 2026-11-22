# Validation design <Badge type="tip" text="used" />

## The idea

Validation estimates how a model will do on data it hasn't seen. The split should mimic how
the model will be used: the same time gap and the same kind of unseen units.

Use three sets: **train** to fit, **validation** to choose models, prompts and
hyperparameters, and **test**, which you touch once at the end.

## Look-up

| Situation | Split | scikit-learn |
|---|---|---|
| Independent rows | k-fold | `KFold` |
| Rare class | Stratified k-fold | `StratifiedKFold` |
| Groups (users, documents) | Group k-fold | `GroupKFold` |
| Ordered in time | Time split, rolling origin | `TimeSeriesSplit` |

```python
from sklearn.model_selection import TimeSeriesSplit, cross_val_score

cross_val_score(model, X, y, cv=TimeSeriesSplit(n_splits=5), scoring="neg_log_loss")
```

- Every look at the test set to make a decision turns it into a validation set.
- Report uncertainty with the score (see [Confidence intervals](/statistics/confidence-intervals)).
- Keep the split in one function, and test it.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): a rolling-origin backtest,
  where every month is predicted by a model trained on the months before.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): trained on 2007–2022,
  tested on Motionen submitted since 2023.
- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): train on winters 23/24 and
  24/25, tune prompts on a validation sample from 24/25, test on 25/26.

## Sources

- scikit-learn: [Cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html)
- Hyndman & Athanasopoulos, [Time series cross-validation](https://otexts.com/fpp3/tscv.html)
