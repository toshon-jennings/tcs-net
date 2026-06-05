# AGENTS.md — Instructions for All Agents & Contributors

This file governs how **every** AI agent and human contributor works on this project. Read it
before doing anything. It applies to all agents regardless of vendor or tool.

---

## 0. The one rule you cannot skip: keep the Build Narrative current

[**BUILD-NARRATIVE.md**](BUILD-NARRATIVE.md) is a living, stakeholder-facing record of *what
we're building, why, and how the experience is designed* — written in plain English for
non-technical decision-makers (school leadership, budget owners, staff).

**A task is not "done" until its story is reflected in BUILD-NARRATIVE.md.** Specifically, on
every meaningful change you must:

1. **Log decisions.** Any architectural, product, cost, or vendor decision → add an entry to
   **§2 (big decisions)** with *what you chose, why, and the trade-off*, in plain language.
2. **Log UX/UI decisions.** Any new screen, flow, component, or interaction choice → add a row
   to the **§3 design decisions log** explaining the decision and the stakeholder-friendly
   *why*. Never make a UX choice silently.
3. **Log progress.** Any milestone a stakeholder would care about → add a dated row to
   **§4 (what's built so far)**, described by *what it means for staff*, not implementation
   detail.
4. **Surface open questions.** If you hit a decision that's the org's to make, add it to
   **§5 (open questions)** rather than guessing silently.
5. **Supersede, don't erase.** When a decision changes, mark the old one superseded and add
   the new one — preserve the history of *why* things changed.

Write for a smart non-engineer. No jargon without a plain-English gloss. If a stakeholder read
only BUILD-NARRATIVE.md, they should understand the system, the reasoning, and the experience.

---

## 1. Project context (read these first)

- [BUILD-NARRATIVE.md](BUILD-NARRATIVE.md) — the plain-English story (maintain it; see §0)
- [01-system-architecture.md](01-system-architecture.md) — system design
- [02-claude-opus-build-spec.md](02-claude-opus-build-spec.md) — how Claude is integrated
- [03-cost-control-and-model-routing.md](03-cost-control-and-model-routing.md) — spend strategy
- [04-knowledge-layer-llm-wiki.md](04-knowledge-layer-llm-wiki.md) — hybrid curated-wiki + RAG model

**What we're building:** an internal AI knowledge base for school staff — cited answers over
the school's own documents, formal report generation, and podcast-style audio summaries, with
Google Workspace sign-in, department-scoped access, and tightly controlled costs. Built on
Open Notebook (engine) + a curated LLM-maintained **wiki** layer (hybrid with RAG) + Claude
Opus (premium reasoning) + OpenRouter (billing gateway).

---

## 2. Non-negotiable principles (carry into every decision)

1. **Cost is a first-class constraint.** This org is adopting something new; an unpredictable
   bill kills adoption. Route work to the cheapest model that's good enough (tiers in
   `03-cost-control-and-model-routing.md`), reserve Claude Opus for hard tasks, keep prompt/
   result/audio caching on, and respect the OpenRouter spend cap and per-user quotas. Don't
   introduce a change that meaningfully raises cost without flagging it in BUILD-NARRATIVE.md §5.
2. **Grounded or it doesn't ship.** Answers come only from the provided documents, every claim
   carries a citation, and "not found in your documents" is a valid answer. Never let the model
   fill gaps with ungrounded content. The gateway must verify citations before display.
3. **Privacy by default.** Sensitive school data stays on infrastructure we control; send only
   the minimal retrieved snippets to any external model; prefer self-hosted models for
   PII-heavy or high-volume tasks; never expose Open Notebook/SurrealDB publicly.
4. **Scoped access, enforced server-side.** Department/role permissions come from Google
   Workspace and are enforced at the gateway on every request — a user can never widen their
   own scope.
5. **Familiar UX.** Mirror tools staff already know (NotebookLM, Workspace). Make trust visible
   (citations, sources, not-found states). Keep expensive actions (reports, podcasts) explicit
   and opt-in.
6. **Minimal, non-duplicated code.** Write the smallest change that works; reuse existing
   utilities; match surrounding conventions; no speculative abstraction.

---

## 3. Secrets & safety

- Never commit API keys (Anthropic, OpenRouter, TTS, Google) — use a secret manager / env.
- All model calls happen server-side (gateway or Open Notebook), never from the browser.
- Don't expose internal services publicly; only the auth gateway is internet-facing.

---

## 4. Definition of done (checklist for every change)

- [ ] The change works and matches the specs in §1.
- [ ] Cost impact considered; if non-trivial, noted in BUILD-NARRATIVE.md.
- [ ] Any decision (architecture/product/cost/vendor) logged in BUILD-NARRATIVE.md §2.
- [ ] Any UX/UI decision logged in BUILD-NARRATIVE.md §3.
- [ ] Milestone, if stakeholder-relevant, logged in BUILD-NARRATIVE.md §4.
- [ ] New open questions surfaced in BUILD-NARRATIVE.md §5.
- [ ] No secrets committed; access enforced server-side; answers stay grounded.
