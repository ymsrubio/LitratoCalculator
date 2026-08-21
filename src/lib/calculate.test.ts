import { describe, it, expect } from 'vitest';
import { calculate, sumLineItems, type CalculationInputs, type LineItem } from './calculate';

/** The app's shipped defaults, so these tests describe what the user actually sees. */
const baseInputs: CalculationInputs = {
  mode: 'package',
  rentalPrice: 15000,
  sellingPricePerPrint: 150,
  printsSoldQty: 150,
  spaceRentalCost: 3500,
  commissionRate: 20,
  printCost: 12,
  printQty: 100,
  employeeCost: 500,
  employeeCount: 2,
  transportCost: 1000,
  miscFees: [
    { id: 'food', name: 'Food / Crew Meals', type: 'unit', amount: 0, unitCount: 2, unitPrice: 150 },
    { id: 'magnet-cost', name: 'Magnet Cost', type: 'unit', amount: 0, unitCount: 0, unitPrice: 15 }
  ],
  revenueItems: [
    { id: 'magnet', name: 'Magnet Add-ons', type: 'unit', amount: 0, unitCount: 0, unitPrice: 50 }
  ]
};

const inputs = (overrides: Partial<CalculationInputs> = {}): CalculationInputs => ({
  ...baseInputs,
  ...overrides
});

const unitRow = (unitCount: number, unitPrice: number): LineItem => ({
  id: 'row',
  name: 'Row',
  type: 'unit',
  amount: 0,
  unitCount,
  unitPrice
});

const flatRow = (amount: number): LineItem => ({
  id: 'row',
  name: 'Row',
  type: 'flat',
  amount,
  unitCount: 0,
  unitPrice: 0
});

describe('sumLineItems', () => {
  it('takes a flat row at its amount and ignores its unit fields', () => {
    expect(sumLineItems([flatRow(500)])).toBe(500);
  });

  it('multiplies count by price for a unit row', () => {
    expect(sumLineItems([unitRow(20, 50)])).toBe(1000);
  });

  it('totals mixed rows', () => {
    expect(sumLineItems([flatRow(500), unitRow(2, 150)])).toBe(800);
  });

  it('is zero for no rows', () => {
    expect(sumLineItems([])).toBe(0);
  });
});

describe('Package Rental mode', () => {
  it('takes expenses off the agreed package fee', () => {
    const result = calculate(inputs({ mode: 'package' }));

    // prints 12x100=1200, staff 500x2=1000, travel 1000, misc 2x150=300
    expect(result.breakdown.printsCost).toBe(1200);
    expect(result.breakdown.staffCost).toBe(1000);
    expect(result.breakdown.totalMiscCost).toBe(300);
    expect(result.totalExpenses).toBe(3500);
    expect(result.grossRevenue).toBe(15000);
    expect(result.netProfit).toBe(11500);
    expect(result.profitMargin).toBeCloseTo(76.67, 1);
  });

  it('costs prints against print quantity, not copies sold', () => {
    const result = calculate(inputs({ mode: 'package', printQty: 200, printsSoldQty: 999 }));
    expect(result.breakdown.printsCost).toBe(2400);
  });

  it('ignores add-on revenue rows, because the package fee is the whole revenue', () => {
    const withAddOns = calculate(
      inputs({ mode: 'package', revenueItems: [unitRow(20, 50)] })
    );
    expect(withAddOns.grossRevenue).toBe(15000);
  });

  it('has no break-even point', () => {
    expect(calculate(inputs({ mode: 'package' })).breakEvenCopies).toBeNull();
  });
});

describe('Retail Booth mode', () => {
  it('earns on copies sold and pays the venue a flat space fee', () => {
    const result = calculate(inputs({ mode: 'retail' }));

    expect(result.breakdown.photoSales).toBe(22500); // 150 copies x P150
    expect(result.breakdown.printsCost).toBe(1800); // 150 copies x P12
    expect(result.grossRevenue).toBe(22500);
    expect(result.totalExpenses).toBe(7600); // 3500 + 1800 + 1000 + 1000 + 300
    expect(result.netProfit).toBe(14900);
    expect(result.profitMargin).toBeCloseTo(66.22, 1);
  });

  it('adds add-on product rows to revenue', () => {
    const result = calculate(inputs({ mode: 'retail', revenueItems: [unitRow(20, 50)] }));
    expect(result.breakdown.totalCustomRevenue).toBe(1000);
    expect(result.grossRevenue).toBe(23500);
  });

  describe('break-even point', () => {
    it('is the copies needed to cover fixed overhead at the per-copy margin', () => {
      // overhead 3500 + 1000 + 1000 + 300 = 5800, margin per copy 150-12 = 138
      expect(calculate(inputs({ mode: 'retail' })).breakEvenCopies).toBe(43);
    });

    it('rounds up, because you cannot sell part of a copy', () => {
      const result = calculate(
        inputs({ mode: 'retail', spaceRentalCost: 100, employeeCount: 0, transportCost: 0, miscFees: [] })
      );
      // overhead 100, margin per copy 138 -> 0.72 copies rounds to 1
      expect(result.breakEvenCopies).toBe(1);
    });

    it('is reduced by add-on revenue, which offsets overhead before prints must', () => {
      const result = calculate(inputs({ mode: 'retail', revenueItems: [unitRow(20, 50)] }));
      // overhead 5800 - 1000 add-ons = 4800, / 138 -> 35
      expect(result.breakEvenCopies).toBe(35);
    });

    it('is zero when add-ons already cover all overhead', () => {
      const result = calculate(inputs({ mode: 'retail', revenueItems: [flatRow(99999)] }));
      expect(result.breakEvenCopies).toBe(0);
    });

    it('is zero when each copy sells for no more than it costs to print', () => {
      const result = calculate(inputs({ mode: 'retail', sellingPricePerPrint: 10, printCost: 12 }));
      expect(result.breakEvenCopies).toBe(0);
    });
  });
});

describe('Percentage Cut mode', () => {
  it('pays the organiser a share of gross revenue', () => {
    const result = calculate(inputs({ mode: 'percent' }));

    expect(result.grossRevenue).toBe(22500);
    expect(result.breakdown.organizerCut).toBe(4500); // 20% of 22500
    expect(result.totalExpenses).toBe(8600); // 4500 + 1800 + 1000 + 1000 + 300
    expect(result.netProfit).toBe(13900);
    expect(result.profitMargin).toBeCloseTo(61.78, 1);
  });

  it('charges commission on add-on revenue too, not just photo sales', () => {
    const result = calculate(inputs({ mode: 'percent', revenueItems: [unitRow(20, 50)] }));
    expect(result.grossRevenue).toBe(23500);
    expect(result.breakdown.organizerCut).toBe(4700);
  });

  it('takes nothing at a zero commission rate', () => {
    const result = calculate(inputs({ mode: 'percent', commissionRate: 0 }));
    expect(result.breakdown.organizerCut).toBe(0);
  });

  it('has no break-even point', () => {
    expect(calculate(inputs({ mode: 'percent' })).breakEvenCopies).toBeNull();
  });
});

describe('profit margin', () => {
  it('is zero rather than infinite when there is no revenue', () => {
    expect(calculate(inputs({ mode: 'package', rentalPrice: 0 })).profitMargin).toBe(0);
    expect(calculate(inputs({ mode: 'retail', printsSoldQty: 0, revenueItems: [] })).profitMargin).toBe(0);
  });

  it('goes negative when a Job loses money', () => {
    const result = calculate(inputs({ mode: 'package', rentalPrice: 1000 }));
    expect(result.netProfit).toBe(-2500);
    expect(result.profitMargin).toBeCloseTo(-250, 1);
  });
});
