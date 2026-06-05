# Cost Control & Model Routing

> **Purpose.** Keep spend predictable and low enough to win org adoption, without giving up
> Claude's quality where it actually matters. The core idea: **don't run one expensive model
> for everything.** Route each task to the cheapest model that's good enough, put a unified
> billing gateway (OpenRouter) in front with hard caps, and reserve Claude Opus for the small
> slice of work that genuinely needs it.

---

## 1. Where the money actually goes

Four cost centers, roughly in order of how easily they surprise you:

1. **LLM reasoning tokens** — biggest lever. Driven by model choice × context size × call volume.
2. **TTS (podcasts)** — sneaky. Premium voices (ElevenLabs) are billed per character/minute and
   add up fast if podcasts are long or frequent.
3. **Embeddings** — usually small, but scales with how often you re-index.
4. **Hosting** — Open Notebook + SurrealDB on a VM is a flat, predictable monthly cost.

The strategy below attacks each one.

---

## 2. The gateway decision: OpenRouter as the default

Three ways to connect models. **Recommended: OpenRouter as primary, with direct Anthropic as
an optional fast-path.**

| Option | Pros | Cons | Use when |
|---|---|---|---|
| **OpenRouter (recommended default)** | One bill for *all* providers; **hard spend caps & per-key limits**; automatic fallback routing; access to cheap open models (Llama, Qwen, DeepSeek, Gemini Flash) **and** Claude through one key; no per-vendor contract sprawl | ~small markup on token price; one more vendor in the path | You want a single budget dial and room to swap models freely — i.e. **now**, during adoption |
| **Direct Anthropic API** | No markup; first-class prompt caching; enterprise data terms direct | Anthropic-only; separate billing/keys per provider | High-volume Claude usage where the markup outweighs convenience |
| **Self-hosted (Ollama)** | **Zero marginal token cost**; data never leaves the network | Needs a GPU/box; lower quality than frontier models | High-volume, low-complexity, or PII-sensitive tasks (summaries, classification, embeddings) |

**These are not exclusive.** Open Notebook lets you assign a different provider/model per
capability, so a realistic setup is: OpenRouter for most reasoning, a self-hosted Ollama model
for bulk summaries + embeddings, and direct Anthropic only if/when Claude volume justifies it.

### OpenRouter wiring (OpenAI-compatible)
Open Notebook supports OpenAI-compatible endpoints, so point it at OpenRouter:

```
OPENAI_COMPATIBLE_BASE_URL=https://openrouter.ai/api/v1
OPENAI_COMPATIBLE_API_KEY=sk-or-...
# Then pick models by their OpenRouter ids, e.g.:
#   anthropic/claude-opus-4-8        (premium reasoning)
#   anthropic/claude-haiku-4-5       (cheap Claude)
#   google/gemini-2.x-flash          (very cheap, fast)
#   deepseek/deepseek-v3             (cheap reasoning)
#   meta-llama/llama-3.x-70b         (cheap open model)
```

Set a **monthly credit limit** and **per-key sub-budgets** in the OpenRouter dashboard — this
is your hard ceiling. Spend literally cannot exceed it, which is the single most reassuring
fact you can hand a budget owner.

---

## 3. Model routing tiers (the main cost lever)

Classify every task and route it. Most traffic should land in Tier 0–1, not Tier 3.

| Tier | Task | Model class | Why |
|---|---|---|---|
| **0** | Embeddings, classification, dept-tagging | Self-hosted Ollama embed model, or cheapest hosted | Highest volume, near-zero value-per-call |
| **1** | Query refinement, short summaries, "did we find it?" checks | Cheap fast model (Gemini Flash / Haiku / Llama) | Frequent, simple, latency-sensitive |
| **2** | Standard Q&A with citations, medium summaries | Mid model (Haiku / DeepSeek / Sonnet-class) | The everyday workhorse |
| **3** | Long-form reports, multi-step synthesis, nuanced policy writing | **Claude Opus** (`claude-opus-4-8`) | Reserve the expensive model for work that's actually hard |

The gateway picks the tier from the request type. A staff member typing a quick question
should *never* trigger an Opus call; generating a formal department report *should*.

> **Illustrative spread (verify current prices):** a Tier-1 model can be **20–60× cheaper per
> token** than Opus. Moving 80% of calls down one or two tiers is usually a bigger saving than
> any single other optimization.

---

## 4. Token discipline (cuts every LLM bill)

- **Prompt caching.** Cache the system prompt + retrieved context (`cache_control: ephemeral`
  on Anthropic; OpenRouter also supports caching for supported models). Repeated context in a
  session gets dramatically cheaper. **Single biggest per-call saving for report flows.**
- **Cap retrieval.** Send the top *k* most relevant chunks, not everything. A hard
  `MAX_CONTEXT_TOKENS` per call prevents runaway prompts. Better retrieval beats bigger context.
- **Cap output.** Set `max_tokens` per task type. Reports get a budget; quick answers get a
  small one.
- **Section-by-section reports.** Draft an outline, then generate one section per call with
  cached context — cheaper and lets you retry just one section on failure.
- **Cache whole results.** Identical question + same sources → serve the stored answer. A lot
  of staff ask the same handful of policy questions.

---

## 5. TTS / podcast cost control

- **Default to cheaper TTS** (OpenAI TTS) for routine podcasts; reserve premium voices
  (ElevenLabs) for flagship/published content only.
- **Cap length & cadence** — e.g. max N minutes per podcast, and a per-user/per-day generation
  quota. Podcasts are opt-in, not generated on every query.
- **Cache audio** — same source + same script → reuse the existing MP3, don't re-synthesize.
- Gemini/Vertex TTS stays available if the school prefers staying in-ecosystem.

---

## 6. Budget guardrails (enforced, not hoped-for)

- **Hard cap at OpenRouter** — monthly credit ceiling; spend stops there.
- **Per-department / per-user quotas at the gateway** — daily token or request budgets; over
  quota → degrade to a cheaper tier or queue, don't fail loudly.
- **Alerts** at 50/80/100% of budget to an admin channel.
- **Per-feature kill switches** — disable podcast generation or Opus reports independently if a
  bill spikes, without taking down search.
- **Cost dashboard** — spend by department, by feature, by model; cost-per-report and
  cache-hit-rate. This is what you show the budget owner monthly.

---

## 7. Recommended starting configuration (lean)

A concrete, defensible default for the preview that keeps the bill small and the quality high
where it counts:

- **Gateway:** OpenRouter, with a conservative monthly cap and per-key sub-budgets.
- **Tier 0 (embeddings, tagging):** self-hosted Ollama embeddings (zero marginal cost), or
  cheapest hosted embedding if no GPU box yet.
- **Tier 1 (refinement, short summaries):** Gemini Flash or Claude Haiku via OpenRouter.
- **Tier 2 (everyday cited Q&A):** Claude Haiku / DeepSeek via OpenRouter.
- **Tier 3 (formal reports only):** Claude Opus `claude-opus-4-8` via OpenRouter.
- **TTS:** OpenAI TTS default; ElevenLabs gated behind an admin flag.
- **Caching:** on everywhere — prompt cache + result cache + audio cache.
- **Guardrails:** OpenRouter hard cap + gateway per-user quotas + 80% alert.

This gives you a system that *can* deliver Opus-quality reports, but only pays Opus prices for
the small fraction of work that warrants it — and a single dial (the OpenRouter cap) that
guarantees the bill can't run away while you're selling the org on adoption.

---

## 8. References
1. OpenRouter — https://openrouter.ai/docs
2. OpenRouter limits & spend controls — https://openrouter.ai/docs/api-reference/limits
3. Anthropic prompt caching — https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
4. Open Notebook (model/provider config) — https://github.com/lfnovo/open-notebook
5. Ollama (self-hosted models) — https://ollama.com
