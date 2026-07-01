'use client';

import { useState } from 'react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
import Dropdown from '../../src/components/dropdown/Dropdown';
import RsIcon from '@/public/RupeesIcon';
import { waterTypes } from '../data/waterTypes';
import { savePrice } from '../services/priceManagement';
import { showApiToast } from '@/app/src/lib/apiToast';

interface WaterFormData {
  type: string;
  price: string;
  labelCap: string;
  otherExpense: string;
}

export default function WaterFormPage() {
  const [formData, setFormData] = useState<WaterFormData>({
    type: '500ml',
    price: '',
    labelCap: '',
    otherExpense: '',
  });

  const [loading, setLoading] = useState(false);

  const handleTypeChange = (val: string) => {
    setFormData({
      type: val,
      price: '',
      labelCap: '',
      otherExpense: '',
    });
  };

  const handleChange = (field: keyof WaterFormData, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, [field]: cleanValue }));
  };

  const handleSubmit = async () => {
    if (
      !formData.price.trim() ||
      !formData.labelCap.trim() ||
      !formData.otherExpense.trim()
    ) {
      showApiToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await savePrice(formData);

      if (response && response.success === false) {
        setFormData({
          type: waterTypes[0]?.value || '',
          price: '',
          labelCap: '',
          otherExpense: '',
        });
      }
    } catch (err) {
      const errorObject = err as Error;
      console.error(errorObject?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full bg-gray-50 shadow-lg rounded-2xl p-6 md:p-10 flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Price
          </h1>

          <Dropdown
            label="Select Bottle Type"
            options={waterTypes}
            value={formData.type}
            onChange={handleTypeChange}
          />

          <WaterInputField
            label="Per Bottle Price"
            customicon={RsIcon}
            type="text"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="Enter price per bottle"
          />

          <WaterInputField
            label="Label + Cap"
            customicon={RsIcon}
            type="text"
            value={formData.labelCap}
            onChange={(e) => handleChange('labelCap', e.target.value)}
            placeholder="Enter label + cap cost"
          />

          <WaterInputField
            label="Other Expenses"
            customicon={RsIcon}
            type="text"
            value={formData.otherExpense}
            onChange={(e) => handleChange('otherExpense', e.target.value)}
            placeholder="Enter other expenses"
          />

          <Button
            onClick={handleSubmit}
            label={loading ? 'Saving Changes...' : 'Save Changes'}
            type="submit"
            className="w-full py-3 text-sm sm:text-base mt-2"
            disabled={loading}
          />
        </div>
      </main>
    </div>
  );
}
