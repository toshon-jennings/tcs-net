"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/content";
import { asset } from "@/lib/asset";
import { BuildingIcon } from "@/components/building-icon";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src={asset("/brand/logo-transparent.png")}
            alt="The City School"
            width={696}
            height={170}
            priority
            className="h-8 w-auto md:h-9"
          />
          <span className="hidden border-l border-line-strong pl-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted lg:inline">
            Knowledge Base
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <Link
            href="/"
            aria-label="Home"
            className={`transition-colors ${
              pathname === "/" ? "text-navy" : "text-ink-soft hover:text-navy"
            }`}
          >
            <BuildingIcon className="h-7 w-7" />
          </Link>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`link-underline whitespace-nowrap text-sm font-medium transition-colors ${
                  active ? "text-navy" : "text-ink-soft hover:text-navy"
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
            className="rounded-full border border-line-strong px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-navy hover:text-navy"
          >
            Repository
          </a>
          <a
            href="https://tcs.raiseaticket.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Raise a ticket"
            className="flex items-center rounded-full border border-line-strong bg-card px-4 py-2 transition-colors hover:border-navy"
          >
            <Image
              src={asset("/brand/raiseaticket-logo.png")}
              alt="Raise a Ticket"
              width={131}
              height={30}
              className="h-4 w-auto"
            />
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
              className="text-base font-medium text-navy"
            >
              Repository →
            </a>
            <a
              href="https://tcs.raiseaticket.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              aria-label="Raise a ticket"
              className="flex w-fit items-center rounded-full border border-line-strong bg-card px-4 py-2"
            >
              <Image
                src={asset("/brand/raiseaticket-logo.png")}
                alt="Raise a Ticket"
                width={131}
                height={30}
                className="h-4 w-auto"
              />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
