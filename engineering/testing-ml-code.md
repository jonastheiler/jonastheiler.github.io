# Testing ML code <Badge type="tip" text="used" />

## The idea

Test the deterministic parts and the contracts, not exact model scores. Fast unit tests
cover data handling, features and metrics. Invariant tests catch leakage, and a smoke test
runs training end to end on tiny data.

## Look-up

| Test | Example |
|---|---|
| Unit | A metric on a case computed by hand |
| Data contract | `validate()` rejects a duplicate timestamp |
| Leakage | No feature comes from after the issue time |
| Smoke | Training on 100 rows runs and returns the right shape |
| Serving contract | The model accepts an example request |

```python
def test_no_feature_from_the_future():
    X = build_features(observations, forecasts, issue_time)
    assert (X["source_time"] <= issue_time).all()
```

- Fix seeds, use tiny fixtures, and don't call the network in unit tests.
- Run the tests in CI on every push (see [CI/CD](/engineering/ci-cd)).

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): one test file per module,
  including the leakage test.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): `test_serve.py` checks
  the HTTP contract of the model in-process, without starting a server.
- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): `finetune --smoke` checks the
  GPU setup in a few minutes before the long run.

## Sources

- [pytest documentation](https://docs.pytest.org/)
- Breck et al. (2017), *The ML test score: a rubric for ML production readiness*, IEEE Big Data
