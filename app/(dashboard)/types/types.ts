export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  poc: string;
}

export interface MetaInfo {
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
  shipDate: string;
  shipVia: string;
  salesperson: string;
  fob: string;
  terms: string;
}

export interface InvoiceItem {
  id: number;
  no: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface PaymentInfo {
  paidAmount: number;
}

export interface InvoiceData {
  companyInfo: CompanyInfo;
  meta: MetaInfo;
  billTo: BillToInfo;
  shipTo: ShipToInfo;
  logisticInfo: LogisticInfo;
  items: InvoiceItem[];
  previousDue: number;
  payment: PaymentInfo;
  taxRate: number;
  shipping: number;
  other: number;
}

export type ObjectSectionKey =
  | 'companyInfo'
  | 'meta'
  | 'billTo'
  | 'shipTo'
  | 'logisticInfo'
  | 'payment';
