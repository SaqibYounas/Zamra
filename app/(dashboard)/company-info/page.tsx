'use client';

import React, { useState, useEffect } from 'react';
import { Building2, User, MapPin, Phone, Mail, Globe } from 'lucide-react';
import WaterInputField from '../../src/components/inputFields/InputField';
import Button from '../../src/components/button/Button';
import { saveCompanyInfo } from '../services/companyInfo';

interface CompanyInfoResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export default function CompanyInformation() {
  const [loading, setLoading] = useState(false);

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
    setPayload((prev) => ({
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

  const submitForm = async () => {
    const localErrors: Record<string, string> = {};

    if (!payload.name.trim())
      localErrors.name = 'Please enter the company name.';

    if (!payload.owner.trim())
      localErrors.owner = 'Please enter the owner name.';

    if (!payload.city.trim()) localErrors.city = 'Please enter the city.';

    if (!payload.contact.trim())
      localErrors.contact = 'Please enter the contact number.';

    if (!payload.address.trim())
      localErrors.address = 'Please enter the company address.';

    if (!payload.email.trim())
      localErrors.email = 'Please enter the email address.';
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});

      const response = (await saveCompanyInfo({
        companyName: payload.name,
        ownerName: payload.owner,
        city: payload.city,
        contact: payload.contact,
        address: payload.address,
        email: payload.email,
      })) as CompanyInfoResponse;

      if (response && response.success === false) {
        setPayload({
          name: '',
          owner: '',
          address: '',
          city: '',
          contact: '',
          email: '',
        });
      }
    } catch (err) {
      const errorObject = err as Error;
      console.error(errorObject?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
  }, [loading, payload]);

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center pt-24 pb-10 px-4 sm:py-12 sm:px-6 lg:px-8 md:pl-20">
      <main className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-2xl bg-gray-50 p-4 sm:p-8 lg:p-10 ring-1 shadow-lg border border-gray-200/50">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
            Update Company Information
          </h1>
        </div>

        <div className="p-0 sm:p-2">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex flex-col sm:flex-row gap-5">
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
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
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

            <Button
              label={loading ? 'Saving...' : 'Save Company'}
              type="submit"
              className="w-full py-3 text-sm sm:text-base"
              disabled={loading}
            />
          </form>
        </div>
      </main>
    </div>
  );
}
