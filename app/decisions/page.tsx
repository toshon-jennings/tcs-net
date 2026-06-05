import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { DECISIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Decisions — TCS·Net",
  description:
    "The key decisions behind the project, in plain language: what we chose, why, and the trade-off.",
};

export default function DecisionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Key Decisions"
        title={
          <>
            Every major choice, <span className="text-pine">in the open.</span>
          </>
        }
        lead="Good decisions are ones you can explain. Each entry below records what we chose, why we chose it, and what we gave up — so the reasoning is never a black box."
      />

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-6">
          {DECISIONS.map((d) => (
            <article
              key={d.id}
              className="overflow-hidden rounded-2xl border border-line-strong bg-card"
            >
              <div className="flex items-center gap-4 border-b border-line bg-paper-deep/60 px-7 py-4">
                <span className="font-mono text-sm font-medium text-ochre">
                  {d.id}
                </span>
                <h2 className="font-display text-xl font-semibold text-ink">
                  {d.title}
                </h2>
              </div>
              <div className="grid gap-px bg-line sm:grid-cols-3">
                <Cell label="What we chose" tone="ink">
                  {d.chose}
                </Cell>
                <Cell label="Why" tone="pine">
                  {d.why}
                </Cell>
                <Cell label="The trade-off" tone="ochre">
                  {d.tradeoff}
                </Cell>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function Cell({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "ink" | "pine" | "ochre";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "pine"
      ? "text-pine"
      : tone === "ochre"
        ? "text-ochre"
        : "text-ink-soft";
  return (
    <div className="bg-card p-7">
      <p className={`font-mono text-xs uppercase tracking-[0.16em] ${toneClass}`}>
        {label}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}
