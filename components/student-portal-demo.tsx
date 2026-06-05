"use client";

import { useState } from "react";

type Tab = "help" | "ticket" | "mine";

const CATEGORIES = [
  "IT",
  "Facilities",
  "Academic",
  "Wellbeing / Counselling",
  "Safety (can be anonymous)",
  "Other",
];

const MY_TICKETS = [
  { ref: "TCS-1042", subject: "Locker won't lock properly", cat: "Facilities", status: "In progress" },
  { ref: "TCS-1031", subject: "Can't log in to the library portal", cat: "IT", status: "Resolved" },
];

export function StudentPortalDemo() {
  const [tab, setTab] = useState<Tab>("help");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [submitted, setSubmitted] = useState(false);

  const anonymous = category.startsWith("Safety");

  return (
    <div className="overflow-hidden rounded-2xl border border-line-strong bg-card shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_70px_-34px_rgba(38,64,105,0.4)]">
      {/* chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper-deep/70 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gold" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="ml-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            TCS·Net — Student Help
          </span>
        </div>
        <span className="rounded-full border border-line-strong bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gold-deep">
          Student gate
        </span>
      </div>

      {/* tabs */}
      <div className="flex gap-1 border-b border-line px-3 pt-3">
        {[
          ["help", "Get help"],
          ["ticket", "Submit a ticket"],
          ["mine", "My tickets"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === id
                ? "bg-card text-navy shadow-[inset_0_-2px_0_var(--color-navy)]"
                : "text-ink-soft hover:text-navy"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-7">
        {/* GET HELP — deflection */}
        {tab === "help" && (
          <div>
            <div className="flex items-center gap-3 rounded-xl border border-line-strong bg-paper px-4 py-3">
              <span className="text-muted">?</span>
              <p className="flex-1 text-[15px] text-ink">
                How do I reset my school email password?
              </p>
            </div>
            <div className="mt-4 rounded-xl border border-line bg-paper/60 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-navy">
                Suggested answer
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                Go to <span className="text-ink">the student portal</span> → Settings →
                Password, or visit the IT desk in the library at break. Resets apply within a
                few minutes.
                <sup className="ml-0.5 font-mono text-[11px] font-semibold text-navy">
                  [1]
                </sup>
              </p>
              <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
                <span className="font-mono font-semibold text-navy">[1]</span> Student IT Guide —
                §2 Accounts &amp; Passwords
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line-strong px-4 py-3">
              <p className="text-sm text-muted">Didn&apos;t solve it?</p>
              <button
                onClick={() => setTab("ticket")}
                className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-navy-deep"
              >
                Submit a ticket →
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              Self-help answers come first — most quick questions never need a ticket.
            </p>
          </div>
        )}

        {/* SUBMIT A TICKET */}
        {tab === "ticket" && !submitted && (
          <div className="space-y-4">
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[15px] text-ink outline-none focus:border-navy"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Subject">
              <input
                readOnly
                value="Projector in Room 14 won't turn on"
                className="w-full rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[15px] text-ink outline-none focus:border-navy"
              />
            </Field>
            <Field label="What's happening?">
              <textarea
                readOnly
                rows={3}
                value="The projector shows no signal even after restarting. Affects our morning class."
                className="w-full resize-none rounded-lg border border-line-strong bg-paper px-3 py-2.5 text-[15px] text-ink outline-none focus:border-navy"
              />
            </Field>

            {anonymous && (
              <div className="flex items-start gap-3 rounded-lg border border-gold/40 bg-gold/10 p-3">
                <span className="mt-0.5 text-gold-deep">🔒</span>
                <p className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink">Submitted anonymously.</span> Safety
                  concerns can be reported without your name — it routes straight to the
                  safeguarding team.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted">
                Signed in as{" "}
                <span className="text-ink-soft">
                  {anonymous ? "— (anonymous)" : "a.student@cityschool.org"}
                </span>
              </p>
              <button
                onClick={() => setSubmitted(true)}
                className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-navy-deep"
              >
                Submit ticket
              </button>
            </div>
          </div>
        )}

        {/* SUBMITTED confirmation */}
        {tab === "ticket" && submitted && (
          <div className="rounded-xl border border-line bg-paper/60 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy text-paper">
              ✓
            </div>
            <h4 className="font-display mt-4 text-lg font-semibold text-ink">
              Ticket submitted
            </h4>
            <p className="mt-2 text-sm text-ink-soft">
              {anonymous ? (
                <>
                  Reference <span className="font-mono text-navy">TCS-1058</span> — routed to the
                  safeguarding team. Keep this code to check back.
                </>
              ) : (
                <>
                  Reference <span className="font-mono text-navy">TCS-1057</span> — routed to{" "}
                  <span className="text-ink">{category}</span>. Track it under “My tickets”.
                </>
              )}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-5 rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-navy hover:text-navy"
            >
              Submit another
            </button>
          </div>
        )}

        {/* MY TICKETS */}
        {tab === "mine" && (
          <ul className="space-y-px overflow-hidden rounded-xl border border-line-strong bg-line-strong">
            {MY_TICKETS.map((t) => (
              <li
                key={t.ref}
                className="flex items-center justify-between gap-4 bg-card px-5 py-4"
              >
                <div>
                  <p className="text-[15px] text-ink">{t.subject}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted">
                    {t.ref} · {t.cat}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    t.status === "Resolved"
                      ? "bg-navy/8 text-navy"
                      : "bg-gold/25 text-gold-deep"
                  }`}
                >
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
