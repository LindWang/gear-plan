// Static demo build: everything renders in the browser (no server, no SSR).
// Browser-only APIs (localStorage, crypto.randomUUID) are used throughout, so
// prerendering is disabled and the adapter serves a single-page fallback.
export const ssr = false;
export const prerender = false;
