import { describe, it, expect } from 'vitest';
import { DEFAULT_ROUTE, ROUTES, parseRoute, routeToHash } from './route';

describe('parseRoute', () => {
  it('maps each known route hash to its Route', () => {
    expect(parseRoute('#/calculator')).toBe('calculator');
    expect(parseRoute('#/ledger')).toBe('ledger');
    expect(parseRoute('#/account')).toBe('account');
  });

  it('defaults to the Calculator for an empty hash', () => {
    expect(parseRoute('')).toBe(DEFAULT_ROUTE);
    expect(parseRoute('#')).toBe(DEFAULT_ROUTE);
    expect(parseRoute('#/')).toBe(DEFAULT_ROUTE);
  });

  it('defaults to the Calculator for an unrecognised hash rather than throwing', () => {
    expect(parseRoute('#/does-not-exist')).toBe(DEFAULT_ROUTE);
    expect(parseRoute('#garbage')).toBe(DEFAULT_ROUTE);
    expect(parseRoute('not-even-a-hash')).toBe(DEFAULT_ROUTE);
  });
});

describe('routeToHash', () => {
  it('produces a hash that parseRoute reads back to the same Route', () => {
    for (const route of ROUTES) {
      expect(parseRoute(routeToHash(route))).toBe(route);
    }
  });
});
