export interface Customer {
  id: number;
  companyName: string;
  attentionPoc: string;
  phone: string;
  mailingAddress: string;
  city: string;
  email: string;
}

/** A saved delivery destination from `GET /api/shipping-addresses`. */
export interface ShippingAddress {
  id: number;
  warehouseName: string;
  attentionTo: string;
  phone: string;
  deliveryAddress: string;
}
