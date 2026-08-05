'use client';

import { StockBottleType } from '../../types/types';
import { SellingPrice } from '../types';

interface Props {
  prices: SellingPrice[];
  loading: boolean;
}

const bottleTypes: StockBottleType[] = [
  '500ml',
  '1.5L',
  '5L',
  '19L',
  '19L Refill',
];

export default function TodayPriceTable({ prices, loading }: Props) {
  return (
    <div
      className="
      w-full
      max-w-5xl
      rounded-2xl
      overflow-hidden
      border
      border-slate-900/20
      bg-white
      shadow-lg
    "
    >
      <div
        className="
        relative
        bg-slate-900
        px-5
        py-5
        text-amber-50
      "
      >
        <div
          className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.06]
        "
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg,#fff 0px,#fff 1px,transparent 1px,transparent 14px)',
          }}
        />

        <h2
          className="
          relative
          text-center
          text-lg
          sm:text-xl
          font-black
          tracking-wide
        "
        >
          Today Per Bottle Price
        </h2>
      </div>

      <div className="p-4 sm:p-6">
        <div
          className="
          overflow-x-auto
          rounded-xl
          border
          border-slate-200
        "
        >
          <table
            className="
            w-full
            min-w-150
            table-fixed
          "
          >
            <thead
              className="
              bg-slate-100
            "
            >
              <tr>
                {bottleTypes.map((type) => (
                  <th
                    key={type}
                    className="
                    px-4
                    py-3
                    text-center
                    text-xs
                    font-bold
                    uppercase
                    text-slate-700
                  "
                  >
                    {type}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                {bottleTypes.map((type) => {
                  const price = prices.find((item) => item.bottleType === type);

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
                      px-4
                      py-4
                      text-center
                      text-sm
                      font-bold
                      text-slate-900
                    "
                    >
                      {loading ? (
                        <div className="mx-auto h-5 w-16 rounded bg-slate-200 animate-pulse" />
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
    </div>
  );
}
