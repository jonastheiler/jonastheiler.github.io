# Quantization & local inference <Badge type="tip" text="used" />

## The idea

Running an open-weight model on your own hardware keeps the data local, costs nothing per
token and works offline.

**Quantization** stores the weights in fewer bits, e.g. 4 instead of 16. That cuts memory
about 4× and speeds up CPU inference, at some cost in quality. **llama.cpp** runs quantized
**GGUF** files on CPUs and serves them over an OpenAI-compatible API.

## Look-up

- **Memory** ≈ parameters × bits / 8, plus the context cache. A 1.7B model needs about 1 GB
  at 4-bit and 3.4 GB at 16-bit.
- **GGUF quantization levels:** `Q4_K_M` is a good default, `Q5_K_M` is a bit better, and
  `Q8_0` is close to lossless.
- **Size beats bits:** a larger model at Q4 often beats a smaller one at Q8.
- Measure latency on the target hardware. Docker limits (`--cpus`, `--memory`) simulate a
  small server.

```bash
docker run -p 8080:8080 ghcr.io/ggml-org/llama.cpp:server \
  -hf unsloth/Qwen3-1.7B-GGUF:Q4_K_M --host 0.0.0.0 --port 8080
```

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8080/v1", api_key="none")
reply = client.chat.completions.create(model="local", messages=[{"role": "user", "content": "Hi"}])
```

## Where I used it

- [privacy-gateway](https://github.com/jonastheiler/privacy-gateway): llama.cpp in Docker,
  capped at 4 CPUs and 4 GB RAM. 1.7B Q4 takes 4.8 s per document. Q8 adds 3.7 points for
  twice the latency, and 4B adds 6 points for 2.5 times. The 0.6B model never finds an IBAN.

## Sources

- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- Hugging Face: [GGUF](https://huggingface.co/docs/hub/gguf)
