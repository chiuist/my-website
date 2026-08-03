# Design QA — Corporate AI Rhythm and Rule Reduction

## Reference websites

- OpenAI: `https://openai.com/`
- Anthropic: `https://www.anthropic.com/`
- Moonshot AI: `https://www.moonshot.cn/`
- Xiaomi MiMo: `https://mimo.mi.com/`
- Local implementation: `http://127.0.0.1:4173/`
- Same-input comparison: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/corporate-sites-and-local-rhythm-comparison.png`

## Observed reference patterns

- OpenAI uses `OpenAI Sans SC / OpenAI Sans`; its visible first screen has no wide divider borders or `<hr>` elements.
- Anthropic uses `Anthropic Sans` for the main headline and `Anthropic Serif` for supporting text; its visible first screen uses spacing and large content blocks instead of divider rules.
- Moonshot uses `PingFang SC` for body/navigation and `M PLUS 1 / MiSans / PingFang SC` for section headings; its visible first screen has no wide divider borders or `<hr>` elements.
- MiMo uses Inter/system sans for body/navigation and Georgia for the hero; its visible first screen has no wide divider borders or `<hr>` elements.

Inference: the shared corporate-site pattern is not one exact font family. It is restrained typography, strong content sizing, and generous spacing with very few full-width separator lines.

## Implemented changes

- Kept the current softer system sans stack, which remains closest to Moonshot's Chinese typography and the product typography used across the reference set.
- Removed the masthead rule and header bottom border.
- Removed navigation hover underlines, mobile menu separators, hero CTA underline, section-link underline, section top borders, list top borders, article-row borders, experiment-row borders, and animated row underline effects.
- Replaced row underline feedback with a subtle background-color hover state.
- Reduced desktop note thumbnails from a 214 px-wide / 143 px-high slot to a maximum 156 px-wide / 96 px-high slot.
- Desktop note image and text blocks now both measure 96 px high.
- Notes and experiments both use 116 px rows.
- Notes section height is 646 px; experiments section height is 572 px. The remaining difference comes from the notes section's image content and “查看全部” control, not mismatched row density.
- Mobile note images stretch to the corresponding text block height; checked rows report matching image/text heights of 121/121 px or 98/98 px.

## Visual and runtime verification

- Desktop viewport: 1601 × 1001 px.
- Mobile viewport: 390 × 844 px.
- Homepage core selectors report no remaining top or bottom boundary borders.
- Desktop and mobile horizontal overflow: `0`.
- Product images remain correctly cropped without distortion.
- Footer continues from the experiments section without a top rule.
- Mobile menu and experiment dialog interactions still pass; browser console warnings/errors: none.
- `git diff --check`: passed.

## Evidence

- Homepage: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/home-corporate-rhythm-final.png`
- Compact notes: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/home-compact-notes-no-rules.png`
- Balanced experiments: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/home-balanced-experiments-no-rules.png`
- Mobile: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/home-compact-mobile-no-rules-final.png`

## Findings

No actionable P0, P1, or P2 findings remain.

## Article list density pass

- Scope: `articles.html` only; long-form article typography was intentionally left unchanged.
- Same-input comparison: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/articles-density-before-after.png`
- Desktop headline: 112 px → 61–68 px, depending on viewport width.
- Desktop hero block: 392 px → 229–235 px.
- Desktop article row: 164 px → 112 px.
- Mobile headline: 40 px; article rows: approximately 109 px with two-line description clamping.
- Removed the list-page header, grid, row, and footer rules; hover feedback now uses a quiet background tint.
- Desktop and mobile horizontal overflow: `0`.
- First article navigation resolves to `article-publish-flow.html`.
- Browser console warnings/errors: none.

## Platform manual import

- Scope: five supplied domestic-platform manuals plus their new entries on `articles.html`.
- Visual target: the existing HEYHONG article header, navigation, palette, typography, container width, and footer treatment.
- All source-only headers and footers were replaced with the site's canonical HEYHONG header and footer.
- Added a shared, sticky in-page directory generated from each manual's real section headings; anchor navigation was verified against `#stage5`.
- Desktop QA used a 1280 × 720 px browser viewport (1265 px content width). Mobile QA used a 390 × 844 px browser viewport (375 px content width).
- All five pages report exactly one canonical header and footer, no duplicate IDs, no missing internal anchors, no horizontal overflow, and no browser console warnings or errors.
- Mobile tables remain readable through contained horizontal scrolling; long platform URLs now wrap without widening the page.
- The article list reports 11 entries, and the new mini-game card was verified to navigate to `article-douyin-kuaishou-minigame.html`.
- Same-input comparison: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/platform-manuals/header-layout-comparison-final.jpg`
- Desktop implementation: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/platform-manuals/douyin-kuaishou-minigame-desktop-final.jpg`
- Mobile overflow checks: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/platform-manuals/haoyoukuaibao-mobile-fixed.jpg` and `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/platform-manuals/taptap-mobile-fixed.jpg`.

No actionable P0, P1, or P2 findings remain for the imported manuals.

## Platform manual spacing and width correction

- Scope: all five imported platform manuals, with the supplied 好游快爆 screenshot used as the primary visual finding.
- Source screenshot: `/var/folders/6t/ss1z7tms7g7d56rpt0l1rbg00000gn/T/codex-clipboard-7aa7a07c-64db-4c29-8420-26160b925236.png`.
- Live before: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/manual-spacing-20260803/01-haoyoukuaibao-live-before.jpg`.
- Existing long-form reference: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/manual-spacing-20260803/02-existing-platform-article-reference.jpg`.
- Final implementation: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/manual-spacing-20260803/03-haoyoukuaibao-local-after.jpg`.
- Same-viewport before/after comparison: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/manual-spacing-20260803/04-before-after-comparison.jpg`.
- Existing-page/implementation comparison: `/Users/hong/.codex/visualizations/2026/07/29/019facff-8342-7ed1-a539-e0c47d0795e6/my-website-qa/manual-spacing-20260803/05-old-layout-vs-manual-after.jpg`.

### Corrected findings

- P1 spacing defect: 好游快爆 used 58 px cover padding plus a 44 px directory margin and 70 px first-heading margin. The visible gaps are now 28 px from tags to directory and 24 px from directory to first heading.
- P1 width inconsistency: the affected manual body was only 984 px wide at a 2048 px viewport. Every manual now uses the existing 1320 px long-form content width.
- P2 section rhythm: inherited 56 px section margins and 8 px section padding were stacking with heading margins. Manual sections now reset both values and use one shared heading rhythm.
- P2 alignment inconsistency: cover labels, directory labels, and section headings now share the same left edge on all five desktop and mobile structures.
- TapTap's real overview/callout between the directory and first numbered section remains intact; it was not treated as blank space.
- All five HTML files now request `manual-pages.css?v=20260803-2` so browsers and the edge cache receive the corrected stylesheet.

### Verification

- Desktop viewport: 2048 × 1228 px (2033 px layout viewport). All five pages report 1320 px content width, aligned cover/directory/heading edges, and no horizontal overflow.
- Mobile viewport: 390 × 844 px (375 px layout viewport). All five pages report cover and directory width of 375 px, 20 px content alignment, and no horizontal overflow.
- Mobile tables remain contained and horizontally scroll only within their own table region when necessary.
- The sticky directory interaction was rechecked: one `#stage3` target was found, navigation updated the hash to `#stage3`, and exactly one active directory item remained.
- `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain for this correction.

final result: passed
