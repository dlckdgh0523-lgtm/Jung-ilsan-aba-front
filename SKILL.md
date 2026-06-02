---
name: chungjieun-aba-design
description: Use this skill to generate well-branded interfaces and assets for 정지은 일산 ABA (CHUNG Ji-eun Ilsan ABA), an Applied Behavior Analysis center in Ilsan, Korea — either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping. Tone is warm, premium, Apple-inspired with a sunrise-to-leaf gradient brand mark.
user-invocable: true
---

Read the `README.md` file within this skill first — it carries the full content fundamentals (Korean honorific voice, no emoji, Pretendard-only typography) and visual foundations (warm cream backgrounds, soft motion, no bluish-purple gradients).

Then explore the other available files:

- **`colors_and_type.css`** — Every token (color, type, spacing, motion, shadows, radii). Import this on every HTML page you author for this brand.
- **`assets/`** — The canonical `logo-aba.png`, the four interior photographs, KakaoTalk icon. Copy these into any new artifact rather than re-creating.
- **`ui_kits/website/`** — A click-thru recreation of the marketing site. Read `README.md` there to find the right component to lift (Header, HeroSlider, ProgramCard, TeacherCard, NoticeBoard, GalleryMasonry, KakaoFab, etc.).
- **`preview/`** — Static specimen cards. Useful for quoting tokens exactly.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of `assets/` and create static HTML files for the user to view. Always include `colors_and_type.css` and reference the Pretendard CDN. If working on production code (Next.js 15 + Tailwind + shadcn/ui + Framer Motion was the stated stack), translate the tokens in `colors_and_type.css` into `tailwind.config.ts` theme extensions and use the JSX components as starting scaffolds.

If the user invokes this skill without any other guidance, ask them what they want to build or design (a new page, a campaign slide, a print piece, a CMS view?), confirm whether they need Korean copy or English, ask if they have new photography to work with, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

**Brand rules to never violate**

1. The brand gradient is **sunrise orange `#F8AD46` → leaf green `#7DBE32`** with `#FFC857` in the middle, always at 95°. Never invert. Never use blue/purple.
2. The page background is warm cream `#FBF8F3`, not white. Pure white is for cards on top.
3. **Pretendard only.** No serifs, no Inter, no Roboto. Latin and Korean live in the same family.
4. **No emoji. No unicode icon glyphs. No AI cartoons.** Iconography is Lucide @ 1.75 stroke or copied SVGs from `assets/`.
5. Korean copy is always honorific (`-요` / `-습니다`). Address parents as **부모님**, child as **아이**, lead as **원장님** or **정지은 BCBA**.
6. Motion uses `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out-soft`). Springs only for tiny icon nudges. No full-element bounces.
7. KakaoTalk consultation button is yellow `#FEE500`, pill-shaped, fixed bottom-right.
