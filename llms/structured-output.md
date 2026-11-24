# Structured JSON output <Badge type="tip" text="used" />

## The idea

To use an LLM's answer in code, the answer has to parse. There are three levels of making
sure it does:

1. **Ask** for JSON in the prompt.
2. **Validate** the answer, and retry or count it as a failure.
3. **Constrain the decoding:** a grammar built from a JSON schema masks every token that
   would break it, so the syntax is always valid.

Valid isn't the same as correct, so the content still needs evaluating.

## Look-up

- Define the schema once, as JSON Schema or a Pydantic model, and keep it small and flat.
  Use enums for categories.
- **Constrained decoding:** llama.cpp takes a `json_schema` or a GBNF grammar, and API
  providers offer structured outputs or tool use.
- Always validate: parse, then check enums and ranges. Score an invalid answer as an empty
  answer, not as a skipped one.
- Let the model **find**, and let code do the deterministic part (replacing, counting,
  arithmetic).

```python
from typing import Literal
from pydantic import BaseModel

class Problem(BaseModel):
    type: Literal["new_snow", "wind_slab", "persistent_weak_layers", "wet_snow", "gliding_snow"]
    danger_level: int

class Bulletin(BaseModel):
    problems: list[Problem]

Bulletin.model_validate_json(answer)   # raises ValidationError if it doesn't fit
Bulletin.model_json_schema()           # the schema to hand to a constrained decoder
```

## Where I used it

- [privacy-gateway](https://github.com/jonastheiler/privacy-gateway): a JSON-schema grammar in
  llama.cpp lifted valid JSON from 32.5% to 100%, at no cost in speed.
- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): without fine-tuning, Qwen
  answered with a list and not JSON, and scored zero. An invalid answer counts as a bulletin
  with no problems.
- [avalanche-api](https://github.com/jonastheiler/avalanche-api): every answer is validated against the Pydantic schema
  before it is returned. An invalid one becomes a 502 that includes the raw output.

## Sources

- llama.cpp: [GBNF grammars](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)
- Willard & Louf (2023), [Efficient guided generation for large language models](https://arxiv.org/abs/2307.09702)
- [Pydantic documentation](https://docs.pydantic.dev/)
