# Prompting <Badge type="tip" text="used" />

## The idea

A prompt is a specification: the task, the rules, the output format, examples, and the
input. Develop prompts the way you develop models: against a validation set and a metric,
never on the test set.

## Look-up

- **Order:** context → task → rules → output format → examples → input.
- **Zero-shot or few-shot:** examples show the format and the edge cases. Pick varied
  examples from the training data, never from the test set.
- **Delimit the input**, e.g. `<bulletin>…</bulletin>`, so the model can tell it apart
  from the instructions.
- **Ask for exactly one output format**, parse it strictly, and count the failures (see
  [Structured JSON output](/llms/structured-output)).
- **Version prompts in git** and log the prompt version with every result.

```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY
message = client.messages.create(
    model="claude-haiku-5-5",
    max_tokens=1024,
    system="You extract avalanche problems from a bulletin as JSON.",
    messages=[{"role": "user", "content": f"<bulletin>{text}</bulletin>"}],
)
answer = message.content[0].text
```

## Where I used it

- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): Haiku zero-shot (F1 0.597)
  against 5-shot (0.610). The prompts were tuned on a separate validation sample.
- [privacy-gateway](https://github.com/jonastheiler/privacy-gateway): the local model is only
  asked to list the entities it finds. Code does the replacement.

## Sources

- Anthropic: [Prompt engineering overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- Brown et al. (2020), [Language models are few-shot learners](https://arxiv.org/abs/2005.14165)
