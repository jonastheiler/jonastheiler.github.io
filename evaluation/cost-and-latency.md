# Cost & latency <Badge type="tip" text="used" />

## The idea

Cost and speed often decide between models as much as accuracy does. Measure them like
quality: per unit of work (e.g. per 1,000 documents), on the target hardware, and with the
median and the tail.

## Look-up

- **API cost** = input tokens × input price + output tokens × output price. Few-shot
  examples raise the input tokens, and prompt caching makes a repeated prefix cheaper.
- **Self-hosted cost** = hours × hourly price, plus training once, plus operations.
- **Latency:** report the median and the 95th percentile. For generation, separate the time
  to the first token from the total time.
- The length of the output dominates generation time, so keep the output format short.
- Batch offline jobs: batch APIs are cheaper, and GPUs process requests in batches.

```python
import time

times = []
for doc in docs:
    t0 = time.perf_counter()
    run(doc)
    times.append(time.perf_counter() - t0)
print(np.median(times), np.percentile(times, 95))
```

The token counts of an API call are in `message.usage.input_tokens` and
`message.usage.output_tokens`.

## Where I used it

- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): US$ per 1,000 bulletins.
  For Claude this is the API price, and for Qwen the inference time on a T4 at US$0.40 per hour.
- [privacy-gateway](https://github.com/jonastheiler/privacy-gateway): the median seconds per
  document for each model size and quantization level.

## Sources

- Anthropic: [Pricing](https://www.anthropic.com/pricing)
- Anthropic: [Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
