/**
 * The app's three destinations, kept free of React and the DOM so the mapping
 * between a URL hash and a Route is testable without rendering anything. See
 * `src/hooks/useRoute.ts` for the React binding that reads/writes
 * `window.location.hash` using these functions.
 */

export type Route = 'calculator' | 'ledger' | 'account';

export const ROUTES: Route[] = ['calculator', 'ledger', 'account'];

/** The Calculator is the app's front door (CONTEXT.md) and needs no account,
 *  so it is always the fallback for an empty or unrecognised hash. */
export const DEFAULT_ROUTE: Route = 'calculator';

const ROUTE_SET = new Set<Route>(ROUTES);

/** Reads a `Route` back out of `window.location.hash` (or any hash string).
 *  Never throws: anything empty or unrecognised resolves to DEFAULT_ROUTE. */
export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  return ROUTE_SET.has(path as Route) ? (path as Route) : DEFAULT_ROUTE;
}

/** The hash a Route lives at, e.g. 'ledger' -> '#/ledger'. */
export function routeToHash(route: Route): string {
  return `#/${route}`;
}
