import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { STEPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "How It Works — TCS·Net",
  description:
    "The architecture in plain English: the building blocks, the journey of a question, and the hybrid knowledge model.",
};

const BLOCKS = [
  {
    name: "Sign-in & permissions",
    tech: "Google Workspace",
    body: "Staff log in with their existing school accounts. Their department and role decide what they can see — enforced on every request, so no one can widen their own access.",
  },
  {
    name: "The knowledge engine",
    tech: "Open Notebook",
    body: "An open-source, self-hosted tool that stores documents, finds the relevant passages, tracks citations, and produces multi-speaker audio summaries.",
  },
  {
    name: "The curated wiki",
    tech: "AI-maintained pages",
    body: "A readable, cited set of pages covering the school's most-asked knowledge — checked first because it's trustworthy and cheap to answer from.",
  },
  {
    name: "The reasoning",
    tech: "Claude + cheaper models",
    body: "The right-sized AI model composes the answer from retrieved passages. The premium model is used only for hard work like formal reports.",
  },
  {
    name: "The billing gateway",
    tech: "OpenRouter",
    body: "All AI requests flow through one gateway with a hard monthly spending cap and access to many models — the single dial that keeps costs predictable.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How It Works"
        title={
          <>
            The architecture,{" "}
            <span className="text-navy">explained without jargon.</span>
          </>
        }
        lead="Five building blocks work together so a staff member can ask a question and get a trustworthy answer. Here's each piece, the journey of a single question, and the idea that keeps it both smart and affordable."
      />

      {/* Building blocks */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
          The building blocks
        </h2>
        <div className="mt-10 space-y-px overflow-hidden rounded-2xl border border-line-strong bg-line-strong">
          {BLOCKS.map((b) => (
            <div
              key={b.name}
              className="grid gap-2 bg-card p-7 md:grid-cols-[1fr_2fr] md:gap-10"
            >
              <div>
                <h3 className="font-display text-lg font-semibold text-navy">
                  {b.name}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-gold-deep">
                  {b.tech}
                </p>
              </div>
              <p className="text-[15px] leading-relaxed text-ink-soft">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="border-y border-line bg-paper-deep">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
            The journey of a question
          </h2>
          <ol className="mt-10 space-y-8">
            {STEPS.map((s, i) => (
              <li key={s.no} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-navy font-mono text-sm text-navy">
                    {s.no}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-line-strong" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust & access */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="eyebrow">Trust &amp; access</p>
        <h2 className="font-display mt-4 text-2xl font-semibold text-ink md:text-3xl">
          Who gets in, and what it's allowed to read
        </h2>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
          Confidence comes from knowing the boundaries. Access is built on the
          accounts and permissions the school already manages — and the system
          can only ever see the documents it's been explicitly given.
        </p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line-strong bg-line-strong md:grid-cols-2">
          {[
            [
              "Familiar sign-in",
              "Staff log in with their existing school Google accounts. Each person automatically sees only their own department's content — no extra passwords, no way to widen their own access.",
            ],
            [
              "Curated contributions",
              "Only designated department “stewards” can add documents; everyone else is read-only. Who is a reader, steward, or admin is managed in Google Workspace groups — the school's existing tool.",
            ],
            [
              "Reads only approved Shared Drives",
              "The system never scans Google Drive. It reads from a fixed, admin-approved list of school-owned Shared Drives — and never from anyone's personal “My Drive” folders.",
            ],
            [
              "Verifiable & logged",
              "Every answer cites its source and can say “not found” rather than guess. Uploads and changes are recorded in an audit trail, so there's always accountability.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="bg-card p-7">
              <h3 className="font-display text-lg font-semibold text-navy">
                {t}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hybrid model */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="eyebrow">The clever bit</p>
        <h2 className="font-display mt-4 text-2xl font-semibold text-ink md:text-3xl">
          A curated wiki, backed by full document search
        </h2>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
          Rather than re-reading every raw document on every question, the system
          keeps a curated wiki of the knowledge staff ask about most. It checks
          that first; for everything else, it falls back to searching the full
          library. The result is more trustworthy, more readable, and cheaper to
          run.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [
              "More trustworthy",
              "Curated pages are reviewed when the AI flags a contradiction — so staff and leaders can simply read and rely on them.",
            ],
            [
              "Cheaper per question",
              "Concise pages mean far less text sent to the AI each time, which directly lowers the cost of every answer.",
            ],
            [
              "Improves over time",
              "Good answers found through search get filed back into the wiki, so the system keeps getting better.",
            ],
          ].map(([t, d]) => (
            <div
              key={t}
              className="rounded-xl border border-line-strong bg-card p-6"
            >
              <h3 className="font-display text-lg font-semibold text-navy">
                {t}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{d}</p>
            </div>
          ))}
        </div>

        <div className="rule mt-14" />
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/cost" className="link-underline font-semibold text-navy">
            How costs stay controlled →
          </Link>
          <Link href="/design" className="link-underline font-semibold text-navy">
            The design decisions →
          </Link>
        </div>
      </section>
    </>
  );
}
