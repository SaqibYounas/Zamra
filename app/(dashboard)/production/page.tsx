'use client';

import { useState, ChangeEvent } from 'react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
import Dropdown from '../../src/components/dropdown/Dropdown';
import { waterTypes } from '../data/waterTypes';

export default function ProductionPage() {
  const [type, setType] = useState(waterTypes[0].value);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleTypeChange = (value: string) => {
    setType(value);
    setFormData({});
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
              value={formData.totalBottle || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalBottle', e.target.value)
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
            value={formData.totalBottle || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('totalBottle', e.target.value)
            }
          />
        );

      case '19L':
        return (
          <>
            <WaterInputField
              label="Quantity"
              type="number"
              value={formData.quantity || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('quantity', e.target.value)
              }
            />
            <WaterInputField
              label="Total Price"
              type="number"
              value={formData.totalPrice || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange('totalPrice', e.target.value)
              }
            />
          </>
        );

      case '19L Refill':
        return (
          <WaterInputField
            label="Total Refill Today"
            type="number"
            value={formData.refill || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('refill', e.target.value)
            }
          />
        );

      default:
        return null;
    }
  };

  const handleSubmit = () => {
    console.log({ type, ...formData });
    alert('Submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full bg-gray-50 shadow-lg rounded-2xl p-6 md:p-10 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
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
            label="Submit"
            onClick={handleSubmit}
            className="mt-6 self-center md:self-start"
          />
        </div>
      </main>
    </div>
  );
}
