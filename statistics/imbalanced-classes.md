# Imbalanced classes <Badge type="tip" text="used" />

## The idea

When one class is rare, accuracy rewards ignoring it: "always no" is 80% accurate if 80% of
cases are "no". Evaluate the probabilities and the rare class directly.

Resampling is often unnecessary. A model with calibrated probabilities plus a threshold
chosen for the decision usually does the job.

## Look-up

| Metric | What it tells | Baseline value |
|---|---|---|
| Accuracy | Misleading here | Majority share |
| Log loss, Brier | Quality of the probabilities | Score of always predicting the base rate |
| PR-AUC (average precision) | How well the rare class is found | Base rate of the rare class |
| ROC-AUC | Ranking | 0.5, and it can look good while precision is poor |

```python
from sklearn.metrics import average_precision_score

average_precision_score(y, p)  # compare with y.mean()
```

- **Threshold from costs:** predict positive when `p > c_FP / (c_FP + c_FN)`, so not
  automatically at 0.5.
- `class_weight="balanced"` and resampling shift the probabilities, so recalibrate
  afterwards.
- Stratify random splits so every fold contains the rare class. Time splits come first,
  though (see [Validation design](/machine-learning/validation)).

## Where I used it

- [motion-forecast](https://github.com/jonastheiler/motion-forecast): 20% of Motionen are
  accepted, so "always reject" is 80% accurate. The champion reaches a PR-AUC of 0.50
  against a base rate of 0.20.

## Sources

- Saito & Rehmsmeier (2015), [The precision-recall plot is more informative than the ROC plot when evaluating binary classifiers on imbalanced datasets](https://doi.org/10.1371/journal.pone.0118432), PLOS ONE
- scikit-learn: [Precision-recall](https://scikit-learn.org/stable/auto_examples/model_selection/plot_precision_recall.html)
