# PII detection & pseudonymization <Badge type="tip" text="used" />

## The idea

**Personal data (PII)** identifies a person directly (name, AHV number, IBAN, phone, email,
address) or indirectly.

- **Anonymization** removes the link for good.
- **Pseudonymization** replaces identifiers with placeholders and keeps the mapping
  separately. It can be reversed, so legally the data is still personal data.

Detection combines regex for fixed formats with NER or an LLM for names and addresses.

## Look-up

| Entity | Detect with |
|---|---|
| AHV number (`756.xxxx.xxxx.xx`) | Regex plus EAN-13 check digit |
| IBAN (`CHxx …`) | Regex plus mod-97 check |
| Phone, email | Regex |
| Names, addresses | NER or an LLM, because they depend on context |

```python
import re

AHV = re.compile(r"\b756\.?\d{4}\.?\d{4}\.?\d{2}\b")
IBAN_CH = re.compile(r"\bCH\d{2}(?: ?[0-9A-Z]{4}){4} ?[0-9A-Z]\b")
```

- Use **numbered placeholders** (`<PERSON_1>`), so the mapping can be reversed and every
  mention of a person gets the same one.
- Replace the longest match first, and ignore "found" entities that aren't in the text.
- **Measure leaks:** an entity is protected only if its identifying part is gone. Measure
  utility too: are the facts the task needs still there?
- Indirect identifiers and sensitive content, such as a diagnosis, remain.

## Where I used it

- [privacy-gateway](https://github.com/jonastheiler/privacy-gateway): a local LLM plus regex
  protects 99.3% of entities. The regex catches "Frau Graf" when the LLM misses it, and the
  LLM catches bare names. A cost: `<PERSON_1>` hides the gender, so the cloud model's reply
  loses "Frau/Herr".

## Sources

- [Microsoft Presidio](https://microsoft.github.io/presidio/)
- Swiss FDPIC (EDÖB): [Data protection](https://www.edoeb.admin.ch/)
