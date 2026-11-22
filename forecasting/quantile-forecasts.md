# Quantile forecasts <Badge type="tip" text="used" />

## The idea

Instead of one number, predict several quantiles. The 10% and 90% quantiles together give an
80% interval. Each quantile is learnt with the pinball loss at its level, so no
distribution has to be assumed.

The goal is to be **as sharp as possible while staying calibrated**: narrow intervals that
still hold as often as they claim.

## Look-up

- **Pinball loss at level τ:** under-predictions cost `τ`, over-predictions cost `1 - τ`
  (see [Proper scoring rules](/statistics/scoring-rules)).
- **One model per quantile**, e.g. LightGBM with `objective="quantile", alpha=τ`.
- **Quantile crossing:** separate models can give `q10 > q50`. Sort the predictions per row:

```python
q10, q50, q90 = np.sort(np.column_stack([q10, q50, q90]), axis=1).T
```

- **Check:** the share of outcomes below each quantile (≈ τ), the interval coverage, and the
  mean interval width.
- **Calibrate** with conformal prediction if the intervals are too narrow (see
  [Calibration](/statistics/calibration)).

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): 10/50/90% quantiles of
  ECMWF's error. The 10–90% range holds 81% of observations. Limitation: it is about 4 °C
  wide in every month, so it is too wide in calm weather and too narrow in difficult weather.

## Sources

- Koenker & Hallock (2001), [Quantile regression](https://doi.org/10.1257/jep.15.4.143), Journal of Economic Perspectives
- Gneiting, Balabdaoui & Raftery (2007), [Probabilistic forecasts, calibration and sharpness](https://doi.org/10.1111/j.1467-9868.2007.00587.x), JRSS-B
- LightGBM: [Parameters](https://lightgbm.readthedocs.io/en/latest/Parameters.html)
