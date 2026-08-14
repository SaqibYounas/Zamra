'use client';

import { useState } from 'react';
import { MapPin, Pencil, Phone, Trash2, Truck, User } from 'lucide-react';

import { type DataTableColumn } from '@/app/src/components/ui/DataTable';
import { IconButton } from '@/app/src/components/ui/Button';
import ConfirmationModal from '@/app/src/components/ui/ConfirmationModal';

import TableCard from './TableCard';
import RecordEditModal, {
  type EditableField,
} from '../../components/RecordEditModal';
import {
  deleteShippingAddress,
  updateShippingAddress,
  type ShippingAddressInput,
} from '../../services/customers';
import type { ShippingAddress } from '../../types/customer';

interface Props {
  rows: ShippingAddress[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const FIELDS: EditableField<ShippingAddressInput>[] = [
  { name: 'warehouseName', label: 'Warehouse', icon: Truck, required: true },
  { name: 'attentionTo', label: 'Contact person', icon: User, required: true },
  { name: 'phone', label: 'Phone', icon: Phone, inputMode: 'tel' },
  {
    name: 'deliveryAddress',
    label: 'Delivery address',
    icon: MapPin,
    required: true,
    wide: true,
  },
];

export default function ShippingDirectory({
  rows,
  loading,
  error,
  onRefresh,
}: Props) {
  const [editing, setEditing] = useState<ShippingAddress | null>(null);
  const [removing, setRemoving] = useState<ShippingAddress | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const columns: DataTableColumn<ShippingAddress>[] = [
    {
      key: 'warehouseName',
      label: 'Warehouse',
      render: (row) => (
        <span
          className="block max-w-[13rem] truncate font-semibold text-ink"
          title={row.warehouseName || undefined}
        >
          {row.warehouseName || '—'}
        </span>
      ),
    },
    {
      key: 'attentionTo',
      label: 'Contact person',
      render: (row) => (
        <span
          className="block max-w-[10rem] truncate"
          title={row.attentionTo || undefined}
        >
          {row.attentionTo || '—'}
        </span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => (
        <span className="tabular whitespace-nowrap">{row.phone || '—'}</span>
      ),
    },
    {
      key: 'deliveryAddress',
      label: 'Delivery address',
      render: (row) => (
        <span
          className="block max-w-[16rem] truncate"
          title={row.deliveryAddress || undefined}
        >
          {row.deliveryAddress || '—'}
        </span>
      ),
    },
  ];

  const handleUpdate = async (values: ShippingAddressInput) => {
    if (!editing) return 'No shipping address selected.';

    const response = await updateShippingAddress(editing.id, values);

    if (response?.success === false) {
      return response.message || 'The shipping address could not be updated.';
    }

    setEditing(null);
    onRefresh();
    return null;
  };

  const handleDelete = async () => {
    if (!removing) return;

    setDeleting(true);
    setDeleteError('');

    const response = await deleteShippingAddress(removing.id);

    setDeleting(false);

    if (response?.success === false) {
      setDeleteError(
        response.message || 'The shipping address could not be deleted.'
      );
      return;
    }

    setRemoving(null);
    onRefresh();
  };

  return (
    <>
      <TableCard
        title="Shipping addresses"
        description="Delivery destinations available when invoicing"
        icon={<Truck className="size-4" />}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        pageSize={5}
        loading={loading}
        error={error}
        onRetry={onRefresh}
        emptyDescription="Warehouses and delivery points will appear here once saved."
        rowActions={(row) => (
          <>
            <IconButton
              variant="secondary"
              size="sm"
              label={`Update ${row.warehouseName}`}
              icon={<Pencil className="size-3.5" />}
              onClick={() => setEditing(row)}
            />
            <IconButton
              variant="secondary"
              size="sm"
              label={`Delete ${row.warehouseName}`}
              icon={<Trash2 className="size-3.5" />}
              onClick={() => {
                setDeleteError('');
                setRemoving(row);
              }}
            />
          </>
        )}
      />

      <RecordEditModal<ShippingAddressInput>
        open={Boolean(editing)}
        title="Update shipping address"
        description="Changes apply to future invoices shipped to this destination."
        fields={FIELDS}
        recordKey={editing?.id ?? 'none'}
        values={
          editing
            ? {
                warehouseName: editing.warehouseName,
                attentionTo: editing.attentionTo,
                phone: editing.phone,
                deliveryAddress: editing.deliveryAddress,
              }
            : null
        }
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />

      <ConfirmationModal
        open={Boolean(removing)}
        title="Delete this shipping address?"
        message={
          deleteError ||
          `${removing?.warehouseName ?? 'This destination'} will no longer be available when invoicing. Invoices already shipped to it are not affected.`
        }
        confirmText="Delete address"
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
