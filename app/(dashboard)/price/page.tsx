'use client';

import { useState, ChangeEvent } from 'react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
import { Calendar, DollarSign } from 'lucide-react';

const waterTypes = ['500ml', '1.5L', '5L', '19L Refill'];

export default function WaterForm() {
  const [type, setType] = useState(waterTypes[0]);
  const [price, setPrice] = useState('');
  const [labelCap, setLabelCap] = useState('');
  const [otherExpense, setOtherExpense] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    const data = {
      type,
      price,
      labelCap,
      otherExpense,
      date,
    };
    console.log('Form submitted:', data);
    alert('Data submitted! Check console.');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Select Bottle Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full py-3 px-4 rounded-2xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        >
          {waterTypes.map((wt) => (
            <option key={wt} value={wt}>
              {wt}
            </option>
          ))}
        </select>
      </div>

      <WaterInputField
        label="Per Bottle Price"
        icon={DollarSign}
        type="number"
        value={price}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPrice(e.target.value)
        }
        placeholder="Enter price per bottle"
      />

      <WaterInputField
        label="Label + Cap"
        icon={DollarSign}
        type="number"
        value={labelCap}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setLabelCap(e.target.value)
        }
        placeholder="Enter label + cap cost"
      />

      <WaterInputField
        label="Other Expenses"
        icon={DollarSign}
        type="number"
        value={otherExpense}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setOtherExpense(e.target.value)
        }
        placeholder="Enter other expenses"
      />

      <WaterInputField
        label="Date & Time"
        icon={Calendar}
        type="datetime-local"
        value={date}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
      />

      <Button label="Submit" onClick={handleSubmit} />
    </div>
  );
}
