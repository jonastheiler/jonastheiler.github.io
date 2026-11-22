# Swiss data protection (nDSG) <Badge type="warning" text="to learn" />

## The idea

The revised Federal Act on Data Protection (**nDSG / revDSG**) has applied since
1 September 2023. It protects the personal data of natural persons and applies to private
companies and federal bodies. For data science it matters whenever training data, logs or
prompts contain personal data.

*A study summary, not legal advice.*

## Look-up

- **Principles:** lawful, in good faith, proportionate, for a recognisable purpose, correct,
  and secure.
- **Privacy by design and by default:** build protection in from the start, and choose the
  most privacy-friendly settings by default.
- **Duty to inform** when collecting personal data, including about **automated individual
  decisions**, which the person can ask to have reviewed by a human.
- **Sensitive data** (health, genetic and biometric data, religion, criminal records) needs
  extra care.
- **Data protection impact assessment** when processing is likely to pose a high risk.
- **Record of processing activities** (exemptions for small companies with low risk).
- **Data breaches** that pose a high risk must be reported to the FDPIC (EDÖB) as soon as
  possible.
- **Disclosure abroad** is allowed to countries the Federal Council lists as adequate, and
  otherwise needs safeguards such as standard contractual clauses. This matters for cloud
  LLM APIs.
- **Fines** of up to CHF 250,000 can be imposed on the responsible individuals.
- Pseudonymized data is still personal data. Anonymized data is not.

## Where I used it

Not yet in depth. [privacy-gateway](https://github.com/jonastheiler/privacy-gateway) is a
technical measure in the spirit of privacy by design: personal data stays local before text
goes to a cloud LLM.

## Sources

- Fedlex: [Federal Act on Data Protection (FADP)](https://www.fedlex.admin.ch/eli/cc/2022/491/en)
- Swiss FDPIC (EDÖB): [Data protection](https://www.edoeb.admin.ch/)
