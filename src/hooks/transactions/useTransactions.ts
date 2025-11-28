/* eslint-disable no-shadow */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  TOKEN_TYPE,
  TransactionFilters,
  TransactionsQueryParams,
} from '@/types/transactions';
import type { MyError } from '@/services/api';
import type { EnvironmentType } from '@/types/environments';
import transactionsApi from '@/services/api/transactions';

// Query keys for consistent cache management
export const transactionQueryKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionQueryKeys.all, 'list'] as const,
  list: (filters: TransactionFilters & { 
    businessId: string; 
    environmentType: EnvironmentType;
    page?: number;
    limit?: number;
  }) => [...transactionQueryKeys.lists(), filters] as const,
  details: () => [...transactionQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionQueryKeys.details(), id] as const,
};

interface UseTransactionsParams {
  businessId: string;
  environmentType: EnvironmentType;
  filters?: Omit<TransactionFilters, 'dateRange'> & { token?: TOKEN_TYPE };
  page?: number;
  limit?: number;
}

export function useTransactions({
  businessId,
  environmentType,
  filters = {},
  page = 1,
  limit = 20,
}: UseTransactionsParams) {

  const queryParams: TransactionsQueryParams = {
    business_id: businessId,
    environment_type: environmentType,
    page,
    limit,
    ...filters,
  };

  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: transactionQueryKeys.list({ 
      ...filters, 
      businessId, 
      environmentType, 
      page, 
      limit 
    }),
    queryFn: () => transactionsApi.getTransactions(queryParams),
    enabled: !!businessId && !!environmentType,
    retry: 2,
    staleTime: 30 * 1000, // 30 seconds
  });

  const exportTransactionsMutation = useMutation({
    mutationFn: (params: TransactionsQueryParams) =>
      transactionsApi.exportTransactions(params),
    onSuccess: (blob) => {
      // Create download link for the blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Transactions exported successfully');
    },
    onError: (error: MyError) => {
      console.error('Failed to export transactions:', error.message);
      toast.error(error.message || 'Failed to export transactions');
    },
  });

  return {
    // Data
    transactions: transactionsData?.data || [],
    pagination: transactionsData?.pagination,
    isLoading,
    error: error as MyError | null,

    // Actions
    exportTransactions: exportTransactionsMutation.mutateAsync,
    refetch,

    // Mutation states
    isExporting: exportTransactionsMutation.isPending,
  };
}

// Hook for prefetching transactions
export function usePrefetchTransactions(params: UseTransactionsParams) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: transactionQueryKeys.list({ 
        ...params.filters, 
        businessId: params.businessId, 
        environmentType: params.environmentType,
        page: params.page,
        limit: params.limit,
      }),
      queryFn: () => transactionsApi.getTransactions({
        business_id: params.businessId,
        environment_type: params.environmentType,
        page: params.page,
        limit: params.limit,
        ...params.filters,
      }),
    });
  };
}