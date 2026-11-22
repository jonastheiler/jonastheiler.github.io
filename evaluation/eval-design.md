# Evaluation design <Badge type="tip" text="used" />

## The idea

An evaluation should answer a decision, e.g. *can a small model replace the API?* Design it
backwards from that question: data like the real task, a metric that matches the use,
baselines, a held-out test set and the uncertainty of the result.

For LLMs, also measure format failures, cost and latency.

## Look-up

**Checklist**

1. Write down the decision and the metric **before** running anything.
2. **Data:** representative and labelled. Labels can be free from structured fields, or
   from synthetic data with planted answers.
3. **Splits:** tune prompts and hyperparameters on validation, and use the test set once.
   A test set from after the training period rules out memorization.
4. **Metric:** define exactly what counts as correct, e.g. "type *and* level right" or
   "leaked = the identifying part is still in the text".
5. **Score failures:** invalid output counts as a wrong answer.
6. **Baselines:** rules, regex, a zero-shot API model.
7. **Uncertainty:** bootstrap intervals (see [Confidence intervals](/statistics/confidence-intervals)).
8. **Slices:** per language, entity type or group.
9. **Read examples:** a small table of errors explains more than the average.
10. **Save the predictions**, so re-scoring costs nothing.

For free text, prefer targeted checks (are all facts still there?) over an LLM judge. If you
use a judge, check it against human labels first.

## Where I used it

- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): type + level F1 with
  intervals, results per language, an example bulletin traced through every model, and the
  predictions committed to the repo.
- [privacy-gateway](https://github.com/jonastheiler/privacy-gateway): "protected" means the
  identifying part is gone. Round-trip checks showed 0 of 80 placeholders broken, but the
  salutation surviving in only 15% of replies, down from 91%.

## Sources

- Hamel Husain, [Your AI product needs evals](https://hamel.dev/blog/posts/evals/)
- Liang et al. (2022), [Holistic evaluation of language models](https://arxiv.org/abs/2211.09110)
