// @coach/design — shared design system for the Claude Coach host and its decks.
//
// Shared as a Module Federation singleton: the host and every deck list it in
// `shared`, so at runtime they all run ONE copy (one colour-scheme store, one
// highlighter). Styles ship separately as '@coach/design/styles.css' — the host
// loads it once; a deck imports it only in its standalone dev entry.
export { tokens } from './tokens.js';
export { ThemeProvider, useTheme } from './theme.js';
export {
  getColorScheme,
  setColorScheme,
  useColorScheme,
  type ColorScheme,
  type ResolvedColorScheme,
} from './scheme.js';
export { CardFrame, Chip } from './CardFrame.js';
export { CodeBlock, Markdown, highlight, isHighlightable, renderMarkdown } from './code.js';
