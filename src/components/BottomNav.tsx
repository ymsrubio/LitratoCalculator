import { Calculator, NotebookText, User } from 'lucide-react';
import { ROUTES, type Route } from '../lib/route';

const NAV_ITEMS: { route: Route; label: string; Icon: typeof Calculator }[] = [
  { route: 'calculator', label: 'Calculator', Icon: Calculator },
  { route: 'ledger', label: 'Ledger', Icon: NotebookText },
  { route: 'account', label: 'Account', Icon: User }
];

// Sanity check the two lists are kept in step with each other.
if (NAV_ITEMS.length !== ROUTES.length) {
  throw new Error('BottomNav is missing a nav item for a Route in src/lib/route.ts');
}

interface BottomNavProps {
  route: Route;
  onNavigate: (route: Route) => void;
}

/**
 * The app's persistent bottom navigation bar (design.md § Layout and
 * navigation). The active destination shows a small `--brand` indicator dot,
 * and its icon/label take `--brand-deep` — the same distinction design.md
 * draws between --brand (decorative, no text) and --brand-deep (anything
 * bearing text). This is deliberately a different shape and position from
 * the Mode selector's pill tab-bar inside the Calculator, so switching Mode
 * never reads as switching screens.
 */
function BottomNav({ route, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {NAV_ITEMS.map(({ route: itemRoute, label, Icon }) => {
        const isActive = itemRoute === route;
        return (
          <button
            key={itemRoute}
            type="button"
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate(itemRoute)}
          >
            <span className="bottom-nav-indicator" aria-hidden="true" />
            <Icon size={22} className="bottom-nav-icon" aria-hidden="true" />
            <span className="bottom-nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
