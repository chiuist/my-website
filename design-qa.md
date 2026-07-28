# Design QA

## Source truth

- Selected direction: clean, off-white editorial portfolio with black typography, orange accents, an abstract orbital hero asset, numbered writing rows, and restrained product cards.
- Reference image: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/selected-design-option-1.png`
- Reference size: 864 × 1821 px.
- Comparison viewport/state: 864 × 1000 CSS px, homepage at the top of the page.
- Footer refinement source: `/var/folders/6t/ss1z7tms7g7d56rpt0l1rbg00000gn/T/codex-clipboard-a59a3c26-5596-44e3-9159-a1cf2c07b3a0.png` plus the explicit instruction to remove the large contact panel and retain only one contact method at bottom left.
- Footer source size: 2346 × 1278 px at 1× density.
- About-section removal source: `/var/folders/6t/ss1z7tms7g7d56rpt0l1rbg00000gn/T/codex-clipboard-7a158863-ac6e-406e-8810-4c0062ea8495.png` plus the explicit instruction to remove the entire highlighted block.
- About-section source size: 3216 × 1184 px at 1× density.
- Heading-wrap sources: `/var/folders/6t/ss1z7tms7g7d56rpt0l1rbg00000gn/T/codex-clipboard-e86e31c1-944c-47be-9a6d-8b406438a208.png` (2920 × 700 px) and `/var/folders/6t/ss1z7tms7g7d56rpt0l1rbg00000gn/T/codex-clipboard-11e4ba0c-a8e8-4ca9-859e-2af351fba176.png` (2742 × 844 px), both showing the final “它。” orphaned on a new line.

## Final implementation evidence

- Homepage comparison input: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-comparison-hero-final.png`
- Homepage implementation capture: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-home-864x1000-final.png`
- Desktop final capture: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-home-final.png`
- Notes section: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-home-notes-pass-2.png`
- Experiments section: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-home-experiments-pass-2.png`
- Product dialog: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-product-dialog.png`
- Article index: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-articles-list.png`
- Standard article page: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-article-standard.png`
- Long-form article page: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-article-long-doc-pass-2.png`
- Mobile navigation: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-mobile-menu-final.png`
- Footer comparison input: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-footer-minimal-comparison.png`
- Footer desktop capture: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-footer-minimal-final.png`; 1440 × 900 CSS viewport, 1425 × 891 captured content pixels, 1× density, `#contact` state.
- Footer mobile capture: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-footer-minimal-mobile.png`; 390 × 844 CSS viewport, 375 × 812 captured content pixels, 1× density, `#contact` state.
- Focused footer comparison was used because the change is isolated to the final page region; the desktop and mobile captures make typography, spacing, link treatment, and responsive stacking readable.
- About-removal comparison input: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-about-removed-comparison.png`
- About-removal desktop capture: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-about-removed-desktop.png`; 1440 × 900 CSS viewport, 1425 × 891 captured content pixels, 1× density, `#contact` state.
- About-removal mobile capture: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-about-removed-mobile.png`; 390 × 844 CSS viewport, 375 × 812 captured content pixels, 1× density, `#contact` state.
- The focused comparison shows the highlighted About block in the source and the experiments-to-footer transition after removal; mobile evidence verifies the same transition without overflow.
- Heading-wrap comparison input: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-headings-comparison.png`
- Notes heading capture: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-heading-notes-1371.png`; 1371 × 844 CSS viewport, 1356 × 835 captured content pixels, 1× density, `#notes` state.
- Experiments heading capture: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-heading-experiments-1371.png`; 1371 × 844 CSS viewport, 1356 × 835 captured content pixels, 1× density, `#experiments` state.
- Tablet heading capture: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-headings-900.png`; 900 × 700 CSS viewport, 885 × 688 captured content pixels, 1× density.
- Mobile heading capture: `/Users/hong/Documents/Codex/2026-07-28/lian-2/work/qa-headings-mobile.png`; 390 × 844 CSS viewport, 375 × 812 captured content pixels, 1× density.

## Comparison history

1. P2 — The source logo became visually blank on the light header. Fixed by using the real logo alpha channel as a dark CSS mask.
2. P2 — The desktop headline wrapped to four lines and lost the reference rhythm. Fixed by reducing the large-screen type scale and adjusting the hero grid.
3. P2 — The 864 × 1000 hero was too tall, hiding the beginning of the notes section. Fixed by capping the desktop hero height at 680 px.
4. P2 — The mobile navigation was clipped by the sticky blurred header. Fixed with an absolutely positioned full-viewport menu and verified at 390 × 844.
5. P2 — Legacy long-form documents retained dark-theme surfaces and weak contrast. Fixed with a light-theme compatibility layer in `article-doc.css`.
6. P2 — The oversized contact card communicated a more open invitation than intended and dominated the page ending. Removed the card, copy action, and hero “开放交流” CTA; moved the single mail link into the footer’s bottom-left position. Post-fix evidence is the footer comparison input and both responsive captures above.
7. P2 — The About section added an unnecessary explanatory block at the end of an intentionally restrained personal site. Removed the full section, its desktop/mobile navigation entries, and unused responsive CSS. The experiments section now transitions directly into the minimal footer.
8. P2 — Both major section titles used a 730 px maximum width, causing the last one or two characters to form an orphan line on large and intermediate displays. Increased the title measure to 920 px, added balanced wrapping, and introduced a 821–1000 px grid/type treatment that keeps both titles on one line without overflow. At 390 px, the title wraps into two balanced lines.

## Final review

- P0: none.
- P1: none.
- P2: none.
- P3: the final logo is intentionally monochrome in the new editorial system, and the generated orbital asset has a subtly lighter image field than the page background. Both are acceptable, non-blocking differences.
- Footer fidelity surfaces: existing Manrope typography and off-white/black/orange tokens are preserved; the card border and excess vertical space are removed; the email remains a sharp `mailto:` link; copy is intentionally reduced to the single address; no image assets are affected.
- About-removal fidelity surfaces: remaining typography, spacing, color tokens, icon assets, and product copy are unchanged; only the requested block and its dead navigation targets were removed.
- Heading fidelity surfaces: Manrope/PingFang typography, font weight, color tokens, icons, and copy remain unchanged; only title measure, responsive grid width, and intermediate font sizing changed. Computed title height is one line at 1371 px and 900 px, with balanced two-line wrapping at 390 px.
- Functional checks: desktop and mobile navigation, footer contact anchor, mail link, note links, product modal open/close, responsive layout, and local route/asset loading verified.
- Code checks: `git diff --check` passed.

final result: passed
