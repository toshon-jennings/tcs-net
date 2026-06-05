"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------------------------- data ---------------------------------- */

type Citation = { id: number; source: string; ref: string };
type Report = { title: string; sections: { h: string; b: string }[] };
type Podcast = { title: string; lines: { speaker: "A" | "B"; text: string }[] };
type Demo = {
  q: string;
  answer: string; // may contain [1] / [2] inline citation tokens
  citations: Citation[];
  notFound?: boolean;
  report?: Report;
  podcast?: Podcast;
};
type Dept = { id: string; name: string; demos: Demo[] };

const DEPARTMENTS: Dept[] = [
  {
    id: "science",
    name: "Science",
    demos: [
      {
        q: "What's our policy on make-up lab sessions for absent students?",
        answer:
          "Students absent from a scheduled lab may complete a make-up session within ten school days [1], arranged through the department coordinator. If more than a term has passed, the safety induction must be repeated before they return to the bench [2].",
        citations: [
          { id: 1, source: "Science Dept Handbook 2025", ref: "§4.2 Laboratory Attendance" },
          { id: 2, source: "Whole-School Attendance Policy", ref: "§7 Practical Subjects" },
        ],
        report: {
          title: "Make-up Lab Sessions — Summary for Department Heads",
          sections: [
            {
              h: "Policy",
              b: "Absent students complete labs within ten school days via the coordinator; safety re-induction applies after one term.",
            },
            {
              h: "Why it exists",
              b: "Balances curriculum coverage with lab-safety requirements for students who miss hands-on instruction.",
            },
            {
              h: "Recommendation",
              b: "Add a shared booking sheet so coordinators can track the ten-day window automatically.",
            },
          ],
        },
        podcast: {
          title: "2-minute brief · Make-up Labs",
          lines: [
            { speaker: "A", text: "So if a student misses a lab, what actually happens?" },
            { speaker: "B", text: "They've got ten school days to make it up through the coordinator." },
            { speaker: "A", text: "And the safety side?" },
            { speaker: "B", text: "If a whole term has passed, they redo the safety induction first." },
          ],
        },
      },
      {
        q: "How much budget is left in the science equipment fund this year?",
        notFound: true,
        answer:
          "I couldn't find this in your documents. The knowledge base doesn't currently include live budget figures for the science equipment fund — those live in the finance system, which isn't connected here.",
        citations: [],
      },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    demos: [
      {
        q: "What's the procedure when the fire alarm sounds during an exam?",
        answer:
          "Invigilators note the time and instruct students to leave answer papers face-down [1]. Students evacuate in silence to the designated assembly point and remain supervised so the exam can resume without breaching exam-board rules [2].",
        citations: [
          { id: 1, source: "Exams Contingency Plan", ref: "§3 Evacuation During an Exam" },
          { id: 2, source: "JCQ Emergency Guidance (school copy)", ref: "p.4 Incident Handling" },
        ],
        report: {
          title: "Exam Evacuation — Staff Quick Reference",
          sections: [
            { h: "Immediate steps", b: "Record the time; papers face-down; silent evacuation to the assembly point." },
            { h: "During", b: "Maintain supervision and silence so the session can validly resume." },
            { h: "After", b: "Log the interruption and report to the exams officer for board notification." },
          ],
        },
        podcast: {
          title: "2-minute brief · Exam Evacuations",
          lines: [
            { speaker: "A", text: "Alarm goes off mid-exam — first move?" },
            { speaker: "B", text: "Note the time, papers face-down, evacuate in silence." },
            { speaker: "A", text: "Can the exam still count?" },
            { speaker: "B", text: "Yes, if supervision and silence hold and you log it for the board." },
          ],
        },
      },
    ],
  },
  {
    id: "hr",
    name: "Staff / HR",
    demos: [
      {
        q: "How do I request leave for a family emergency?",
        answer:
          "Notify your line manager as early as possible, then submit a compassionate-leave request through the staff portal [1]. Up to three days are normally granted at the head's discretion, with extensions considered case by case [2].",
        citations: [
          { id: 1, source: "Staff Handbook 2025", ref: "§9.3 Compassionate Leave" },
          { id: 2, source: "Leave & Absence Policy", ref: "§5 Discretionary Leave" },
        ],
        report: {
          title: "Compassionate Leave — One-page Guide",
          sections: [
            { h: "How to request", b: "Tell your line manager, then submit via the staff portal." },
            { h: "What's granted", b: "Up to three days at the head's discretion; extensions case by case." },
            { h: "Good to know", b: "Early notice helps cover arrangements and speeds approval." },
          ],
        },
        podcast: {
          title: "2-minute brief · Compassionate Leave",
          lines: [
            { speaker: "A", text: "Family emergency — what's the fastest route?" },
            { speaker: "B", text: "Tell your line manager, then file it in the staff portal." },
            { speaker: "A", text: "How much time can you get?" },
            { speaker: "B", text: "Usually up to three days, more if the head approves it." },
          ],
        },
      },
    ],
  },
];

const STEP_LABELS = [
  "Checking the curated wiki",
  "Searching department documents",
  "Composing a grounded answer",
];

/* ------------------------------- component -------------------------------- */

type Phase = "idle" | "thinking" | "answering" | "done";

export function ExperienceDemo() {
  const [deptIdx, setDeptIdx] = useState(0);
  const [demoIdx, setDemoIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepsDone, setStepsDone] = useState(0);
  const [typed, setTyped] = useState(0);
  const [panel, setPanel] = useState<"none" | "report" | "podcast">("none");
  const [playing, setPlaying] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const dept = DEPARTMENTS[deptIdx];
  const demo = dept.demos[demoIdx];

  const reset = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setStepsDone(0);
    setTyped(0);
    setPanel("none");
    setPlaying(false);
  }, [clearTimers]);

  const run = useCallback(() => {
    clearTimers();
    setPanel("none");
    setPlaying(false);
    setTyped(0);

    if (reduced.current) {
      setStepsDone(STEP_LABELS.length);
      setPhase("answering");
      setTyped(demo.answer.length);
      setPhase("done");
      return;
    }

    setPhase("thinking");
    setStepsDone(0);
    STEP_LABELS.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setStepsDone(i + 1), 600 * (i + 1)),
      );
    });

    const startTyping = 600 * STEP_LABELS.length + 250;
    timers.current.push(
      setTimeout(() => {
        setPhase("answering");
        let i = 0;
        const tick = () => {
          i += 2;
          setTyped(Math.min(i, demo.answer.length));
          if (i < demo.answer.length) {
            timers.current.push(setTimeout(tick, 16));
          } else {
            setPhase("done");
          }
        };
        tick();
      }, startTyping),
    );
  }, [clearTimers, demo.answer]);

  const selectDept = (i: number) => {
    if (i === deptIdx) return;
    setDeptIdx(i);
    setDemoIdx(0);
    reset();
  };

  const selectDemo = (i: number) => {
    setDemoIdx(i);
    reset();
  };

  const visibleAnswer = phase === "idle" ? "" : demo.answer.slice(0, typed);

  return (
    <div className="overflow-hidden rounded-2xl border border-line-strong bg-card shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_70px_-34px_rgba(38,64,105,0.4)]">
      {/* Window chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper-deep/70 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gold" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="ml-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            TCS·Net — Ask
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-line-strong bg-card p-1">
          {DEPARTMENTS.map((d, i) => (
            <button
              key={d.id}
              onClick={() => selectDept(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                i === deptIdx
                  ? "bg-navy text-paper"
                  : "text-ink-soft hover:text-navy"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 md:p-7">
        {/* Ask row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-line-strong bg-paper px-4 py-3">
            <SearchIcon />
            <p className="flex-1 text-[15px] text-ink">{demo.q}</p>
          </div>
          <button
            onClick={run}
            className="rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-navy-deep"
          >
            {phase === "idle" ? "Ask" : "Ask again"}
          </button>
        </div>

        {/* Suggested questions */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Try:
          </span>
          {dept.demos.map((d, i) => (
            <button
              key={i}
              onClick={() => selectDemo(i)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                i === demoIdx
                  ? "border-navy bg-navy/5 text-navy"
                  : "border-line-strong text-ink-soft hover:border-navy hover:text-navy"
              }`}
            >
              {d.notFound ? "↯ " : ""}
              {shorten(d.q)}
            </button>
          ))}
        </div>

        {/* Result */}
        <div className="mt-6 min-h-[7rem]">
          {phase === "idle" && (
            <div className="rounded-xl border border-dashed border-line-strong bg-paper/50 px-5 py-8 text-center">
              <p className="text-sm text-muted">
                Press <span className="font-semibold text-navy">Ask</span> to see
                a grounded, cited answer appear — just as a staff member would.
              </p>
            </div>
          )}

          {/* Thinking steps */}
          {(phase === "thinking" || phase === "answering" || phase === "done") && (
            <ol className="mb-5 space-y-2">
              {STEP_LABELS.map((label, i) => {
                const active = stepsDone > i;
                return (
                  <li
                    key={label}
                    className={`flex items-center gap-3 text-sm transition-opacity ${
                      active ? "opacity-100" : "opacity-35"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                        active
                          ? "border-navy bg-navy text-paper"
                          : "border-line-strong text-muted"
                      }`}
                    >
                      {active ? "✓" : i + 1}
                    </span>
                    <span className={active ? "text-ink-soft" : "text-muted"}>
                      {label}
                      {i === 0 && active && (
                        <span className="ml-2 rounded bg-gold/25 px-1.5 py-0.5 text-[11px] font-medium text-gold-deep">
                          wiki hit
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          {/* Answer */}
          {(phase === "answering" || phase === "done") && (
            <div className="fade-in rounded-xl border border-line bg-paper/60 p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-navy">
                  {demo.notFound ? "Honest answer" : "The answer"}
                </p>
                {!demo.notFound && (
                  <span className="rounded-full bg-navy/8 px-2.5 py-0.5 text-[11px] font-medium text-navy">
                    {dept.name} · cited
                  </span>
                )}
              </div>

              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                <AnswerText text={visibleAnswer} />
                {phase === "answering" && <span className="caret">.</span>}
              </p>

              {/* Citations */}
              {phase === "done" && demo.citations.length > 0 && (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Sources
                  </p>
                  <ul className="space-y-1.5">
                    {demo.citations.map((c) => (
                      <li key={c.id} className="flex items-start gap-2 text-xs">
                        <span className="font-mono font-semibold text-navy">
                          [{c.id}]
                        </span>
                        <span className="text-ink-soft">
                          <span className="font-medium text-ink">{c.source}</span>{" "}
                          — {c.ref}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Honest note for not-found */}
              {phase === "done" && demo.notFound && (
                <p className="mt-4 border-t border-line pt-4 text-xs text-muted">
                  This is by design — the system says “not found” rather than
                  guessing. <span className="text-gold-deep">That's the trust gate.</span>
                </p>
              )}

              {/* Actions */}
              {phase === "done" && !demo.notFound && (
                <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-4">
                  <ActionButton
                    active={panel === "report"}
                    onClick={() =>
                      setPanel(panel === "report" ? "none" : "report")
                    }
                    icon="report"
                    label="Generate report"
                  />
                  <ActionButton
                    active={panel === "podcast"}
                    onClick={() => {
                      setPanel(panel === "podcast" ? "none" : "podcast");
                      setPlaying(false);
                    }}
                    icon="podcast"
                    label="Generate podcast"
                  />
                </div>
              )}

              {/* Report panel */}
              {phase === "done" && panel === "report" && demo.report && (
                <div className="fade-in mt-4 rounded-lg border border-line-strong bg-card p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold-deep">
                    Generated report · draft
                  </p>
                  <h4 className="font-display mt-2 text-lg font-semibold text-ink">
                    {demo.report.title}
                  </h4>
                  <div className="mt-3 space-y-3">
                    {demo.report.sections.map((s) => (
                      <div key={s.h}>
                        <p className="text-sm font-semibold text-navy">{s.h}</p>
                        <p className="text-sm leading-relaxed text-ink-soft">
                          {s.b}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Podcast panel */}
              {phase === "done" && panel === "podcast" && demo.podcast && (
                <div className="fade-in mt-4 rounded-lg border border-line-strong bg-navy p-5 text-paper">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold-soft">
                        Audio overview · 2 voices
                      </p>
                      <p className="font-display mt-1 text-base font-semibold">
                        {demo.podcast.title}
                      </p>
                    </div>
                    <button
                      onClick={() => setPlaying((p) => !p)}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-navy-deep transition-transform hover:scale-105"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? <PauseIcon /> : <PlayIcon />}
                    </button>
                  </div>

                  {/* Equalizer */}
                  <div className="mt-4 flex h-10 items-center gap-[3px]">
                    {Array.from({ length: 44 }).map((_, i) => (
                      <span
                        key={i}
                        className={`wave-bar w-[3px] flex-1 rounded-full bg-gold-soft/70 ${
                          playing ? "playing" : ""
                        }`}
                        style={{ animationDelay: `${(i % 11) * 0.07}s` }}
                      />
                    ))}
                  </div>

                  {/* Transcript */}
                  <div className="mt-4 space-y-2 border-t border-paper/15 pt-4">
                    {demo.podcast.lines.map((l, i) => (
                      <p key={i} className="text-sm text-paper/85">
                        <span
                          className={`mr-2 font-mono text-xs ${
                            l.speaker === "A" ? "text-gold-soft" : "text-paper"
                          }`}
                        >
                          {l.speaker === "A" ? "Host" : "Guide"}
                        </span>
                        {l.text}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- helpers ---------------------------------- */

function AnswerText({ text }: { text: string }) {
  // Render [n] tokens as small navy citation markers.
  const parts = text.split(/(\[\d+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[\d+\]$/.test(p) ? (
          <sup key={i} className="ml-0.5 font-mono text-[11px] font-semibold text-navy">
            {p}
          </sup>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function ActionButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: "report" | "podcast";
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-navy bg-navy text-paper"
          : "border-line-strong text-ink-soft hover:border-navy hover:text-navy"
      }`}
    >
      {icon === "report" ? <ReportIcon /> : <PodcastIcon />}
      {label}
    </button>
  );
}

function shorten(q: string) {
  return q.length > 46 ? q.slice(0, 44).trimEnd() + "…" : q;
}

/* --------------------------------- icons ---------------------------------- */

const ic = "h-4 w-4 shrink-0";

function SearchIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-muted" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ReportIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none">
      <path d="M6 3h8l4 4v14H6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v4h4M9 13h6M9 17h6M9 9h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function PodcastIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  );
}
