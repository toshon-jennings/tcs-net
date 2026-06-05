# Build Narrative — Internal AI Knowledge Base

> **What this file is.** A living, plain-English record of *what we're building, why, and what
> decisions we've made* — written for stakeholders (school leadership, budget owners, staff),
> not just engineers. If a non-technical decision-maker reads only this file, they should
> understand the system, the reasoning behind it, and how the experience is designed.
>
> **This file is mandatory and always-current.** Every agent and contributor updates it as
> part of doing the work — see [AGENTS.md](AGENTS.md). A change isn't "done" until its story is
> here.

---

## 1. The one-paragraph summary (for a busy stakeholder)

We're building an internal AI knowledge base for school staff. Staff ask questions in plain
language and get trustworthy, **cited** answers drawn only from the school's own documents —
plus the ability to generate formal **reports** and **podcast-style audio summaries**. It signs
in with the Google accounts staff already use, only shows people what their department/role
allows, and is built to keep **costs predictable and low** so it's sustainable to adopt.

---

## 2. Why we're building it this way (the big decisions, in plain language)

Each decision below records **what we chose**, **why**, and **what we gave up**. New decisions
get appended; superseded ones are struck through, not deleted.

### D-1 — Use Open Notebook as the knowledge engine
**Chose:** an open-source, self-hostable tool (Open Notebook) as the core engine for search,
citations, and audio summaries, instead of a single cloud vendor's product.
**Why:** the school's documents stay on infrastructure we control (privacy), we're not locked
to one vendor's pricing, and it natively supports multi-speaker audio summaries.
**Trade-off:** we run and maintain a bit more infrastructure ourselves.

### D-2 — Claude Opus for the hard thinking, cheaper models for everything else
**Chose:** route each task to the cheapest model that's good enough; reserve the premium model
(Claude Opus) only for formal reports and complex synthesis.
**Why:** quality where it matters, without paying premium prices for simple questions.
**Trade-off:** slightly more routing logic to maintain.

### D-3 — OpenRouter as the billing gateway, with a hard spending cap
**Chose:** send AI requests through OpenRouter, which gives us one bill, access to many models,
and a monthly spending ceiling that **cannot be exceeded**.
**Why:** cost predictability is essential to getting the org to adopt this; one dial controls
the maximum possible spend.
**Trade-off:** a small price markup vs. going direct to each provider.

### D-4 — Google Workspace for sign-in and permissions
**Chose:** staff log in with their existing school Google accounts; their department/role
controls what they can see.
**Why:** no new passwords, familiar experience, leverages permissions the school already manages.
**Trade-off:** depends on Google Workspace being the identity system (it already is).

### D-5 — "Grounded or it doesn't ship" — every claim shows its source
**Chose:** the system only answers from the provided documents and shows a citation for every
claim; "I couldn't find that in your documents" is an expected, acceptable answer.
**Why:** trust. Staff need to believe the answers, and verify them.
**Trade-off:** the system sometimes says "not found" instead of guessing — by design.

### D-6 — Hybrid knowledge model: a curated "wiki" plus search
**Chose:** in addition to searching raw documents, the system maintains a curated, AI-written
**wiki** of the school's most important, frequently-asked knowledge (policies, procedures,
FAQs) — readable markdown pages with citations and contradiction flags. Search over raw
documents still covers everything else. (Based on Karpathy's "LLM Wiki" pattern.)
**Why:** (1) **Trust** — staff and leaders can *read* the curated pages, not just trust an
opaque search box. (2) **Cost** — answering from concise curated pages is cheaper than
re-reading large raw documents on every question; the costly upkeep runs only when documents
change, on cheap models. (3) It improves over time as good answers get filed back in.
**Trade-off:** someone has to review the wiki when the AI flags a contradiction or a big
rewrite — a deliberate "human-in-the-loop" trust gate — and it's a newer approach than plain
search, so we phase it in. Detail: [04-knowledge-layer-llm-wiki.md](04-knowledge-layer-llm-wiki.md).

---

## 3. How the experience is designed (UX/UI decisions)

> This section explains *why the interface looks and behaves the way it does*. Update it
> whenever a screen, flow, or interaction decision is made.

### Guiding UX principles
- **Familiar, not novel.** Model the experience on tools staff already know (NotebookLM,
  Google Workspace) so there's almost nothing to learn.
- **Trust is visible.** Citations, source links, and "not found" states are front-and-center —
  the UI's job is to make answers verifiable, not just impressive.
- **Scoped by default.** People see their own department's content automatically; they never
  have to think about permissions to stay safe.
- **Cost-aware by design.** Expensive actions (formal reports, podcasts) are deliberate,
  opt-in steps — not things that fire on every keystroke.

### Screen / interaction decisions log
*(Append entries as design decisions are made. Template below.)*

| ID | Screen / element | Decision | Why (stakeholder-friendly) | Status |
|----|------------------|----------|----------------------------|--------|
| UX-1 | Search bar | Single prominent natural-language box on the home screen | Lowest-friction entry point; mirrors what staff expect | Planned |
| UX-2 | Answer view | Inline citations linking back to the source document | Makes every answer verifiable; builds trust | Planned |
| UX-3 | Department filter | Pre-set to the user's department; cross-dept only if role allows | Safe by default; no permissions to think about | Planned |
| UX-4 | "Generate report" | Explicit button, not automatic | Keeps premium-cost actions deliberate | Planned |
| UX-5 | "Generate podcast" | Explicit button with length cap | Audio is opt-in; controls the sneakiest cost | Planned |

> When a decision changes, add a new row and mark the old one `Superseded by UX-n`.

---

## 4. What's built so far (progress, in plain language)

> A running, dated log of meaningful milestones — written so a stakeholder understands what
> now works, not implementation detail.

| Date | Milestone | What it means for staff |
|------|-----------|--------------------------|
| 2026-06-05 | Architecture, build spec, and cost strategy documented | The plan is set: what we're building, how Claude is used, and how costs stay controlled |
| 2026-06-05 | Hybrid knowledge model decided (curated wiki + document search) | Answers will be more trustworthy and readable, and cheaper to produce per question |

*(Append new milestones as they land.)*

---

## 5. Open questions / decisions still needed

> Things we owe stakeholders a decision on. Keep this honest and current.

- **Self-hosted models (Ollama)?** Stand up a small GPU box for zero-marginal-cost bulk tasks,
  or stay fully hosted for the preview? *(Affects cost and hardware.)*
- **Custom UI vs. Open Notebook's built-in UI?** More branding/control vs. faster delivery.
- **TTS provider for podcasts?** Cheaper default (OpenAI) vs. premium voices (ElevenLabs) vs.
  staying in Google's ecosystem.

---

## 6. Where to find the technical detail

This file is the *story*. The specifications are:
- [01-system-architecture.md](01-system-architecture.md) — how the pieces fit together
- [02-claude-opus-build-spec.md](02-claude-opus-build-spec.md) — how Claude is used
- [03-cost-control-and-model-routing.md](03-cost-control-and-model-routing.md) — how spend stays controlled
