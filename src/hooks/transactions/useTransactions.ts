/* eslint-disable no-shadow */
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  TOKEN_TYPE,
  TransactionFilters,
  TransactionsQueryParams,
} from '@/types/transactions'
import type { MyError } from '@/services/api'
import type { EnvironmentType } from '@/types/environments'
import transactionsApi from '@/services/api/transactions'

// Query keys for consistent cache management
export const transactionQueryKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionQueryKeys.all, 'list'] as const,
  list: (
    filters: Partial<TransactionFilters> & {
      businessId: string
      environmentType: EnvironmentType
      page?: number
      limit?: number
    },
  ) => [...transactionQueryKeys.lists(), filters] as const,
  details: () => [...transactionQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionQueryKeys.details(), id] as const,
}

interface UseTransactionsParams {
  businessId: string
  environmentType: EnvironmentType
  filters?: Omit<TransactionFilters, 'dateRange'> & { token?: TOKEN_TYPE }
  page?: number
  limit?: number
}

export function useTransactions({
  businessId,
  environmentType,
  filters = {},
  page = 1,
  limit = 20,
}: UseTransactionsParams) {
  // Build query params explicitly so we only send defined fields
  const queryParams: TransactionsQueryParams = {
    business_id: businessId,
    environment_type: environmentType,
    page,
    limit,
  }

  if (filters.token) queryParams.token = filters.token
  if (filters.status) queryParams.status = filters.status
  if (filters.search) queryParams.search = filters.search

  const {
    data: transactionsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: transactionQueryKeys.list({
      ...(filters ?? {}),
      businessId,
      environmentType,
      page,
      limit,
    }),
    queryFn: () => transactionsApi.getTransactions(queryParams),
    enabled: !!businessId && !!environmentType,
    retry: 2,
    staleTime: 30 * 1000, // 30 seconds
  })

  return {
    // Data
    transactions: transactionsData?.data || [],
    pagination: transactionsData?.pagination,
    isLoading,
    isFetching,
    isError,
    error: error as MyError | null,

    refetch,
  }
}

// Hook for prefetching transactions
export function usePrefetchTransactions(params: UseTransactionsParams) {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: transactionQueryKeys.list({
        ...(params.filters ?? {}),
        businessId: params.businessId,
        environmentType: params.environmentType,
        page: params.page,
        limit: params.limit,
      }),
      queryFn: () =>
        transactionsApi.getTransactions({
          business_id: params.businessId,
          environment_type: params.environmentType,
          page: params.page,
          limit: params.limit,
          ...(params.filters ?? {}),
        }),
    })
  }
}
