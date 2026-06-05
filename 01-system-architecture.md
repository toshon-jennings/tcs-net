# Internal AI Knowledge Base — System Architecture (Revised)

> **Revision note.** This supersedes the original *Internal AI Knowledge Base System
> Architecture*. The core change: the NotebookLM-style engine is now
> [**Open Notebook**](https://github.com/lfnovo/open-notebook) (open-source, self-hostable,
> privacy-focused), with **Claude Opus** as the primary reasoning/report-generation LLM.
> Google Workspace is retained for **identity (SSO/RBAC)** and as a **document source**,
> but we no longer hard-depend on Vertex AI Search or Gemini TTS. This removes single-vendor
> lock-in, gives us multi-speaker (1–4) podcasts, keeps sensitive school data inside
> infrastructure we control, and lets us swap providers per task (cost vs. quality).

## 1. Overview

An internal AI knowledge base for school staff that delivers **department-scoped answers**,
**generated reports**, and **podcast-style audio summaries** over documents the school already
owns. Staff interact through a clean, NotebookLM-like web UI. The system is built around
Open Notebook as the retrieval + synthesis + podcast engine, Claude Opus as the high-quality
reasoning layer, and Google Workspace for authentication and content ingestion.

Design priorities, in order: **data privacy**, **answer trustworthiness (citations)**,
**department-level access control**, and **low operational burden**.

## 2. Core Components

| Component | Role | Why |
|---|---|---|
| **Open Notebook** (FastAPI + Next.js + SurrealDB) | Knowledge engine: source ingestion, chunking, embeddings, hybrid (vector + full-text) search, notebooks, context-anchored chat, citations, and podcast generation | Self-hostable NotebookLM alternative; multi-provider; REST API; field-level encryption |
| **Curated Wiki layer** (LLM-maintained markdown) | Trusted top layer of curated, cited pages for stable, high-value knowledge (policies, FAQs, procedures); queried before RAG | Higher trust + readable for stakeholders + lower per-query cost. Hybrid model — see [04-knowledge-layer-llm-wiki.md](04-knowledge-layer-llm-wiki.md) |
| **Claude Opus** (Anthropic API, `claude-opus-4-8`) | Primary reasoning model for report generation, multi-step synthesis, and nuanced long-form content | Best-in-class long-context reasoning; configured natively as Open Notebook's Anthropic provider |
| **Google Workspace** (OIDC/SAML) | Single sign-on, group membership → roles, audit identity | Staff already have accounts; no new credential surface |
| **Google Drive** | Source of record for documents (policies, guides, FAQs) | Familiar upload workflow; synced into Open Notebook as sources |
| **App Gateway / BFF** (Next.js App Router on Vercel *or* container) | Thin auth + policy layer in front of Open Notebook; enforces department scoping, brokers SSO, proxies the Open Notebook API | Keeps Open Notebook off the public internet; centralizes RBAC and audit |
| **Object storage + Postgres (optional)** | Generated podcast MP3s, audit log, app metadata | Durable artifacts and compliance logging outside the engine |

### Provider strategy (configurable, not hard-wired)
Open Notebook abstracts providers via the Esperanto library, so each capability can be
pointed at the best/cheapest option without code changes. **Cost is a first-class
constraint** — see [03-cost-control-and-model-routing.md](03-cost-control-and-model-routing.md)
for the full strategy. In short, route every task to the cheapest model that's good enough and
put a unified billing gateway with a hard spend cap in front.

- **Default gateway: OpenRouter.** One bill for all providers, hard monthly spend caps,
  fallback routing, and access to cheap open models *and* Claude through a single key. Wired
  via Open Notebook's OpenAI-compatible endpoint support. Direct Anthropic API and self-hosted
  Ollama remain available as alternatives/supplements.
- **Reasoning / reports / chat (tiered):** Claude Opus (`claude-opus-4-8`) reserved for
  long-form reports and hard synthesis only; cheaper models (Claude Haiku `claude-haiku-4-5`,
  Gemini Flash, DeepSeek, or self-hosted Llama) for query refinement, everyday Q&A, and short
  summaries.
- **Embeddings:** a cheap hosted embedding model for the preview (D-9 — fully hosted for now);
  self-hosted Ollama (zero marginal cost, fully on-prem) remains the planned option once usage
  justifies the hardware.
- **Text-to-Speech (podcasts):** OpenAI TTS by default (cheap); ElevenLabs gated behind an
  admin flag for flagship content; Gemini/Vertex TTS remains an option if the school prefers
  Google. 1–4 distinct speakers supported.
- **Speech-to-Text (if ingesting audio sources):** OpenAI / Groq / Google.

## 3. Data Ingestion and Management

1. **Drive-based authoring (primary).** Stewards add documents to department **Shared Drives**
   (e.g. `KB · Science`, `KB · Admin`, `KB · HR`). A sync worker pulls new/changed files (Drive
   API change feed) and registers them as **sources** in the corresponding Open Notebook
   notebook.

   **How it knows which folders to read — explicit allowlist, Shared Drives only (D-8):**
   - A **folder registry** maps a fixed set of **Shared Drive IDs** → `department` +
     default `access_level`. The worker watches **only** these IDs; anything not registered is
     invisible to it. There is no domain-wide Drive scan.
   - The worker runs as a **dedicated read-only service account** added as **Viewer to those
     specific Shared Drives only**. That membership is the hard boundary — it is technically
     incapable of reading a folder it has not been added to, and it is **not** granted a
     domain-wide "read all Drive" scope.
   - **Personal "My Drive" folders are never ingested.** Shared Drives are org-owned, so content
     survives staff departure, governance/membership is central, and there's no risk of
     scooping up a person's private or misfiled files. To contribute, a steward places the file
     in the department Shared Drive — not by sharing a personal folder.
2. **Direct upload (secondary).** The web UI supports drag-and-drop of PDFs, Office docs,
   webpages, and audio — Open Notebook handles parsing and chunking. Gated to stewards by role.
3. **Metadata & scoping.** Every source carries `department`, `topic`, `access_level`, and
   `source_uri`. Department is the primary RBAC filter and is enforced at the gateway, not
   just in search ranking.
4. **Indexing.** Open Notebook produces embeddings + full-text indexes in SurrealDB for
   hybrid retrieval.

### Roles & who can contribute (steward model)

Contribution is **curated, not open** (decision D-7): designated stewards upload for their
department; everyone else is read-only. Roles map 1:1 to **Google Workspace groups**, which are
the single source of truth — add/remove a person from a group and their access changes
everywhere, with no separate user admin to maintain. The gateway resolves group membership to a
role + permitted departments and enforces it on **every** request (upload, search, wiki edit);
a user can never widen their own scope.

| Role | Workspace group (example) | Can do |
|---|---|---|
| **Student** | `students@…` (OU/group) | Student gate only: self-help over student-visible content + submit/track tickets. **Blocked from all staff routes.** |
| **Reader** (all staff) | `kb-<dept>-readers` | Ask & read within their department(s) |
| **Steward / Contributor** | `kb-<dept>-contributors` | Upload to their department (Drive folder and/or UI) |
| **Department Admin** | `kb-<dept>-admins` | Manage that dept's sources & metadata, curate the wiki, manage contributors |
| **Global Admin / Knowledge Owner** | `kb-admins` | System config, cross-department, group management |

- **Upload paths are gated by role.** Drive-folder contribution is governed by Google Drive
  sharing on the department folder (mirrors the `*-contributors` group); UI upload checks the
  same role at the gateway.
- **`access_level`** allows restricted collections even within a department (e.g.
  `HR-confidential`) so sensitive sources are withheld from ordinary readers.
- **Trusted-wiki edits** require steward/admin review when the AI flags a contradiction
  (human-in-the-loop), and all uploads/changes are written to the audit log.

> **Two gates, one-way access.** Tiers are ordered `student < staff < admin`: staff routes
> require tier ≥ staff (students blocked), student routes require tier ≥ student (so staff can
> also use the student gate). This powers the **student portal** (self-help + ticketing,
> including an anonymous safety channel) — full design in
> [05-student-portal-and-gate.md](05-student-portal-and-gate.md).

> **Privacy posture:** documents and embeddings live in self-hosted SurrealDB with
> field-level encryption. Only the minimal retrieved snippets needed to answer a query are
> sent to Claude (or any external LLM). PII-heavy collections can be pinned to on-prem
> Ollama models so nothing leaves the network.

## 4. User Interface (Preview Website)

Clean, NotebookLM-like experience for Workspace users. Two viable approaches:

- **(A) Use Open Notebook's bundled Next.js UI**, themed and placed behind the auth gateway.
  Fastest path.
- **(B) Build a thin custom Next.js front end** that calls the gateway → Open Notebook REST
  API. More control over branding, department UX, and audit hooks. **Recommended for the
  preview**, falling back to (A) if timelines compress.

Key features:
- **Natural-language search bar** with hybrid retrieval and inline **citations** back to the
  source document.
- **Departmental filtering** — defaults to the user's department(s); cross-department access
  only if their role allows.
- **Document / source viewer** with highlight-to-source.
- **Report generation** (Claude Opus) — structured, cited long-form output.
- **"Generate podcast"** — 1–4 speaker audio overview of a notebook, report, or result set.
- **SSO** via Google Workspace; **RBAC** via Workspace groups.

## 5. Workflow for Queries and Content Generation

1. **Auth.** User hits the site → redirected through Google Workspace SSO → gateway issues a
   session carrying their department(s) and role.
2. **Query.** User asks a question. The gateway injects an enforced `department` filter based
   on the session (a user cannot widen their own scope).
3. **Retrieve.** Open Notebook runs hybrid search over the permitted sources and returns
   ranked, cited chunks.
4. **Reason (Claude Opus).** For answers/reports, retrieved context + the question are sent to
   Claude Opus with a grounded prompt (see Build Spec). Output is citation-checked against the
   provided context before display.
5. **Podcast (optional).** On request, the chosen text (answer, report, or notebook) is sent
   to Open Notebook's podcast pipeline → multi-speaker TTS → MP3 stored in object storage; a
   playable link is returned.
6. **Display & log.** Results, citations, and audio links render in the UI; the gateway writes
   an audit record (who, what scope, what sources, what model).

## 6. Security and Confidence

- **Identity:** Google Workspace SSO; no separately managed passwords.
- **RBAC:** Workspace group → role → permitted departments, enforced server-side at the
  gateway on every request (defense in depth: also filtered in Open Notebook).
- **Network:** Open Notebook and SurrealDB are never exposed publicly; only the gateway is.
  Service-to-service auth via short-lived tokens.
- **Data minimization:** only required snippets leave the boundary; on-prem model option for
  sensitive collections; field-level encryption at rest.
- **Auditing:** append-only log of queries, scopes, sources touched, models used, and
  generated artifacts — for accountability and incident review.
- **Trust UX:** every generated claim shows its citation; "I couldn't find this in your
  documents" is a first-class, expected answer (no ungrounded guessing).

## 7. Deployment

- **Open Notebook + SurrealDB:** Docker Compose on a school-controlled VM or managed
  container host. SurrealDB uses the persistent RocksDB backend with backups.
- **Gateway / BFF:** Next.js (App Router). Vercel is fine for the preview if the engine is
  reachable over a private network/tunnel; otherwise co-locate the gateway with the engine.
- **Secrets:** Anthropic / TTS / embedding keys in a secret manager (Google Secret Manager,
  Vercel encrypted env, or Vault). Never in source.
- **Environments:** `preview` (this build) → `staging` → `prod`, each with isolated data.

## 8. What Changed vs. the Original (Summary)

- **Vertex AI Search → Open Notebook** (self-hosted hybrid retrieval, citations, notebooks).
- **Gemini-only TTS → pluggable TTS** with 1–4 speakers (ElevenLabs/OpenAI/Google).
- **Claude as an optional add-on → Claude Opus as the primary reasoning engine**, wired in
  natively.
- **Added** an explicit **auth/policy gateway** so RBAC and audit are enforced in one place
  and the engine stays private.
- **Added** a provider-strategy table so cost/privacy/quality can be tuned per task.

## 9. References
1. Open Notebook — https://github.com/lfnovo/open-notebook
2. The "Golden Loop" Workflow — https://analyticswithadam.medium.com/the-golden-loop-workflow-for-productivity-connecting-notebooklm-gems-and-google-workspace-e38fc683f936
3. NotebookLM Enterprise (reference for parity) — https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/set-up-notebooklm
4. Anthropic API (Claude Opus) — https://docs.anthropic.com
5. Filtering custom search by metadata — https://docs.cloud.google.com/generative-ai-app-builder/docs/filter-search-metadata
