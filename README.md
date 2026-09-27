# @coach/design

Shared design system for the Claude Coach host and its decks and tools: design
tokens, a base theme (dark and light), the card frame, and syntax-highlighted
code and markdown.

## How it's delivered

The package is installed from git **and** shared at runtime as a Module
Federation singleton. The host's copy wins, so the host and every deck share
one colour-scheme store and one highlighter. When a deck runs standalone, it
falls back to its own bundled copy.

```jsonc
// package.json
"@coach/design": "github:Chang-CH/coach-design#semver:^0.1.0"
```

```ts
// vite.config.ts → federation({ shared })
'@coach/design': { singleton: true, requiredVersion: '^0.1.0' },
```

Styles ship separately and are **not** injected by the JS:

- **Host:** import `@coach/design/styles.css` once, globally.
- **Deck:** import it only in the standalone dev entry (`main.tsx`), never in
  `remote.tsx`. Inside the host it's already loaded.

## The base theme is meant to be overridden

All styles live in the `coach` cascade layer. Any unlayered CSS in a deck beats
them, whatever the specificity.

```css
.leetcode-page {
  --accent: #00b4d8;          /* primitives: bg-0/1/2, line, text, muted, accent, … */
  --bg-0: #081019;
  --font-heading: 'Cinzel', serif;
  --code-bg: #04121c;         /* derived tokens are optional overrides */
}
.leetcode-page .coach-prose h2 { letter-spacing: 1px; } /* plain CSS wins */
```

Only primitive tokens are declared at `:root`. Derived values such as
`--code-bg`, `--font-heading` and `--link` are resolved where they're used, with
fallbacks, so overriding a primitive on your root carries through to them.

With Tailwind v4, declare the layer order before importing Tailwind:

```css
@layer theme, base, coach, components, utilities;
@import "tailwindcss";
@import "@coach/design/styles.css";
```

## What's owned globally (singleton)

| | |
|---|---|
| Sizing | type scale `--text-*`, spacing `--space-*`, radii `--radius-*`, card `--card-width/height/radius` |
| Colour scheme | `useColorScheme()` / `setColorScheme('light' \| 'dark' \| 'system')` sets `<html data-coach-scheme>`; persisted. Pin a subtree with `data-coach-scheme` on its root. |
| Deck identity | `<ThemeProvider color>` sets `--deck-color` |

## Components

- `CardFrame`, `Chip`: the common card frame and stat chip.
- `CodeBlock({ code, lang })`: highlights code with highlight.js (bash, cpp,
  css, go, java, js, json, kotlin, python, sql, ts, xml/html, yaml, plus
  aliases). Colours come from the `--syntax-*` tokens.
- `Markdown({ source })`: renders markdown inside `.coach-prose` with fenced
  code highlighted. `renderMarkdown(src)` returns the HTML string. The output is
  **not sanitised**, so only pass it content from our own backends or the
  `claude` CLI.
- `.coach-prose`: scoped element defaults (headings, lists, tables, inline code).
- Type classes: `.headline-1` … `.overline-1`.

## Versioning

A singleton means a deck built against a newer minor version may run on the
host's older copy (Module Federation only warns about the mismatch). Keep the
API **additive** within a major version: don't rename or remove exports or
tokens. Tag every release (`v0.1.0`) so `#semver:` ranges resolve.
