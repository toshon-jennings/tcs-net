export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 pb-14 pt-16 md:pt-20">
        <p className="eyebrow rise">{eyebrow}</p>
        <h1
          className="rise font-display mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl"
          style={{ animationDelay: "80ms" }}
        >
          {title}
        </h1>
        {lead && (
          <p
            className="rise mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: "160ms" }}
          >
            {lead}
          </p>
        )}
      </div>
    </header>
  );
}
