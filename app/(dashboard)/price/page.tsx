'use client';

import { useState } from 'react';
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
          <WaterInputField
            label="Date & Time"
            icon={Calendar}
            type="datetime-local"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />

          <Button label="Submit" onClick={handleSubmit} className="mt-6" />
        </div>
      </main>
    </div>
  );
}
