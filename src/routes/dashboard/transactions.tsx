import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import type { EnhancedTransaction, TransactionFilters as TransactionFiltersType } from '@/types/transactions';
import type { EnvironmentType } from '@/types/environments';
import { getTransactionType } from '@/types/transactions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useTransactions } from '@/hooks/transactions/useTransactions';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { TransactionDetails } from '@/components/transactions/TransactionDetails';
import { TransactionSkeleton } from '@/components/transactions/TransactionSkeleton';
import { Card, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/dashboard/transactions')({
  component: TransactionsPage,
});

function TransactionsPage() {
  const { currentBusiness, isLoading: isBusinessLoading } = useBusinessContext();

  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFiltersType>({});
  const [page, setPage] = useState(1);
  const [environmentType, setEnvironmentType] = useState<EnvironmentType>('test');
  const limit = 20;

  const {
    transactions: rawTransactions,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useTransactions({
    businessId: currentBusiness?.id || '',
    environmentType,
    filters,
    page,
    limit,
  });

  // Derive enhanced transactions and transaction type from transactionStatus
  const enhancedTransactions: Array<EnhancedTransaction> = rawTransactions.map((tx) => ({
    ...tx,
    amountMajor: tx.amount / 100, // Convert cents to major units
    type: getTransactionType(tx) as any,
    currency: 'KES',
    user: {
      email: tx.email,
    },
  }));

  const handleFiltersChange = (newFilters: TransactionFiltersType) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleTransactionClick = (transaction: EnhancedTransaction) => {
    if (!transaction?.id) return;
    setSelectedTransaction(transaction.id);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnvironmentChange = (value: string) => {
    setEnvironmentType(value as EnvironmentType);
    setPage(1); // Reset to first page when environment changes
    setFilters({});
  };

  if (isBusinessLoading) {
    return <TransactionSkeleton />;
  }

  if (!currentBusiness) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold">No Business Selected</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please select a business from the business switcher to view transactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all transactions for your business
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Environment Toggle */}
          <Tabs value={environmentType} onValueChange={handleEnvironmentChange}>
            <TabsList>
              <TabsTrigger value="test">Test</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <TransactionFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        isLoading={isLoading || isFetching}
      />

      {/* Error state for transactions */}
      {isError && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold">Failed to load transactions</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {error?.message || 'An error occurred while fetching transactions.'}
            </p>
            <div className="mt-4">
              <Button onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table / Skeleton logic */}
      {isLoading ? (
        // Initial transactions skeleton (first-time load)
        <TransactionSkeleton />
      ) : (
        <>
          <TransactionsTable
            transactions={enhancedTransactions}
            onTransactionClick={handleTransactionClick}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to{' '}
                {Math.min(page * limit, pagination.totalItems)} of{' '}
                {pagination.totalItems} transactions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground mx-2">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetails
          transactionId={selectedTransaction}
          open={!!selectedTransaction}
          onOpenChange={(open) => !open && setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}
