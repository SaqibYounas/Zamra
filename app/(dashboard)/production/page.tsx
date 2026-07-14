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
      perPet: '',
      bottleperPet: '',
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
              label="Bottle per Pet (12)"
              type="number"
              value={formData.bottleperPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('bottleperPet', e.target.value)
              }
              placeholder="Enter bottle per pet"
              error={fieldErrors.bottleperPet}
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
              label="Bottle per Pet (6)"
              type="number"
              value={formData.bottleperPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('bottleperPet', e.target.value)
              }
              placeholder="Enter bottle per pet"
              error={fieldErrors.bottleperPet}
            />
          </>
        );

      case '5L':
        return (
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
        );

      case '19L':
        return (
          <>
            <WaterInputField
              label="Quantity"
              type="number"
              value={formData.totalPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPet', e.target.value)
              }
              placeholder="Enter quantity"
              error={fieldErrors.totalPet}
            />

            <WaterInputField
              label="Price per bottle"
              type="number"
              value={formData.bottleperPet}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('bottleperPet', e.target.value)
              }
              placeholder="Enter price per bottle"
              error={fieldErrors.bottleperPet}
            />
          </>
        );

      case '19L Refill':
        return (
          <WaterInputField
            label="Total Refill Today"
            type="number"
            value={formData.totalPet}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('totalPet', e.target.value)
            }
            placeholder="Enter refill today"
            error={fieldErrors.totalPet}
          />
        );

      default:
        return null;
    }
  };

  const submitForm = async () => {
    const errors: Record<string, string> = {};

    if (!formData.totalPet.trim()) {
      errors.totalPet = 'This field is required.';
    }

    if (
      (type === '500ml' || type === '1.5L' || type === '19L') &&
      !formData.bottleperPet.trim()
    ) {
      errors.bottleperPet = 'This field is required.';
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
        showApiToast('Stock updated successfully.', 'success');

        setFormData({
          totalPet: '',
          perPet: '',
          bottleperPet: '',
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
    <div className="min-h-screen bg-amber-50">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full bg-gray-50 shadow-lg rounded-2xl p-6 md:p-10 flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Production
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Dropdown
              label="Select Bottle Type"
              options={waterTypes}
              value={type}
              onChange={handleTypeChange}
            />

            {renderFields()}

            <AppButton
              type="submit"
              label={loading ? 'Submitting...' : 'Submit'}
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
