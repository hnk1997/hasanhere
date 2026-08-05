# Hasan Nawaz — portfolio homepage

Hasan's content (hasanhere.com) rebuilt in the **nicolearoberts.com** layout, colour scheme and typography.

```
index.html
css/style.css
js/main.js
assets/img/      posters, screenshots, client logos (pulled from hasanhere.com)
assets/video/    case-study walkthrough videos (pulled from hasanhere.com)
```

Open `index.html` over any static server, e.g.

```bash
cd /Users/hasannawaz/Desktop/Shortcuts/Hasanhere2 && python3 -m http.server 4322
```

---

## What was matched to the reference

Measured off nicolearoberts.com at 1440px and reproduced 1:1:

| | value |
|---|---|
| Display type | Afacad — h1 56/400, h2 & card titles 38/500, stat numbers 28/700, strength titles 20/500 |
| UI type | Rubik — body 16/400, quotes 16/300, nav 16/300, labels 14, tags 12 |
| Icons | Material Symbols Rounded |
| Ink / body / muted | `#0b0b0b` / `#505050` / `#757575`, stat numbers `#3b3b3b` |
| Teal | `#00959f`, deep `#076269`, pale `#cee9eb` |
| Surfaces | card `#f4f9fa`, pill `#f7f7f7`, hero `linear-gradient(121deg,#fff,#ecf9fa)` |
| Nav | full-bleed, 24px padding, 98px tall, `rgba(255,255,255,.9)` + blur |
| Hero crossfade | opacity only, `spring(duration 1s, bounce .2)`, 1s delay, 4s dwell |
| Section head | 120/24/20 padding, 24px gap, pill 12×24 @ r32 |
| Case card | 1152×572, 48px padding, r40, 100px gap, text column 462px, media 494×476 |
| Tag | 8×12 @ r100, `rgba(0,149,159,.05)` |
| Buttons | 16×24 @ r365 — primary `#00959f`, secondary white + 1px `#000` |
| Stat divider | 1px `rgba(34,34,34,.1)` |
| Strength card | 368×127, 16px padding, r24, 3-up grid, 24px gap |
| Quote card | 40px padding, r40, balanced 2-column |
| Footer | `#00959f`, r64 64 0 0, 60/40/32 padding |

## Copy

Every line of visible copy is Hasan's own, verbatim from hasanhere.com — hero status,
case-study titles, descriptions, read-times, all seven testimonials, contact details.

Stat values were read out of hasanhere.com's compiled counter props (they render as `0%`
in the DOM until their scroll animation fires):

- Sastaticket — **-19%** drop-off reduction, **+8.4%** completed bookings, **+6.1%** conversion lift
- Aramco — **59%** saved in engineering cost, **70%** faster end to end delivery
- NEOM — **-40%** dev QA cycles, **+25%** faster campaign rollout

## Placeholders — things to fill in

The reference layout has slots Hasan's site has no copy for. These are lorem ipsum:

1. **"My key strengths" — all six cards.** Titles and body text. No equivalent content exists on hasanhere.com.
2. **Third tag on every case card.** Real tags are the read-time and "Video Walkthrough"; the rest are lorem, rendered at reduced opacity so they're easy to spot (`.tag.is-placeholder`).

Three section headings are Nicole's strings kept verbatim as structural placeholders:
"What I've designed recently", "My key strengths", "Don't take it from me – hear it from my managers & peers".

## Deliberate deviations

- **Case cards 4–8 have no stat row.** Hasan's site publishes impact numbers for only the
  first three projects. Nothing was invented to fill the gap.
- **One media element per card, not two.** The reference pairs two phone mockups; Hasan's
  assets are single wide walkthrough videos, placed in the same 494×476 figure.
- **Single CTA per card.** The reference has "View Case Study" + "View Live"; there are no
  public live URLs for Hasan's work, so only the case-study button ships.
- **Hero headline rotates five lines** cut from Hasan's existing hero paragraph — same words,
  re-segmented to fill the reference's rotating-headline slot. The transition is lifted from
  the reference's compiled variant config: a pure opacity crossfade on a
  `{type:'spring', duration:1, bounce:0.2, delay:1}` curve with a 4s dwell between swaps.
  The spring is sampled at 24 steps into a CSS `linear()` easing (`--spring-fade`) rather
  than approximated with a cubic-bezier. No translate, no blur — outgoing and incoming
  fade simultaneously.
- **Writing section and the "Let's solve something meaningful" CTA are not on this page.**
  The reference homepage has no equivalent section. "Writing" remains in the nav.
