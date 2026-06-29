'use client';

import { useState, ChangeEvent } from 'react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
import Dropdown from '../../src/components/dropdown/Dropdown';
import { waterTypes } from '../data/waterTypes';
import { saveStock } from '../services/stockManagement';

interface StockMangRequestBody {
  bottleType?: string;
  totalPet: string;
  perBottlePrice?: string;
}

export default function ProductionPage() {
  const [type, setType] = useState(waterTypes[0]?.value || '');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTypeChange = (value: string) => {
    setType(value);
    setFormData({});
    setError('');
    setMessage('');
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderFields = () => {
    switch (type) {
      case '500ml':
        return (
          <>
            <WaterInputField
              label="Total Pet"
              type="number"
              value={formData.totalPet || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
            />
            <WaterInputField
              label="Bottle per Pet (12)"
              type="number"
              value={formData.perPet || '12'}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('perPet', e.target.value)
              }
            />
          </>
        );

      case '1.5L':
        return (
          <>
            <WaterInputField
              label="Total Pet"
              type="number"
              value={formData.totalPet || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
            />
            <WaterInputField
              label="Bottle per Pet (6)"
              type="number"
              value={formData.perPet || '6'}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('perPet', e.target.value)
              }
            />
          </>
        );

      case '5L':
        return (
          <WaterInputField
            label="Total Bottles"
            type="number"
            value={formData.totalPet || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('totalPet', e.target.value)
            }
          />
        );

      case '19L':
        return (
          <>
            <WaterInputField
              label="Quantity"
              type="number"
              value={formData.totalPet || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
            />
            <WaterInputField
              label="Price per Bottle"
              type="number"
              value={formData.perBottlePrice || ''} // Matches interface
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('perBottlePrice', e.target.value)
              }
            />
          </>
        );

      case '19L Refill':
        return (
          <WaterInputField
            label="Total Refill Today"
            type="number"
            value={formData.totalPet || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('totalPet', e.target.value)
            }
          />
        );

      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    try {
      setLoading(true);

      const payload: StockMangRequestBody = {
        bottleType: type,
        totalPet: formData.totalPet || '0',
      };

      if (formData.perBottlePrice) {
        payload.perBottlePrice = formData.perBottlePrice;
      }

      const response = await saveStock(payload);

      if (response && response.success === false) {
        setError(response.message || 'Failed to update stock information.');
      } else {
        setMessage(
          response.message || 'Stock information updated successfully.'
        );
        setFormData({});
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
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full bg-gray-50 shadow-lg rounded-2xl p-6 md:p-10 flex flex-col justify-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Production
          </h1>

          <Dropdown
            label="Select Bottle Type"
            options={waterTypes}
            value={type}
            onChange={handleTypeChange}
          />

          {renderFields()}

          <Button
            label={loading ? 'Submitting...' : 'Submit'}
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 self-center md:self-start"
          />

          {error && (
            <p className="text-xs text-center font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 mt-2">
              {error}
            </p>
          )}

          {message && (
            <p className="text-xs text-center font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 mt-2">
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
