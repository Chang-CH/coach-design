// JS mirror of the constants in styles.css, for places that need a value in
// code (inline styles, canvas, charts). CSS should read the custom properties
// instead so deck overrides and the light/dark scheme apply.
export const tokens = {
  card: { width: 220, height: 308, radius: 14 }, // host-enforced card dimensions
  font: {
    pixel: "'Press Start 2P', monospace",
    terminal: "'VT323', monospace",
    serif: "'Cinzel', serif",
    mono: "ui-monospace, 'Cascadia Code', Consolas, monospace",
  },
  status: { active: '#5ad17a', idle: '#9aa0b4', blocked: '#f4564a' },
} as const;
