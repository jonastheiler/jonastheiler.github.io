# Calibration <Badge type="tip" text="used" />

## The idea

A model is **calibrated** if its probabilities mean what they say: of all cases it gives
70%, about 70% happen. For intervals, an 80% interval should contain the outcome 80% of
the time.

Calibration is separate from **discrimination**, which is how well a model ranks cases.
ROC-AUC only measures ranking, so a model can have a high AUC and still give badly
calibrated probabilities.

## Look-up

**Check it**

- **Reliability diagram:** bin the predictions and plot the mean prediction against the
  observed frequency. A calibrated model lies on the diagonal.
- **Interval coverage:** the share of outcomes inside the interval, compared with its
  nominal level.

```python
from sklearn.calibration import CalibrationDisplay

CalibrationDisplay.from_predictions(y, p, n_bins=10)
coverage = ((y >= lo) & (y <= hi)).mean()
```

**Fix it**, always on held-out data and never on the training data:

- **Classifiers:** Platt scaling (`method="sigmoid"`) or isotonic regression, which needs
  more data. Both are in `CalibratedClassifierCV`.
- **Intervals:** conformal prediction. Conformalized quantile regression (CQR) widens both
  ends by a margin measured on a calibration set:

```python
scores = np.maximum(q_lo_cal - y_cal, y_cal - q_hi_cal)
level = min(1, (1 - alpha) * (1 + 1 / len(y_cal)))
margin = np.quantile(scores, level)
lo, hi = q_lo_test - margin, q_hi_test + margin
```

**Pitfall:** coverage averaged over all cases can hide intervals that are too wide in easy
cases and too narrow in hard ones. Check coverage per slice, such as per season or per
group.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): the quantile models were
  overconfident, and CQR widened the 10–90% interval to 81% coverage against a target of
  80%. Limitation: the interval is equally wide in calm and in difficult weather.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): every MLflow run logs
  a calibration plot.

## Sources

- scikit-learn: [Probability calibration](https://scikit-learn.org/stable/modules/calibration.html)
- Romano, Patterson & Candès (2019), [Conformalized quantile regression](https://arxiv.org/abs/1905.03222)
- Angelopoulos & Bates (2021), [A gentle introduction to conformal prediction](https://arxiv.org/abs/2107.07511)
