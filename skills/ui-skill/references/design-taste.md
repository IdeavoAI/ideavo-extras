# Design taste

Read this when building a new screen or page. Judge the rendered result: a choice that could be pasted into any unrelated product, or that carries no meaning, is a reflex, not a decision.

## Start from the product

- Name the screen's purpose, its user, the primary task and the one primary action before laying anything out.
- Keep the project's established choices (fonts, palette, radii, density, icons). Don't introduce new ones unless the user asks.
- Give each screen one focal point and one clear idea; everything else supports it.

## Composition

- **Proximity before containers.** Group related items with space; the gap between groups is at least twice the gap within one. Use a card only for content that is separate or repeated, and never nest cards more than one level.
- **Hierarchy before labels.** Size, weight, position and contrast show importance. Add badges, eyebrows or captions only when they carry information the layout can't.
- **Deliberate alignment.** Align to a few shared edges, keep container widths consistent, and left-align text-heavy content instead of centring everything.
- **Density fits the use.** Tools and dashboards can be compact; reading and marketing pages get more air.
- **Controls look like controls.** Interactive elements have a shape, border or consistent place; never style them like the text beside them.

## Typography

- Two or three sizes per screen, with clear steps between heading, body and caption. Regular, medium and semibold are usually enough.
- Body text at 14–16px, reading text kept to about 60–75 characters per line, numbers in tabular figures.

## Colour and depth

- A neutral base with the theme's accent. Colour marks state and action, not decoration; gradients, glows and glass only when they have a job.
- Soft, layered shadows for elevation; borders for structure, dividers and selected or focus states. Nested corners are concentric (outer radius = inner radius + padding).

## Components

- One primary button per view, labelled with a verb ("Save changes"); secondary actions are quieter (outline or ghost); destructive actions use the destructive style.
- Tables for comparable records, cards for browsable items, lists for sequences.
- One icon set at a consistent size and stroke, with a text label or `aria-label`.
- Empty states explain what belongs there and offer one action, without filler illustrations.

## Content

- Use the app's real content and terms. Never invent customers, metrics, testimonials, logos or activity, and don't use placeholder names or filler words.

## Motion

- Animate only to explain a change of state, with short transitions on the specific properties that change, and respect reduced motion.

## Before finishing

- **Removal test:** name each decorative element and the job it does; if the screen is clearer without it, remove it rather than adding a new effect.
- Compare the screen with the nearest existing page: same spacing, type and components, and the most important thing is obvious at a glance.
