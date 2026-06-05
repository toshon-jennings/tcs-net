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

### D-7 — Who can add documents: a "steward" model
**Chose:** documents get in two ways — staff drop files into **department Google Drive
folders** (picked up automatically), or upload directly in the app. **Only designated
department "stewards" can upload**; everyone else is read-only. Who is a reader, steward, or
admin is controlled entirely through **Google Workspace groups** — the same place the school
already manages its people.
**Why:** keeps the knowledge base **curated and trustworthy** (no free-for-all that fills it
with noise or outdated files), while using tools the school already runs, so there's no separate
user-admin system to maintain. Permissions are enforced on every action, so no one can see or
add beyond their department.
**Trade-off:** a few people carry the upload responsibility, so each department needs at least
one active steward. Sensitive material can be further restricted with an "access level" tag even
inside a department. Detail:
[01-system-architecture.md](01-system-architecture.md#3-data-ingestion-and-management).

### D-8 — Only org-owned Shared Drives, from an explicit allowlist
**Chose:** TCS-Net never scans Google Drive. It reads from a **fixed, admin-approved list** of
**Shared Drives** (one or more per department) — and **never from anyone's personal "My Drive"
folders**. A dedicated read-only account is added only to those specific Shared Drives, which is
the hard technical limit on what it can ever see.
**Why:** (1) **Security** — no chance of accidentally ingesting someone's private or misfiled
files; the system can only see folders it's explicitly been added to. (2) **Continuity** —
Shared Drives are owned by the school, not an individual, so documents don't disappear when a
staff member leaves. (3) **Clean governance** — folder membership is managed centrally and maps
directly to the steward model.
**Trade-off:** stewards must put contributions in the department Shared Drive rather than
sharing a personal folder — a deliberate, healthy constraint. Detail:
[01-system-architecture.md](01-system-architecture.md#3-data-ingestion-and-management).

### D-9 — Stay fully hosted for the preview (revisit self-hosting later)
**Chose:** during the preview, run all AI work through hosted providers (via the OpenRouter
gateway). Don't stand up a school-owned model server (Ollama) yet.
**Why:** no hardware to buy or maintain while we're still proving the idea; faster to launch.
Self-hosting for zero-marginal-cost bulk work stays on the table once real usage justifies the
investment.
**Trade-off:** slightly higher per-use cost than running free models on our own machine —
acceptable at preview scale, and capped by the OpenRouter spending limit.

### D-10 — OpenAI for the podcast voices (premium voices gated)
**Chose:** generate podcast-style audio with OpenAI's text-to-speech by default.
**Why:** inexpensive, good quality, and multi-voice — it fits the budget story. Premium voices
(ElevenLabs) stay available behind an admin flag for flagship content only; Google's TTS
remains a fallback if the school prefers staying in its ecosystem.
**Trade-off:** not the absolute most lifelike voice, but a sensible default that keeps audio
affordable.

### D-11 — A student gate with tickets, behind a one-way door
**Chose:** add a **student gate** where students can get cited self-help and **submit support
tickets** (IT, Facilities, Academic, Wellbeing, Safety, Other), with a **"my tickets"** status
view. Access is **one-way**: students can use only the student gate; **staff can use both
gates**, but students can never reach the staff knowledge base. Who is a student vs. staff comes
from Google Workspace. The **Safety/Wellbeing** category can be submitted **anonymously**.
**Why:** (1) extends the system's value to the whole school, not just staff; (2) self-help
**deflects** easy questions, saving staff time and cost; (3) the one-way gate keeps staff
material strictly out of student reach while letting staff see exactly what students experience;
(4) an anonymous safety channel matters for bullying/safeguarding, where a student may not come
forward if named.
**Trade-off:** more to build and govern (a ticket queue, routing, safeguarding handling), and
student data means extra privacy care — students are minors. Detail:
[05-student-portal-and-gate.md](05-student-portal-and-gate.md).

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
| UX-6 | Brand colours | Adopt City School's navy + gold over a warm "paper" background | Feels TCS-native and trustworthy from day one; the paper background keeps it calm and readable | Built (preview site) |
| UX-7 | Interactive demo | A live, clickable "Ask" panel on the homepage showing the pipeline, a cited answer, and report/podcast outputs | Stakeholders care most about *seeing* the experience — so we show it, not just describe it | Built (preview site) |
| UX-8 | Official logo + favicon | Use The City School's real logo lockup in the header/footer and the arch mark as the favicon | Psychological continuity and comfort — the site reads as genuinely the school's, not a generic tool | Built (preview site) |
| UX-9 | Student portal + "two entrances" | Illustrative student help/ticket panel and a one-way staff/student gate explainer on the homepage | Shows stakeholders the student experience and makes the asymmetric access model easy to grasp | Built (preview site) |

> When a decision changes, add a new row and mark the old one `Superseded by UX-n`.

---

## 4. What's built so far (progress, in plain language)

> A running, dated log of meaningful milestones — written so a stakeholder understands what
> now works, not implementation detail.

| Date | Milestone | What it means for staff |
|------|-----------|--------------------------|
| 2026-06-05 | Architecture, build spec, and cost strategy documented | The plan is set: what we're building, how Claude is used, and how costs stay controlled |
| 2026-06-05 | Hybrid knowledge model decided (curated wiki + document search) | Answers will be more trustworthy and readable, and cheaper to produce per question |
| 2026-06-05 | Stakeholder preview website live (GitHub Pages) | Anyone can visit a site that explains the project and shows the experience |
| 2026-06-05 | Site styled in TCS navy + gold; interactive "Ask" demo added | The preview now looks TCS-native and lets stakeholders *try* the experience — ask a question, see a cited answer, generate a report or audio overview |
| 2026-06-05 | "Trust & access" section added to the site; hosting + podcast-voice decisions locked | Stakeholders can now read the security story on the site; the build stays fully hosted for now with OpenAI voices for audio |
| 2026-06-05 | Official City School logo + favicon applied | The preview now carries the school's real brand, so it feels familiar and trustworthy at first glance |
| 2026-06-05 | Student gate + ticketing designed and shown on the site | Students will be able to get help and submit tickets; staff see both gates, students only theirs (with an anonymous safety option) |

*(Append new milestones as they land.)*

---

## 5. Open questions / decisions still needed

> Things we owe stakeholders a decision on. Keep this honest and current.

- **Custom UI vs. Open Notebook's built-in UI for the real product?** The stakeholder *preview*
  site is custom; the production app's UI approach is still open (branding/control vs. faster
  delivery).

_Resolved:_ self-hosted models → stay fully hosted for now (D-9); podcast voices → OpenAI TTS
(D-10).

---

## 6. Where to find the technical detail

This file is the *story*. The specifications are:
- [01-system-architecture.md](01-system-architecture.md) — how the pieces fit together
- [02-claude-opus-build-spec.md](02-claude-opus-build-spec.md) — how Claude is used
- [03-cost-control-and-model-routing.md](03-cost-control-and-model-routing.md) — how spend stays controlled
