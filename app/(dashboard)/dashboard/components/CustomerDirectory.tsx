'use client';

import { useState } from 'react';
import {
  AtSign,
  Building2,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  User,
} from 'lucide-react';

import { type DataTableColumn } from '@/app/src/components/ui/DataTable';
import { IconButton } from '@/app/src/components/ui/Button';
import ConfirmationModal from '@/app/src/components/ui/ConfirmationModal';

import TableCard from './TableCard';
import RecordEditModal, {
  type EditableField,
} from '../../components/RecordEditModal';
import {
  deleteCustomer,
  updateCustomer,
  type CustomerInput,
} from '../../services/customers';
import type { Customer } from '../../types/customer';

interface Props {
  rows: Customer[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const FIELDS: EditableField<CustomerInput>[] = [
  { name: 'companyName', label: 'Company', icon: Building2, required: true },
  { name: 'attentionPoc', label: 'Contact person', icon: User, required: true },
  { name: 'phone', label: 'Phone', icon: Phone, inputMode: 'tel' },
  { name: 'email', label: 'Email', icon: AtSign, inputMode: 'email' },
  { name: 'city', label: 'City', icon: MapPin },
  {
    name: 'mailingAddress',
    label: 'Mailing address',
    icon: MapPin,
    wide: true,
  },
];

/** Long values are clipped with a tooltip rather than wrapped to four lines. */
function clamp(value: string, width: string) {
  return (
    <span className={`block truncate ${width}`} title={value || undefined}>
      {value || '—'}
    </span>
  );
}

export default function CustomerDirectory({
  rows,
  loading,
  error,
  onRefresh,
}: Props) {
  const [editing, setEditing] = useState<Customer | null>(null);
  const [removing, setRemoving] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const columns: DataTableColumn<Customer>[] = [
    {
      key: 'companyName',
      label: 'Company',
      render: (row) => (
        <span
          className="block max-w-[13rem] truncate font-semibold text-ink"
          title={row.companyName || undefined}
        >
          {row.companyName || '—'}
        </span>
      ),
    },
    {
      key: 'attentionPoc',
      label: 'Contact person',
      render: (row) => clamp(row.attentionPoc, 'max-w-[10rem]'),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => (
        <span className="tabular whitespace-nowrap">{row.phone || '—'}</span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => clamp(row.email, 'max-w-[10rem]'),
    },
    {
      key: 'city',
      label: 'City',
      render: (row) => clamp(row.city, 'max-w-[7rem]'),
    },
  ];

  const handleUpdate = async (values: CustomerInput) => {
    if (!editing) return 'No customer selected.';

    const response = await updateCustomer(editing.id, values);

    if (response?.success === false) {
      return response.message || 'The customer could not be updated.';
    }

    setEditing(null);
    onRefresh();
    return null;
  };

  const handleDelete = async () => {
    if (!removing) return;

    setDeleting(true);
    setDeleteError('');

    const response = await deleteCustomer(removing.id);

    setDeleting(false);

    if (response?.success === false) {
      setDeleteError(response.message || 'The customer could not be deleted.');
      return;
    }

    setRemoving(null);
    onRefresh();
  };

  return (
    <>
      <TableCard
        title="Customers"
        description="Saved billing profiles used on invoices"
        icon={<Building2 className="size-4" />}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        pageSize={5}
        loading={loading}
        error={error}
        onRetry={onRefresh}
        emptyDescription="Customers you save while creating an invoice will appear here."
        rowActions={(row) => (
          <>
            <IconButton
              variant="secondary"
              size="sm"
              label={`Update ${row.companyName}`}
              icon={<Pencil className="size-3.5" />}
              onClick={() => setEditing(row)}
            />
            <IconButton
              variant="secondary"
              size="sm"
              label={`Delete ${row.companyName}`}
              icon={<Trash2 className="size-3.5" />}
              onClick={() => {
                setDeleteError('');
                setRemoving(row);
              }}
            />
          </>
        )}
      />

      <RecordEditModal<CustomerInput>
        open={Boolean(editing)}
        title="Update customer"
        description="Changes apply to future invoices raised for this profile."
        fields={FIELDS}
        recordKey={editing?.id ?? 'none'}
        values={
          editing
            ? {
                companyName: editing.companyName,
                attentionPoc: editing.attentionPoc,
                phone: editing.phone,
                mailingAddress: editing.mailingAddress,
                city: editing.city,
                email: editing.email,
              }
            : null
        }
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />

      <ConfirmationModal
        open={Boolean(removing)}
        title="Delete this customer?"
        message={
          deleteError ||
          `${removing?.companyName ?? 'This customer'} will be removed from the directory. Invoices already raised for them are not affected.`
        }
        confirmText="Delete customer"
        loadingText="Deleting…"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setRemoving(null);
          setDeleteError('');
        }}
      />
    </>
  );
}
