# Context

The shared vocabulary for this project. This file is a glossary and nothing else —
no implementation details, no specs, no decisions. Decisions live in `docs/adr/`.

## Job

A single photobooth engagement that **actually happened** — one wedding, one
birthday, one mall booth weekend. A Job is a record, not a projection: it is
logged after the fact to capture what was really earned.

Every Job is logged under exactly one **Mode**, and regardless of Mode it always
resolves to the same four figures: gross revenue, total expenses, net profit,
and margin. This is what makes Jobs of different Modes comparable and summable
in the **Ledger**.

A Job is explicitly *not* a what-if. Exploring hypothetical pricing before
quoting a client is what the **Calculator** is for, and that exploration is
discarded unless it is saved as a Job.

## Ledger

The chronological history of a user's Jobs, ordered by date, with earnings
totalled over a period (typically a month). The Ledger answers "how is the
business actually doing?", which no single calculation can.

The Ledger is the reason accounts exist. A Calculator needs no login; a Ledger
is a business record that must survive a cleared cache and be readable from
more than one device.

## Account

One signed-in identity, belonging to one person, owning one photobooth business.
An Account is the boundary of visibility: every Job belongs to exactly one
Account, and no Account may ever see another's Jobs.

There is deliberately no notion of staff, members, or roles. Sharing a business
means sharing the login. If teams are ever needed, the concept that would be
introduced is a Business that an Account belongs to — Jobs would hang off the
Business rather than the Account.

## Mode

One of the three business arrangements a photobooth operator works under. Each
Mode has its own revenue and expense structure, because the money genuinely
flows differently:

- **Package Rental** — the operator is hired for a fixed event fee. Revenue is
  that single agreed price.
- **Retail Booth** — the operator rents a venue space and sells prints directly
  to the public. Revenue depends on how many copies actually sell, which makes
  the **Break-Even Point** meaningful here and only here.
- **Percentage Cut** — the operator sells directly at an event but owes the
  venue or organiser a share of gross revenue as commission.

## Break-Even Point

The number of copies that must be sold before a Retail Booth Job stops losing
money. It is specific to Retail Booth, because it is the only Mode where
revenue scales with volume sold rather than being agreed in advance.

## Calculator

The signed-out, no-account surface: enter numbers, see profit immediately,
save nothing. It is the app's front door and must stay fully usable without
signing in.
