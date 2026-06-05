# Student Portal & the Staff/Student Gate

> **Decision (D-11, scoped by D-12).** TCS-Net serves two audiences through **two entrances**
> with **one-way access**: a **student gate** (get help + submit requests) open to any signed-in
> school account, and a **staff gate** (the full knowledge base + request management) restricted
> to staff. **Staff can enter the student gate; students cannot enter the staff gate.**
>
> **Launch scope (D-12):** student requests are limited to **Operations — IT, Facilities, and
> Food Service**. Sensitive categories (academic, wellbeing, safety) are **not** offered at
> launch; they can be added later only by admin opt-in, as a restricted, designated-staff-only
> channel (see §4).

---

## 1. The gate: role tiers (one-way access)

Access is modeled as **ordered tiers**, not separate silos:

```
student  <  staff  <  (dept admin / global admin)
```

- **Staff routes** require tier **≥ staff** → students are blocked.
- **Student routes** require tier **≥ student** → *everyone* signed in, including staff, can use
  them. Staff are a strict **superset** of students.

This gives exactly the asymmetry required: a staff member can do everything a student can (e.g.
view the help portal, see how a ticket looks), but a student can never reach staff content —
even by typing a staff URL directly, because the gateway re-checks tier on **every** request.

### How audience is determined
From **Google Workspace**, the existing source of truth:
- Students live in the **students org-unit / group** (e.g. `students@cityschool.org`).
- Staff are in the staff groups (`kb-*` groups from [01-system-architecture.md](01-system-architecture.md)).
- The gateway resolves the signed-in account to a tier on login and stamps it on the session.
  A student account simply has no path to staff scope.

> **Hard boundary, not cosmetic.** The two gates are enforced server-side. Hiding a button is
> never the control; the gateway authorization is.

---

## 2. What each gate contains

| | Student gate | Staff gate |
|---|---|---|
| **Who** | Any signed-in school account (students *and* staff) | Staff only |
| **Self-help** | Ask a question over **student-visible** knowledge only | Full department-scoped knowledge base |
| **Tickets** | Submit & track *their own* tickets | Manage the whole ticket queue |
| **Reports / podcasts** | — | Yes |
| **Admin** | — | Per role (steward / dept admin / global admin) |

Student self-help only ever searches content explicitly marked **student-visible** (an
`audience` tag on sources / wiki pages). Staff-only documents are invisible to the student gate
by construction.

---

## 3. Student self-help (deflection first)

When a student asks for help, the system first tries to **answer from student-visible
knowledge** (same grounded, cited engine as staff — see
[02-claude-opus-build-spec.md](02-claude-opus-build-spec.md)). Only if that doesn't resolve it
does the student file a ticket. This **deflects** common questions (saving staff time and
cost), and pre-fills the ticket with what they already tried.

---

## 4. Requests (Operations only at launch)

**A request carries:** category, subject, description, optional attachment, submitter (from
sign-in), created/updated timestamps, assigned department, status, and an audit trail.

**Launch categories (Operations):** **IT · Facilities · Food Service.** Each routes to the
relevant Operations queue, reusing the department model already in the architecture. This keeps
the launch unambiguous and uncontroversial — clear, practical requests with obvious owners.

**Status lifecycle:** `New → In progress → Resolved` (with optional `Closed`). Students see the
status of **their own** requests in "My requests"; staff work the queue from the staff gate.

### Deferred: sensitive channel (academic / wellbeing / safety) — admin opt-in only (D-12)
Sensitive categories are **not part of the launch.** They can be enabled later **only by admin
opt-in**, and would follow a **GoGuardian/Beacon-style** pattern:
- Routed to a **designated, trained safeguarding group only** — never the general queue
  (`access_level = safeguarding`).
- A **Safety** category could be **anonymous-eligible** (no submitter identity; optional opaque
  reference code), since a student may not come forward if named.
- **Not a crisis system.** Any such channel must carry a prominent **"not for emergencies — if
  someone is in danger, contact [X] now"** notice and a real response/coverage plan. This is a
  safeguarding-lead decision, not a software default.

---

## 5. Privacy & safeguarding (students are minors)

- **Data minimisation:** request content is stored in the app's own database (not sent to an
  external model unless self-help is invoked, and then only the question + student-visible
  snippets).
- **Launch scope avoids sensitive data:** Operations-only requests (IT/Facilities/Food Service)
  keep student submissions practical and low-risk by design.
- **If a sensitive channel is later enabled (D-12):** route to the designated safeguarding group
  only; if anonymous, store **no** IP/account linkage; add the "not for emergencies" notice.
- **Compliance:** handle in line with the school's student-data-privacy obligations; keep the
  full audit trail for accountability (identified requests only).

---

## 6. Data model (sketch)

```
ticket
  id, ref_code, category, subject, body,
  submitter_id (nullable for anonymous), audience='student',
  department, status, assignee_id (nullable),
  created_at, updated_at, attachments[]
ticket_event        # audit trail
  ticket_id, actor_id (nullable), type, note, at
audience_tag        # on sources / wiki pages: 'staff' | 'student'
```

---

## 7. Build sequence (incremental)

1. **Tier the gateway** (student vs staff from Workspace) and enforce on all routes.
2. **Student gate shell** + Operations request submission (IT/Facilities/Food Service) + "My requests".
3. **Operations request queue** in the staff gate (list, assign, status).
4. **Self-help deflection** over student-visible content.
5. _(Deferred, admin opt-in)_ **Sensitive/safeguarding channel** — designated-staff routing,
   optional anonymity, "not for emergencies" notice.

---

## 8. References
1. RBAC & departments — [01-system-architecture.md](01-system-architecture.md)
2. Grounded answers — [02-claude-opus-build-spec.md](02-claude-opus-build-spec.md)
3. Curated knowledge / audience tagging — [04-knowledge-layer-llm-wiki.md](04-knowledge-layer-llm-wiki.md)
