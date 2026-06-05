export const NAV_LINKS = [
  { href: "/story", label: "The Story" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/decisions", label: "Decisions" },
  { href: "/cost", label: "Cost" },
  { href: "/design", label: "Design" },
];

export const PILLARS = [
  {
    no: "01",
    title: "Answers you can trust",
    body: "Every answer is drawn only from the school's own documents and shows its source. If something isn't in the documents, the system says so — it never guesses.",
  },
  {
    no: "02",
    title: "Costs that stay in budget",
    body: "Simple questions run on inexpensive models; only complex reports use the premium one. A single hard spending cap means the bill can never run away.",
  },
  {
    no: "03",
    title: "Private by design",
    body: "The school's documents live on infrastructure we control. Only the small snippets needed to answer a question are ever sent to an AI model.",
  },
  {
    no: "04",
    title: "Nothing new to learn",
    body: "Staff sign in with the Google accounts they already use, and the experience mirrors tools they already know. Each person sees only what their department allows.",
  },
];

export const DECISIONS = [
  {
    id: "D-1",
    title: "An open, self-hosted knowledge engine",
    chose:
      "We use Open Notebook — an open-source, self-hostable tool — as the core engine for search, citations, and audio summaries, rather than a single cloud vendor's product.",
    why: "The school's documents stay on infrastructure we control, we're not locked to one vendor's pricing, and it natively supports multi-speaker audio summaries.",
    tradeoff: "We run and maintain a little more infrastructure ourselves.",
  },
  {
    id: "D-2",
    title: "Premium AI only where it counts",
    chose:
      "Each task is routed to the cheapest model that's good enough; the premium model (Claude Opus) is reserved for formal reports and complex synthesis.",
    why: "Quality where it matters, without paying premium prices for simple questions.",
    tradeoff: "Slightly more routing logic to maintain.",
  },
  {
    id: "D-3",
    title: "One billing gateway with a hard cap",
    chose:
      "AI requests go through OpenRouter, which gives one bill, access to many models, and a monthly spending ceiling that cannot be exceeded.",
    why: "Cost predictability is essential to adoption — one dial controls the maximum possible spend.",
    tradeoff: "A small price markup versus going direct to each provider.",
  },
  {
    id: "D-4",
    title: "Sign in with Google Workspace",
    chose:
      "Staff log in with their existing school Google accounts; their department and role control what they can see.",
    why: "No new passwords, a familiar experience, and it leverages permissions the school already manages.",
    tradeoff: "Depends on Google Workspace as the identity system — which it already is.",
  },
  {
    id: "D-5",
    title: "Grounded, or it doesn't ship",
    chose:
      "The system only answers from the provided documents and shows a citation for every claim. “I couldn't find that in your documents” is an expected, acceptable answer.",
    why: "Trust. Staff need to believe the answers — and be able to verify them.",
    tradeoff: "The system sometimes says “not found” instead of guessing. By design.",
  },
  {
    id: "D-6",
    title: "A curated wiki, plus search",
    chose:
      "Alongside document search, the system maintains a curated, AI-written wiki of the school's most important, frequently-asked knowledge — readable pages with citations and contradiction flags.",
    why: "More trustworthy and readable for staff and leaders, and cheaper to answer from. It improves over time as good answers are filed back in.",
    tradeoff:
      "Someone reviews the wiki when the AI flags a contradiction or a big rewrite — a deliberate human-in-the-loop trust gate. We phase it in.",
  },
];

export const UX_PRINCIPLES = [
  {
    title: "Familiar, not novel",
    body: "Model the experience on tools staff already know — there should be almost nothing to learn.",
  },
  {
    title: "Trust is visible",
    body: "Citations, source links, and honest “not found” states sit front-and-center. The interface's job is to make answers verifiable.",
  },
  {
    title: "Scoped by default",
    body: "People see their own department's content automatically. They never have to think about permissions to stay safe.",
  },
  {
    title: "Cost-aware by design",
    body: "Expensive actions — formal reports, audio summaries — are deliberate, opt-in steps, never things that fire on every keystroke.",
  },
];

export const UX_DECISIONS = [
  {
    id: "UX-1",
    element: "Search bar",
    decision: "A single prominent natural-language box on the home screen.",
    why: "The lowest-friction entry point; mirrors what staff already expect.",
  },
  {
    id: "UX-2",
    element: "Answer view",
    decision: "Inline citations that link back to the source document.",
    why: "Makes every answer verifiable, which builds trust.",
  },
  {
    id: "UX-3",
    element: "Department filter",
    decision: "Pre-set to the user's department; cross-department only if their role allows.",
    why: "Safe by default — no permissions to think about.",
  },
  {
    id: "UX-4",
    element: "Generate report",
    decision: "An explicit button, never automatic.",
    why: "Keeps premium-cost actions deliberate.",
  },
  {
    id: "UX-5",
    element: "Generate podcast",
    decision: "An explicit button with a length cap.",
    why: "Audio is opt-in — it controls the sneakiest cost.",
  },
];

export const COST_TIERS = [
  {
    tier: "Tier 0",
    task: "Behind-the-scenes indexing and tagging",
    model: "Self-hosted / cheapest model",
    note: "Highest volume, near-zero value per call.",
  },
  {
    tier: "Tier 1",
    task: "Refining a question, short summaries",
    model: "Fast, inexpensive model",
    note: "Frequent, simple, and latency-sensitive.",
  },
  {
    tier: "Tier 2",
    task: "Everyday cited answers",
    model: "Mid-tier model",
    note: "The everyday workhorse.",
  },
  {
    tier: "Tier 3",
    task: "Long-form reports, complex synthesis",
    model: "Claude Opus (premium)",
    note: "Reserved for work that's genuinely hard.",
  },
];

export const STEPS = [
  {
    no: "01",
    title: "Ask in plain language",
    body: "A staff member types a question into the search bar — no special syntax, just how they'd ask a colleague.",
  },
  {
    no: "02",
    title: "Scoped to what they can see",
    body: "The system automatically limits the search to the documents their department and role permit. A person can never widen their own access.",
  },
  {
    no: "03",
    title: "Find, then reason",
    body: "It checks the curated wiki first, then the wider document library, and pulls the most relevant, cited passages.",
  },
  {
    no: "04",
    title: "A grounded, cited answer",
    body: "The right AI model composes the answer from those passages — with a citation on every claim — or honestly reports that nothing was found.",
  },
  {
    no: "05",
    title: "Reports & audio, on request",
    body: "With one click, staff can turn results into a formal report or a multi-speaker audio summary to listen to on the go.",
  },
];
