# TCS·Net — Internal AI Knowledge Base

An internal AI knowledge base for school staff: trustworthy, **cited** answers over the
school's own documents, plus formal reports and podcast-style audio summaries — with costs and
privacy under control.

This repository contains the **project specifications** and a **stakeholder preview website**.

## Stakeholder preview site

A multi-page Next.js site that explains the project in plain language for stakeholders
(leadership, budget owners, staff): the story, how it works, key decisions, the cost approach,
and the design.

```bash
npm install
npm run dev      # http://localhost:3000
```

It is deployed to **GitHub Pages** via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
on every push to `main` (static export, served under `/tcs-net/`).

## Specifications

| Doc | What it covers |
|---|---|
| [BUILD-NARRATIVE.md](BUILD-NARRATIVE.md) | Living, plain-English record of decisions, UX, and progress (for stakeholders) |
| [AGENTS.md](AGENTS.md) | Rules every AI agent / contributor follows on this project |
| [01-system-architecture.md](01-system-architecture.md) | How the system fits together |
| [02-claude-opus-build-spec.md](02-claude-opus-build-spec.md) | How Claude is integrated |
| [03-cost-control-and-model-routing.md](03-cost-control-and-model-routing.md) | How spend stays controlled |
| [04-knowledge-layer-llm-wiki.md](04-knowledge-layer-llm-wiki.md) | Hybrid curated-wiki + search model |

## Architecture at a glance

**Open Notebook** (self-hosted knowledge engine) + a curated **LLM-maintained wiki** + **Claude
Opus** (premium reasoning, reserved for hard tasks) + **OpenRouter** (one billing gateway with a
hard spend cap), on **Google Workspace** identity.

## Tech stack (preview site)

Next.js (App Router, static export) · TypeScript · Tailwind CSS v4 · deployed on GitHub Pages.
