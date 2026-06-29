'use client';

import { useState } from 'react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
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
    type: waterTypes[0].value,
    price: '',
    labelCap: '',
    otherExpense: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (field: keyof WaterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await savePrice(formData);
      setLoading(false);
      if (response && response.success === false) {
        setError(response.message || 'Failed to update company information.');
      } else {
        setMessage(
          response.message || 'Company information updated successfully.'
        );
        setFormData({
          type: waterTypes[0].value,
          price: '',
          labelCap: '',
          otherExpense: '',
        });
      }
    } catch (err) {
      const errorObject = err as Error;
      setError(errorObject?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full bg-gray-50 shadow-lg rounded-2xl p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Price
          </h1>

          <Dropdown
            label="Select Bottle Type"
            options={waterTypes}
            value={formData.type}
            onChange={(val) => handleChange('type', val)}
          />

          <WaterInputField
            label="Per Bottle Price"
            customicon={RsIcon}
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="Enter price per bottle"
          />
          <WaterInputField
            label="Label + Cap"
            customicon={RsIcon}
            type="number"
            value={formData.labelCap}
            onChange={(e) => handleChange('labelCap', e.target.value)}
            placeholder="Enter label + cap cost"
          />
          <WaterInputField
            label="Other Expenses"
            customicon={RsIcon}
            type="number"
            value={formData.otherExpense}
            onChange={(e) => handleChange('otherExpense', e.target.value)}
            placeholder="Enter other expenses"
          />

          {error && (
            <p className="text-xs text-center font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
              {error}
            </p>
          )}
          {message && (
            <p className="text-xs text-center font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              {message}
            </p>
          )}
          <Button
            onClick={handleSubmit}
            label={loading ? 'Saving Changes...' : 'Save Changes'}
            type="submit"
            className="w-full py-3 text-sm sm:text-base"
            disabled={loading}
          />
        </div>
      </main>
    </div>
  );
}
