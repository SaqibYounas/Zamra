'use client';

import { useState } from 'react';
import Button from '../../src/components/button/Button';
import FormInput from '../../src/components/inputFields/FormInput';

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

  const handleSubmit = () => {
    setMessage('');
    setError('');

    if (
      !payload.name ||
      !payload.owner ||
      !payload.address ||
      !payload.city ||
      !payload.contact ||
      !payload.email
    ) {
      setError('Please fill in all fields.');
      return;
    }

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
    <div className="min-h-screen bg-surface-2 flex items-center justify-center py-8 px-4 sm:py-10 sm:px-6 lg:px-8">
      <main className="w-full max-w-2xl rounded-3xl bg-surface p-6 sm:p-8 shadow-xl shadow-[rgba(15,23,42,0.15)]">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-teal-600 uppercase tracking-[0.4em] text-[11px] font-black">
            Company Settings
          </p>
          <h1 className="text-3xl font-black text-slate-900">
            Update Company Information
          </h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Update your Zamra Water Company Information.
          </p>
        </div>

        <div className="rounded-3xl border border-surface bg-surface p-6 md:p-8">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 space-y-0">
              <FormInput
                label="Company Name"
                type="text"
                value={payload.name}
                onChange={(value) =>
                  setPayload((prev) => ({ ...prev, name: String(value) }))
                }
                placeholder="Enter Company Name"
              />

              <FormInput
                label="Owner Name"
                type="text"
                value={payload.owner}
                onChange={(value) =>
                  setPayload((prev) => ({ ...prev, owner: String(value) }))
                }
                placeholder="Enter Owner Name"
              />

              <FormInput
                label="City"
                type="text"
                value={payload.city}
                onChange={(value) =>
                  setPayload((prev) => ({ ...prev, city: String(value) }))
                }
                placeholder="Enter City Name"
              />

              <FormInput
                label="Contact"
                type="text"
                value={payload.contact}
                onChange={(value) =>
                  setPayload((prev) => ({ ...prev, contact: String(value) }))
                }
                placeholder="Enter Contact Number"
              />
            </div>

            <FormInput
              label="Address"
              type="text"
              value={payload.address}
              onChange={(value) =>
                setPayload((prev) => ({ ...prev, address: String(value) }))
              }
              placeholder="Enter Company Address"
            />

            <FormInput
              label="Email"
              type="email"
              value={payload.email}
              onChange={(value) =>
                setPayload((prev) => ({ ...prev, email: String(value) }))
              }
              placeholder="Enter Company Email"
            />

            {error ? (
              <p className="text-sm font-semibold text-rose-600">{error}</p>
            ) : null}

            {message ? (
              <p className="text-sm font-semibold text-emerald-600">
                {message}
              </p>
            ) : null}

            <Button
              label="Save Changes"
              type="submit"
              className="mt-2 w-full"
            />
          </form>
        </div>
      </main>
    </div>
  );
}
