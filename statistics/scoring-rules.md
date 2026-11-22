# Proper scoring rules <Badge type="tip" text="used" />

## The idea

A scoring rule rates a probabilistic forecast against what actually happened. It is
**proper** if a forecaster gets the best expected score by reporting what they really
believe, so neither hedging nor exaggerating pays off.

Accuracy, F1 and other threshold metrics are not proper. They only see on which side of a
threshold a probability falls, so 51% and 99% count the same.

## Look-up

| Forecast | Rule | Formula (lower is better) | Notes |
|---|---|---|---|
| Probability `p` of a binary event `y` | Log loss | `-(y·log p + (1-y)·log(1-p))` | Punishes confident mistakes hard; infinite for `p = 0` when `y = 1` |
| same | Brier score | `(p - y)²` | Bounded 0–1, the MSE of probabilities |
| Quantile `q` at level `τ` | Pinball loss | `τ·(y - q)` if `y ≥ q`, else `(1-τ)·(q - y)` | Averaged over many quantiles it approximates CRPS |
| Full distribution `F` | CRPS | `∫ (F(x) - 1{x ≥ y})² dx` | In the unit of `y`; equals MAE for a point forecast |

```python
from sklearn.metrics import log_loss, brier_score_loss, mean_pinball_loss

log_loss(y, p)
brier_score_loss(y, p)
mean_pinball_loss(y, q10, alpha=0.1)
```

- **Skill score:** `1 - score / score_baseline` says how much better than a baseline. 0 means
  no better, 1 means perfect.
- Use the same rule for choosing models as for reporting them.
- Log loss is sensitive to a few very confident errors. Brier is more forgiving, so report both.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): pinball loss over the
  10/50/90% quantiles. The corrected forecast scores 0.387 against 0.751 for raw ECMWF.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): log loss is the main
  metric and Brier the second. Always predicting 20% scores 0.506, and the champion scores 0.413.

## Sources

- Gneiting & Raftery (2007), [Strictly proper scoring rules, prediction, and estimation](https://doi.org/10.1198/016214506000001437), JASA
- scikit-learn: [Metrics and scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
