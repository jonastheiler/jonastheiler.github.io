# Model serving <Badge type="tip" text="used" />

## The idea

Serving makes predictions available to other systems. From simplest to most complex: write
predictions to a file on a schedule, call the model as a library, offer an HTTP API, or
process a stream. How fresh the predictions must be decides which one you need.

## Look-up

| Pattern | When | Example |
|---|---|---|
| Batch file | Inputs change daily | A JSON file at a stable URL |
| HTTP API | One prediction per request | `mlflow models serve`, FastAPI |
| Stream | Events need an answer in seconds | Kafka consumer |

```bash
mlflow models serve -m models:/motion-forecast@champion --env-manager uv -p 5001
curl http://127.0.0.1:5001/invocations -H "Content-Type: application/json" \
  -d '{"dataframe_records": [{"type": "Motion", "party": "SVP"}]}'
```

```python
from fastapi import FastAPI

app = FastAPI()
model = mlflow.pyfunc.load_model("models:/motion-forecast@champion")  # load once

@app.post("/predict")
def predict(motion: dict) -> float:
    return float(model.predict(pd.DataFrame([motion]))[0])
```

- Define and validate the input schema, and keep an example request in the tests.
- Load the model once at start-up, and add a health endpoint.

## Where I used it

- [motion-forecast](https://github.com/jonastheiler/motion-forecast): `mlflow models serve`
  turns the champion into an HTTP API that checks each request against the model's schema.
  The alias is read at start-up.
- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): a file instead of an API.
  Forecasts change once a day, so `forecasts/latest.json` serves them.
- [avalanche-api](https://github.com/jonastheiler/avalanche-api): a FastAPI service for an LLM. The model loads in the
  lifespan, every answer is parsed into the Pydantic schema (a 502 otherwise), and requests
  that arrive within 50 ms share one batch.

## Sources

- [MLflow documentation](https://mlflow.org/docs/latest/): deployment
- [FastAPI documentation](https://fastapi.tiangolo.com/)
