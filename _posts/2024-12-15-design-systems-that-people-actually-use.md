---
layout: post
title: "Design Systems That People Actually Use"
date: 2024-12-15
lang: en
categories: [design]
tags: [design-systems, design-tokens, component-libraries, design-governance]
excerpt: "Design systems often fail not because the components are 'bad,' but because they don't reduce time-to-ship. Treat your system as a product with users (designers & engineers), a roadmap, and success metrics."
image: /assets/images/bgs/starry_bg.png
---

Design systems often fail not because the components are "bad," but because they don't reduce _time-to-ship_. Treat your system as a product with users (designers & engineers), a roadmap, and success metrics.

## Define success like a PM

- **North-star metric:** _Time to first reuse (TTFR)_ — how long it takes a team to adopt the system on a new screen.
- **Usage metrics:** Component adoption rates, dev hours saved, bug reduction in UI code.
- **Health signals:** Version uptake, deprecation adherence, contribution frequency.

## Start with tokens, not components

Design tokens (color, typography, spacing, radius, shadow) are the compression layer for consistency.

- Maintain **clear hierarchy**: global → theme → component tokens.
- Name them functionally (`color.text.muted`) not by hex or brand (`color.gray500`).
- Publish tokens to both code and Figma from a single source (automation pays off fast).

## Design APIs, not just components

A component is only as usable as its props.

- **Constrain choices**: Offer 3–5 purposeful variants; unlimited options kill consistency.
- **Accessible defaults**: AA color contrast, focus state baked in, logical tab order.
- **Slots & composition**: Make it obvious where icons, helper text, or actions go.
- **Error-proof states**: Loading, empty, error, and success states shipped together.

## Governance, the boring superpower

- **Contribution model:** Document "How to propose a change" with a template (use case, API, accessibility notes, usage examples).
- **Versioning & deprecation:** SemVer + deprecation plan with lint warnings and migration scripts.
- **Release notes:** Changelog with "Why it matters" and a GIF or before/after.

## Documentation that shortens TTFR

- **Copy-paste starters**: One canonical example per variant.
- **Do/Don't gallery**: Fewer words, more visual rules.
- **Decision logs**: Record trade-offs; it prevents re-litigating the same debates.

## Rollout playbook

1. Pilot with one high-velocity team; fix friction fast.
2. Ship a **migration map** (old → new, with code mods where possible).
3. Add lightweight **lint rules** and **Figma libraries** that default to system components.
4. Celebrate wins: showcase screens built 100% with system parts.

## What to build first (90-day plan)

- Week 1–2: Audit patterns; define tokens; pick 8–12 core components (Button, Input, Select, Modal, Tooltip, Table basics, Tabs, Toast).
- Week 3–6: Ship tokens + 6 components end-to-end (Figma + code); instrument metrics.
- Week 7–12: Harden a11y, add docs, run pilot, iterate, announce v0.1.

**Remember:** A smaller, stable system adopted by many beats an encyclopedic one adopted by none.
