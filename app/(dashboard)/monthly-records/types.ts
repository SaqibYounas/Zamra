export type BottleRecord = {
  name: string;
  stock: number;
  price: number;
  production: number;
  cost: number;
  profit: number;
};

export type DayRecord = {
  day: number;
  bottles: BottleRecord[];
};

export type MonthOption = {
  month: string;
  year: number;
};

export type Totals = {
  stock: number;
  cost: number;
  profit: number;
};
