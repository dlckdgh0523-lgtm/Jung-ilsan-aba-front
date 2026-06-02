# Website UI Kit — 정지은 일산 ABA

A click-thru recreation of the marketing site and admin CMS, using the brand's tokens. **Frontend only — all data comes from `data.js`.** The user's target stack is Next.js 15 + Tailwind + shadcn/ui + Framer Motion; this kit lifts straight into that stack by translating the tokens into `tailwind.config.ts` and the JSX components into client components.

## Pages

| File | What it is |
|---|---|
| `index.html` | Single-page marketing site — Hero slider + About + Programs + Teachers + Notices + Gallery + Contact. The 관리자 button in the header opens the admin page in an in-page overlay. |
| `admin.html` | Sidebar-based CMS with Dashboard, Hero CRUD, Programs, Teachers, Notices, Gallery, FAQ, Reviews, Section ON/OFF. |

## File layout

```
ui_kits/website/
├── index.html            ← marketing site
├── admin.html            ← admin CMS
├── tokens.css            ← buttons, cards, eyebrow, reveal — site-scoped
├── site.css              ← hero, sections, footer, kakao fab
├── admin.css             ← CMS sidebar, tables, gallery grid, toggles
├── data.js               ← all mockData (brand, hero, about, programs, …)
├── Chrome.jsx            ← Header, Footer, KakaoFab, Icon helper
├── HeroSlider.jsx        ← Full-bleed slider w/ auto-advance, swipe, dots
├── Sections.jsx          ← About / Programs / Teachers / Notices / Gallery / Contact + <Reveal>
├── App.jsx               ← Composes the home, owns section-spy + admin overlay
└── Admin.jsx             ← The full CMS UI
```

## Component map

| Component | Lifts to (in Next.js) |
|---|---|
| `Header`        | `components/layout/header.tsx` (sticky + section spy) |
| `HeroSlider`    | `features/hero/hero-slider.tsx` — wrap with Framer Motion's `<AnimatePresence>` |
| `AboutSection`  | `features/about/about-section.tsx` |
| `ProgramsSection` / `ProgramCard` | `features/programs/*` |
| `TeachersSection` / `TeacherCard` | `features/teachers/*` |
| `NoticesSection` | `features/notices/notice-board.tsx` |
| `GallerySection` + `Lightbox` | `features/gallery/*` |
| `ContactSection` | `features/contact/contact-form.tsx` |
| `KakaoFab` | `components/ui/kakao-fab.tsx` |
| `Footer` | `components/layout/footer.tsx` |
| `Reveal` | `components/motion/reveal.tsx` (use Framer Motion's `whileInView`) |
| `AdminApp` + sub-views | `app/admin/(routes)` per section |

## Motion notes for the Framer Motion port

- `Reveal` → `motion.div` with `initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true, margin:"-15%"}} transition={{duration: 0.48, ease: [0.22, 1, 0.36, 1]}}`.
- Hero crossfade → `<AnimatePresence mode="popLayout">` swapping the `motion.div` with the slide image; pair with a 1.0 → 1.06 scale on the image element for the Ken-Burns feel.
- Stagger on cards → `staggerChildren: 0.06` on the parent, `delayChildren: 0` on the section.
- Card hover → `whileHover={{y: -4}} transition={{type:"tween", duration: 0.28, ease:[0.22,1,0.36,1]}}`.

## Known shortcuts in this prototype

- The admin page is read-only — buttons and switches don't persist. A real implementation would call CMS APIs.
- The lightbox doesn't support keyboard arrows yet; add `keydown` listeners in the production port.
- The contact form simulates a successful submission with `setSent(true)` — no real submit.
- Teacher photos are typographic avatars (initial on a gradient) since no real headshots were supplied. **Replace with real photos before launch.**
- Map area is a placeholder card; embed Kakao Map or Naver Map in production.
- Icons via Lucide CDN at the supplied stroke-width (1.75). If the client has a licensed icon set, swap inside `Chrome.jsx`'s `<Icon>` wrapper.
