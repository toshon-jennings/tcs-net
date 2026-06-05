import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { COST_TIERS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cost — TCS·Net",
  description:
    "How the project keeps AI spending predictable and low: right-sized models, a hard cap, and a curated wiki that lowers per-question cost.",
};

export default function CostPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cost Approach"
        title={
          <>
            Powerful AI, on a{" "}
            <span className="text-pine">predictable budget.</span>
          </>
        }
        lead="Premium AI is genuinely useful — and genuinely easy to overspend on. So cost here is a design constraint, not an afterthought. Four mechanisms keep the bill in check, and one of them is a ceiling that simply cannot be crossed."
      />

      {/* The cap */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 rounded-2xl border border-pine bg-pine p-8 text-paper md:grid-cols-[1fr_1.4fr] md:items-center md:p-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ochre-soft">
              The safety net
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight">
              A hard monthly cap that can't be exceeded.
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-paper/85">
            Every AI request runs through a single billing gateway (OpenRouter)
            with a fixed monthly ceiling. When the budget is reached, spending
            stops — there's no way for the bill to quietly run away. It's one
            dial a budget owner can set and trust, which is exactly what makes
            adopting something new feel safe.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
          The biggest lever: right-sized models
        </h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
          Not every question needs the most powerful (and most expensive) AI.
          Each task is routed to the cheapest model that's good enough. The
          premium model is reserved for the small share of work that genuinely
          needs it — a quick question never triggers a premium-priced answer.
        </p>
        <div className="mt-10 overflow-hidden rounded-2xl border border-line-strong">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-paper-deep">
                {["Tier", "What it handles", "Model used"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-line-strong px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COST_TIERS.map((t, i) => (
                <tr
                  key={t.tier}
                  className={i % 2 === 0 ? "bg-card" : "bg-paper"}
                >
                  <td className="border-b border-line px-5 py-4 align-top">
                    <span className="font-mono text-sm font-medium text-pine">
                      {t.tier}
                    </span>
                  </td>
                  <td className="border-b border-line px-5 py-4 align-top">
                    <p className="text-[15px] text-ink">{t.task}</p>
                    <p className="mt-1 text-xs text-muted">{t.note}</p>
                  </td>
                  <td className="border-b border-line px-5 py-4 align-top text-[15px] text-ink-soft">
                    {t.model}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-sm text-muted">
          For everyday questions, a lower tier can be{" "}
          <span className="font-medium text-ink">20–60× cheaper</span> per answer
          than the premium model. Moving most traffic down a tier or two saves
          more than any other single optimization.
        </p>
      </section>

      {/* Other levers */}
      <section className="border-t border-line bg-paper-deep">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
            And three more savings, built in
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "The curated wiki",
                "Answering from concise, curated pages sends far less text to the AI than re-reading raw documents — lowering the cost of every question.",
              ],
              [
                "Smart caching",
                "Repeated context, identical questions, and already-made audio are reused instead of paid for twice.",
              ],
              [
                "Opt-in extras",
                "Formal reports and audio summaries are deliberate button-presses with sensible limits — never fired automatically.",
              ],
            ].map(([t, d]) => (
              <div
                key={t}
                className="rounded-xl border border-line-strong bg-card p-6"
              >
                <h3 className="font-display text-lg font-semibold text-pine">
                  {t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-line-strong bg-card p-7">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ochre">
              The bottom line
            </p>
            <p className="font-display mt-3 text-xl leading-snug text-ink md:text-2xl">
              The system <em className="text-pine">can</em> deliver premium-quality
              reports — but only pays premium prices for the small slice of work
              that warrants it, under a ceiling that can't be crossed.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/how-it-works"
              className="link-underline font-semibold text-pine"
            >
              How it works →
            </Link>
            <Link
              href="/decisions"
              className="link-underline font-semibold text-pine"
            >
              The decisions behind this →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
