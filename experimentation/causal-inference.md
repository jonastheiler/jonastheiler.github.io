# Causal inference <Badge type="warning" text="to learn" />

## The idea

Prediction asks *what will happen*. Causal inference asks *what would happen if we
changed something*. Without randomization, a correlation can come from a **confounder**
that drives both the cause and the outcome.

Causal methods make the assumptions explicit, usually as a graph, and adjust for them.

## Look-up

- **Potential outcomes:** every unit has an outcome with treatment and one without. Only one
  is ever observed, so effects are estimated on groups.
- **DAG** (directed acyclic graph): draw what causes what. Adjust for confounders, but not
  for mediators or colliders.
- **Randomized experiments** are the gold standard (see [A/B tests](/experimentation/ab-tests)).

| Method | Idea | Needs |
|---|---|---|
| Regression adjustment, matching, inverse propensity weighting | Compare like with like | All confounders measured |
| Difference-in-differences | Compare the change in a treated group with the change in a control group | Parallel trends |
| Regression discontinuity | Compare just above and just below a cut-off | A sharp threshold rule |
| Instrumental variables | Use a variable that only affects the outcome through the treatment | A valid instrument |
| Synthetic control | Build the treated unit's counterfactual from similar units | A long pre-period |

**Pitfall:** a feature that predicts well is not a lever. In a prediction model, party
predicts acceptance, but that doesn't show that switching party would change the answer.

## Where I used it

Not yet. [motion-forecast](https://github.com/jonastheiler/motion-forecast) is a reminder of
the difference: it predicts well, but it explains nothing causally.

## Sources

- Hernán & Robins, [Causal Inference: What If](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/)
- Cunningham, [Causal Inference: The Mixtape](https://mixtape.scunning.com/)
- [DoWhy documentation](https://www.pywhy.org/dowhy/)
