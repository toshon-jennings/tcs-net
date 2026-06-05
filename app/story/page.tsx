import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "The Story — TCS·Net",
  description:
    "Why we're building an internal AI knowledge base for school staff, and the principles guiding it.",
};

export default function StoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Story"
        title={
          <>
            Knowledge the school already owns,{" "}
            <span className="text-navy">put within reach.</span>
          </>
        }
        lead="Every school sits on years of policies, handbooks, guides, and hard-won answers. The hard part has never been having that knowledge — it's finding the right piece of it, quickly, and trusting what you find."
      />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-12">
          <Section heading="The problem we're solving">
            <p>
              Staff lose real time hunting through shared drives, old emails, and
              half-remembered documents — and when they do find something, they
              can't always tell if it's current. New staff feel it most. The
              knowledge exists; the <em>access</em> to it doesn't.
            </p>
          </Section>

          <Section heading="What we're building">
            <p>
              An internal knowledge base that staff can simply <em>ask</em>.
              Type a question the way you'd ask a colleague, and get back a clear
              answer drawn only from the school's own documents — with a citation
              on every claim so it can be verified. When a question isn't covered,
              the system says so plainly rather than guessing.
            </p>
            <p>
              On top of answers, staff can generate formal{" "}
              <strong>reports</strong> for leadership and{" "}
              <strong>podcast-style audio summaries</strong> to absorb on the
              commute — all from the same trusted source material.
            </p>
          </Section>

          <Section heading="The principles guiding every decision">
            <ul className="space-y-5">
              {[
                [
                  "Trust before cleverness",
                  "An answer that can't be verified isn't worth giving. Citations and honest “not found” responses are the foundation.",
                ],
                [
                  "Sustainable by design",
                  "A tool the school can't afford won't be adopted. Cost is treated as a feature, not an afterthought.",
                ],
                [
                  "Privacy we control",
                  "The school's documents stay on infrastructure we manage; only minimal snippets ever leave it.",
                ],
                [
                  "Meet staff where they are",
                  "Existing logins, familiar patterns, department-aware access. Nothing new to learn.",
                ],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" />
                  <span>
                    <strong className="text-ink">{t}.</strong>{" "}
                    <span className="text-ink-soft">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section heading="Where the project stands">
            <p>
              We're in the <strong>preview and planning</strong> stage. The
              architecture, the way premium AI is used, the cost strategy, and
              the curated-knowledge approach are all decided and documented. This
              site is how we're sharing that thinking with stakeholders before the
              build begins in earnest.
            </p>
          </Section>
        </div>

        <div className="rule mt-16" />
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/how-it-works" className="link-underline font-semibold text-navy">
            How it works →
          </Link>
          <Link href="/decisions" className="link-underline font-semibold text-navy">
            The key decisions →
          </Link>
        </div>
      </article>
    </>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-ink">{heading}</h2>
      <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-ink-soft [&_em]:text-ink [&_strong]:text-ink">
        {children}
      </div>
    </section>
  );
}
