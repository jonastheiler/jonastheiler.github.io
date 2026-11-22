# Monitoring <Badge type="tip" text="used" />

## The idea

After deployment you have to check that the model still works. Score live predictions once
the outcomes arrive, compare them with the offline expectation and with a baseline, and act
when a threshold is crossed. Also check the plumbing: did the job run, and is the data fresh?

## Look-up

| Layer | Examples |
|---|---|
| Pipeline | The job ran, data is fresh, row counts and schema are as expected |
| Inputs | Missing rates, distribution shift (see [Drift](/forecasting/drift)) |
| Outputs | Distribution of the predictions |
| Quality (delayed) | Rolling error and interval coverage against the test score |

- Store every prediction with its time and model version, append only, and score it later.
- Score a **baseline live as well**. It tells you whether the model got worse or the world
  got harder.
- Choose windows and margins so that noise doesn't raise alarms.
- An alarm should trigger something: retraining, a failing job, or a notification.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): every forecast is scored
  daily against the measurement and raw ECMWF, and shown on a dashboard. Stale observations
  stop the forecast. A degraded model fails the job and starts a retrain.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): `forecasts.csv` is
  append-only and dated by git. The live log loss is logged next to the champion's test score.

## Sources

- Google Cloud: [MLOps: continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)
- Chip Huyen (2022), *Designing Machine Learning Systems*, O'Reilly
