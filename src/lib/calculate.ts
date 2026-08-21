/**
 * All profit arithmetic for the calculator, kept free of React so it can be
 * tested directly. See CONTEXT.md for what a Mode means.
 */

export type Mode = 'package' | 'retail' | 'percent';

/**
 * A user-added row under Revenue or Misc Fees. A row is either a single flat
 * amount, or a count multiplied by a per-unit price.
 */
export interface LineItem {
  id: string;
  name: string;
  type: 'flat' | 'unit';
  amount: number;
  unitCount: number;
  unitPrice: number;
}

export interface CalculationInputs {
  mode: Mode;
  /** Package Rental: the agreed fixed event fee. */
  rentalPrice: number;
  /** Retail Booth and Percentage Cut: price charged per print sold. */
  sellingPricePerPrint: number;
  printsSoldQty: number;
  /** Retail Booth: flat fee paid to the venue for the space. */
  spaceRentalCost: number;
  /** Percentage Cut: share of gross revenue owed to the organiser, as a percent. */
  commissionRate: number;
  printCost: number;
  /** Package Rental only; the other Modes cost prints against printsSoldQty. */
  printQty: number;
  employeeCost: number;
  employeeCount: number;
  transportCost: number;
  miscFees: LineItem[];
  revenueItems: LineItem[];
}

export interface CalculationBreakdown {
  photoSales: number;
  printsCost: number;
  staffCost: number;
  organizerCut: number;
  spaceRentalCost: number;
  transportCost: number;
  totalMiscCost: number;
  totalCustomRevenue: number;
}

export interface CalculationResult {
  grossRevenue: number;
  totalExpenses: number;
  netProfit: number;
  /** Percentage of gross revenue kept as profit. Zero when there is no revenue. */
  profitMargin: number;
  /** Copies that must sell before the Job stops losing money. Retail Booth only. */
  breakEvenCopies: number | null;
  breakdown: CalculationBreakdown;
}

/** Totals a set of Revenue or Misc Fee rows. */
export function sumLineItems(items: LineItem[]): number {
  return items.reduce(
    (sum, item) => sum + (item.type === 'flat' ? item.amount : item.unitCount * item.unitPrice),
    0
  );
}

function marginOf(netProfit: number, grossRevenue: number): number {
  return grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
}

export function calculate(inputs: CalculationInputs): CalculationResult {
  const {
    mode,
    rentalPrice,
    sellingPricePerPrint,
    printsSoldQty,
    spaceRentalCost,
    commissionRate,
    printCost,
    printQty,
    employeeCost,
    employeeCount,
    transportCost,
    miscFees,
    revenueItems
  } = inputs;

  const totalMiscCost = sumLineItems(miscFees);
  const totalCustomRevenue = sumLineItems(revenueItems);
  const staffCost = employeeCost * employeeCount;

  if (mode === 'package') {
    // Revenue is the agreed package fee alone; add-on rows do not apply here.
    const printsCost = printCost * printQty;
    const totalExpenses = printsCost + staffCost + transportCost + totalMiscCost;
    const netProfit = rentalPrice - totalExpenses;

    return {
      grossRevenue: rentalPrice,
      totalExpenses,
      netProfit,
      profitMargin: marginOf(netProfit, rentalPrice),
      breakEvenCopies: null,
      breakdown: {
        photoSales: 0,
        printsCost,
        staffCost,
        organizerCut: 0,
        spaceRentalCost: 0,
        transportCost,
        totalMiscCost,
        totalCustomRevenue
      }
    };
  }

  // Retail Booth and Percentage Cut both sell prints directly, so they share
  // their revenue shape and differ only in what they owe the venue.
  const photoSales = sellingPricePerPrint * printsSoldQty;
  const grossRevenue = photoSales + totalCustomRevenue;
  const printsCost = printCost * printsSoldQty;

  if (mode === 'retail') {
    const totalExpenses =
      spaceRentalCost + printsCost + staffCost + transportCost + totalMiscCost;
    const netProfit = grossRevenue - totalExpenses;

    // Add-on revenue offsets fixed overhead before prints have to cover it.
    const netOverheadToCover = Math.max(
      0,
      spaceRentalCost + staffCost + transportCost + totalMiscCost - totalCustomRevenue
    );
    const marginPerCopy = sellingPricePerPrint - printCost;
    const breakEvenCopies =
      marginPerCopy > 0 ? Math.ceil(netOverheadToCover / marginPerCopy) : 0;

    return {
      grossRevenue,
      totalExpenses,
      netProfit,
      profitMargin: marginOf(netProfit, grossRevenue),
      breakEvenCopies,
      breakdown: {
        photoSales,
        printsCost,
        staffCost,
        organizerCut: 0,
        spaceRentalCost,
        transportCost,
        totalMiscCost,
        totalCustomRevenue
      }
    };
  }

  const organizerCut = grossRevenue * (commissionRate / 100);
  const totalExpenses =
    organizerCut + printsCost + staffCost + transportCost + totalMiscCost;
  const netProfit = grossRevenue - totalExpenses;

  return {
    grossRevenue,
    totalExpenses,
    netProfit,
    profitMargin: marginOf(netProfit, grossRevenue),
    breakEvenCopies: null,
    breakdown: {
      photoSales,
      printsCost,
      staffCost,
      organizerCut,
      spaceRentalCost: 0,
      transportCost,
      totalMiscCost,
      totalCustomRevenue
    }
  };
}
