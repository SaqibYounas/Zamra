'use client';

import { useState } from 'react';
import { Save, type LucideIcon } from 'lucide-react';

import { Modal } from '@/app/src/components/ui/Modal';
import { Alert } from '@/app/src/components/ui/Alert';
import Button from '@/app/src/components/ui/Button';
import TextField from '@/app/src/components/ui/TextField';

export interface EditableField<T> {
  name: keyof T & string;
  label: string;
  icon?: LucideIcon;
  hint?: string;
  required?: boolean;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email';
  /** Spans both columns; use for addresses and other long values. */
  wide?: boolean;
}

const FORM_ID = 'record-edit-form';

interface RecordEditModalProps<T extends Record<string, unknown>> {
  open: boolean;
  title: string;
  description?: string;
  fields: EditableField<T>[];
  values: T | null;
  /**
   * Identity of the record being edited. Changing it remounts the form, so the
   * inputs reset without an effect writing state on open.
   */
  recordKey: string | number;
  onClose: () => void;
  onSubmit: (values: T) => Promise<string | null>;
}

/**
 * Edit dialog for one record. `onSubmit` resolves with a message to keep the
 * dialog open and show it, or `null` once the record has been saved.
 */
export default function RecordEditModal<T extends Record<string, unknown>>({
  open,
  title,
  description,
  fields,
  values,
  recordKey,
  onClose,
  onSubmit,
}: RecordEditModalProps<T>) {
  const [saving, setSaving] = useState(false);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="lg"
      dismissable={!saving}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            label="Cancel"
            onClick={onClose}
            disabled={saving}
            className="sm:w-auto"
            fullWidth
          />
          <Button
            type="submit"
            form={FORM_ID}
            label="Save changes"
            loadingLabel="Saving…"
            loading={saving}
            icon={<Save className="size-4" />}
            className="sm:w-auto"
            fullWidth
          />
        </>
      }
    >
      {values ? (
        <RecordEditFields<T>
          key={recordKey}
          fields={fields}
          initialValues={values}
          onSubmit={onSubmit}
          onSavingChange={setSaving}
        />
      ) : null}
    </Modal>
  );
}

/**
 * The fields themselves. Mounted fresh per record — see `recordKey` — so the
 * draft starts from `initialValues` with no reset logic.
 */
function RecordEditFields<T extends Record<string, unknown>>({
  fields,
  initialValues,
  onSubmit,
  onSavingChange,
}: {
  fields: EditableField<T>[];
  initialValues: T;
  onSubmit: (values: T) => Promise<string | null>;
  onSavingChange: (saving: boolean) => void;
}) {
  const [draft, setDraft] = useState<T>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const handleChange = (name: string, value: string) => {
    setDraft((previous) => ({ ...previous, [name]: value }) as T);
    setFieldErrors((previous) =>
      previous[name] ? { ...previous, [name]: '' } : previous
    );
    setFormError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      if (!field.required) return;
      if (!String(draft[field.name] ?? '').trim()) {
        errors[field.name] = `${field.label} is required.`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    onSavingChange(true);
    setFormError('');

    const message = await onSubmit(draft);

    onSavingChange(false);
    if (message) setFormError(message);
  };

  return (
    <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError ? <Alert tone="danger">{formError}</Alert> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.wide ? 'sm:col-span-2' : ''}>
            <TextField
              name={field.name}
              label={field.label}
              icon={field.icon}
              hint={field.hint}
              type={field.type ?? 'text'}
              inputMode={field.inputMode}
              value={String(draft[field.name] ?? '')}
              onChange={(event) => handleChange(field.name, event.target.value)}
              error={fieldErrors[field.name]}
              required={field.required}
            />
          </div>
        ))}
      </div>
    </form>
  );
}
