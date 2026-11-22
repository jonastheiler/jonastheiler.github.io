# Fine-tuning with LoRA <Badge type="tip" text="used" />

## The idea

Fine-tuning adapts a pretrained model to a task using labelled examples.

**LoRA** (low-rank adaptation) freezes the original weights and learns a small update
`ΔW = B·A` of low rank `r` for selected layers. That trains well under 1% of the
parameters, produces an adapter file of a few megabytes, and fits on a free GPU.
**QLoRA** also loads the frozen base model in 4-bit to save memory.

## Look-up

| Hyperparameter | Meaning | Typical |
|---|---|---|
| `r` | Rank of the update | 8–32 |
| `lora_alpha` | Scale; the update is multiplied by `alpha / r` | 2 × `r` |
| `target_modules` | Which layers get adapters | Attention projections, optionally the MLP |
| Learning rate | Higher than for full fine-tuning | 1e-4 to 2e-4 |
| Epochs | Few; watch the validation loss | 1–3 |

```python
from peft import LoraConfig, get_peft_model

config = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05, task_type="CAUSAL_LM",
                    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"])
model = get_peft_model(base_model, config)
model.print_trainable_parameters()
```

- Train on exactly the prompt format used at inference, and compute the loss only on the
  answer tokens.
- Draw a **learning curve** (e.g. 100, 300, 1,000 examples) to see whether more labels
  would pay off.
- Usually the labels, not the GPU, are the main cost.

## Where I used it

- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): Qwen3-1.7B with LoRA on 100,
  300 and 1,000 examples on a free Kaggle T4, about 40 minutes for 1,000. F1 rose from 0.367
  to 0.516 to 0.612, level with Claude Haiku.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast), for contrast: fully
  fine-tuning a small encoder did no better than its frozen embeddings (0.463 vs 0.459), and
  early stopping halted it after 2 epochs.

## Sources

- Hu et al. (2021), [LoRA: low-rank adaptation of large language models](https://arxiv.org/abs/2106.09685)
- Dettmers et al. (2023), [QLoRA: efficient finetuning of quantized LLMs](https://arxiv.org/abs/2305.14314)
- Hugging Face: [PEFT documentation](https://huggingface.co/docs/peft)
