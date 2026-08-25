import { User } from 'lucide-react';

/**
 * Honest placeholder for Account (CONTEXT.md § Account): one signed-in
 * identity, the boundary that makes saved Jobs and the Ledger possible.
 * Sign-in itself is a separate ticket (#16); this explains what an Account
 * unlocks and that none exists yet, rather than a blank page or a fake
 * preview of a signed-in state.
 */
function Account() {
  return (
    <section className="placeholder-screen">
      <h1 className="placeholder-title">Account</h1>
      <div className="placeholder-art" aria-hidden="true">
        <User size={36} />
      </div>
      <p className="placeholder-lead">Sign in to unlock saving.</p>
      <p className="placeholder-body">
        An Account is one signed-in identity for your photobooth business. Once
        you're signed in, a finished calculation can be saved as a Job, and your
        Jobs will build into the Ledger.
      </p>
      <p className="placeholder-body placeholder-note">
        Sign-in isn't available yet — it's coming in a future update. The
        Calculator keeps working fully without an account.
      </p>
    </section>
  );
}

export default Account;
