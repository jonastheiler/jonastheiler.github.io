# Model registry <Badge type="tip" text="used" />

## The idea

A registry stores every trained model version with its metadata. An **alias** such as
`champion` points to the version in use, so serving code loads a name, not a file path.
Promoting a model means moving the alias, and rolling back means moving it back.

## Look-up

```python
import mlflow

version = mlflow.register_model(f"runs:/{run_id}/model", "motion-forecast")
client = mlflow.MlflowClient()
client.set_registered_model_alias("motion-forecast", "champion", version.version)

model = mlflow.pyfunc.load_model("models:/motion-forecast@champion")
```

- **Package the preprocessing with the model**, e.g. in a `pyfunc` wrapper, so callers send
  raw inputs.
- Give the model a **signature**, so inputs are checked against a schema.
- Pin only the packages the model needs. By default MLflow may copy the whole lock file.
- Aliases replace the older stages (Staging, Production), which are deprecated.
- A lightweight alternative is a model file plus a model card in git.

## Where I used it

- [motion-forecast](https://github.com/jonastheiler/motion-forecast): each training registers
  the stage that wins on validation. It only takes the `champion` alias if it beats the
  current champion on the test set. A `pyfunc` wrapper accepts a Motion as it comes from
  parliament.
- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): `model/` holds the current
  model and its card, versioned by git.

## Sources

- [MLflow documentation](https://mlflow.org/docs/latest/): Model Registry and pyfunc
