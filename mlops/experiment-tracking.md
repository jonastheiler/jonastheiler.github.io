# Experiment tracking <Badge type="tip" text="used" />

## The idea

Every training run records its parameters, metrics, data version, code version and
artifacts. That makes results comparable and reproducible, and replaces spreadsheets and
file names like `model_final_v3.pkl`.

## Look-up

```python
import mlflow

mlflow.set_tracking_uri("sqlite:///mlflow.db")
mlflow.set_experiment("motion-forecast")

with mlflow.start_run(run_name="tfidf+metadata"):
    mlflow.log_params({"C": 1.0, "min_df": 3})
    mlflow.log_input(mlflow.data.from_pandas(train_df), context="training")
    mlflow.log_metric("val_log_loss", 0.42)
    mlflow.log_figure(fig, "calibration.png")
```

- **Nested runs** for a hyperparameter search: `mlflow.start_run(nested=True)` inside the
  parent run.
- Compare runs in `mlflow ui`, at `http://localhost:5000` by default.
- **Autologging** is convenient but can be slow, because it scores and plots the training
  data. Log what you need.
- Alternatives: Weights & Biases, or for a small project, reports committed to git.

## Where I used it

- [motion-forecast](https://github.com/jonastheiler/motion-forecast): one run per stage of the
  model ladder, with a nested run per hyperparameter setting. Each run logs a data digest, a
  calibration plot and a per-party table. Autologging made runs about 7× slower.
- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp), without a tracker: a model
  card and a backtest report in Markdown, versioned in git.

## Sources

- [MLflow documentation](https://mlflow.org/docs/latest/)
