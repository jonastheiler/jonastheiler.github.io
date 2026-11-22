import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitepress'

const root = new URL('../', import.meta.url)

const chapters = [
  'statistics',
  'machine-learning',
  'forecasting',
  'llms',
  'evaluation',
  'mlops',
  'engineering',
  'data-engineering',
  'privacy',
  'experimentation',
]

// The sidebar is read from each chapter's index.md, so its topic list is the only place to edit.
function chapter(dir: string) {
  const md = readFileSync(new URL(`${dir}/index.md`, root), 'utf8')
  const title = md.match(/^# (.+)$/m)![1]
  const items = [...md.matchAll(/^- \[(.+)\]\(\.\/(.+)\)$/gm)].map(([, text, slug]) => ({
    text,
    link: `/${dir}/${slug}`,
  }))
  return { text: title, link: `/${dir}/`, collapsed: false, items }
}

export default defineConfig({
  title: 'Jonas Theiler',
  description: 'What I have learnt as a data scientist, organized to look things up.',
  cleanUrls: true,
  srcExclude: ['README.md'],
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: 'Projects', link: '/projects' },
      // The cards are a standalone HTML app in public/, so skip the SPA router.
      { text: 'Cards', link: '/cards/index.html', target: '_self' },
    ],
    sidebar: chapters.map(chapter),
    outline: 'deep',
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/jonastheiler' }],
  },
})
