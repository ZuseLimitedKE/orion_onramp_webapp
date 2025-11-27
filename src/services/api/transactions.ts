import { Api } from '../api';
import type {
  InitializeTransactionRequest,
  InitializeTransactionResponse,
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
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.search) queryParams.append('search', params.search);
    
    return Api.get(`/api/transaction?${queryParams.toString()}`);
  },

  /**
   * Get a single transaction by ID
   */
  getTransactionById: (id: string): Promise<TransactionResponse> =>
    Api.get(`/api/transaction/${id}`),

  /**
   * Initialize a new transaction
   */
  initializeTransaction: (
    data: InitializeTransactionRequest,
    environmentId: string
  ): Promise<InitializeTransactionResponse> => {
    // This would use the private key authentication
    return Api.post('/api/transaction/initialize', data, {
      headers: {
        'Authorization': `Bearer ${environmentId}`, // This would be the private key
      },
    });
  },

  /**
   * Verify a transaction by reference
   */
  verifyTransaction: (reference: string): Promise<TransactionResponse> =>
    Api.get(`/api/transaction/verify/${reference}`),

  /**
   * Export transactions as CSV
   */
  exportTransactions: (params: TransactionsQueryParams): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    
    queryParams.append('business_id', params.business_id);
    queryParams.append('environment_type', params.environment_type);
    
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.search) queryParams.append('search', params.search);
    
    return Api.get(`/api/transaction/export?${queryParams.toString()}`, {
      responseType: 'blob',
    });
  },
};

export default transactionsApi;