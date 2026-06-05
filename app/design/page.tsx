import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { UX_PRINCIPLES, UX_DECISIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Design — TCS·Net",
  description:
    "The experience principles and concrete interface decisions that make the system feel trustworthy and effortless.",
};

export default function DesignPage() {
  return (
    <>
      <PageHeader
        eyebrow="Experience & Design"
        title={
          <>
            Designed to feel{" "}
            <span className="text-pine">trustworthy and effortless.</span>
          </>
        }
        lead="The interface has one job: make answers easy to get and easy to believe. These are the principles guiding it and the concrete decisions that follow from them."
      />

      {/* Principles */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
          Guiding principles
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line-strong bg-line-strong sm:grid-cols-2">
          {UX_PRINCIPLES.map((p, i) => (
            <div key={p.title} className="bg-card p-8">
              <span className="font-mono text-sm text-ochre">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-2 text-xl font-semibold text-pine">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Decisions log */}
      <section className="border-y border-line bg-paper-deep">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
              Interface decisions
            </h2>
            <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-muted md:block">
              Status: Planned
            </span>
          </div>
          <div className="mt-10 space-y-px overflow-hidden rounded-2xl border border-line-strong bg-line-strong">
            {UX_DECISIONS.map((d) => (
              <div
                key={d.id}
                className="grid gap-3 bg-card p-7 md:grid-cols-[auto_1fr_1.4fr] md:items-baseline md:gap-8"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-ochre">{d.id}</span>
                  <span className="font-display text-base font-semibold text-ink">
                    {d.element}
                  </span>
                </div>
                <p className="text-[15px] text-ink-soft">{d.decision}</p>
                <p className="text-[15px] text-muted">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-pine">
                    Why{" "}
                  </span>
                  {d.why}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm text-muted">
            This log grows as the build progresses — every new screen or
            interaction decision is recorded here with its plain-English
            rationale, so the experience never changes silently.
          </p>
        </div>
      </section>

      {/* Visual language */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
          A calm, considered visual language
        </h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
          The look is editorial and institutional on purpose: warm paper tones, a
          confident serif, and restrained accents. It should feel like a
          well-made reference work the school is proud of — not a flashy gadget.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Swatch name="Pine" hex="#1F4D3A" className="bg-pine text-paper" />
          <Swatch name="Ochre" hex="#B1671C" className="bg-ochre text-paper" />
          <Swatch
            name="Paper"
            hex="#F6F3EA"
            className="border border-line-strong bg-paper text-ink"
          />
        </div>

        <div className="rule mt-14" />
        <div className="mt-8">
          <Link href="/story" className="link-underline font-semibold text-pine">
            ← Back to the project story
          </Link>
        </div>
      </section>
    </>
  );
}

function Swatch({
  name,
  hex,
  className,
}: {
  name: string;
  hex: string;
  className: string;
}) {
  return (
    <div className={`flex items-end justify-between rounded-xl p-6 ${className}`}>
      <span className="font-display text-lg font-semibold">{name}</span>
      <span className="font-mono text-xs uppercase tracking-[0.14em] opacity-80">
        {hex}
      </span>
    </div>
  );
}
