import { useQuery } from '@tanstack/react-query';
import { transactionQueryKeys } from './useTransactions';
import type { MyError } from '@/services/api';
import transactionsApi from '@/services/api/transactions';

export function useTransactionDetails(transactionId: string | undefined) {
  const {
    data: transactionData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: transactionQueryKeys.detail(transactionId!),
    queryFn: () => transactionsApi.getTransactionById(transactionId!),
    enabled: !!transactionId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    transaction: transactionData?.transaction || null,
    isLoading,
    error: error as MyError | null,
    refetch,
  };
}