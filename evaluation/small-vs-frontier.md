# Small vs. frontier models <Badge type="tip" text="used" />

## The idea

Large API models are strong out of the box, cost money per token, and the data leaves your
network. Small open models are weak out of the box, but after fine-tuning they can match a
large model on a narrow task, and you decide where they run.

The choice depends on quality on *your* task, the labels needed, cost, latency, privacy and
maintenance.

## Look-up

| | Frontier API | Small open model |
|---|---|---|
| Getting started | A prompt, minutes | Labels plus fine-tuning |
| Quality | Strong on everything | Strong on one task after fine-tuning |
| Cost | Per token | Hardware time plus operations |
| Data | Leaves your network | Stays local |
| Model changes | When the provider changes it | When you choose |

- A **learning curve** shows how many labels the small model needs.
- Compare on the same test set and metric, with intervals.
- **Hybrid:** a local model handles the sensitive step, and a frontier model the hard
  reasoning.

## Where I used it

- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): Qwen3-1.7B with 1,000
  examples ties Claude Haiku at about the same cost (US$0.13 per 1,000 bulletins). The case
  for the small model is control, not price.
- [privacy-gateway](https://github.com/jonastheiler/privacy-gateway): the hybrid pattern. A
  local model pseudonymizes, and the cloud model does the task.

## Sources

- Zhao et al. (2024), [LoRA Land: 310 fine-tuned LLMs that rival GPT-4](https://arxiv.org/abs/2405.00732)
