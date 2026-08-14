import type Lenis from 'lenis';

// Module-level singleton so ScrollManager (route/anchor handling) can drive the
// same Lenis instance that SmoothScroll sets up.
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) { instance = l; }
export function getLenis(): Lenis | null { return instance; }
