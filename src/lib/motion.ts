// DESIGN.md §4.5. Easing yang sama ada di globals.css (--ease-out, --ease-in-out).
export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const duration = { fast: 0.18, base: 0.45, slow: 0.9 } as const;

export const stagger = { list: 0.04, letters: 0.012 } as const;
