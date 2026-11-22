# Python tooling (uv) <Badge type="tip" text="used" />

## The idea

A reproducible environment and fast feedback. **uv** manages the Python version, the
dependencies, the lock file and running commands. **ruff** lints and formats, **pytest**
tests, and `pyproject.toml` holds the project's metadata.

## Look-up

```bash
uv init --package myproject      # src layout with pyproject.toml
uv add pandas lightgbm           # runtime dependencies
uv add --dev pytest ruff         # development only
uv run pytest                    # runs inside the project environment
uv run ruff check . && uv run ruff format .
uv sync --locked                 # in CI: fail if uv.lock is out of date
```

- Commit `uv.lock`. `pyproject.toml` lists only the direct dependencies.
- Use the `src/` layout and run modules with `uv run python -m package.module`.
- Put heavy dependencies in optional extras, e.g. `[project.optional-dependencies]`
  `finetune = ["torch", "peft"]`, installed with `pip install -e ".[finetune]"`.

## Where I used it

- [lucerne-temp](https://github.com/jonastheiler/lucerne_temp): uv with four runtime
  dependencies. All other lab repos use uv as well.
- [avalanche-llm](https://github.com/jonastheiler/avalanche-llm): a `finetune` extra keeps the
  GPU dependencies out of the normal install.

## Sources

- [uv documentation](https://docs.astral.sh/uv/)
- [Ruff documentation](https://docs.astral.sh/ruff/)
- [Python Packaging User Guide](https://packaging.python.org/)
