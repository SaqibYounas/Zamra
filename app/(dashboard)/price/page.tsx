'use client';

import { useState, ChangeEvent } from 'react';
import { Calendar } from 'lucide-react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
import Dropdown from '../../src/components/dropdown/Dropdown';
import RsIcon from '@/public/RupeesIcon';
import { waterTypes } from '../data/waterTypes';

interface WaterFormData {
  type: string;
  price: string;
  labelCap: string;
  otherExpense: string;
  date: string;
}

export default function WaterFormPage() {
  const [formData, setFormData] = useState<WaterFormData>({
    type: waterTypes[0].value,
    price: '',
    labelCap: '',
    otherExpense: '',
    date: new Date().toISOString().slice(0, 16),
  });

  const handleChange = (field: keyof WaterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Data submitted! Check console.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <main className="w-full max-w-4xl p-4 md:p-8">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-6">
            Price Form
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('price', e.target.value)
            }
            placeholder="Enter price per bottle"
          />

          <WaterInputField
            label="Label + Cap"
            customicon={RsIcon}
            type="number"
            value={formData.labelCap}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('labelCap', e.target.value)
            }
            placeholder="Enter label + cap cost"
          />

          <WaterInputField
            label="Other Expenses"
            customicon={RsIcon}
            type="number"
            value={formData.otherExpense}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('otherExpense', e.target.value)
            }
            placeholder="Enter other expenses"
          />

          <WaterInputField
            label="Date & Time"
            icon={Calendar}
            type="datetime-local"
            value={formData.date}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('date', e.target.value)
            }
          />

          <Button label="Submit" onClick={handleSubmit} className="mt-6" />
        </div>
      </main>
    </div>
  );
}
