# Baselines <Badge type="tip" text="used" />

## The idea

A baseline is the simplest reasonable answer to the problem. It sets the bar a more complex
model has to clear to justify itself, and it catches bugs. A model that is worse than its
baseline is either broken or working on a problem with little signal.

## Look-up

| Task | Baselines |
|---|---|
| Classification | Majority class; the class frequency as the probability |
| Regression | Mean or median |
| Forecasting | Persistence (last value), seasonal naive, an existing physical model |
| Text extraction | Keyword rules, regular expressions |
| LLM task | A zero-shot prompt to an API model |

```python
from sklearn.dummy import DummyClassifier

DummyClassifier(strategy="prior").fit(X_train, y_train)  # predicts the base rate
```

- Make the baseline **cheap but strong**. "Existing model plus its typical error for that
  hour" is much harder to beat than the raw model.
- Put the baseline in the same table, scored on the same test set with the same metric.
- Report where the baseline is good: it shows which part of the task is easy.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): raw ECMWF (MAE 1.50 °C) and
  ECMWF plus the typical error per hour (1.42 °C), against 1.22 °C for the model.
- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): keyword rules find the
  problem type almost as well as Haiku, but get the danger level right only a third of the
  time.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): always 20%, log loss
  0.506.
- [privacy-gateway](https://github.com/jonastheiler/privacy-gateway): regex alone protects
  62% of entities.

## Sources

- Hyndman & Athanasopoulos, [Forecasting: Principles and Practice, simple methods](https://otexts.com/fpp3/simple-methods.html)
- Google: [Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml)
