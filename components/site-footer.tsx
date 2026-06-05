import Link from "next/link";
import { NAV_LINKS } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold text-navy">
                TCS
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-deep">
                ·net
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              An internal AI knowledge base for school staff — trustworthy, cited
              answers over the school's own documents, with costs and privacy
              under control. This site is a stakeholder preview of the project.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-soft transition-colors hover:text-navy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">Project</p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/toshon-jennings/tcs-net"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-ink-soft transition-colors hover:text-navy"
                >
                  Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/lfnovo/open-notebook"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-ink-soft transition-colors hover:text-navy"
                >
                  Open Notebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="rule mt-12" />
        <div className="mt-6 flex flex-col items-start justify-between gap-2 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} TCS·Net — Internal preview.</p>
          <p className="font-mono uppercase tracking-[0.18em]">
            Status: Preview · Pre-build
          </p>
        </div>
      </div>
    </footer>
  );
}
