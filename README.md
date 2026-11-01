# Khamis.AI · RAG Tool Recommender

A standalone, static build of the **Tool Recommender** from [Khamis.AI](https://github.com/MohammedKhames/Khamis.ai):

- the interactive **10-stage RAG wheel**
- the **guided stage pages** (answer a few questions, get a tool recommendation and code example)
- the **Embedding Advisor** (embedded on stage 5)

Arabic (RTL) and English, light and dark theme. No build step and no dependencies.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

`vercel.json` is included; import the repo into Vercel as a static site (no framework, output directory `.`).

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Shell page: wheel, stage pages, embedded advisor |
| `explorer.js` | Main app logic; default view is the stages wheel (`stagesHome`) |
| `stubs.js` | No-op `window.Khamis*` stand-ins for modules not included in this build |
| `code-examples.js` | Code snippet generator for recommendations |
| `embedding-advisor.html`, `app.js`, `engine.js`, `translations.js` | Embedding Advisor |
| `style.css`, `appearance.css`, `theme.css`, `brand.css`, `advisor-appearance.css`, `brand/` | Styling and branding |

`stubs.js` must load before `code-examples.js` and `explorer.js`.
