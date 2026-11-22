# Backtesting <Badge type="tip" text="used" />

## The idea

A backtest replays the past. At each forecast origin you train only on data before it,
forecast the next period, and move forward. This gives many truly out-of-sample forecasts
and shows how performance varies, for example by season.

## Look-up

```python
predictions = []
for start, end in month_ranges:                   # e.g. first and last day of each month
    model = fit(df[df.time < start])              # only the past
    test = df[(df.time >= start) & (df.time < end)]
    predictions.append(predict(model, test))
```

- **Expanding window** (all history) or **sliding window** (recent data only, which adapts
  faster).
- Respect data delays. If a value is published a day late, the model can't use it.
- Report results per period, not only the average. "Beats the baseline in 17 of 20 months"
  says more than one number.
- Use the same code for the backtest and for production, so the backtest measures what runs.
- A **forward test** goes further: log real forecasts before the outcome is known.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): a rolling-origin backtest
  from March 2025 to October 2026 (14,176 hours), with every month predicted by a model
  trained on the months before.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): live forecasts are
  appended to a file, and git dates each one before the answer comes in.

## Sources

- Hyndman & Athanasopoulos, [Time series cross-validation](https://otexts.com/fpp3/tscv.html)
- Tashman (2000), [Out-of-sample tests of forecasting accuracy](https://doi.org/10.1016/S0169-2070(00)00065-0), International Journal of Forecasting
