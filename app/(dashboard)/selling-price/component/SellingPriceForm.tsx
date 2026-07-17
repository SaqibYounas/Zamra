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

      // API call
      console.log(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="mx-auto  flex min-h-screen max-w-4xl items-center justify-center px-4 py-8">
        <div className="w-full rounded-2xl ring-1 bg-gray-50 p-6 shadow-lg md:p-10">
          <h1 className="mb- text-center text-3xl font-bold">Selling Price</h1>

          <p className="mb-6 text-center text-sm text-gray-500">
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
      </main>
    </div>
  );
}
