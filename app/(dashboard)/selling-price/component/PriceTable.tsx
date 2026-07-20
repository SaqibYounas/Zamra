'use client';

interface Price {
  id: number;
  bottleType: string;
  perBottlePrice: string;
  labelCapPrice: string;
  otherExpenses: string;
  isActive: boolean;
}

interface Props {
  prices: Price[];
  loading: boolean;
}

export default function TodayPriceTable({ prices, loading }: Props) {
  const bottles = ['500ml', '1 Liter', '1.5 Liter', '19 Liter'];

  const bottleTypeMap: Record<string, string> = {
    '500ml': '500ml',
    '1L': '1 Liter',
    '1.5L': '1.5 Liter',
    '19L': '19 Liter',
  };

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-sm
        overflow-x-auto
        rounded-2xl
        bg-white
        p-3
        shadow-md
        ring-1
        ring-slate-200
        sm:max-w-md
        sm:p-5
        lg:max-w-full
        lg:p-6
      "
    >
      <h2
        className="
          mb-3
          text-center
          text-base
          font-bold
          text-slate-900
        "
      >
        Today Per Bottle Price
      </h2>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full table-fixed">
          <thead className="bg-blue-50">
            <tr>
              {bottles.map((type) => (
                <th
                  key={type}
                  className="p-3 text-center text-xs text-blue-700"
                >
                  {type}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              {bottles.map((type) => {
                const price = prices.find(
                  (item) => bottleTypeMap[item.bottleType] === type
                );

                const total = price
                  ? Number(price.perBottlePrice) +
                    Number(price.labelCapPrice) +
                    Number(price.otherExpenses)
                  : 0;

                return (
                  <td
                    key={type}
                    className="
                      border-t
                      p-3
                      text-center
                      text-sm
                      font-semibold
                    "
                  >
                    {loading ? (
                      <div className="flex justify-center">
                        <div className="h-5 w-16 animate-pulse rounded-md bg-slate-200" />
                      </div>
                    ) : (
                      `Rs ${total}`
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
