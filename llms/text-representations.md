# Text representations: TF-IDF to embeddings <Badge type="tip" text="used" />

## The idea

Models need numbers, so text has to be turned into vectors first.

- **TF-IDF** counts words and weights them by how rare they are. The vectors are sparse and
  transparent, and they keep every single term.
- **Sentence embeddings** come from a pretrained language model. They are dense vectors that
  capture meaning, so similar texts end up close together, even across languages.

Which one wins depends on the task. For classification with thousands of labels, TF-IDF
with a linear model is a strong baseline.

## Look-up

| | TF-IDF | Sentence embeddings | Fine-tuned transformer |
|---|---|---|---|
| Vector | Vocabulary-sized, sparse | 384–1024 dims, dense | – |
| Captures | Exact terms | Meaning, synonyms, other languages | The task itself |
| Cost | Milliseconds on a CPU | A GPU helps | Needs a GPU |
| Labels needed | For the classifier | For the classifier | Many |

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sentence_transformers import SentenceTransformer

X = TfidfVectorizer(min_df=3, ngram_range=(1, 2), sublinear_tf=True).fit_transform(texts)

encoder = SentenceTransformer("intfloat/multilingual-e5-small")
E = encoder.encode(["query: " + t for t in texts], normalize_embeddings=True)
```

- E5 models expect a `query: ` or `passage: ` prefix.
- For normalized vectors, cosine similarity is just the dot product.

## Where I used it

- [motion-forecast](https://github.com/jonastheiler/motion-forecast): TF-IDF (log loss 0.444)
  beat frozen multilingual-e5-small embeddings (0.459) and a fully fine-tuned e5 model
  (0.463). The embedding sums up what a text is about, while word counts let the classifier
  weigh every term.

## Sources

- scikit-learn: [Text feature extraction](https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction)
- [Sentence Transformers documentation](https://www.sbert.net/)
- Wang et al. (2024), [Multilingual E5 text embeddings: a technical report](https://arxiv.org/abs/2402.05672)
