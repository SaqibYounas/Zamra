'use client';

import { useState, ChangeEvent } from 'react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
import Dropdown from '../../src/components/dropdown/Dropdown';
import { waterTypes } from '../data/waterTypes';

export default function ProductionPage() {
  const [state, setState] = useState({
    sidebarOpen: true,
    activeTab: 'production-quantity',
    type: waterTypes[0].value,
    formData: {} as Record<string, string>,
  });

  const updateState = (field: string, value: unknown) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (field: string, value: string) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }));
  };

  const renderFields = () => {
    const { type, formData } = state;

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
    console.log({ type: state.type, ...state.formData });
    alert('Submitted!');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main
        className={`flex-1 flex items-center justify-center p-4 md:p-8 transition-all duration-300 ease-in-out
          ${state.sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}
      >
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 md:p-10 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-6">
            Production
          </h1>

          <Dropdown
            label="Select Bottle Type"
            options={waterTypes}
            value={state.type}
            onChange={(val) => {
              updateState('type', val);
              updateState('formData', {});
            }}
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
