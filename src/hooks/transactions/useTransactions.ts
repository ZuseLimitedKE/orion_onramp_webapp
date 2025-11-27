/* eslint-disable no-shadow */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  InitializeTransactionRequest,
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
  filters?: Omit<TransactionFilters, 'dateRange'>;
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
  const queryClient = useQueryClient();

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

  const initializeTransactionMutation = useMutation({
    mutationFn: ({ data, environmentId }: { data: InitializeTransactionRequest; environmentId: string }) =>
      transactionsApi.initializeTransaction(data, environmentId),
    onSuccess: (response) => {
      toast.success('Transaction initialized successfully');
      // Invalidate transactions list to reflect new transaction
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      return response;
    },
    onError: (error: MyError) => {
      console.error('Failed to initialize transaction:', error.message);
      toast.error(error.message || 'Failed to initialize transaction');
    },
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
    initializeTransaction: initializeTransactionMutation.mutateAsync,
    exportTransactions: exportTransactionsMutation.mutateAsync,
    refetch,

    // Mutation states
    isInitializing: initializeTransactionMutation.isPending,
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