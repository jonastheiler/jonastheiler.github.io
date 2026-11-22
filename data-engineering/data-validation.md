# Data validation <Badge type="tip" text="used" />

## The idea

Check data before using it: schema, ranges, uniqueness and freshness. Fail loudly at the
point of entry instead of training on garbage. A small `validate()` function is often enough.

## Look-up

```python
def validate(df: pd.DataFrame) -> pd.DataFrame:
    problems = []
    if list(df.columns) != ["time", "temp"]:
        problems.append(f"unexpected columns {list(df.columns)}")
    if not df["time"].is_unique:
        problems.append("duplicate timestamps")
    if not df["temp"].between(-40, 45).all():
        problems.append("temperature out of range")
    if df["time"].max() < pd.Timestamp.now(tz="UTC") - pd.Timedelta(days=2):
        problems.append("stale data")
    if problems:
        raise ValueError("; ".join(problems))
    return df
```

- **What to check:** columns and types, missing values, ranges, uniqueness, freshness, and
  row counts against what you expect.
- **Where:** after downloading and before writing, before training, and on every request
  at serving time.
- Use `raise` instead of `assert`, because asserts are skipped with `python -O`.
- When it grows: pandera for DataFrames, Pydantic for single records.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): data is validated before
  anything is written, and stale observations stop the forecast.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): the served model checks
  each request against its input schema.

## Sources

- [pandera documentation](https://pandera.readthedocs.io/)
- [Pydantic documentation](https://docs.pydantic.dev/)
