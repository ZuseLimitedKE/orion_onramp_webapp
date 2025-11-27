import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Download } from 'lucide-react';
import type {
  EnhancedTransaction,
  TransactionFilters as TransactionFiltersType,
} from '@/types/transactions';
import { Button } from '@/components/ui/button';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useTransactions } from '@/hooks/transactions/useTransactions';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { TransactionDetails } from '@/components/transactions/TransactionDetails';
import { TransactionSkeleton } from '@/components/transactions/TransactionSkeleton';

export const Route = createFileRoute('/dashboard/transactions')({
  component: TransactionsPage,
});

function TransactionsPage() {
  const { currentBusiness } = useBusinessContext();
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFiltersType>({});
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    transactions: rawTransactions,
    pagination,
    isLoading,
    isExporting,
    exportTransactions,
  } = useTransactions({
    businessId: currentBusiness?.id || '',
    environmentType: 'test', // might want to make this dynamic
    filters,
    page,
    limit,
  });

  const enhancedTransactions: Array<EnhancedTransaction> = rawTransactions.map((tx) => ({
    ...tx,
    amountMajor: tx.amount / 100, // Convert cents to major units
    type: tx.metadata?.type || 'on_ramp', // might want to adjust this logic
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

  const handleExport = async () => {
    if (!currentBusiness) return;

    await exportTransactions({
      business_id: currentBusiness.id,
      environment_type: 'test',
      ...filters,
    });
  };

  const handleTransactionClick = (transaction: EnhancedTransaction) => {
    setSelectedTransaction(transaction.id);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting || enhancedTransactions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        isLoading={isLoading}
      />

      {/* Transactions Table */}
      {isLoading ? (
        <TransactionSkeleton />
      ) : (
        <>
          <TransactionsTable
            transactions={enhancedTransactions}
            onTransactionClick={handleTransactionClick}
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