'use client';

import { useState, useEffect } from 'react';
import WaterInputField from '../../src/components/inputFields/InputField';
import AppButton from '../../src/components/button/Button';
import Dropdown from '../../src/components/dropdown/Dropdown';
import RsIcon from '@/public/RupeesIcon';
import { waterTypes } from '../data/waterTypes';
import { savePrice } from '../services/priceManagement';

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

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleTypeChange = (val: string) => {
    setFormData({
      type: val,
      price: '',
      labelCap: '',
      otherExpense: '',
    });

    setFieldErrors({});
  };

  const handleChange = (field: keyof WaterFormData, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');

    setFormData((prev) => ({
      ...prev,
      [field]: cleanValue,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const submitForm = async () => {
    const errors: Record<string, string> = {};

    if (!formData.price.trim()) {
      errors.price = 'Per bottle price is required.';
    }

    if (!formData.labelCap.trim()) {
      errors.labelCap = 'Label + Cap cost is required.';
    }

    if (!formData.otherExpense.trim()) {
      errors.otherExpense = 'Other expenses are required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitForm();
  };

  useEffect(() => {
    const handleGlobalEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) {
        e.preventDefault();
        submitForm();
      }
    };

    window.addEventListener('keydown', handleGlobalEnter);

    return () => {
      window.removeEventListener('keydown', handleGlobalEnter);
    };
  }, [loading, formData]);

  return (
    <div className="min-h-screen ">
      <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl bg-gray-50 p-6 ring-1 shadow-lg md:p-10">
          <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl">
            Price
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              error={fieldErrors.price}
            />

            <WaterInputField
              label="Label + Cap"
              customicon={RsIcon}
              type="text"
              value={formData.labelCap}
              onChange={(e) => handleChange('labelCap', e.target.value)}
              placeholder="Enter label + cap cost"
              error={fieldErrors.labelCap}
            />

            <WaterInputField
              label="Other Expenses"
              customicon={RsIcon}
              type="text"
              value={formData.otherExpense}
              onChange={(e) => handleChange('otherExpense', e.target.value)}
              placeholder="Enter other expenses"
              error={fieldErrors.otherExpense}
            />

            <AppButton
              type="submit"
              label={loading ? 'Saving Changes...' : 'Save Changes'}
              loading={loading}
              className="w-full py-3 text-sm sm:text-base mt-2"
            />
          </form>
        </div>
      </main>
    </div>
  );
}
