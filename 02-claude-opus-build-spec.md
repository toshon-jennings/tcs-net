# Claude Opus Build Specification (Revised)

> **Revision note.** Updated to reflect (1) the **real Anthropic Messages API** rather than a
> generic placeholder REST shape, (2) **Claude Opus 4.x** (`claude-opus-4-8`) as the current
> model, and (3) integration through **[Open Notebook](https://github.com/lfnovo/open-notebook)**
> rather than Vertex AI Search. Claude is the reasoning/report layer; Open Notebook owns
> retrieval, citations, and podcasts.

## 1. Role of Claude in the System

Claude operates at two points in the workflow:

1. **Query refinement (cheap model).** Turn a vague staff question into 3–5 precise search
   queries for Open Notebook. Use a Tier-1 model (`claude-haiku-4-5`, Gemini Flash, or a
   self-hosted model) — fast and low-cost.
2. **Grounded reasoning & report generation (high-quality model).** Take the retrieved,
   cited context from Open Notebook and produce answers, summaries, and long-form reports.
   Use `claude-opus-4-8` **only for long-form reports and hard synthesis** — everyday cited
   Q&A should run on a cheaper Tier-2 model. This tiering is the primary cost lever; see
   [03-cost-control-and-model-routing.md](03-cost-control-and-model-routing.md).

> **Provider note.** All model calls in this spec route through **OpenRouter** by default
> (one bill, hard spend cap, fallback routing), using the same Messages-style payloads. Use
> the OpenRouter base URL and model ids (e.g. `anthropic/claude-opus-4-8`). Direct Anthropic
> API (shown below) is the alternative fast-path when Claude volume justifies skipping the
> markup; payload shape is the same.

Claude **never** invents facts. Its prompts require that every claim trace to the supplied
context, and the gateway verifies citations before display.

## 2. Two Integration Modes

**Mode A — Native (recommended).** Configure Claude inside Open Notebook as the Anthropic
provider. Open Notebook then uses Claude for chat/report transformations directly, so you get
retrieval + reasoning + citations in one call path. Set in Open Notebook's model config:

```
ANTHROPIC_API_KEY=sk-ant-...
# Default models (configurable in the Open Notebook UI/model settings)
#   reasoning/report:  claude-opus-4-8
#   light tasks:       claude-haiku-4-5
```

**Mode B — Direct (for custom report flows).** The gateway calls the Anthropic Messages API
itself, passing context it retrieved from Open Notebook's `/search` API. Use this when you
need bespoke report structures, multi-pass drafting, or strict output schemas. Both modes can
coexist.

## 3. Anthropic Messages API — Real Request Shape

Authentication uses the `x-api-key` header (not OAuth). Keys live in a secret manager.

```http
POST https://api.anthropic.com/v1/messages
x-api-key: $ANTHROPIC_API_KEY
anthropic-version: 2023-06-01
content-type: application/json
```

### 3.1 Report generation request

```json
{
  "model": "claude-opus-4-8",
  "max_tokens": 4096,
  "system": "You are an educational research assistant for school staff. Answer ONLY from the <context> provided. Every factual claim must cite a source id like [doc123]. If the context does not contain the answer, say so plainly. Maintain a professional, academic, school-appropriate tone.",
  "messages": [
    {
      "role": "user",
      "content": "Generate a report on the impact of remote learning on student engagement in the Science department.\n\nSections: Introduction, Key Findings, Challenges, Recommendations.\n\n<context>\n[doc123] ...excerpt from a Drive document...\n[doc456] ...excerpt from another document...\n</context>"
    }
  ]
}
```

### 3.2 Response shape (real)

```json
{
  "id": "msg_01...",
  "type": "message",
  "role": "assistant",
  "model": "claude-opus-4-8",
  "content": [
    { "type": "text", "text": "# Remote Learning Impact — Science Dept\n\n## Introduction\n... [doc123] ..." }
  ],
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 1820, "output_tokens": 1240 }
}
```

> Note: the generated text is in `content[].text`, and token accounting is split into
> `input_tokens` / `output_tokens` under `usage` — not a single `tokens_used` field.

### 3.3 Prompt caching (do this)

Retrieved context and the system prompt are large and reused across a session. Mark them with
`cache_control` to cut cost and latency materially:

```json
{
  "role": "user",
  "content": [
    { "type": "text", "text": "<context>...long retrieved snippets...</context>",
      "cache_control": { "type": "ephemeral" } },
    { "type": "text", "text": "Now draft the Recommendations section only." }
  ]
}
```

### 3.4 Streaming
For reports and chat, set `"stream": true` and render tokens as they arrive via SSE — much
better perceived latency for long-form output.

## 4. Prompt Engineering

### 4.1 Report generation (template)
```
System: You are an expert educational researcher writing for school administrators.
Rules: (1) Use ONLY the <context>. (2) Cite every claim as [source_id]. (3) If unsupported,
write "Not found in the provided documents." (4) Formal, objective, school-appropriate tone.

User: Write a [REPORT_TYPE] on [TOPIC].
Required sections: [SECTION_1], [SECTION_2], [SECTION_3].
<context>
[CITED_SNIPPETS_FROM_OPEN_NOTEBOOK]
</context>
```

### 4.2 Query refinement (template, Haiku)
```
System: Output strictly a JSON array of strings, nothing else.
User: A staff member asked: "[USER_QUERY]". Produce 3–5 more specific search queries for a
school knowledge base, biased toward the [DEPARTMENT] department where relevant.
```
Parse the JSON array and fan the queries into Open Notebook's search.

### 4.3 Iterative reports
For long reports, draft an outline first, then request one section per call (each with cached
context). Cheaper, more controllable, and easier to retry a single failed section.

## 5. Citation Verification (non-negotiable)

After Claude returns text, the gateway:
1. Extracts every `[source_id]` token.
2. Confirms each id was actually in the context passed in.
3. Flags or strips any claim whose citation is missing/hallucinated before display.

This is the trust backbone — the UI promises "answers grounded in your documents."

## 6. Error Handling and Resilience

- **Rate limits (HTTP 429):** exponential backoff with jitter; respect `retry-after`.
- **Overloaded (529):** retry with backoff; fall back to `claude-haiku-4-5` for non-critical
  paths if Opus is saturated.
- **Timeouts / partial streams:** for sectioned reports, retry only the failed section.
- **Empty retrieval:** if Open Notebook returns no context, do **not** call Opus to "fill in"
  — return the explicit "not found" state.
- **Content safety:** run school-policy checks on generated output; log violations.

## 7. Observability

Log per call: model, `input_tokens`/`output_tokens`, latency, cache hit ratio, department
scope, source ids used, and citation-verification result. Surface cost-per-report and
cache-hit-rate dashboards — these drive the provider/model tuning decisions in the
architecture doc.

## 8. Security

- API keys in a secret manager; never in client code or the repo. All Anthropic calls happen
  server-side (gateway or Open Notebook), never from the browser.
- Send only the minimal retrieved snippets; for sensitive collections, route to on-prem
  Ollama models instead of Claude (configurable per notebook in Open Notebook).
- Anthropic API: enterprise data-handling terms apply (no training on API data); confirm
  current compliance posture against the school's data-privacy requirements.

## 9. Future Enhancements
- **Multi-turn chat** anchored to a notebook (Claude + Open Notebook context window).
- **Auto-summaries** of newly ingested Drive documents (Haiku on the sync worker).
- **Role-aware research paths** — tailored briefings per staff role.
- **Tool use** — let Claude call Open Notebook search as a tool for agentic multi-hop
  research, instead of single-shot context stuffing.

## 10. References
1. Open Notebook — https://github.com/lfnovo/open-notebook
2. Anthropic Messages API — https://docs.anthropic.com/en/api/messages
3. Prompt caching — https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
4. NotebookLM podcast API (parity reference) — https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/podcast-api
