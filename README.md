# jonastheiler.github.io

A wiki of what I have learnt as a data scientist, organized in chapters to look things up.
Built with [VitePress](https://vitepress.dev).

## Run it locally

```sh
npm install
npm run dev      # http://localhost:5173
```

## Structure

- One folder per chapter (`statistics/`, `llms/`, ...). Its `index.md` lists the topics,
  and the sidebar is read from that list in `.vitepress/config.mts`.
- Every topic page has the same sections: The idea, Look-up, Where I used it, Sources.
- To add a topic, create the page and add one line to its chapter's `index.md`.
- `public/cards/`: the flashcard app, served as-is at `/cards/`. Cards live in
  `public/cards/cards.js`; progress is tracked with Leitner boxes in the browser.
