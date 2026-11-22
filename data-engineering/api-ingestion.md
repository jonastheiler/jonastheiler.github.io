# API ingestion <Badge type="tip" text="used" />

## The idea

Pulling data from an API reliably takes timeouts, retries with backoff, pagination,
incremental loads, and validation before anything is stored. Each run should be safe to
repeat.

## Look-up

```python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

session = requests.Session()
retry = Retry(total=5, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504])
session.mount("https://", HTTPAdapter(max_retries=retry))

response = session.get(url, params=params, timeout=30)
response.raise_for_status()
data = response.json()
```

- **Incremental:** fetch only since the last stored timestamp, plus a small overlap to catch
  corrections.
- **Idempotent:** running twice gives the same result, e.g. by overwriting a whole partition.
- **Rate limits:** respect `429` and `Retry-After`, and pause between pages.
- **API keys** live in environment variables, never in code.
- Validate before writing (see [Data validation](/data-engineering/data-validation)).

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): MeteoSwiss measurements and
  ECMWF forecasts from Open-Meteo. Each run updates the last 3 days, and temporary errors are
  retried with backoff.
- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): every SLF bulletin since
  November 2023, in four languages.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): about 20,000 Motionen
  and Postulate from the parliament's web service, with an API key in `PARL_API_KEY`.

## Sources

- [Requests documentation](https://requests.readthedocs.io/)
- urllib3: [Retry](https://urllib3.readthedocs.io/en/stable/reference/urllib3.util.html)
