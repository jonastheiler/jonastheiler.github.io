# SQL <Badge type="tip" text="used" />

## The idea

SQL is still the common language for data. The core is filtering, joins, aggregation and
window functions. PostgreSQL is the typical database behind applications, and DuckDB runs
fast analytical SQL directly on local files.

## Look-up

```sql
-- Aggregate per group
SELECT party, COUNT(*) AS n, AVG(accepted::int) AS accept_rate
FROM motions
GROUP BY party
ORDER BY accept_rate DESC;

-- Window function: rolling 24-hour mean error
SELECT time,
       AVG(abs_error) OVER (ORDER BY time ROWS BETWEEN 23 PRECEDING AND CURRENT ROW) AS mae_24h
FROM forecasts;

-- Latest row per group (PostgreSQL)
SELECT DISTINCT ON (station) *
FROM observations
ORDER BY station, time DESC;

-- Step by step with CTEs
WITH recent AS (SELECT * FROM forecasts WHERE time > now() - interval '7 days')
SELECT AVG(abs_error) FROM recent;
```

```python
import duckdb

duckdb.sql("SELECT AVG(temp) FROM 'data/observations/*.parquet'").df()
```

- `NULL = NULL` is not true but `NULL`, so use `IS NULL`.
- Index the columns you filter and join on, and read the query plan with `EXPLAIN`.

## Where I used it

- [shiny-k8s-lab](https://github.com/jonastheiler/shiny-k8s-lab): a PostgreSQL schema from
  `init.sql`, queried with `psql` inside the cluster.

## Sources

- PostgreSQL: [Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [DuckDB documentation](https://duckdb.org/docs/)
- [Use The Index, Luke](https://use-the-index-luke.com/)
