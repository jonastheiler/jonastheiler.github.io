# File formats <Badge type="tip" text="used" />

## The idea

The format decides how fast data loads, whether types survive, and how readable it is.
**Parquet** is the default for analytical data: columnar, typed and compressed. CSV and JSON
remain for exchange and for files people read.

## Look-up

| Format | Strengths | Use for |
|---|---|---|
| CSV | Readable everywhere, clean git diffs | Small tables, append-only logs |
| JSON / JSON Lines | Nested records, one record per line | API data, documents, predictions |
| Parquet | Columnar, typed, compressed, reads only the needed columns | Analytical tables |
| Arrow / Feather | In-memory format, very fast to read | Exchange between tools |

```python
df.to_parquet("data/observations/2026-11.parquet", index=False)
df = pd.read_parquet("data/observations/")        # reads every file in the folder
records = pd.read_json("data/docs.jsonl", lines=True)
```

- **Partition** by time (e.g. one file per month), so an update rewrites one small file.
- Parquet keeps the types, including time zones. CSV turns everything into text.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): observations and forecasts as
  monthly Parquet files in the repo.
- [motion-forecast](https://github.com/jonastheiler/motion-forecast): the data as Parquet,
  and live forecasts as an append-only CSV that is easy to read in git.
- [privacy-gateway](https://github.com/jonastheiler/privacy-gateway): documents as JSON Lines.

## Sources

- [Apache Parquet documentation](https://parquet.apache.org/docs/)
- [Apache Arrow documentation](https://arrow.apache.org/docs/)
