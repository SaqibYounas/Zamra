import SellingPriceForm from './component/SellingPriceForm';
import TodayPriceTable from './component/PriceTable';

export default function SellingPricePage() {
  const prices = {
    '500ml': 'Rs 50',
    '1 Liter': 'Rs 80',
    '1.5 Liter': 'Rs 100',
    '19 Liter': 'Rs 150',
  };

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-5xl
        px-3
        sm:px-6
        lg:px-8
        pt-20
        sm:pt-24
        lg:pt-10
      "
    >
      <TodayPriceTable loading={false} prices={prices} />

      <div className="mt-5 sm:mt-8">
        <SellingPriceForm />
      </div>
    </main>
  );
}
