# Design System

The visual rules for the Litrato Profit Calculator. `CONTEXT.md` defines what the
words mean; this file defines what the app looks like. Architecture decisions
live in `docs/adr/`.

Every colour here is taken from the Litrato logo, so the app reads as part of the
same brand rather than a generic tool wearing a logo.

## Principles

**One colour, one meaning.** The previous design used emerald green as both the
brand accent and the meaning of "profit", with red competing alongside it. That is
why it read as noisy. Here, orange means "you can interact with this" and nothing
else, while green and red are reserved exclusively for money figures and never
appear on a button.

**Scrolling is allowed.** The old single-viewport rule forced every measurement
smaller until the screen was cramped; it is the direct cause of the density
problem. The Calculator should still aim to show its most important information
without scrolling, but this is a goal, not a constraint, and it does not apply to
the Ledger, Account, or sign-in screens at all.

**Legibility outranks decoration.** The primary user reads financial figures on a
phone, sometimes outdoors, sometimes in front of a client. Where a choice trades
elegance against readability, readability wins.

## Colour

### Palette

| Token | Hex | Source in logo | Use |
| --- | --- | --- | --- |
| `--surface` | `#FDF8F0` | camera body cream | Page background |
| `--surface-card` | `#FFFFFF` | wordmark | Cards and raised rows |
| `--surface-tint` | `#FBC376` | peach wedge | Decorative fills and empty-state art only |
| `--text-primary` | `#4B2B05` | wordmark outline | All body and heading text |
| `--text-muted` | `#5D5757` | logo grey | Labels, captions, secondary text |
| `--brand` | `#F36519` | orange wedge | Decorative fills that carry no text: active nav indicator, focus rings |
| `--brand-deep` | `#A83D0B` | orange wedge, darkened | Anything bearing text: buttons, steppers, and orange used as text |
| `--profit` | `#1F7A5C` | mint wedge, deepened | Positive money figures |
| `--profit-soft` | `#B1D8C4` | mint wedge | Background tint behind positive figures |
| `--loss` | `#8D342E` | brick red wedge | Negative money figures and expense totals |

### Why these and not conventional green and red

The logo already contains the two colours money needs: a mint wedge and a brick
red wedge. Using them means the profit and loss colours are simultaneously
conventional enough to read instantly and native to the brand, so cohesion costs
nothing. The raw mint is too pale to carry text, so it is deepened to `#1F7A5C`
for figures and kept at full lightness only as a background tint.

Peach is deliberately **not** a semantic colour. It exists for decorative surfaces
and illustration, and must never indicate state, because a fourth meaningful
colour would recreate the noise this palette is fixing.

### Contrast

Measured against `--surface` (`#FDF8F0`), verified rather than estimated:

| Colour | Ratio | Verdict |
| --- | --- | --- |
| `--text-primary` `#4B2B05` | 12.06:1 | Passes AAA |
| `--loss` `#8D342E` | 7.46:1 | Passes AAA |
| `--text-muted` `#5D5757` | 6.70:1 | Passes AA |
| `--brand-deep` `#A83D0B` | 5.95:1 | Passes AA |
| `--profit` `#1F7A5C` | 4.97:1 | Passes AA |
| `--brand` `#F36519` | 2.97:1 | **Fails AA at any text size** |

White text on a fill:

| Fill | Ratio | Verdict |
| --- | --- | --- |
| `--brand-deep` `#A83D0B` | 6.29:1 | Passes AA |
| `--brand` `#F36519` | 3.14:1 | **Fails AA for normal text** |

This is why there are two oranges. The logo's `#F36519` is the brand's identity
colour, but it is too light to carry text in either direction: dark text on it and
white text on it both fail. It is therefore restricted to shapes that carry no
words — the active navigation indicator, focus rings, decorative accents.

`--brand-deep` is the working colour. Every button, every stepper, and every piece
of orange text uses it, because it passes comfortably as both a fill behind white
text and as text on a light surface. Steppers count here: a plus or minus glyph is
text.

Every new colour pairing must be measured before it ships, not eyeballed. The
first draft of this palette was estimated by eye and three of its five figures
were wrong, one of them in the failing direction. The user reads money in
imperfect light and may have imperfect eyesight; contrast is a functional
requirement, not a compliance checkbox.

## Typography

### Family

```
--font-sans: 'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
```

**Outfit is currently declared but never loaded.** No `@import` and no `<link>`
exists for it, so the app has been silently rendering in `system-ui` while
appearing to specify a typeface. Either load Outfit properly or delete it from the
stack and design honestly against the system font — but the present state, where
the intended font and the rendered font differ, must not survive the redesign.

Outfit is a good fit for this app: geometric, round, and legible at large sizes,
which suits the oversized profit figure. It supports tabular figures, which the
rule below depends on. If it is kept, it must actually be loaded and its weights
subset to the four this scale uses.

### Scale

A single family, weight and size doing the work of distinction. The scale is
deliberately short — more sizes means more decisions and more inconsistency.

| Token | Size | Weight | Use |
| --- | --- | --- | --- |
| `--text-hero` | 2.5rem | 700 | The net profit figure |
| `--text-xl` | 1.5rem | 700 | Screen titles, monthly Ledger totals |
| `--text-lg` | 1.125rem | 600 | Section headings, Job names |
| `--text-base` | 1rem | 400 | Body text, input values |
| `--text-sm` | 0.875rem | 500 | Field labels, row captions |
| `--text-xs` | 0.75rem | 600 | Badges, units, uppercase eyebrows |

Never go below `--text-xs`. If something does not fit, the layout is wrong, not
the type size — that mistake is what produced the current cramped screen.

Numbers displaying currency use tabular figures (`font-variant-numeric: tabular-nums`)
so digits stay aligned as values change. This requires the loaded font to support
the feature, which is a second reason the font question above has to be settled
rather than left implicit.

## Spacing

A 4px base, used through tokens rather than ad-hoc values.

| Token | Value | Typical use |
| --- | --- | --- |
| `--space-1` | 4px | Gap between a label and its value |
| `--space-2` | 8px | Inside a compact control |
| `--space-3` | 12px | Between related rows |
| `--space-4` | 16px | Card padding, between fields |
| `--space-5` | 24px | Between sections |
| `--space-6` | 32px | Above and below major blocks |

Card padding is `--space-4` minimum. Sections are separated by `--space-5`. The
old design used 6px gaps and 44px rows to survive the viewport rule; those values
are now floors to avoid, not targets.

## Touch targets

Every interactive element is at least **44x44px**. Steppers, previously shrunk to
32px, return to 44px minimum and may grow on taller screens. Two adjacent targets
are separated by at least `--space-2` so a mis-tap does not change the wrong
value.

## Layout and navigation

The app has three destinations in a persistent bottom navigation bar: Calculator,
Ledger, Account. The bar sits within thumb reach and uses `--brand` for the active item's
indicator and `--brand-deep` for its label.

The three Modes — Package Rental, Retail Booth, Percentage Cut — are selected
inside the Calculator view and must remain visually distinct from the bottom bar,
so that changing Mode is never confused with changing screen.

Content is laid out in cards on `--surface`, with the net profit figure given the
most prominent position so that it visibly responds to every input change.

## Component rules

**Money figures** use `--profit` when positive and `--loss` when negative, at a
weight heavy enough to scan. The currency symbol is never larger than the number.

**Buttons** use `--brand-deep` as a solid fill with white text for the primary action,
and a bordered treatment with `--brand-deep` for secondary actions. There is at
most one primary action visible on a screen.

**Steppers** keep the plus and minus pattern, both rendered in the same visual
family. The old design coloured plus and minus differently and coloured them by
revenue-versus-expense; that is exactly the double-duty colour use this system
removes.

**Revenue and expense sections** stay clearly separated, but by heading, order and
spacing rather than by shouting in two saturated colours.

**Empty states** explain what will appear and how to make it appear. An empty
Ledger is a normal state for a new user, not an error.

## Iconography

`lucide-react` continues as the icon set. Icons inherit `--text-muted` unless
they are part of an interactive control, in which case they take `--brand-deep`.

The app icon and favicon must be the Litrato mark. The current assets are leftover
Vite template files in purple and blue, which belong to no part of this palette,
and they become more visible once the app is installable to a home screen.

## What this replaces

The previous system used stark white `#FFFFFF` on `#F8FAFC`, blue-grey charcoal
text `#0F172A`, emerald `#059669` as both brand and profit, and vivid red
`#EF4444`, with none of it related to the logo. The move to warm cream surfaces
and brown text is the single change that makes the app feel like Litrato's rather
than a template's.

## Open items

Two decisions are deferred to implementation, to be settled against a rendered
screen rather than on paper:

- Whether Outfit is loaded properly or dropped in favour of the system font.
- The exact treatment of a factor row now that it has room to breathe.
- Where the Save action lives on the Calculator once accounts exist.
