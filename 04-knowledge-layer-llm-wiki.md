# Knowledge Layer — Hybrid LLM-Wiki + RAG

> **Decision (D-6):** We adopt a **hybrid** knowledge model. A curated, LLM-maintained
> **wiki** (per [Karpathy's LLM-Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f))
> is the trusted top layer for stable, high-value knowledge; **Open Notebook's RAG** handles the
> long tail of raw documents. This raises trust and *lowers* per-query cost, at the price of
> some curation/governance overhead.

---

## 1. Why hybrid (the short version)

- **Trust:** staff (and stakeholders) can *read* the curated wiki pages — "here is the current
  policy," with citations and contradiction flags — instead of trusting opaque chunk retrieval.
- **Cost:** answering from concise wiki pages sends far fewer tokens to Claude than stuffing
  large raw context on every query. The expensive work (building/checking the wiki) is **batch
  and infrequent**, runs on **cheap models**, and happens only when documents change — not per
  question.
- **Coverage:** not everything deserves curation. RAG covers the long tail of raw documents so
  nothing is lost while the wiki focuses on what's asked often and matters most.

---

## 2. The three layers (mapped to our system)

| Karpathy layer | In our system | Notes |
|---|---|---|
| **Raw sources** | Google Drive docs + Open Notebook sources | Already our ingestion path |
| **The wiki** | Department-scoped markdown pages in a versioned store (git repo or object store), indexed in Open Notebook for retrieval | The trusted, readable, cheap-to-query layer |
| **The schema** | A wiki-governance doc + our existing [AGENTS.md](AGENTS.md) | Governs how agents ingest/curate/lint the wiki |

### Wiki structure
```
wiki/
  index.md                # catalog of pages (the map)
  log.md                  # chronological record of ingests, edits, lints
  schema.md               # rules governing wiki maintenance (the "schema" layer)
  science/
    remote-learning-engagement.md
    lab-safety-policy.md
  hr/
    leave-policy.md
  admin/
    attendance-policy.md
```
Each page carries front-matter: `department`, `topic`, `access_level`, `sources` (the source
ids it's derived from), and `last_reviewed`. Department folders mirror the RBAC model so wiki
access scopes exactly like raw sources.

---

## 3. The three operations

### Ingest (when a source is added/changed)
1. Triggered by the Drive sync worker registering a new/changed source.
2. A **cheap model (Tier 1)** reads the source + the relevant existing wiki page(s) and
   proposes an updated page: merges new facts, preserves citations (`[source_id]`), and flags
   any contradiction with existing content rather than silently overwriting.
3. Update `index.md` and append to `log.md`.
4. Contradictions and large rewrites are queued for **human review** before publish (trust
   gate). Routine, low-risk updates can auto-publish.

> Ingest is **batch and infrequent** — only on document change. This is where the wiki's cost
> lives, and it's small.

### Query (when a staff member asks)
1. Search the **wiki first** (it's concise, curated, cited).
2. If the wiki covers it → answer from the wiki page(s). Cheap: small context, often a Tier-2
   model suffices; Claude Opus only for genuinely complex synthesis.
3. If the wiki **doesn't** cover it → fall back to Open Notebook RAG over raw sources.
4. Optionally, a high-value RAG answer can be **filed back** into the wiki (becomes curated for
   next time) — the "compounding" behavior.

### Lint (scheduled health check)
- A **cheap model**, run on a schedule (e.g. nightly/weekly), scans for: contradictions, stale
  claims (old `last_reviewed`), orphaned pages, and missing cross-references.
- Output is a report for human curators, not auto-edits. Keeps the wiki honest as policies
  change.

---

## 4. Cost implications (net positive)

- **Per-query cost drops** — concise wiki context << raw-document context; fewer Opus calls.
- **Ingest/lint cost is bounded** — batch, infrequent, Tier-1 models, behind the OpenRouter
  spend cap like everything else (see
  [03-cost-control-and-model-routing.md](03-cost-control-and-model-routing.md)).
- **Governance has a cost too** — human review time for contradictions/large rewrites. Real,
  but it's *people trusting the system*, which is the point.

> Net: the hybrid model is expected to **reduce** total AI spend versus pure RAG at steady
> state, while improving trust.

---

## 5. Trust & governance (non-negotiables)

- **Citations preserved** — every wiki claim traces to a `source_id`; the query path verifies
  citations exactly as in [02-claude-opus-build-spec.md](02-claude-opus-build-spec.md).
- **Contradictions are flagged, never silently resolved.** A human decides.
- **Human-in-the-loop for risky changes** — policy rewrites and contradictions gate on review.
- **`log.md` is the audit trail** — who/what changed, when, from which sources.
- **Drift control** — `last_reviewed` + scheduled lint keep pages from going stale as the
  underlying documents change.

---

## 6. Build sequence (incremental)

1. Stand up the wiki store (git repo or object store) + `index.md` / `log.md` / `schema.md`.
2. Implement **query: wiki-first, RAG-fallback** (lowest effort, immediate cost win).
3. Implement **ingest** on the existing Drive sync trigger (cheap model, human-review gate).
4. Implement **lint** as a scheduled job.
5. Add **file-back** (promote good RAG answers into the wiki) once the basics are stable.

---

## 7. References
1. Karpathy — LLM Wiki pattern — https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
2. Open Notebook — https://github.com/lfnovo/open-notebook
3. Cost & routing — [03-cost-control-and-model-routing.md](03-cost-control-and-model-routing.md)
4. Claude integration — [02-claude-opus-build-spec.md](02-claude-opus-build-spec.md)
