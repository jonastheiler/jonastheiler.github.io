# Gradient boosting <Badge type="tip" text="used" />

## The idea

Gradient boosting adds many small decision trees one after another. Each new tree is fit to
the errors of the ensemble so far: more precisely, to the negative gradient of the loss.

It is the default choice for tabular data. It handles mixed scales, missing values,
non-linear effects and interactions with little preprocessing. LightGBM, XGBoost and
CatBoost are the common implementations.

## Look-up

| LightGBM parameter | Effect | Starting point |
|---|---|---|
| `learning_rate` | Step size; smaller needs more trees | 0.05 |
| `n_estimators` + early stopping | Number of trees | Stop on validation loss |
| `num_leaves` | Complexity of each tree | 15–63 |
| `min_child_samples` | Minimum data per leaf; regularizes | 20–100 |
| `subsample`, `colsample_bytree` | Randomness against overfitting | 0.8 |
| `objective` | The loss: `regression`, `binary`, `quantile` (+ `alpha`) | – |

```python
import lightgbm as lgb

model = lgb.LGBMRegressor(objective="quantile", alpha=0.9, learning_rate=0.05,
                          n_estimators=1000, num_leaves=31)
model.fit(X_train, y_train, eval_set=[(X_val, y_val)],
          callbacks=[lgb.early_stopping(50)])
```

- Trees can't extrapolate beyond the target values seen in training. Predicting a
  **residual or correction** to an existing estimate avoids that limit.
- Built-in feature importance by gain is biased. Use permutation importance or SHAP to
  explain a model.
- `subsample` only takes effect together with `subsample_freq > 0`.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): one LightGBM quantile model
  each for the 10%, 50% and 90% quantiles. They predict ECMWF's error, not the temperature,
  and are stored as text files in the repo.

## Sources

- [LightGBM documentation](https://lightgbm.readthedocs.io/)
- Friedman (2001), [Greedy function approximation: a gradient boosting machine](https://doi.org/10.1214/aos/1013203451), Annals of Statistics
- Chen & Guestrin (2016), [XGBoost: a scalable tree boosting system](https://arxiv.org/abs/1603.02754)
