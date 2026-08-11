'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import WaterInputField from '../../src/components/inputFields/InputField';
import AppButton from '../../src/components/button/Button';
import Dropdown from '../../src/components/dropdown/Dropdown';
import { waterTypes } from '../data/waterTypes';
import { saveStock } from '../services/stockManagement';
import { showApiToast } from '@/app/src/lib/apiToast';

interface StockFormData {
  totalPet: string;
  bottlePerPet: string;
}

interface StockMangRequestBody {
  bottleType: string;
  totalPet: string;
  bottlePerPet?: string;
}

export default function ProductionPage() {
  const [type, setType] = useState<string>(waterTypes[0]?.value || '');

  const [formData, setFormData] = useState<StockFormData>({
    totalPet: '',
    bottlePerPet: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof StockFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleTypeChange = (value: string) => {
    setType(value);

    setFormData({
      totalPet: '',
      bottlePerPet: '',
    });

    setFieldErrors({});
  };

  const renderFields = () => {
    switch (type) {
      case '500ml':
        return (
          <>
            <WaterInputField
              label="Total Pet"
              type="number"
              value={formData.totalPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
              placeholder="Enter total pet"
              error={fieldErrors.totalPet}
            />

            <WaterInputField
              label="Bottle per Pet"
              type="number"
              value={12}
              disabled
              placeholder="Enter bottle per pet"
              error={fieldErrors.bottlePerPet}
              onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                throw new Error('Function not implemented.');
              }}
            />
          </>
        );

      case '1.5L':
        return (
          <>
            <WaterInputField
              label="Total Pet"
              type="number"
              value={formData.totalPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
              placeholder="Enter total pet"
              error={fieldErrors.totalPet}
            />

            <WaterInputField
              label="Bottle per Pet"
              type="number"
              value={6}
              disabled
              placeholder="Enter bottle per pet"
              error={fieldErrors.bottlePerPet}
              onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                throw new Error('Function not implemented.');
              }}
            />
          </>
        );

      case '5L':
        return (
          <>
            <WaterInputField
              label="Total Bottles"
              type="number"
              value={formData.totalPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
              placeholder="Enter total bottles"
              error={fieldErrors.totalPet}
            />
            <WaterInputField
              label="Bottle per Pet"
              type="number"
              value={4}
              disabled
              placeholder="Enter bottle per pet"
              error={fieldErrors.bottlePerPet}
              onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                throw new Error('Function not implemented.');
              }}
            />
          </>
        );

      case '19L':
        return (
          <>
            <WaterInputField
              label="Total Bottles"
              type="number"
              value={formData.totalPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
              placeholder="Enter quantity"
              error={fieldErrors.totalPet}
            />
            <WaterInputField
              label="Bottle per Pet"
              type="number"
              value={1}
              disabled
              placeholder="Enter bottle per pet"
              error={fieldErrors.bottlePerPet}
              onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                throw new Error('Function not implemented.');
              }}
            />
          </>
        );

      case '19L Refill':
        return (
          <>
            <WaterInputField
              label="Total Refill"
              type="number"
              value={formData.totalPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
              placeholder="Enter refill today"
              error={fieldErrors.totalPet}
            />
            <WaterInputField
              label="Bottle per Pet"
              type="number"
              value={1}
              disabled
              placeholder="Enter bottle per pet"
              error={fieldErrors.bottlePerPet}
              onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                throw new Error('Function not implemented.');
              }}
            />
          </>
        );

      default:
        return null;
    }
  };

  const submitForm = async () => {
    const errors: Record<string, string> = {};

    if (!formData.totalPet.trim()) {
      errors.totalPet = 'Total pet or bottles is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});

      const payload: StockMangRequestBody = {
        bottleType: type,
        totalPet: formData.totalPet,
        bottlePerPet:
          type === '500ml'
            ? '12'
            : type === '1.5L'
              ? '6'
              : type === '5L'
                ? '4'
                : '1',
      };

      const response = await saveStock(payload);

      if (response?.success === false) {
        showApiToast(
          response.message || 'Failed to update stock information.',
          'error'
        );
      } else {
        showApiToast('Stock updated successfully.', 'success');

        setFormData({
          totalPet: '',
          bottlePerPet: '',
        });
      }
    } catch (err) {
      const errorObject = err as Error;

      showApiToast(
        errorObject.message || 'An unexpected error occurred.',
        'error'
      );
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
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full bg-gray-50 ring-1 shadow-lg rounded-2xl p-6 md:p-10 flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Production
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-4">
              <Dropdown
                label="Select Bottle Type"
                options={waterTypes}
                value={type}
                onChange={handleTypeChange}
              />
            </div>

            <div className="flex flex-col gap-5 mb-6 [&>div]:m-0 [&>div]:p-0">
              {renderFields()}
            </div>

            <AppButton
              type="submit"
              label={loading ? 'Saving...' : 'Save Production'}
              loading={loading}
              disabled={loading}
              className="w-full py-3 text-sm sm:text-base mt-2"
            />
          </form>
        </div>
      </main>
    </div>
  );
}
