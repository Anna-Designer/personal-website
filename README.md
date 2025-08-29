# Anna Designer - Personal Website

A modern, responsive personal website for Anna Designer, a freelance designer and developer specializing in web design, development, and digital strategy.

## Features

- **Multilingual Support**: English and Russian language versions
- **Responsive Design**: Mobile-first approach with modern CSS/Sass
- **SEO Optimized**: Integrated with Jekyll SEO plugins
- **Fast Performance**: Optimized assets and efficient code structure
- **Contact Integration**: Built-in contact form with Formspree/Netlify support
- **Portfolio Showcase**: Dedicated sections for work samples and case studies

## Prerequisites

- Ruby 2.7.0 or higher
- Bundler gem
- Git

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Anna-Designer/personal-website.git
   cd personal-website
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

## Development

To build the website locally:

```bash
bundle exec jekyll build
```

To run the development server:

```bash
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000`

## Project Structure

```
├── _config.yml          # Site configuration
├── _layouts/            # Page layouts
├── _includes/           # Reusable components
├── _sass/              # Sass stylesheets
├── _data/              # Site data files
├── assets/             # Static assets (CSS, JS, images)
├── _works/             # Portfolio work files
├── ru/                 # Russian language content
└── *.md                # Content pages
```

## Customization

- Update site settings in `_config.yml`
- Modify styles in the `_sass/` directory
- Add new content pages in the root or `ru/` directory
- Customize components in the `_includes/` directory

## Deployment

This site is configured for deployment to GitHub Pages. Simply push changes to the `main` branch to trigger automatic deployment.

## License

This project is proprietary software owned by Anna Designer. All rights reserved.

- You may not use, copy, modify, or distribute this code without explicit permission from the owner.
- This includes but is not limited to: forking the repository, creating derivative works, or using the code in commercial projects.
- For licensing inquiries or permissions, please contact Anna Designer directly.







## POSTS

### Designer

```
# 1) Design Systems That People Actually Use

Design systems often fail not because the components are “bad,” but because they don’t reduce *time-to-ship*. Treat your system as a product with users (designers & engineers), a roadmap, and success metrics.

## Define success like a PM

* **North-star metric:** *Time to first reuse (TTFR)* — how long it takes a team to adopt the system on a new screen.
* **Supporting metrics:** Coverage (% of UI built with system), open→merged time for contributions, defects per release, and satisfaction (quick pulse surveys).

## Start with tokens, not components

Design tokens (color, type, spacing, radius, shadow) are the compression layer for consistency.

* Keep a **clear hierarchy**: global → theme → component tokens.
* Name them functionally (`color.text.muted`) not by hex or brand (`color.gray500`).
* Publish tokens to both code and Figma from a single source (automation pays for itself fast).

## Design APIs, not just components

A component is only as usable as its props.

* **Constrain choices**: Offer 3–5 purposeful variants; unlimited options kill consistency.
* **Accessible defaults**: AA color contrast, focus state baked in, logical tab order.
* **Slots & composition**: Make it obvious where icons, helper text, or actions go.
* **Error-proof states**: Loading, empty, error, and success states shipped together.

## Governance, the boring superpower

* **Contribution model:** Document “How to propose a change” with a template (use case, API, accessibility notes, usage examples).
* **Versioning & deprecation:** SemVer + deprecation plan with lint warnings and migration scripts.
* **Release notes:** Changelog with “Why it matters” and a GIF or before/after.

## Documentation that shortens TTFR

* **Copy-paste starters**: One canonical example per variant.
* **Do/Don’t gallery**: Fewer words, more visual rules.
* **Decision logs**: Record trade-offs; it prevents re-litigating the same debates.

## Rollout playbook

1. Pilot with one high-velocity team; fix friction fast.
2. Ship a **migration map** (old → new, with code mods where possible).
3. Add lightweight **lint rules** and **Figma libraries** that default to system components.
4. Celebrate wins: showcase screens built 100% with system parts.

## What to build first (90-day plan)

* Week 1–2: Audit patterns; define tokens; pick 8–12 core components (Button, Input, Select, Modal, Tooltip, Table basics, Tabs, Toast).
* Week 3–6: Ship tokens + 6 components end-to-end (Figma + code); instrument metrics.
* Week 7–12: Harden a11y, add docs, run pilot, iterate, announce v0.1.

**Remember:** A smaller, stable system adopted by many beats an encyclopedic one adopted by none.

---

# 2) AI as Your Junior Designer: A Practical Workflow (That Actually Saves Time)

AI won’t replace designers, but designers using AI will outpace those who don’t. Treat AI like a junior teammate: great at volume, needs direction, and benefits from critique.

## The 7-step loop

1. **Clarify the job**

* Write a one-paragraph brief: user, goal, constraints, success metric.
* Feed real context: brand voice, token palette, sample copy, existing screens.

2. **Ideate wide**

* Prompt for *diverse* directions: “Give me 5 distinct navigation patterns for a mobile banking app, each with a short rationale and risk.”
* Ask for contrasts: conservative, experimental, data-heavy, content-first.

3. **Storyboard and flows**

* Have AI list user flows and edge cases. Then request compact storyboards (frames + captions).
* Use it to enumerate empty, error, loading, and success states you might miss.

4. **Draft content**

* Generate UX copy variants (microcopy, onboarding, empty-state nudges). Provide your tone rules: concise, friendly, no exclamation spam, AA reading level.

5. **Critique & converge**

* Paste your chosen direction and ask for a critique: usability risks, accessibility concerns, cognitive load, and alternative layouts to test.
* Instruct it to find contradictions in your own brief (surprisingly effective).

6. **Spec & handoff**

* Ask for acceptance criteria: “What must be true for this screen to succeed?”
* Generate checklists: interactive states, keyboard navigation, aria labels, tab order.

7. **Experiment scaffolding**

* Have AI draft a simple test plan: hypotheses, tasks, success signals, and sample recruiting screener.

## Prompt patterns that work

* **Role + scenario:** “You’re a senior UX designer auditing onboarding for a fitness app…”
* **Constraints first:** tokens, grid, min tap target, platform guidelines.
* **One ask per prompt:** Ideate → critique → refine → spec (don’t jumble).

## Where AI shines

* Lists, variants, names, copy drafts, edge-case enumeration, quick personas, test tasks, and converting requirements into checklists.

## Where humans must lead

* Interaction nuance, visual hierarchy, motion timing, ethical judgment, and prioritization.

## Guardrails

* **Privacy:** Never paste sensitive customer data.
* **Copyright:** Treat AI images as concept art; validate licensing before shipping.
* **Bias:** Ask AI to self-audit for stereotypes or exclusionary language.
* **Accessibility:** Request contrast checks, alt text suggestions, and motion-safe alternatives.

**Bottom line:** Use AI to move faster between *thinking* states. Keep craft and taste human.

---

# 3) Case Studies That Convert: A Five-Act Script for Your Portfolio

Hiring managers skim. Your case study has 30–60 seconds to hook them and 5 minutes to convince them. Use this structure to tell a crisp, credible story.

## Five acts, one page each

**Act 1 — Hook (The billboard)**

* One sentence problem (“Checkout drop-off was 42% on mobile”).
* One sentence outcome (quantified).
* A single hero image (final state).
* Your role, timeframe, team, tools.

**Act 2 — Context (Why this mattered)**

* Business goal and constraints (platform, timeline, legacy blockers).
* Audience and key jobs-to-be-done.
* Success metrics you targeted (leading + lagging).

**Act 3 — Approach (How you worked)**

* Show 2–3 pivotal decisions, not every step.
* Evidence snapshots: a messy whiteboard, a quick prototype, a user quote.
* Alternatives you *didn’t* choose and why (demonstrates critical thinking).
* Accessibility and internationalization considerations included early.

**Act 4 — Outcome (What changed)**

* Before/after frames with annotations.
* Movement: where attention goes, how the flow shortens.
* Quant results: conversion, time-on-task, support tickets, NPS shift.
* Deployment footprint: % of the product touched, component reuse.

**Act 5 — Reflection (What you learned)**

* What you’d do with 2 more weeks.
* What surprised you (user behavior, tech constraints).
* A short note from a partner (PM/engineer) if you can include one.

## Make it scannable

* Headlines that tell the story: “Reduced checkout steps from 6 → 3” beats “Checkout redesign.”
* Sub-90 word paragraphs, generous white space, numbered captions.

## Evidence over adjectives

Replace “intuitive” with proof: funnel charts, usability metrics, A/B results, or even proxy signals (click maps, task completion).

## Show your judgment

Include one smart trade-off you made (e.g., deferred dark mode to land accessibility fixes first). Explain the reasoning.

## Common mistakes (and fixes)

* **Too long:** Keep the main story to \~5 pages; link deep artifacts separately.
* **Process soup:** Don’t parade every tool; focus on decisions and outcomes.
* **No metrics:** If you lack data, use directional proxies and qualitative signals.
* **No credit:** Name collaborators; state *your* contribution clearly.

## A reusable template

1. **Title:** Outcome-focused headline.
2. **TL;DR card:** Problem, role, timeframe, impact.
3. **Context page:** Goals, users, constraints, success metric.
4. **Approach page:** 2–3 decisions + artifacts.
5. **Outcome page:** Before/after + numbers.
6. **Reflection page:** Lessons + next steps.

**Pro tip:** Write the TL;DR first and design toward it. If you can’t summarize the impact in two sentences, you’re not ready to publish.
```


### Development

```
# Article 1: The 80/20 Guide to Becoming a Senior Developer (Without Burning Out)

**TL;DR:** Seniority is less about years and more about repeatably shipping value, reducing risk, and leveling up others. Focus on decision quality, context, and compounding habits.

## 1) Think in Outcomes, Not Tasks

* **Start from the user/business goal.** Ask: *What changes for whom, by when?* This trims scope and aligns your design.
* **Write a one-paragraph intent.** “We will \[change], for \[audience], measured by \[metric], by \[date].”
* **Prefer bets over projects.** Timebox and instrument; kill low-signal lines quickly.

## 2) Design in Layers

* **Happy path first** → capture the essential sequence.
* **Edge cases next** → enumerate inputs, states, and failure modes.
* **Constraints last** → latency, cost, compliance, rate limits.

**Decision record (DR) template**

1. Context
2. Options (2–4, with tradeoffs)
3. Decision & rationale
4. Reversible? (Y/N)
5. Review date / kill switch

## 3) Communicate Like an Owner

* **Write preview docs.** A 1–2 page memo beats a 40-minute meeting.
* **Make your PRs reviewable.** Small, thematic, and with a crisp description (see Article 2).
* **Broadcast progress.** Weekly status = blockers + next steps + risks with owners.

**Status update skeleton**

* ✅ Done: …
* 🔄 Next: …
* ⚠️ Risks: owner, mitigation, date

## 4) Manage Risk With Guardrails

* **Observability first.** Add metrics, logs, and traces before rollout.
* **Gradual exposure.** Feature flags, canaries, and staged rollouts.
* **Rehearse failure.** Run game days; document pager expectations and runbooks.

## 5) Make Fewer, Better Decisions

* **Reversible vs. irreversible.** Move fast on the former; be deliberate on the latter.
* **Default to simple.** Fewer moving parts = fewer pagers.
* **Bias to delete.** The best code is often code you didn’t write.

## 6) Compound by Teaching

* Pair, mob, and document. Reviews are training moments.
* Leave **breadcrumbs** (why, not just what) in code and ADRs.

## A One-Week Seniority Sprint

* **Mon:** Write intent + DR for your current feature.
* **Tue:** Break work into 1–2 day PRs; add feature flag.
* **Wed:** Add metrics (RED/USE) + dashboards; define SLO.
* **Thu:** Ship a canary; verify with smoke tests.
* **Fri:** Share a 1-pager debrief (what worked, what didn’t, next bet).

---

# Article 2: Fast, Kind, Useful Code Reviews

**TL;DR:** The best reviews increase correctness *and* velocity. Optimize for clarity, small diffs, and teachable feedback. Automate the rest.

## Goals of a Great Review

1. **Correctness & safety:** Logic, data shape, failure modes.
2. **Clarity:** Future readers understand intent quickly.
3. **Consistency:** Team conventions > personal taste.
4. **Coaching:** Explain *why*, not just *what*.

## Author Checklist (Before You Ask for Review)

* [ ] PR < 400 lines (net) and single-theme
* [ ] Clear title: *component: short imperative summary*
* [ ] Description includes **context, approach, screenshots**, and **risk**
* [ ] Tests run locally; CI is green
* [ ] Self-review: leave comments where reviewers might stumble

**PR description template**

```
Title: checkout: add idempotency on CreateOrder

Context
- High duplicate POSTs causing double charges under retry

Approach
- Introduce Idempotency-Key header; upsert by key
- Persist request hash + response in Redis (24h TTL)

Risk & Rollout
- Flag: checkout.idempotency
- Canaries 5% → 25% → 100%; dashboards linked

Validation
- Unit + integration tests; replayed prod traces
```

## Reviewer Checklist

* [ ] Does the change meet the stated intent?
* [ ] Are edge cases and failure modes handled (timeouts, retries)?
* [ ] Naming clear; functions do one thing; comments explain *why*
* [ ] Tests cover the interesting paths; negative cases included
* [ ] Security/privacy: input validation, authz, secrets, PII
* [ ] Performance/cost implications noted

## Comment Taxonomy (to reduce friction)

* **Blocking:** Must fix for correctness/safety.
* **Strong-nit:** Team standard or consistency issue.
* **Nit:** Preference; feel free to ignore.
* **Question:** Seeking clarity; not a request.

Example:

```
Blocking: we should use exponential backoff with jitter here to avoid thundering herd.
Strong-nit: prefer snake_case to match module conventions.
Question: how does this behave when Redis is down?
```

## Strategies for Speed

* **Batch reviews.** Reserve 2–3 review blocks per day.
* **Automate chores.** Linters, formatters, typecheckers, snapshot tests.
* **Pre-commit hooks.** Prevent noisy diffs (whitespace, imports).
* **Split PRs.** One for plumbing, one for behavior.

## Measuring Review Health

* **Lead time to merge** (target: < 24h for small PRs)
* **Rework rate** (post-merge bugfixes linked to PRs)
* **Review coverage** (non-trivial PRs with ≥ 1 reviewer)

## Healthy Team Norms

* Default to kindness; assume good intent.
* Praise good patterns in comments.
* Prefer examples over directives; link docs.

---

# Article 3: Designing Reliable Services — Patterns That Actually Ship

**TL;DR:** Reliability is a set of boring, disciplined habits. Instrument everything, constrain blast radius, and prefer simple controls you can explain at 3am.

## Start With Failure Modes

Make a quick table before you design:

| Failure            | Symptom          | Detection              | Mitigation                |
| ------------------ | ---------------- | ---------------------- | ------------------------- |
| Upstream timeout   | 504s, rising p95 | Timeout metric, alert  | Backoff + circuit breaker |
| Duplicate requests | Double charges   | Idempotency key misses | Idempotency store         |
| Hot partition      | Spiky latency    | p99 per-key dashboard  | Sharding, rate limits     |

## Timeouts, Retries, Backoff

**Rules of thumb:**

* Timeouts < SLA and < upstream timeout.
* Use **exponential backoff with jitter**; cap retries.
* Retries must be **idempotent**.

Pseudocode:

```python
import random, time

BASE = 0.1  # seconds
MAX = 2.0

for attempt in range(5):
    try:
        return call()
    except TimeoutError:
        delay = min(MAX, BASE * (2 ** attempt))
        time.sleep(random.uniform(0, delay))  # jitter
raise TimeoutError("exhausted retries")
```

## Circuit Breakers & Bulkheads

* **Circuit breaker:** trip after N failures, half-open after cool-down.
* **Bulkhead:** isolate resources per tenant/workload to avoid cascade.

Concept sketch:

```ts
class CircuitBreaker {
  state: 'closed'|'open'|'half'; failures = 0
  async exec(fn) {
    if (this.state === 'open') throw new Error('short-circuit')
    try { const r = await fn(); this.failures = 0; return r }
    catch (e) {
      this.failures++
      if (this.failures > 5) this.state = 'open'
      throw e
    }
  }
}
```

## Idempotency & Exactly-Once (Myth)

* **Idempotency keys** on write endpoints; store (key → response).
* Treat **exactly-once** as a convenience; implement **at-least-once** with idempotent consumers.

Consumer pattern:

```
if seen[event.id]: ack(); return
process(event)
mark_seen(event.id)
ack()
```

## Queues, DLQs, and Backpressure

* **Queues** smooth spikes; set max-inflight per worker.
* **Dead-letter queues** capture poison messages with reason.
* **Backpressure**: shed load early (429/503) and degrade gracefully.

## Observability & SLOs

* Choose one **golden signal** per service (latency, errors, traffic, saturation).
* Define an **SLO** (e.g., 99.9% success, 300ms p95) and alert on **error budget burn**, not single metrics.
* Log with **trace IDs** across hops.

## Graceful Degradation

* Feature flags to disable expensive paths.
* Cached fallbacks and partial results (e.g., hide recommendations if they’re slow).
* Progressive enhancements on clients.

## Incidents Without Chaos

* Clear on-call rotation; single incident commander.
* Use a **timeline**; record decisions, not feelings.
* Blameless postmortems: *what, so what, now what*.

## A Minimal Reliability Starter Pack

* Timeouts + retries + jitter everywhere
* Circuit breaker on risky upstreams
* Idempotent writes; dedupe on consumers
* Health checks + readiness + liveness
* Tracing + RED/USE dashboards
* SLO with error budget policy
* Runbook per critical page

**Remember:** Reliability is a product feature. Ship it on purpose.
```



### Freelance


```
# Freelance Pricing That Survives Scope Creep

## Why pricing feels hard (and how to fix it)

Freelancers often undercharge because they price time instead of outcomes, confuse “rate” with “earnings,” and skip guardrails against scope creep. Fixing this means:

* anchoring to business value (not hours),
* setting a clear price floor,
* productizing deliverables,
* and adding contractual protections.

## Step 1: Set your price floor (math you can trust)

Your **price floor** is the minimum you can charge and still hit your goals.

1. Decide your targets

* Desired take-home pay: **\$80,000**
* Annual business expenses (software, gear, health, etc.): **\$20,000**
* Effective tax rate: **25%**
* Working days/year: \~220; assume 50% billable → **110 billable days**

2. Convert to required revenue
   **Required revenue** = (Pay + Expenses) ÷ (1 − Tax)
   \= (80,000 + 20,000) ÷ 0.75 = **\$133,333**

3. Convert to day/hour
   Day-rate floor = 133,333 ÷ 110 ≈ **\$1,210/day**
   If you bill \~6 focused hours/day, hourly floor ≈ **\$200/hr**.

> Use this as a floor. Price projects higher when the business value supports it.

## Step 2: Productize to set expectations

Package your work into named offers with outcomes, timelines, and limits.

**Examples**

* **Audit & Action Plan** — \$1,500, 1 week, up to 2 stakeholder calls, written plan + annotated screenshots.
* **MVP Sprint** — \$6,000, 2 weeks, up to 20 hrs build time, 2 revisions, launch checklist.
* **Optimization Retainer** — \$3,000/mo, up to 12 hrs, monthly KPI review, async support within 1 biz day.

Each package needs:

* **Deliverables** (what they get)
* **Assumptions** (what must be true)
* **Timeline** (start/end, review windows)
* **Limits** (revision counts, response SLAs)
* **Price** (fixed or value-based)

## Step 3: Choose the right pricing model

* **Fixed-fee (most client-friendly):** Scope is clear and risks are contained. Use when you can estimate accurately.
* **Value-based (best upside):** Tie price to impact (revenue, savings, speed). Use when outcomes are measurable.
* **Day/Hour (use sparingly):** Great for discovery or ambiguous work. Put a cap and a not-to-exceed.

## Step 4: Add scope-creep armor to your contract

* **Change-order clause:** “Any work outside the Scope will require a signed Change Order and is billed at $\_\_\_/hr or a separate fixed fee.”
* **Revision limits:** “Includes up to 2 rounds of revisions; additional rounds billed at $\_\_\_/hr.”
* **Dependencies:** “Timeline depends on Client providing content/approvals within 2 business days.”
* **Kill fee:** “If Client cancels after kickoff, a 25% fee of the remaining balance is due.”
* **Deposit:** 30–50% to start; milestone payments thereafter.

## Step 5: Anchor to value in the proposal

Open with the business outcome, not the tasks.

**Mini-structure**

1. **Goal & Impact** (what success looks like)
2. **Plan** (your approach)
3. **Deliverables & Timeline**
4. **Investment & Rationale** (why priced this way)
5. **Next Steps** (how to start)

**Example value anchor**
“Replacing the current funnel could recover \~3–5% of lost leads. At your current volume, that’s \$40–\$65k/quarter. The proposed \$12k fixed fee includes research, redesign, implementation, and A/B validation.”

## Email snippets you can copy

**Proposal cover note**
Subject: Proposal → \[Project Name]
“Hi \[Name], attached is a concise plan to reach \[Outcome]. It’s a fixed price that covers research → implementation → validation, with clear milestones so you always know what’s next. If you’re good to go, I’ll send the kickoff invoice and book the start date.”

**Scope-change response**
“Happy to include \[new request]. Since it’s outside our current scope, I’ve attached a one-page change order: +\$1,800 and +3 business days. Approve here and I’ll slot it in.”

**Rate-increase notice**
“Starting Oct 1, my day rate will be \$1,450 (from \$1,210) to reflect increased demand and expanded capabilities. Existing retainers remain at current rates through year-end.”

## Quick checklist

* [ ] Price floor computed
* [ ] 2–3 productized offers
* [ ] Contract includes change orders, revision limits, kill fee, deposit
* [ ] Proposal leads with value, not tasks
* [ ] Email templates ready to paste

---

# A 90-Day Plan to Build a Freelance Lead Machine

## The outcome

In 12 weeks you’ll have: a clear positioning, a portfolio that sells outcomes, a repeatable outbound + content cadence, and a referral flywheel. Target: **1–2 new clients/month** from your own pipeline.

## Weeks 1–2: Positioning & assets

* **Pick your ICP:** e.g., “Series A SaaS with self-serve onboarding.”
* **Positioning line:** *I help \[ICP] achieve \[Outcome] without \[Pain].*
* **Portfolio refresh:** 3 case studies with problem → approach → result → proof (screenshots/metrics/testimonials).
* **Social proof:** Ask 5 past clients for one-paragraph testimonials.
* **Profiles:** Tighten LinkedIn + website headline to match your positioning.

**Case study outline**

* Context (who/what)
* Constraint (why failing)
* Intervention (what you did)
* Impact (before/after metrics)
* Evidence (quote, screenshot, Loom)

## Weeks 3–4: Foundational outreach (cold but relevant)

* Build a **lead list** of 200 prospects that match your ICP.
* Write **two short outreach templates** (below).
* Send **100 tailored messages/week**. Target **\~10% reply**, **5 discovery calls**, **1–2 new clients**.

**Cold email (pain-point)**
Subject: quick win on \[specific metric]
“Hey \[Name]—noticed \[specific issue] on \[their asset]. I’ve helped \[similar company] lift \[metric] by \[result]. If you want, I can map a 3-step fix on a quick call this week.”

**Cold email (proof-first)**
Subject: we did this at \[peer company]
“Hi \[Name], shipped \[result] for \[peer]. I think you can get a similar lift by \[one concrete suggestion]. Worth a 15-min teardown? I’ll bring a one-pager—yes/no is fine.”

**Follow-up cadence**
Day 2: bump + 1 fresh angle
Day 7: share a Loom teardown (3–5 min)
Day 14: last nudge with a simple “close the loop” ask

## Weeks 5–8: Publish once, atomize everywhere

* **Weekly flagship** (1 deep post, tutorial, or teardown).
* **Atomize** into 5–7 short posts (LinkedIn/Twitter), 1 email to a simple list, and 1 clip or carousel.
* **SEO basics**: one long-tail post/week aimed at your ICP’s search terms.
* **Calls to action**: a single CTA—“Book a teardown” or “Grab the audit.”

**Content ideas that attract buyers**

* Before/after breakdowns with numbers
* Decision frameworks (“When to choose X vs Y”)
* “What I’d do if I ran \[Famous Company]’s \[Thing] for 30 days”
* Toolkits/Checklists (download = soft lead capture)

## Weeks 9–12: Partnerships & referrals

* **Partnerships:** 5 agencies/creators who serve your ICP but don’t compete—offer white-label help or bench support.
* **Referrals:** ask every happy client:
  “If this was helpful, who are 1–2 peers who’d value a 20-minute teardown? Warm intros are gold—no pressure.”

**Referral package** (make it easy)

* 3-sentence blurb about you
* 2 case study links
* Your calendar link
* A forwardable email

## Daily/weekly cadence

* **Daily (45–60 min):** 20 tailored touches, 5 follow-ups.
* **Weekly (2–3 hrs):** one flagship piece + atomization.
* **Weekly (30 min):** pipeline review, update statuses, book next actions.

## Simple pipeline metrics

* Leads contacted → Replies → Calls → Proposals → Wins
* Track: contact count, reply rate (goal 8–12%), call rate (40–60% of replies), close rate (20–40% of proposals), average deal size, cycle length.

## Minimal tool stack

* **CRM:** a spreadsheet or Notion database (status, next step, date).
* **Email:** Gmail + a lightweight follow-up tool (or manual reminders).
* **Calendar/booking:** Calendly or Cal.com.
* **Video:** Loom for teardowns.

---

# Run Your One-Person Business Like a Firm

## Think “systems,” not “tasks”

A resilient solo practice has repeatable systems for **intake, delivery, communication, billing, and cash flow**. Build once; reuse forever.

## System 1: Frictionless onboarding

* **Intake form** (goals, constraints, decision makers, budget, deadline).
* **Kickoff email** with: scope PDF, timeline, comms channels, what you need by when.
* **Folder template** (01\_Contract, 02\_Discovery, 03\_Working, 04\_Deliverables).
* **Welcome packet** (how to give feedback, revision limits, business hours).

**Kickoff email snippet**
“Excited to get started! Attached is the one-page scope and timeline. Slack messages get a response within 1 business day; urgent items by email with ‘URGENT’ in the subject. First milestone delivery is on \[date]. Here’s what I need from you by \[date]…”

## System 2: Project execution without chaos

* **Working cadence:** weekly plan on Monday, ship mid-week, review Friday.
* **Status update template (Fridays):**

  * Shipped ✅
  * Next 🔜
  * Risks ⚠️ (with asks)
  * Decisions needed ❓
* **Feedback window:** fixed 48-hour review periods to avoid drift.
* **Change control:** anything outside the scope triggers a one-page change order.

## System 3: Invoicing & collections that get you paid

* **Payment structure:** 50% to book, 25% mid-milestone, 25% on delivery (or net-7).
* **Late fees:** “1.5%/month after 10 days overdue” (or a flat fee you’re comfortable with).
* **Multiple methods:** bank transfer, card, PayPal, Wise, or Stripe.
* **Collections cadence:** Day 1 friendly reminder → Day 7 “late fee kicks in” → Day 14 pause work → Day 30 send final notice + collections option.

**Invoice line-item example**

* “MVP Sprint — fixed fee — includes discovery, build, QA, handoff — Delivery by Oct 10 — 2 revisions.”

## System 4: Cash-flow and taxes without surprises

* **Three accounts method:**

  * **Income** (all payments land here)
  * **Taxes** (auto-transfer 25–35% each payment)
  * **Operating + Owner’s Pay** (split what’s left using targets, e.g., 50/50)
* **Runway goal:** 3 months of expenses saved.
* **Forecast:** simple monthly sheet for expected invoices, likely pay dates, and obligations.

## System 5: Legal/contract basics (talk to a pro for your country)

* **SOW must-haves:** scope, exclusions, timeline, acceptance criteria, revision limits, IP ownership/license, confidentiality, payment schedule, termination/kill fee, dispute resolution, liability caps.
* **Ownership vs license:** Clearly state who owns what and when (e.g., “Full IP transfers upon final payment”).
* **Portfolio rights:** permission to show work (with or without attribution).
* **NDA sanity:** use mutual NDAs; avoid clauses that block you from working in your niche.

## System 6: Boundaries to prevent burnout

* **Office hours:** state them in the contract and kickoff.
* **Response SLAs:** e.g., “within 1 business day.”
* **Focus blocks:** protect 2–3 no-meeting windows/week.
* **Time off:** put it on the calendar and in your email signature.

## Lite tool stack (swap for equivalents you prefer)

* **Docs/PM:** Notion or Google Drive + Trello/Asana.
* **Time & invoices:** Harvest, Toggl, or Bonsai.
* **Accounting:** QuickBooks, Wave, or a local accountant.
* **Signatures:** PandaDoc, DocuSign, or Dropbox Sign.
* **Comms:** Email + Slack/Discord; Zoom/Meet; Loom.

## One-page change order (template)

* **What changed:** short description
* **Impact:** +$\_\_\_\_ and +\_\_ days
* **New total:** $\_\_\_\_
* **Signature & date**

## Weekly CEO hour (non-negotiable)

Every Friday, spend 60 minutes on the business: review pipeline, send two proposals or follow-ups, reconcile accounts, write one public post, and plan next week’s “big rock.” This single habit compounds more than any tool.

```
