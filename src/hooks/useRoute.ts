import { useCallback, useEffect, useState } from 'react';
import { parseRoute, routeToHash, type Route } from '../lib/route';

/**
 * Reads the active Route from `window.location.hash` and keeps it in sync as
 * the hash changes (back/forward, a typed/shared URL). Navigating writes the
 * hash rather than mutating state directly, so the browser's back button and
 * a shared link both work like real navigation. The mapping itself lives in
 * `src/lib/route.ts`, which is what's unit tested — this hook is a thin DOM
 * binding around it (see AGENTS.md: the UI/DOM layer is not unit tested).
 */
export function useRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    const nextHash = routeToHash(next);
    if (window.location.hash === nextHash) return;
    // Setting the hash fires 'hashchange', which updates state above — but we
    // also set state here so the UI reflects the tap immediately rather than
    // waiting a tick for the event to round-trip.
    window.location.hash = nextHash;
    setRoute(next);
  }, []);

  return [route, navigate];
}
