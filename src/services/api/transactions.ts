import { Api } from '../api';
import type {
  TransactionResponse,
  TransactionsQueryParams,
  TransactionsResponse,
} from '@/types/transactions';

const transactionsApi = {
  /**
   * Get transactions with pagination and filtering
   */
  getTransactions: (params: TransactionsQueryParams): Promise<TransactionsResponse> => {
    const queryParams = new URLSearchParams();
    
    queryParams.append('business_id', params.business_id);
    queryParams.append('environment_type', params.environment_type);
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.token) queryParams.append('token', params.token);
    if (params.search) queryParams.append('search', params.search);
    
    return Api.get(`/api/transaction?${queryParams.toString()}`);
  },

  /**
   * Get a single transaction by ID
   */
  getTransactionById: (id: string): Promise<TransactionResponse> =>
    Api.get(`/api/transaction/${id}`),
};

export default transactionsApi;