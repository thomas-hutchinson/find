# Bois Weekend — wayfinding handover

Status as of 2026-10-07. Planning only: no App code exists yet.

## Where things live

- **The map:** [Map: Bois Weekend](https://github.com/thomas-hutchinson/find/issues/4).
  It is the single source of truth: destination, settled choices, decisions so
  far, fog, and what is out of scope. Its tickets are the map's sub-issues.
- **Vocabulary:** `CONTEXT.md`, section *Bois Weekend*. It defines Weekend,
  Receipt, Member, Item, Settlement and Transfer.
- **Research notes:** `docs/research/bois-weekend-*.md`. Each one is linked
  from its closed ticket.

## Destination

A build-ready spec for **Bois Weekend** (id `bois-weekend`, class prefix `bw-`),
with nothing left to decide before building starts.

## Decided

- **Shared and live:** each friend signs in on their own phone. An invite link
  only lets a signed-in person join. The server enforces Weekend membership on
  every read and write.
- **Backend:** [Which backend should host Bois Weekend?](https://github.com/thomas-hutchinson/find/issues/5)
  chose Supabase Free in Sydney. Postgres RLS covers rows, realtime and
  Storage. The Claude key lives in an Edge Function. Backend code goes in
  `src/apps/bois-weekend/backend/`, as the third AGENTS.md exception.
- **Receipt reading:** [How should Claude read a receipt photo into Items?](https://github.com/thomas-hutchinson/find/issues/6)
  chose Sonnet 5.5 at low effort, with one retry on Opus 5.5 when the sum
  check fails. Output is structured JSON in integer cents. Photos are resized
  on the phone.
- **Settlement:** [How do we compute the fewest Transfers, to the cent?](https://github.com/thomas-hutchinson/find/issues/7)
  computes an exact minimum with largest-remainder cent rounding. Unpaid
  Transfers already shown stay put while they are still minimal.
- **Splitting rules:** Items split evenly by default, with custom shares
  allowed. One currency per Weekend, default NZD, GST-inclusive. Receipt-level
  adjustments are shared in proportion to each Member's Items.
- **Placeholders:** Members can be placeholders until the real person takes
  them over.

## Open tickets

| Ticket | Type | Ready? |
| --- | --- | --- |
| [What are Bois Weekend's screens and flow?](https://github.com/thomas-hutchinson/find/issues/8) | prototype (HITL) | Yes |
| [What is Bois Weekend's data model and access rules?](https://github.com/thomas-hutchinson/find/issues/9) | grilling (HITL) | Yes |
| [How does Bois Weekend's backend fit Find's repo, build and deploy?](https://github.com/thomas-hutchinson/find/issues/12) | grilling (HITL) | Yes |
| [Does Google sign-in survive the installed iOS app?](https://github.com/thomas-hutchinson/find/issues/13) | task (HITL, real iPhone) | Yes |
| [How does a friend join a Weekend and take over a placeholder?](https://github.com/thomas-hutchinson/find/issues/10) | grilling (HITL) | Blocked by the iOS sign-in test |
| [How does a Member check and fix what Claude read from a receipt?](https://github.com/thomas-hutchinson/find/issues/11) | grilling (HITL) | Blocked by the screens prototype |

## Known catches awaiting a decision

- **Idle pausing:** a Free Supabase project pauses after 7 days idle. Choose
  between a manual Resume, a keep-alive job, or Pro at US$25/mo. This is
  tracked in the backend/deploy ticket.
- **Email sign-in:** Supabase's default sender allows 2 emails an hour, so a
  custom sender is needed. Emailed magic links break in the installed iOS app;
  use a 6-digit code instead.
- **Sign in with Apple:** costs US$99/yr plus a secret rotation every 6 months.
  Decide in the joining ticket.
- **Before building:** run the receipt-reading eval on about 30 real NZ
  receipts.

## How to resume

Run `/mattpocock-skills:wayfinder` with the map URL. It takes the first
unblocked ticket. Resolve one ticket per session: post a resolution comment,
close the ticket, and add one line to the map's *Decisions so far*.

## Deviations from the wayfinder defaults

- **No type labels:** the `wayfinder:research|prototype|grilling|task` labels
  don't exist in the repo, and the tooling couldn't create them. Each ticket
  states its type in its body.
- **Blocking in the body:** the tooling has no native GitHub dependency edges,
  so each ticket lists its blockers under `## Blocked by`.
- **Research location:** research went to `docs/research/` on this branch
  instead of throwaway `research/<name>` branches.
