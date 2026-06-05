import Link from "next/link";
import { PILLARS, STEPS } from "@/lib/content";
import { ExperienceDemo } from "@/components/experience-demo";
import { StudentPortalDemo } from "@/components/student-portal-demo";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "var(--color-navy)" }}
        />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pt-28">
          <p className="eyebrow rise" style={{ animationDelay: "0ms" }}>
            Internal AI Knowledge Base · Stakeholder Preview
          </p>
          <h1
            className="rise font-display mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-ink md:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            The school's knowledge,{" "}
            <span className="text-navy">finally easy to ask.</span>
          </h1>
          <p
            className="rise mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            Staff ask a question in plain language and get a trustworthy,
            cited answer drawn only from the school's own documents — plus
            formal reports and podcast-style audio summaries. Built to keep
            answers honest, access safe, and costs firmly under control.
          </p>
          <div
            className="rise mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#demo"
              className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-navy-deep"
            >
              See it in action
            </a>
            <Link
              href="/how-it-works"
              className="link-underline text-sm font-semibold text-ink"
            >
              How it works →
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive demo */}
      <section id="demo" className="scroll-mt-24 border-y border-line bg-paper-deep">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">See it in action</p>
              <h2 className="font-display mt-3 max-w-xl text-3xl font-semibold leading-tight text-ink md:text-4xl">
                Ask a question. Watch a trusted answer appear.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              An interactive preview of the real experience. Pick a department,
              press <span className="font-semibold text-navy">Ask</span>, and try
              turning an answer into a report or an audio overview.
            </p>
          </div>
          <ExperienceDemo />
          <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Illustrative preview · sample documents · no live data
          </p>
        </div>
      </section>

      {/* Two entrances: staff & students */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="eyebrow">For students, too</p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl font-semibold leading-tight text-ink md:text-4xl">
          Two entrances, one community
        </h2>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
          Staff get the full knowledge base. Students get a friendly place to find answers and
          ask for help — and the door only swings one way.
        </p>

        {/* One-way gate diagram */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-line-strong bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold-deep">
              Student gate
            </p>
            <h3 className="font-display mt-2 text-xl font-semibold text-navy">
              Get help &amp; submit tickets
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Any student (or staff member) can ask a question, get a cited answer from
              student-safe content, and file a ticket if they still need help.
            </p>
          </div>
          <div className="rounded-2xl border border-line-strong bg-navy p-6 text-paper">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold-soft">
              Staff gate
            </p>
            <h3 className="font-display mt-2 text-xl font-semibold">
              The full knowledge base
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-paper/80">
              Staff only. Everything in the knowledge base, plus the ticket queue. Staff can also
              use the student gate — but students can never enter here.
            </p>
          </div>
        </div>
        <p className="mt-5 flex items-center gap-2 text-sm text-muted">
          <span className="rounded-full bg-navy/8 px-2.5 py-0.5 font-mono text-[11px] font-medium text-navy">
            one-way
          </span>
          Staff → both gates · Students → student gate only, enforced on every request.
        </p>

        <div className="mt-10">
          <StudentPortalDemo />
          <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Illustrative preview · sample data · no live data
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-line bg-paper-deep">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display max-w-xl text-3xl font-semibold leading-tight text-ink md:text-4xl">
              Built around four promises
            </h2>
            <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-muted md:block">
              Why it earns trust
            </span>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line-strong bg-line-strong sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div key={p.no} className="bg-card p-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-gold-deep">{p.no}</span>
                  <h3 className="font-display text-xl font-semibold text-navy">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works preview */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow">From question to answer</p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl font-semibold leading-tight text-ink md:text-4xl">
          Five steps, no learning curve
        </h2>
        <div className="mt-12 space-y-px overflow-hidden rounded-2xl border border-line-strong bg-line-strong">
          {STEPS.map((s) => (
            <div
              key={s.no}
              className="grid items-start gap-4 bg-card p-7 md:grid-cols-[auto_1fr_2fr] md:items-center md:gap-10"
            >
              <span className="font-display text-3xl font-semibold text-line-strong md:text-4xl">
                <span className="text-navy/30">{s.no}</span>
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">
                {s.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-ink-soft">
                {s.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/how-it-works"
            className="link-underline text-sm font-semibold text-navy"
          >
            See the full architecture in plain English →
          </Link>
        </div>
      </section>

      {/* Cost callout */}
      <section className="border-t border-line bg-navy text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-gold-soft">
              The honest part
            </p>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Powerful AI is wonderful — and easy to overspend on.
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-paper/80">
              So cost isn't an afterthought here; it's a design constraint.
              Cheap models handle the everyday, the premium model is reserved
              for hard work, and a single hard cap means the monthly bill can
              never surprise anyone.
            </p>
            <Link
              href="/cost"
              className="mt-8 inline-block rounded-full bg-paper px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-paper-deep"
            >
              See the cost approach
            </Link>
          </div>
          <div className="space-y-4">
            {[
              ["Hard monthly cap", "Spending physically cannot exceed it."],
              ["Right-sized models", "20–60× cheaper for everyday questions."],
              ["Cheaper over time", "A curated wiki lowers per-question cost."],
            ].map(([t, d]) => (
              <div
                key={t}
                className="rounded-xl border border-paper/15 bg-navy-deep/40 p-5"
              >
                <p className="font-display text-lg font-semibold">{t}</p>
                <p className="mt-1 text-sm text-paper/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
