'use client';

import { useState } from 'react';

import WaterInputField from '../../../src/components/inputFields/InputField';
import AppButton from '../../../src/components/button/Button';
import Dropdown from '../../../src/components/dropdown/Dropdown';
import RsIcon from '@/public/RupeesIcon';
import { waterTypes } from '../../data/waterTypes';
import { saveSellingPrice } from '../../services/sellingPrice';

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
}

interface FormData {
  type: string;
  sellingPrice: string;
}

export default function SellingPriceForm({ prices }: Props) {
  const [formData, setFormData] = useState<FormData>({
    type: '500ml',
    sellingPrice: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleTypeChange = (value: string) => {
    setFormData({
      type: value,
      sellingPrice: '',
    });

    setError('');
  };

  const handleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,

      sellingPrice: value.replace(/[^0-9]/g, ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.sellingPrice) {
      setError('Selling price is required');

      return;
    }

    const selectedPrice = prices.find(
      (item) => item.bottleType === formData.type
    );

    if (!selectedPrice) {
      setError('Price type not found');
      return;
    }

    const payload = {
      sellingPrice: formData.sellingPrice,
      priceManagementId: selectedPrice.id,
    };

    try {
      setLoading(true);

      const response = await saveSellingPrice(payload);
      console.log('Saved:', response);

      setFormData({
        type: '500ml',
        sellingPrice: '',
      });
    } catch (error) {
      console.error(error);

      setError('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl ring-1 bg-gray-50 p-6 shadow">
      <h1 className="text-center text-2xl font-bold">Selling Price</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <Dropdown
            label="Select Bottle Type"
            options={waterTypes}
            value={formData.type}
            onChange={handleTypeChange}
          />
        </div>

        <WaterInputField
          label="Selling Price Per Bottle"
          customicon={RsIcon}
          type="text"
          value={formData.sellingPrice}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter selling price"
          error={error}
        />

        <AppButton
          type="submit"
          label={loading ? 'Saving...' : 'Save Selling Price'}
          loading={loading}
        />
      </form>
    </div>
  );
}
