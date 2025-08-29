---
layout: post
title: "Fast, Kind, Useful Code Reviews"
date: 2025-01-10
lang: en
categories: [development]
tags: [code-review, collaboration, development-process, team-culture]
excerpt: "Code reviews make or break team velocity and culture. A system for reviews that ship value without burning relationships."
image: /assets/images/bgs/starry_bg.png
---

Code reviews make or break team velocity and culture. A system for reviews that ship value without burning relationships.

## The Review Philosophy

**Good code reviews are:**

- **Fast:** Hours, not days
- **Kind:** Assume positive intent, suggest improvements
- **Useful:** Focus on impact, not style preferences

**Bad reviews:**

- Bikeshed trivial choices
- Block on personal preferences
- Lack context for feedback

## Pre-Review: Set Up for Success

### Author Responsibilities

```markdown
PR Template:

## What & Why

- Brief context for the change
- Link to ticket/issue

## Testing

- How to verify the change works
- Edge cases considered

## Reviewer Notes

- Areas you want specific feedback on
- Known tradeoffs you made
```

### Size Matters

- **Target:** 200-400 lines
- **Max:** 800 lines (split if larger)
- **Single responsibility:** One logical change per PR

## The Review Process

### 1) First Pass: Architecture & Logic (15 min)

**Questions to ask:**

- Does this solve the right problem?
- Is the approach sound?
- Are there obvious bugs or edge cases?
- Does it fit with existing patterns?

**Don't get distracted by:**

- Formatting (use automated tools)
- Naming (unless truly confusing)
- Minor style differences

### 2) Second Pass: Implementation Details (10 min)

**Focus on:**

- Error handling
- Performance implications
- Security concerns
- Test coverage for critical paths

### 3) Feedback Framework

**Use the SBI model:**

- **Situation:** "In the user service..."
- **Behavior:** "...this function doesn't handle null users..."
- **Impact:** "...which could cause 500 errors in production."

**Label your feedback:**

- `nit:` Minor style/preference (author can ignore)
- `suggestion:` Nice-to-have improvement
- `question:` Seeking clarification
- `concern:` Must address before merge

## Sample Review Comments

### ❌ Unhelpful

```
"This is wrong."
"Use a better variable name."
"I would do this differently."
```

### ✅ Helpful

```
nit: Consider `isEmailValid` instead of `flag` for clarity

suggestion: Could we extract this validation logic into a helper function?
It's used in 3 places and would be easier to test in isolation.

concern: This query runs on every page load. Should we add caching
or move it to a background job?

question: What happens if the API returns a 500 here? Should we
fall back to cached data?
```

## Handling Disagreements

### When You're the Author

- **Ask for context:** "Help me understand the concern with approach X"
- **Propose alternatives:** "What if we did Y instead?"
- **Timebox discussions:** "Let's pair on this for 15 minutes"

### When You're the Reviewer

- **Suggest, don't demand:** "Have you considered..." vs "You should..."
- **Explain the why:** Link to principles, past incidents, or business impact
- **Offer to pair:** Complex feedback works better face-to-face

## Review Speed Targets

| PR Size       | Review Time | Author Response |
| ------------- | ----------- | --------------- |
| < 50 lines    | 2 hours     | 1 hour          |
| 50-200 lines  | 4 hours     | 2 hours         |
| 200-400 lines | 1 day       | 4 hours         |
| 400+ lines    | Split it    | Split it        |

## Automation That Helps

### Pre-commit Hooks

```bash
# Format, lint, and run tests
pre-commit install
```

### Review Assignment

- Round-robin assignment
- Code owner requirements for critical areas
- Optional reviewers for learning opportunities

### Merge Requirements

- 1-2 approvals (team dependent)
- All conversations resolved
- CI passes
- Up-to-date with main branch

## Review Anti-Patterns

### The Perfectionist

- Blocks on minor style preferences
- Asks for extensive refactoring in every PR
- **Fix:** Separate "nice to have" from "must have"

### The Ghost

- Approves without reading
- Never leaves feedback
- **Fix:** Rotate reviewer assignments, pair occasionally

### The Historian

- Brings up every past decision
- Wants to understand the entire codebase evolution
- **Fix:** Focus on the current change, not the journey

## Building a Review Culture

### For Managers

- **Measure review time,** not just code output
- **Celebrate good feedback** in retros
- **Model good reviews** when you participate

### For Teams

- **Review your reviews:** What feedback was most helpful?
- **Rotate reviewers:** Cross-pollinate knowledge
- **Async first:** Don't wait for meetings to resolve simple feedback

## The 24-Hour Rule

If a PR sits unreviewed for 24 hours:

1. Author tags specific reviewers
2. Author mentions in team chat
3. Manager assigns emergency reviewer

Code reviews are a team sport. Fast, kind, and useful reviews create trust, spread knowledge, and ship better software.
