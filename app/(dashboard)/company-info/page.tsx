'use client';

import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  Save,
  User,
} from 'lucide-react';

import {
  PageContainer,
  PageHeader,
} from '@/app/src/components/layout/PageShell';
import { Card, CardBody, CardHeader } from '@/app/src/components/ui/Card';
import { FieldsetHeading } from '@/app/src/components/ui/FieldsetHeading';
import { Alert } from '@/app/src/components/ui/Alert';
import { Badge } from '@/app/src/components/ui/Badge';
import TextField from '@/app/src/components/ui/TextField';
import Button from '@/app/src/components/ui/Button';
import { saveCompanyInfo } from '../services/companyInfo';

interface CompanyInfoResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

type CompanyForm = {
  name: string;
  owner: string;
  address: string;
  city: string;
  contact: string;
  email: string;
};

const EMPTY_FORM: CompanyForm = {
  name: '',
  owner: '',
  address: '',
  city: '',
  contact: '',
  email: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CompanyInformation() {
  const [payload, setPayload] = useState<CompanyForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [savedDetails, setSavedDetails] = useState<CompanyForm | null>(null);

  /** True once the form matches what was last saved in this session. */
  const matchesSaved =
    savedDetails !== null &&
    (Object.keys(payload) as (keyof CompanyForm)[]).every(
      (field) => payload[field].trim() === savedDetails[field].trim()
    );

  const handleChange = (field: keyof CompanyForm, value: string) => {
    setPayload((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) =>
      previous[field] ? { ...previous, [field]: '' } : previous
    );
    setFormError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: Record<string, string> = {};

    if (!payload.name.trim()) errors.name = 'Company name is required.';
    if (!payload.owner.trim()) errors.owner = 'Owner name is required.';
    if (!payload.city.trim()) errors.city = 'City is required.';
    if (!payload.contact.trim()) errors.contact = 'Contact number is required.';
    if (!payload.address.trim())
      errors.address = 'Company address is required.';

    if (!payload.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_PATTERN.test(payload.email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setFieldErrors({});
    setFormError('');

    try {
      const response = (await saveCompanyInfo({
        companyName: payload.name,
        ownerName: payload.owner,
        city: payload.city,
        contact: payload.contact,
        address: payload.address,
        email: payload.email,
      })) as CompanyInfoResponse;

      if (response?.success === false) {
        setFormError(
          response.message || 'Company information could not be saved.'
        );
        return;
      }

      // Values stay on screen after saving: there is no read endpoint, so
      // clearing the form would leave no way to confirm what was stored.
      setSavedDetails(payload);
    } catch (error) {
      setFormError(
        (error as Error)?.message || 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer width="form">
      <PageHeader
        eyebrow="Settings"
        title="Company information"
        description="Business details recorded for the plant. These identify your company on generated invoices."
      />

      <Card as="section">
        <CardHeader
          title="Business details"
          description="All fields are required"
          icon={<Building2 className="size-4" />}
          metric={
            savedDetails && matchesSaved ? (
              <Badge tone="success" dot>
                Saved this session
              </Badge>
            ) : undefined
          }
        />

        <CardBody>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {formError ? <Alert tone="danger">{formError}</Alert> : null}

            {savedDetails && matchesSaved ? (
              <Alert tone="success" title="Saved">
                These are the details new invoices will carry. They stay on
                screen for this session — there is no endpoint to read them back
                after a reload.
              </Alert>
            ) : null}

            {savedDetails && !matchesSaved ? (
              <Alert tone="info" title="Unsaved changes">
                You have edited the details since they were last saved. Save
                again to apply them to new invoices.
              </Alert>
            ) : null}

            <section className="space-y-4">
              <FieldsetHeading
                title="Identity"
                description="How the business is named on paperwork"
                icon={<Building2 className="size-3.5" />}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  name="name"
                  label="Company name"
                  type="text"
                  icon={Building2}
                  autoComplete="organization"
                  value={payload.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Zamra Water Plant"
                  error={fieldErrors.name}
                  required
                />

                <TextField
                  name="owner"
                  label="Owner name"
                  type="text"
                  icon={User}
                  value={payload.owner}
                  onChange={(event) =>
                    handleChange('owner', event.target.value)
                  }
                  placeholder="Owner or managing partner"
                  error={fieldErrors.owner}
                  required
                />
              </div>
            </section>

            <section className="space-y-4">
              <FieldsetHeading
                title="Location"
                description="Printed in the invoice header"
                icon={<MapPin className="size-3.5" />}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <TextField
                    name="address"
                    label="Address"
                    type="text"
                    icon={MapPin}
                    autoComplete="street-address"
                    value={payload.address}
                    onChange={(event) =>
                      handleChange('address', event.target.value)
                    }
                    placeholder="Street, area and landmark"
                    error={fieldErrors.address}
                    required
                  />
                </div>

                <TextField
                  name="city"
                  label="City"
                  type="text"
                  icon={Globe}
                  autoComplete="address-level2"
                  value={payload.city}
                  onChange={(event) => handleChange('city', event.target.value)}
                  placeholder="City"
                  error={fieldErrors.city}
                  required
                />

                <TextField
                  name="contact"
                  label="Contact number"
                  type="tel"
                  icon={Phone}
                  inputMode="tel"
                  autoComplete="tel"
                  value={payload.contact}
                  onChange={(event) =>
                    handleChange('contact', event.target.value)
                  }
                  placeholder="+92 300 0000000"
                  error={fieldErrors.contact}
                  required
                />
              </div>
            </section>

            <section className="space-y-4">
              <FieldsetHeading
                title="Contact"
                description="Where customers reply about invoices"
                icon={<ReceiptText className="size-3.5" />}
              />

              <TextField
                name="email"
                label="Email"
                type="email"
                icon={Mail}
                inputMode="email"
                autoComplete="email"
                value={payload.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="billing@zamrawater.com"
                error={fieldErrors.email}
                required
              />
            </section>

            <div className="flex justify-end border-t border-line pt-4">
              <Button
                type="submit"
                label="Save company"
                loadingLabel="Saving…"
                loading={loading}
                icon={<Save className="size-4" />}
                className="sm:w-auto"
                fullWidth
              />
            </div>
          </form>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
