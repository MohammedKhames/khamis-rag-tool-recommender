<div align="center">

<img src="logo.svg" alt="Khamis.AI" width="84" height="84">

# Khamis - RAG Tool Recommender

**Pick the right tool for every stage of your RAG pipeline — in a few clicks.**

An interactive 10-stage RAG wheel, guided recommendation pages with ready-to-run code, and an Embedding Advisor. Arabic (RTL) and English, light and dark. Zero dependencies, zero build.

[Run locally](#run-locally) · [How it works](#how-it-works) · [Deploy](#deploy) · [العربية](#بالعربي)

</div>

<img width="1181" height="832" alt="image" src="https://github.com/user-attachments/assets/25714648-d87f-4e9c-be4b-b683e57bef41" />

---

## What it is

A standalone extract of the **Tool Recommender** from [Khamis.AI](https://github.com/MohammedKhames/Khamis.ai). You click a stage on the RAG wheel, answer a handful of questions about your project, and get a recommended tool plus a code snippet you can copy.

- **10-stage RAG wheel**: an animated orbit that links to every stage of the pipeline.
- **Guided stage pages**: short questionnaires that update the recommendation instantly as you change your answers. Each recommendation comes with an install command and code (direct SDK and LangChain variants where relevant).
- **Embedding Advisor**: a dedicated advisor for stage 4 that ranks embedding models by your data language, task, runtime (local or API), hardware, privacy needs, text length and priority (speed, balance or quality).
- **Bilingual**: Arabic (RTL) and English, switchable at any time, and a light/dark theme. Choices are remembered in the browser.

## The 10 stages

| # | Stage | What you decide |
| --- | --- | --- |
| 1 | Data Ingestion | How to connect and load your knowledge sources |
| 2 | Preprocessing | How to clean text while keeping structure |
| 3 | Chunking | How to split documents into retrievable pieces |
| 4 | Embedding | Which model turns text into vectors (**Embedding Advisor**) |
| 5 | Vector Database | Where to store and search the vectors |
| 6 | Retrieval | How to pull the most relevant passages |
| 7 | Reranking | How to reorder results for precision |
| 8 | Prompt Construction | How to combine the question and the context |
| 9 | Generation (LLM) | Which model writes the grounded answer |
| 10 | Evaluation & Optimization | How to measure and improve quality |

## Run locally

It is plain static HTML, CSS and JavaScript, so any static server works:

```bash
git clone https://github.com/MohammedKhames/khamis-rag-tool-recommender.git
cd khamis-rag-tool-recommender
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Use a local server rather than opening `index.html` from disk, because the Embedding Advisor is loaded in an iframe.

## How it works

```
index.html ── stubs.js ── code-examples.js ── explorer.js
                                                  │
                                                  └── iframe → embedding-advisor.html
                                                               (app.js · engine.js · translations.js)
```

- `explorer.js` drives the wheel, stage pages, recommendations, language/theme state and URL hashes (`#stages`, `#stage-1` … `#stage-10`). The default view is the wheel (`stagesHome`), and unknown hashes fall back to it.
- `code-examples.js` generates the install command and code snippet for each recommendation.
- `embedding-advisor.html` is a self-contained page. It talks to the parent page via `postMessage` to sync language, theme and height, and to report the model you picked so later stages (such as the vector database) can use its dimension.
- `stubs.js` provides no-op `window.KhamisSimulation`, `KhamisEcosystems`, `KhamisMathSkills`, `KhamisComplexity`, `KhamisResources` and `KhamisHomeMap`. The original site has those modules; this standalone build does not, and `explorer.js` still calls them. It must load before `code-examples.js` and `explorer.js`.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | App shell: wheel, stage pages, embedded advisor |
| `explorer.js` | Main logic, content, routing |
| `stubs.js` | No-op stand-ins for modules not in this build |
| `code-examples.js` | Code snippet generator |
| `embedding-advisor.html` | Embedding Advisor page |
| `app.js`, `engine.js`, `translations.js` | Advisor UI, scoring engine, strings |
| `style.css`, `appearance.css` | Main app styling |
| `theme.css`, `brand.css`, `advisor-appearance.css` | Advisor styling and branding |
| `brand/` | Brand assets (orbit art, preview) |
| `logo.svg`, `favicon.svg` | Logo and favicon |
| `vercel.json` | Static hosting config and security headers |

## Deploy

No build step is needed. On [Vercel](https://vercel.com), import the repository as a static site. `vercel.json` already sets no framework, the output directory `.` and basic security headers. Any static host (GitHub Pages, Netlify, Cloudflare Pages) also works.

## Notes

- Fonts (IBM Plex Sans Arabic, Inter) load from Google Fonts. Without network access the page falls back to system fonts.
- Recommendations are guidance for choosing a starting point, not benchmarks. Always check each tool's own docs for current versions and pricing.

## بالعربي

**Khamis.AI · موصي أدوات RAG** نسخة مستقلة من «Tool Recommender» في موقع Khamis.AI. بتختار مرحلة من دايرة RAG العشر مراحل، وتجاوب على أسئلة بسيطة عن مشروعك، فتطلعلك الأداة المناسبة مع كود جاهز للنسخ، ومعاها **مستشار الـ Embedding** لاختيار موديل التمثيل المتجهي. الموقع بيدعم العربي والإنجليزي والوضع الفاتح والداكن، ومفيش أي بناء أو تبعيات: شغّله بأي سيرفر ثابت (`python3 -m http.server`).

## Credits

Built by [Mohammed Khamis](https://github.com/MohammedKhames) as part of [Khamis.AI](https://github.com/MohammedKhames/Khamis.ai).
