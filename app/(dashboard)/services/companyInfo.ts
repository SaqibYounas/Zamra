import axios from 'axios';
import { toServiceError, type MutationOutcome } from './serviceResult';

/** Business details recorded for the plant and printed on invoices. */
export interface CompanyInfoInput {
  companyName: string;
  ownerName: string;
  city: string;
  contact: string;
  address: string;
  email: string;
}

/** Saves the company profile. Toasts the outcome. */
export async function saveCompanyInfo(
  data: CompanyInfoInput
): Promise<MutationOutcome> {
  try {
    const response = await axios.post('/api/company-info', data, {
      showToast: true,
    });
    return response.data;
  } catch (error) {
    return toServiceError(error, 'Company information could not be saved.');
  }
}
