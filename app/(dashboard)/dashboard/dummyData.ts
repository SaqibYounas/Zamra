import {
  Customer,
  ShippingAddress,
  StockMetrics,
  StockBottleType,
} from './types';

/* -------------------------------------------------------------------------- */
/*               Dummy stock data — used whenever the real API                */
/*               (getStock) is unavailable or returns an error                */
/* -------------------------------------------------------------------------- */

const BOTTLES: StockBottleType[] = ['500ml', '1.5L', '5L', '19L', '19L Refill'];

function bottleWise(values: number[]): Record<StockBottleType, number> {
  return BOTTLES.reduce(
    (acc, size, i) => ({ ...acc, [size]: values[i] }),
    {} as Record<StockBottleType, number>
  );
}

export const dummyStockData: StockMetrics = {
  todayStock: bottleWise([120, 80, 45, 30, 60]),
  overallStock: bottleWise([980, 640, 310, 210, 450]),
  costs: bottleWise([15000, 22000, 18500, 26000, 9000]),
  profitToday: bottleWise([4200, 3100, 2600, 3900, 1800]),
  sellingPriceToday: bottleWise([60, 130, 340, 780, 400]),
  monthlyProfitHistory: Array.from({ length: 30 }, (_, i) =>
    Math.round(3000 + Math.sin(i / 3) * 1200 + i * 40)
  ),
};

/* -------------------------------------------------------------------------- */
/*                             Dummy customers table                          */
/* -------------------------------------------------------------------------- */

const FIRST_NAMES = [
  'Ali',
  'Sara',
  'Bilal',
  'Ayesha',
  'Hamza',
  'Zainab',
  'Usman',
  'Mahnoor',
  'Fahad',
  'Iqra',
  'Omar',
  'Rabia',
  'Tariq',
  'Nida',
  'Waqas',
  'Sana',
  'Adeel',
  'Hira',
  'Kashif',
  'Amina',
  'Faisal',
  'Laiba',
  'Shahzad',
  'Mehak',
];

export const dummyCustomers: Customer[] = FIRST_NAMES.map((name, i) => ({
  id: i + 1,
  name: `${name} ${['Khan', 'Ahmed', 'Malik', 'Butt', 'Chaudhry'][i % 5]}`,
  phone: `+92 3${(i % 9) + 1}${100000000 + i * 137}`.slice(0, 13),
  email: `${name.toLowerCase()}${i + 1}@example.com`,
  totalOrders: (i * 7) % 40,
}));

/* -------------------------------------------------------------------------- */
/*                        Dummy shipping addresses table                      */
/* -------------------------------------------------------------------------- */

const CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Faisalabad',
  'Multan',
  'Rawalpindi',
];

export const dummyShippingAddresses: ShippingAddress[] = FIRST_NAMES.map(
  (name, i) => ({
    id: i + 1,
    customerName: `${name} ${['Khan', 'Ahmed', 'Malik', 'Butt', 'Chaudhry'][i % 5]}`,
    addressLine: `House #${(i + 1) * 3}, Street ${((i * 5) % 20) + 1}`,
    city: CITIES[i % CITIES.length],
    postalCode: `${54000 + i * 11}`,
  })
);

/* -------------------------------------------------------------------------- */
/*   Dummy async service calls — swap the body for a real API call later.     */
/*   Kept async so components calling them don't need to change shape.        */
/* -------------------------------------------------------------------------- */

export async function getCustomers(): Promise<Customer[]> {
  return Promise.resolve(dummyCustomers);
}

export async function getShippingAddresses(): Promise<ShippingAddress[]> {
  return Promise.resolve(dummyShippingAddresses);
}
