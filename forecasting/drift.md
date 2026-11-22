# Drift <Badge type="tip" text="used" />

## The idea

The world keeps changing after a model is trained.

- **Data drift:** the distribution of the inputs shifts.
- **Concept drift:** the relation between inputs and target changes.

Labels often arrive late, so input drift can show up before accuracy can be measured.

## Look-up

| What to watch | How |
|---|---|
| Quality, once labels arrive | Rolling metric against the test score and a live baseline |
| Inputs | Per-feature means and missing rates, PSI, KS test |
| Predictions | Mean prediction, share of positives |
| Uncertainty | Rolling interval coverage |

- **PSI** (population stability index): `Σ (a - e) · ln(a / e)` over bins of the expected
  (`e`) and actual (`a`) shares. As a rule of thumb, above 0.2 is a large shift.
- Pick windows long enough to tell noise from change, and a threshold with a margin.
- Decide in advance what an alarm triggers: retraining, an investigation or a rollback.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): if the live forecast is more
  than 0.1 °C worse than raw ECMWF over the last weeks, or coverage drifts from 80% after
  three weeks, the daily job fails and starts a retrain.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): the live log loss is
  logged next to the champion's test log loss. The labels arrive after a median of 62 days.

## Sources

- Gama et al. (2014), [A survey on concept drift adaptation](https://doi.org/10.1145/2523813), ACM Computing Surveys
- Google Cloud: [MLOps: continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)
