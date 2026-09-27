// Per-deck identity colour. Sets --deck-color for everything underneath, which
// the card frame, chips and code blocks use as their accent.
import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';

const ThemeCtx = createContext<{ color: string }>({ color: '#7c5cff' });

export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({ color, children }: { color: string; children: ReactNode }) {
  return (
    <ThemeCtx.Provider value={{ color }}>
      <div style={{ ['--deck-color' as string]: color } as CSSProperties}>{children}</div>
    </ThemeCtx.Provider>
  );
}
