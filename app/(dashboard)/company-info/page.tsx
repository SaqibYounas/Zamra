'use client';

import React, { useState } from 'react';
import { Building2, User, MapPin, Phone, Mail, Globe } from 'lucide-react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';

export default function CompanyInformation() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [payload, setPayload] = useState({
    name: '',
    owner: '',
    address: '',
    city: '',
    contact: '',
    email: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof payload, value: string) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const localErrors: Record<string, string> = {};

    if (!payload.name) localErrors.name = 'Company Name field is required.';
    if (!payload.owner) localErrors.owner = 'Owner Name field is required.';
    if (!payload.city) localErrors.city = 'City context name is required.';
    if (!payload.contact)
      localErrors.contact = 'Contact phone number is required.';
    if (!payload.address)
      localErrors.address = 'Company physical address is required.';
    if (!payload.email)
      localErrors.email = 'Company email desk address is required.';

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setError('Please fill in all required fields.');

      const firstFailingFieldKey = Object.keys(localErrors)[0];
      setTimeout(() => {
        const inputElement = document.querySelector(
          `input[name="${firstFailingFieldKey}"]`
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          inputElement.focus();
        }
      }, 100);

      return;
    }

    // Success commit callback logic
    setFieldErrors({});
    setMessage('Company information updated successfully.');

    setPayload({
      name: '',
      owner: '',
      address: '',
      city: '',
      contact: '',
      email: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4 sm:py-10 sm:px-6 lg:px-8 md:ml-16">
      <main className="w-full max-w-2xl rounded-2xl bg-gray-50 p-6 sm:p-10 shadow-lg border border-gray-200/50">
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <p className="text-teal-600 uppercase tracking-[0.4em] text-[11px] font-black">
              Company Settings
            </p>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Update Company Information
          </h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Update your Zamra Water Company Information setup profiles safely
            below.
          </p>
        </div>

        <div className="rounded-2xl p-4 sm:p-8 ">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <WaterInputField
                name="name"
                label="Company Name"
                type="text"
                icon={Building2}
                value={payload.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter Company Name"
                error={fieldErrors.name}
              />

              <WaterInputField
                name="owner"
                label="Owner Name"
                type="text"
                icon={User}
                value={payload.owner}
                onChange={(e) => handleChange('owner', e.target.value)}
                placeholder="Enter Owner Name"
                error={fieldErrors.owner}
              />

              <WaterInputField
                name="city"
                label="City"
                type="text"
                icon={Globe}
                value={payload.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Enter City Name"
                error={fieldErrors.city}
              />

              <WaterInputField
                name="contact"
                label="Contact"
                type="text"
                icon={Phone}
                value={payload.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                placeholder="Enter Contact Number"
                error={fieldErrors.contact}
              />
            </div>

            <WaterInputField
              name="address"
              label="Address"
              type="text"
              icon={MapPin}
              value={payload.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter Company Address"
              error={fieldErrors.address}
            />

            <WaterInputField
              name="email"
              label="Email"
              type="email"
              icon={Mail}
              value={payload.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter Company Email"
              error={fieldErrors.email}
            />

            {error && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 animate-fadeIn">
                {error}
              </p>
            )}

            {message && (
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 animate-fadeIn">
                {message}
              </p>
            )}

            <Button
              label="Save Changes"
              type="submit"
              className="w-full mt-2"
            />
          </form>
        </div>
      </main>
    </div>
  );
}
