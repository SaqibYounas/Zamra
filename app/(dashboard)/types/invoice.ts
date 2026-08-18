export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  /** Point of contact printed as the invoice manager. */
  poc: string;
}

export interface InvoiceMeta {
  /** ISO date (`yyyy-mm-dd`) so it binds directly to a date input. */
  date: string;
  invoiceNo: string;
}

export interface BillToInfo {
  attn: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

export interface ShipToInfo {
  attn: string;
  name: string;
  address: string;
  city: string;
  phone: string;
}

export interface LogisticInfo {
  poNo: string;
  /** ISO date (`yyyy-mm-dd`). */
  shipDate: string;
  shipVia: string;
  salesperson: string;
  fob: string;
  terms: string;
}

export interface InvoiceItem {
  /** Client-side row id; not sent to the backend. */
  id: number;
  /** Item code shown in the document's first column. */
  no: string;
  description: string;
  bottleType: string;
  qty: number;
  unitPrice: number;
}

export interface PaymentInfo {
  paidAmount: number;
}

export interface InvoiceData {
  companyInfo: CompanyInfo;
  meta: InvoiceMeta;
  billTo: BillToInfo;
  shipTo: ShipToInfo;
  logisticInfo: LogisticInfo;
  items: InvoiceItem[];
  previousDue: number;
  payment: PaymentInfo;
  /** Percentage, e.g. `3.8` for 3.8%. */
  taxRate: number;
  shipping: number;
  other: number;
}

/** Settlement state of a saved invoice. */
export type InvoiceStatus = 'Paid' | 'Pending' | 'Unpaid';

/** One row of the invoice history table. */

/** One line of a saved invoice, as the backend returns it. */
export interface InvoiceLineRecord {
  id?: number | string;
  itemCode?: string;
  description?: string;
  bottleType?: string;
  qty: number;
  rate: number;
}

/**
 * A saved invoice in full. Every field beyond the summary is optional: this is
 * shaped for a backend contract that does not exist yet.
 */
export interface InvoiceRecord extends InvoiceSummary {
  poNo?: string;
  shipVia?: string;
  rep?: string;
  fob?: string;
  terms?: string;
  dispatchDate?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  shipToName?: string;
  shipToAddress?: string;
  shipToPhone?: string;
  taxRate?: number;
  shippingCharges?: number;
  miscCharges?: number;
  previousDueArrears?: number;
  amountPaid?: number;
  subtotal?: number;
  taxAmount?: number;
  totalAmount?: number;
  balanceDue?: number;
  items?: InvoiceLineRecord[];
}

/** Editable fields of an invoice, as the update form submits them. */
export interface InvoiceUpdateInput {
  invoiceNo: string;
  date: string;
  customer: string;
  status: InvoiceStatus;
  poNo?: string;
  shipVia?: string;
  rep?: string;
  terms?: string;
  taxRate?: number;
  shippingCharges?: number;
  miscCharges?: number;
  previousDueArrears?: number;
  amountPaid?: number;
  items?: InvoiceLineRecord[];
}

/**
 * Keys of `InvoiceData` whose value is a nested object, so a single change
 * handler can address `(section, field)` pairs.
 */
export type ObjectSectionKey =
  | 'companyInfo'
  | 'meta'
  | 'billTo'
  | 'shipTo'
  | 'logisticInfo'
  | 'payment';

export interface InvoiceCustomer {
  id: number;
  companyName: string;
  attentionPoc: string;
  email: string;
}

export interface InvoiceSummary {
  id: number;
  invoiceNo: string;
  customer: InvoiceCustomer | null;
  date: string;
  amount: number;
  status: InvoiceStatus | null;
}
