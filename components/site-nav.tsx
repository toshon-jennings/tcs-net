"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/content";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-2xl font-semibold tracking-tight text-pine">
            TCS
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ochre">
            ·net
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`link-underline text-sm font-medium transition-colors ${
                  active ? "text-pine" : "text-ink-soft hover:text-pine"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="https://github.com/toshon-jennings/tcs-net"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line-strong px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-pine hover:text-pine"
          >
            Repository
          </a>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span
              className={`block h-px w-6 bg-ink transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-ink transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-ink transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-paper px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-ink-soft"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/toshon-jennings/tcs-net"
              target="_blank"
              rel="noreferrer"
              className="text-base font-medium text-pine"
            >
              Repository →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
