// Light/dark colour scheme — owned by this package so the host and every deck
// share ONE value. That only holds because @coach/design is a federation
// singleton: a second copy would carry its own state.
//
// The resolved scheme is written to <html data-coach-scheme="light|dark">,
// which styles.css keys its palettes on. A deck can pin a subtree to one
// scheme by putting the same attribute on its own root element.
import { useSyncExternalStore } from 'react';

export type ColorScheme = 'light' | 'dark' | 'system';
export type ResolvedColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'coach:color-scheme';
// Dark is the house look; 'system' is opt-in.
const DEFAULT_SCHEME: ColorScheme = 'dark';

const listeners = new Set<() => void>();
const media =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: light)')
    : null;

function readStored(): ColorScheme {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* storage unavailable (private mode, sandbox) */
  }
  return DEFAULT_SCHEME;
}

let scheme: ColorScheme = typeof window !== 'undefined' ? readStored() : DEFAULT_SCHEME;

function resolve(s: ColorScheme): ResolvedColorScheme {
  if (s !== 'system') return s;
  return media?.matches ? 'light' : 'dark';
}

// Snapshot is a cached object so useSyncExternalStore sees a stable reference.
let snapshot = { scheme, resolved: resolve(scheme) };

function apply() {
  snapshot = { scheme, resolved: resolve(scheme) };
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.coachScheme = snapshot.resolved;
  }
  listeners.forEach((l) => l());
}

media?.addEventListener('change', () => {
  if (scheme === 'system') apply();
});
apply();

export function getColorScheme() {
  return snapshot;
}

export function setColorScheme(next: ColorScheme) {
  scheme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* not persisted; still applies for this session */
  }
  apply();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Current scheme preference, what it resolves to, and a setter. */
export function useColorScheme() {
  const s = useSyncExternalStore(subscribe, getColorScheme, getColorScheme);
  return { ...s, setScheme: setColorScheme };
}
