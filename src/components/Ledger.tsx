import { NotebookText } from 'lucide-react';

/**
 * Honest placeholder for the Ledger (CONTEXT.md § Ledger): the chronological
 * history of a user's Jobs, totalled by month. There is no account system
 * yet (that's issue #16 and friends), so this explains what will appear here
 * and why it needs an Account, rather than showing a blank page or faking a
 * preview of data that doesn't exist.
 */
function Ledger() {
  return (
    <section className="placeholder-screen">
      <h1 className="placeholder-title">Ledger</h1>
      <div className="placeholder-art" aria-hidden="true">
        <NotebookText size={36} />
      </div>
      <p className="placeholder-lead">Your Job history will live here.</p>
      <p className="placeholder-body">
        Every Job you save from the Calculator — Package Rental, Retail Booth, or
        Percentage Cut — will appear here in order, with your earnings totalled
        by month, so you can see how the business is actually doing over time.
      </p>
      <p className="placeholder-body placeholder-note">
        The Ledger needs an Account so it can follow you to every device and
        survive a cleared cache. Sign-in isn't available yet — it's coming in a
        future update.
      </p>
    </section>
  );
}

export default Ledger;
