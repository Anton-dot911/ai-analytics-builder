# AI Analytics Builder PWA

Local-first Engineering Console for building a production-oriented AI Analytics Tool.

## Runtime principles

- No backend required.
- No hosting provider required.
- Deterministic analytics runs in the browser.
- Project metadata remains in localStorage; datasets, analyses and evidence use IndexedDB.
- AI is optional and accessed through a provider adapter.
- The core does not depend on OpenAI, Anthropic, OpenRouter, Ollama, Netlify or another provider.

## Current pipeline

CSV → schema inference → profiling → quality checks → deterministic metrics → verified evidence

The next layers are Analysis DSL, Investigation Engine, richer evidence graphs and AI interpretation.

## Optional AI

The current UI accepts any OpenAI-compatible chat-completions endpoint. Examples include a local Ollama endpoint or a compatible gateway. Browser-side provider calls are intentionally optional; API keys entered in the UI are stored locally in browser state and should only be used on a trusted machine.

## Run locally

```bash
npm run dev
```

Then open `http://localhost:4173`.

A simple static server is used deliberately. Netlify is not part of the runtime or development requirement.
