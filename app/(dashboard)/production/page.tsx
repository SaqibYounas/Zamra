'use client';

import { useState, ChangeEvent } from 'react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
import Dropdown from '../../src/components/dropdown/Dropdown';
import { waterTypes } from '../data/waterTypes';
import { saveStock } from '../services/stockManagement';
import { showApiToast } from '@/app/src/lib/apiToast';

interface StockFormData {
  totalPet: string;
  perPet: string;
  bottleperPet: string;
}

interface StockMangRequestBody {
  bottleType: string;
  totalPet: string;
  bottleperPet?: string;
}

export default function ProductionPage() {
  const [type, setType] = useState<string>(waterTypes[0]?.value || '');

  const [formData, setFormData] = useState<StockFormData>({
    totalPet: '',
    perPet: '',
    bottleperPet: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof StockFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeChange = (value: string) => {
    setType(value);

    setFormData({
      totalPet: '',
      perPet: '',
      bottleperPet: '',
    });
  };

  const renderFields = () => {
    switch (type) {
      case '500ml':
        return (
          <>
            <WaterInputField
              label="Total Pet"
              type="text"
              value={formData.totalPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
              placeholder="Enter Total Pet"
            />
            <WaterInputField
              label="Bottle per Pet (12)"
              type="text"
              value={formData.bottleperPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('bottleperPet', e.target.value)
              }
              placeholder="Enter Bottle Per Pet"
            />
          </>
        );

      case '1.5L':
        return (
          <>
            <WaterInputField
              label="Total Pet"
              type="text"
              value={formData.totalPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
            />
            <WaterInputField
              label="Bottle per Pet (6)"
              type="text"
              value={formData.bottleperPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('bottleperPet', e.target.value)
              }
            />
          </>
        );

      case '5L':
        return (
          <WaterInputField
            label="Total Bottles"
            type="text"
            value={formData.totalPet}
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
              type="text"
              value={formData.totalPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
            />
            <WaterInputField
              label="Price per Bottle"
              type="text"
              value={formData.bottleperPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('bottleperPet', e.target.value)
              }
            />
          </>
        );

      case '19L Refill':
        return (
          <WaterInputField
            label="Total Refill Today"
            type="text"
            value={formData.totalPet}
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
    if (!formData.totalPet.trim()) {
      showApiToast('Please fill in all required fields.', 'error');
      return;
    }

    if (
      (type === '500ml' || type === '1.5L') &&
      !formData.bottleperPet.trim()
    ) {
      showApiToast('Please fill in all required fields.', 'error');
      return;
    }

    if (type === '19L' && !formData.bottleperPet.trim()) {
      showApiToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      setLoading(true);

      const payload: StockMangRequestBody = {
        bottleType: type,
        totalPet: formData.totalPet,
      };

      if (formData.bottleperPet) {
        payload.bottleperPet = formData.bottleperPet;
      }

      const response = await saveStock(payload);

      if (response?.success === false) {
        showApiToast(
          response.message || 'Failed to update stock information.',
          'error'
        );
      } else {
        setFormData({
          totalPet: '',
          perPet: '',
          bottleperPet: '',
        });
      }
    } catch (err) {
      const errorObject = err as Error;
      console.error(errorObject.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full bg-gray-50 shadow-lg rounded-2xl p-6 md:p-10 flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
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
          />
        </div>
      </main>
    </div>
  );
}
