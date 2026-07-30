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

final result: passed
