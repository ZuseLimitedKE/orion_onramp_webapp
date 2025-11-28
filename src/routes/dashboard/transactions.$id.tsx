import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransactionDetails } from '@/hooks/transactions/useTransactionDetails';
import { TransactionStatusBadge } from '@/components/transactions/TransactionStatusBadge';
import { TransactionSkeleton } from '@/components/transactions/TransactionSkeleton';
import {
  convertToMajorUnits,
  formatCurrency,
} from '@/types/transactions';

export const Route = createFileRoute('/dashboard/transactions/$id')({
  component: TransactionDetailPage,
});

function TransactionDetailPage() {
  const { id } = Route.useParams();
  const { transaction, isLoading, error } = useTransactionDetails(id);
  const navigate = Route.useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl">
        <TransactionSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground">Error Loading Transaction</h1>
          <p className="text-muted-foreground mt-2">
            {error.message || 'Failed to load transaction details.'}
          </p>
          <Button
            onClick={() => navigate({ to: '/dashboard/transactions' })}
            className="mt-4"
          >
            Back to Transactions
          </Button>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground">Transaction Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The transaction you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate({ to: '/dashboard/transactions' })}
            className="mt-4"
          >
            Back to Transactions
          </Button>
        </div>
      </div>
    );
  }

  // const environmentType = getEnvironmentType(transaction.token);

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/dashboard/transactions' })}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">
            Transaction Details
          </h1>
          <p className="text-muted-foreground">
            Reference: {transaction.reference}
          </p>
        </div>
        <TransactionStatusBadge status={transaction.transactionStatus} />
      </div>

      {/* Transaction Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Reference
                </label>
                <p className="font-mono text-sm">{transaction.reference}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Type
                </label>
                {/* <p>{getTransactionTypeLabel(transaction.transactionType)}</p> */}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Environment
                </label>
                
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-card rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-4">User Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p>{transaction.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-4">Financial Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Amount
                </label>
                <p className="text-2xl font-bold">
                  {formatCurrency(convertToMajorUnits(transaction.amount), 'KES')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Token
                </label>
                <p className="font-mono">{transaction.token}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <p>{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p>{new Date(transaction.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
        <div className="mt-6 bg-card rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-4">Metadata</h2>
          <pre className="text-sm bg-muted p-3 rounded-lg overflow-auto">
            {JSON.stringify(transaction.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}