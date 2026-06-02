# 정지은 일산 ABA — Design System

A warm, premium, emotionally-branded design language for **정지은 일산 ABA** (CHUNG Ji-eun Ilsan ABA), an Applied Behavior Analysis (ABA) therapy / child‑development center based in Ilsan, Korea.

The system blends three influences specified by the brand owner:

> **Apple** (calm typographic restraint, generous whitespace)
> **+** **Premium Education Center** (trust, warmth, expertise)
> **+** **Emotional Branding** (soft motion, hand-feel warmth, child-centered photography)

---

## Source materials

| Source | What it gave us |
|---|---|
| **Logo PNG** (`uploads/KakaoTalk_Photo_2026-05-20-17-44-07.png`) | The "aba" wordmark + Korean / Latin lockup. Brand orange→green gradient was sampled directly from this file. |
| **4 interior photos** (KakaoTalk_Photo_2026-05-20-17-48-{24,28,32,37}.jpeg) | Reception desk, parent lounge, child library, therapy-room corridor. Confirmed the warm-wood + clean-white interior palette and supplied the hero slider imagery. |
| **Brief (Korean)** | Required pages, content structure, tech stack (Next.js 15 + Tailwind + shadcn/ui + Framer Motion), motion vocabulary, and CMS scope. |
| **Reference** [onsarang.kr](http://www.onsarang.kr/) | Style benchmark for the ABA-center category — referenced for category vocabulary, **not** copied. |
| **Figma** [Inclusive After-School Club (Community)](https://www.figma.com/site/7NprMlwXhBDls7v3OzPwFj/Inclusive-After-School-Club--Community-) | Mood reference for layout density and section rhythm. Visuals were **not** copied; the user explicitly asked us not to. |

> ⚠️ **The Figma file was not opened with design-context tooling** — we worked from the user's brief plus the supplied photos. If you have edit/view access to the Figma file, point us at specific frames and we can mine real component specs.

---

## What's in this folder

```
.
├── README.md                  ← you are here
├── SKILL.md                   ← Agent Skill manifest (Claude Code-compatible)
├── colors_and_type.css        ← All design tokens (color, type, spacing, motion)
├── assets/                    ← Logos, interior photos, KakaoTalk icon
├── preview/                   ← Static cards that populate the Design System tab
└── ui_kits/
    └── website/               ← Hi-fi recreation of the marketing site + admin
        ├── README.md
        ├── index.html         ← Click-thru prototype (homepage + nav to all pages)
        ├── tokens.css         ← Site-scoped overrides
        ├── *.jsx              ← Modular components
```

---

## Content fundamentals

The center's voice is **warm, sincere, and deeply parent-facing** — never clinical, never marketing-loud.

| Aspect | Rule | Example |
|---|---|---|
| **Primary language** | Korean (`ko-KR`). English appears only in the brand name lockup and small support text. | "정지은 일산 ABA" / "CHUNG ji eun applied behavior analysis" |
| **Voice** | First-person plural for the center ("저희가 함께…"). Second-person honorific (`-요`, `-습니다`) for the family. Avoid `-다` declarative. | "아이의 가능성을 함께 키워갑니다." |
| **Address** | Always honorific. Parents addressed as **부모님**, child as **아이**. The lead therapist is **원장님** / **정지은 BCBA**. | "부모님께서 가장 잘 아십니다." |
| **Tone** | Calm, certain, hopeful. Never breathless. Never "혁신적인" / "최고의" / superlative-stacking. | "차근차근, 아이의 속도로." |
| **Casing (English)** | Sentence case for nav and buttons. ALL-CAPS reserved for the eyebrow micro-label (e.g. `ABOUT US`). | `Our Programs`, not `OUR PROGRAMS` |
| **Punctuation** | Korean full-width punctuation (`，` is wrong — use `,` Latin). Em dash `—` for emphasis. Avoid exclamation marks in body copy. | "ABA는 — 작은 변화부터 시작합니다." |
| **Numerals** | Western digits, tabular numerals enabled in the CSS. Use 한글 only for ages in promotional copy ("만 3세–7세"). | `2026.05.20`, `만 3세` |
| **Emoji** | **No.** Emoji is not used anywhere. The brand's "warmth" comes from photography and color, not pictographs. | — |
| **CTA verbs** | Action + softening: `상담 신청하기`, `더 알아보기`, `프로그램 보기`. Never single-word `신청!` | `무료 상담 예약하기 →` |
| **Vibe in one line** | "한 아이를 위한, 한 사람의 전문성." (One specialist, one child.) | — |

### Copy samples worth reusing
- **Hero kicker:** "정지은 일산 ABA"
- **Hero promise:** "한 아이의 속도로, 한 걸음씩."
- **About headline:** "응용행동분석(ABA)으로 만나는 작은 변화들"
- **Closing CTA:** "지금, 부모님의 첫 상담을 도와드릴게요."

---

## Visual foundations

### Palette
- **Two-color brand:** sunrise **orange `#F8AD46`** → leaf **green `#7DBE32`**, joined by a soft yellow `#FFC857`. Always a 95° gradient, never vertical.
- **Neutrals are warm**, not cool: page background is `#FBF8F3` (paper-cream), not pure white. Borders are `#EEE7DA`.
- **Wood accents** (`#E8D7B8`, `#C8A878`, `#8C6A3F`) appear in photography surrounds, illustrations and dividers — never as text fills.
- **No bluish-purple gradients. Ever.**

### Type
- **One family — Pretendard Variable.** It carries Korean + Latin in the same metrics and reads as crisply as SF Pro. Weights used: 400 / 500 / 600 / 700.
- Display sizes are huge and tight (`-0.025em`), like Apple landing pages. Body is `16px` with `1.7` line-height — generous, breathable.
- Eyebrows are `13px / 600 / uppercase / +0.08em / brand-green-deep`.
- **No serifs.** Premium feel comes from spacing + weight contrast, not from a serif accent.

### Spacing & layout
- **4pt base** — `--space-1` … `--space-32`. Section padding is `clamp(64px, 10vw, 128px)` vertical.
- Max content width `1280px`, wide variant `1440px`. Gutter `clamp(20px, 4vw, 48px)`.
- Header is **always fixed**, 72px, with backdrop blur. Footer is non-sticky.
- 12-col grid implied via CSS Grid; cards align to a 4-col / 8-col / 12-col rhythm.

### Backgrounds
- Hero: **full-bleed photography** with a 20–35% dark gradient overlay from bottom for legibility. Photos are always **warm-leaning** (interiors in this brand are wood+cream).
- Section backgrounds alternate `--bg-base` (cream) and `--bg-surface` (white). The third alt is a tinted `--brand-gradient-soft` band, used sparingly (one band per page max).
- **No repeating patterns, no noise textures, no SVG hand-drawn squiggles.**

### Motion
- Easing: **`--ease-out-soft` (cubic-bezier(0.22, 1, 0.36, 1))** for entrances; `--ease-in-out` for state changes; `--ease-spring` only for hover micro-bounce.
- Durations: `160 / 280 / 480 / 900 ms`. Hero crossfade is 900ms; component entrances 480ms; hovers 160ms.
- Patterns in use: `fade-in`, `slide-up (16-24px)`, `stagger (60ms)`, `parallax (8-12%)`, `blur-to-clear (8px→0)`, `hover-scale (1.0→1.02)`. **No bounces on full elements.** Spring only on tiny icon nudges.
- Hero slider: **crossfade + scale-1.04→1.0** on the active image (Ken Burns lite).

### Hover & press states
- **Buttons:** primary darkens to `--brand-orange-deep` (orange) / `--brand-green-deep` (green), shadow lifts from `--shadow-sm` → `--shadow-md`. Press scales to `0.98`.
- **Cards:** lift translateY(-4px), shadow `--shadow-sm` → `--shadow-md`, 280ms. Image inside scales 1.0→1.04. No border-color shift.
- **Links (text):** brand-green-deep underline grows from 0 to 100% width, 280ms ease-out-soft.
- **Icon buttons:** background fades from transparent → `--bg-muted`. No color invert.

### Borders, shadows, radii
- Borders are `1px solid var(--border-1)` (`#EEE7DA`) — barely visible, used only where necessary to separate cards from cream bg.
- **Three-level shadow system** — `xs / sm / md / lg`, all warm (rgba of `#1C1A17`). Plus two brand glows for CTAs (orange + green).
- **Radii:** inputs/buttons `12px`, cards `20px`, hero `28px`, modal `28px`, avatar `999px`. The brand's roundness is generous but never bubbly.

### Cards
- Background `#FFFFFF`, radius `20px`, shadow `sm`, no border by default.
- Photo cards: image takes the top 60–66% with a 20px border-radius matching the card; text body sits below with 24px padding.
- Hover: lift + image scale (see above). Title color stays — only the image moves.

### Transparency & blur
- The fixed header uses `backdrop-filter: blur(20px) saturate(180%)` over `rgba(255, 255, 255, 0.72)`.
- Modals dim the background with `rgba(28, 26, 23, 0.55)` + `backdrop-filter: blur(8px)`.
- Hero protection gradient is `linear-gradient(180deg, transparent 40%, rgba(28,26,23,0.55) 100%)` — never a capsule behind text.

### Imagery
- Real photography of the center (warm tungsten lighting, wood-and-cream interior). When stock is needed, prefer **warm, soft, slightly-grainy** child/family photography — never cold or clinical hospital imagery.
- **No AI-rendered cartoons. No emoji.**
- Children's faces in real photos must be obscured/blurred until consent confirmed — flag this with the client.

### Layout rules
- The header is fixed-top, full-width, always white-blur.
- The Kakao consultation button is a fixed FAB, bottom-right, `--kakao` yellow, `--radius-pill`.
- "Pinned notice" lives at the top of the notice board with a `--brand-orange` left accent **dot** (4px circle), not a left border.

---

## Iconography

> See [`assets/`](./assets) for icon-set files copied in.

- **Stroke icons via Lucide** are the brand's icon system. Loaded from CDN (`https://unpkg.com/lucide@latest`). Stroke width **1.75**, line-cap round, line-join round, sized in **20 / 24 / 32 px** buckets.
- **Why Lucide:** the brief doesn't ship an icon set, and Lucide's calm 1.75px stroke matches the Apple+premium-education feel better than Material Symbols (too utilitarian) or Heroicons (too thick at `solid`). **This is a substitution** — if you have an in-house icon set, drop the SVGs into `assets/icons/` and update `ui_kits/website/Icon.jsx`.
- **Logo files** in `assets/logo-aba.png` are the canonical brand mark. There's no monogram-only or stacked variant supplied — flag for client to commission both.
- **Emoji and unicode characters are NOT used as icons anywhere.** This is an intentional brand rule.
- **KakaoTalk button**: a small custom SVG bubble (in `Icon.jsx`) at the brand-mandated `#FEE500` yellow. This is the one non-Lucide icon.

---

## Index

| File | Purpose |
|---|---|
| [`colors_and_type.css`](./colors_and_type.css) | Tokens — import this in every page. |
| [`preview/`](./preview) | Static cards that show up in the Design System tab. |
| [`ui_kits/website/index.html`](./ui_kits/website/index.html) | The full click-thru website prototype. |
| [`ui_kits/website/README.md`](./ui_kits/website/README.md) | Component-by-component breakdown. |
| [`assets/`](./assets) | Logo, interior photography, anything pixel-based. |
| [`SKILL.md`](./SKILL.md) | Agent Skill manifest. |

---

## Known gaps / open questions for the client

1. **No web fonts shipped** — we're loading Pretendard from CDN. If the brand owns a licensed Korean display face, drop the `.woff2` files into `fonts/` and we'll wire them up.
2. **Logo lockup variants** — only the horizontal Korean+English lockup was supplied. We need: square mark, monogram, light-on-dark, single-color, favicon.
3. **Photography** — only 4 interior shots are available, and none include people (which is good for privacy but limits hero variety). We need 6–8 hero-quality shots including therapy sessions (with consent + face-blur protocol).
4. **Teachers / programs / notices / gallery copy** is mocked in the UI kit. Replace with real content before launch.
5. **The reference site onsarang.kr** was not crawled — only used as a category cue. If you want us to align more or less with its IA, let us know.
