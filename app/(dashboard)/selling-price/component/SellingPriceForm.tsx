'use client';

import { useState } from 'react';
import WaterInputField from '../../../src/components/inputFields/InputField';
import AppButton from '../../../src/components/button/Button';
import Dropdown from '../../../src/components/dropdown/Dropdown';
import RsIcon from '@/public/RupeesIcon';
import { waterTypes } from '../../data/waterTypes';

interface SellingPriceFormData {
  type: string;
  sellingPrice: string;
}

export default function SellingPriceForm() {
  const [formData, setFormData] = useState<SellingPriceFormData>({
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

    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.sellingPrice) {
      setError('Selling price is required');
      return;
    }

    try {
      setLoading(true);

      console.log(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-sm
        rounded-2xl
        bg-gray-50
        p-4
        shadow-lg
        ring-1
        sm:max-w-md
        sm:p-6
        lg:max-w-full
        lg:p-8
      "
    >
      <h1 className="text-center text-xl font-bold sm:text-2xl lg:text-3xl">
        Selling Price
      </h1>

      <p className="mb-5 text-center text-xs text-gray-500 sm:mb-6 sm:text-sm">
        Manage bottle selling rates
      </p>

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
          className="mt-6 w-full py-3"
        />
      </form>
    </div>
  );
}
