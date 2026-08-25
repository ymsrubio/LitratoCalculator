import { useRoute } from './hooks/useRoute';
import Calculator from './components/Calculator';
import Ledger from './components/Ledger';
import Account from './components/Account';
import BottomNav from './components/BottomNav';

/**
 * The navigation shell (issue #14). Three destinations — Calculator, Ledger,
 * Account — live behind a persistent bottom bar; see src/lib/route.ts for the
 * routing logic and src/components/BottomNav.tsx for the bar itself.
 *
 * The Calculator is kept permanently mounted and only hidden via the `hidden`
 * attribute when another destination is active, rather than being unmounted
 * and remounted. That's what makes its in-progress values survive a trip to
 * Ledger or Account and back (issue #14's acceptance criterion) without
 * lifting its ~20 pieces of state out of the component — persisting those
 * values across a page reload is the separate, not-yet-built issue #12.
 * Ledger and Account hold no state of their own, so they mount and unmount
 * freely as the user navigates to and away from them.
 */
function App() {
  const [route, navigate] = useRoute();

  return (
    <div className="app-shell">
      <main className="route-content">
        <div className="route-view" hidden={route !== 'calculator'}>
          <Calculator />
        </div>
        {route === 'ledger' && (
          <div className="route-view">
            <Ledger />
          </div>
        )}
        {route === 'account' && (
          <div className="route-view">
            <Account />
          </div>
        )}
      </main>
      <BottomNav route={route} onNavigate={navigate} />
    </div>
  );
}

export default App;
