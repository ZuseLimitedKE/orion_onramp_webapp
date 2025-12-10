import { useNavigate } from '@tanstack/react-router';
import { ArrowDownLeft, ArrowUpRight, Eye, RefreshCw, Loader2 } from 'lucide-react';
import { TransactionStatusBadge } from './TransactionStatusBadge';
import type { EnhancedTransaction } from '@/types/transactions';
import {
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_COLORS,
  TRANSACTION_TYPE_LABELS,
  convertToMajorUnits,
  formatCurrency,
  getTransactionType
} from '@/types/transactions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TransactionsTableProps {
  transactions: Array<EnhancedTransaction>;
  isLoading?: boolean;
  onTransactionClick?: (transaction: EnhancedTransaction) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function TransactionsTable({
  transactions,
  isLoading = false,
  onTransactionClick,
  onRefresh,
  isRefreshing = false,
}: TransactionsTableProps) {
  const navigate = useNavigate();

  const handleViewDetails = (transaction: EnhancedTransaction, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!transaction?.id) return;

    if (onTransactionClick) {
      onTransactionClick(transaction);
      return;
    }

    navigate({
      to: '/dashboard/transactions/$id',
      params: { id: transaction.id },
    });
  };

  const getTransactionIcon = (type: TRANSACTION_TYPE) => {
    return type === TRANSACTION_TYPE.ON_RAMP ? ArrowDownLeft : ArrowUpRight;
  };

  const getAmountDisplay = (transaction: EnhancedTransaction) => {
    const amount = convertToMajorUnits(transaction.amount);
    return formatCurrency(amount, 'KES');
  };

  if (transactions.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">
              No transactions found.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-3">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl">Transaction History</CardTitle>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRefresh && onRefresh()}
              disabled={isRefreshing}
              aria-label="Refresh transactions"
              className="p-1"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* compact content padding */}
      <CardContent className="">
        <div className="w-full">
          <Table className="w-full table-fixed text-xs">
            <TableHeader>
              {/* smaller header row height */}
              <TableRow className="">
                <TableHead className="p-1 text-xs font-medium w-[15%] text-muted-foreground">Reference</TableHead>
                <TableHead className="p-1 text-xs font-medium w-[12%] text-muted-foreground">Type</TableHead>
                <TableHead className="p-1 text-xs font-medium w-[12%] text-muted-foreground">Status</TableHead>
                <TableHead className="p-1 text-xs font-medium w-[16%] text-muted-foreground">User</TableHead>
                <TableHead className="p-1 text-xs font-medium w-[10%] text-muted-foreground">Token</TableHead>
                <TableHead className="p-1 text-xs font-medium w-[10%] text-muted-foreground">Date</TableHead>
                <TableHead className="p-1 text-xs font-medium text-right w-[8%] text-muted-foreground">Amount</TableHead>
                <TableHead className="p-1 text-xs font-medium text-right w-[6%] text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.map((transaction) => {
                const type = getTransactionType(transaction as any);
                const TypeIcon = getTransactionIcon(type);
                const amountDisplay = getAmountDisplay(transaction);
                const date = new Date(transaction.createdAt).toLocaleDateString();

                return (
                  <TableRow
                    key={transaction.id}
                    className="hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <TableCell className="p-1 align-middle whitespace-nowrap overflow-hidden truncate">
                      <div className="flex flex-col gap-0">
                        <span className="font-medium truncate">{transaction.reference}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{transaction.metadata?.note ?? ''}</span>
                      </div>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="p-1 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${TRANSACTION_TYPE_COLORS[type]}`} aria-hidden>
                          <TypeIcon className="h-3 w-3" />
                        </div>
                        <span className="truncate">{TRANSACTION_TYPE_LABELS[type]}</span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="p-1 align-middle whitespace-nowrap">
                      <TransactionStatusBadge status={transaction.transactionStatus} />
                    </TableCell>

                    {/* User */}
                    <TableCell className="p-1 align-middle whitespace-nowrap overflow-hidden">
                      <div className="flex flex-col gap-0">
                        <span className="truncate font-medium">{transaction.email}</span>
                        {transaction.user?.name && (
                          <span className="text-[11px] text-muted-foreground truncate">{transaction.user.name}</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Token */}
                    <TableCell className="p-1 align-middle whitespace-nowrap">
                      <span className="font-mono text-[12px] inline-block whitespace-nowrap overflow-hidden truncate px-2 py-0.5 rounded bg-secondary">
                        {transaction.token}
                      </span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="p-1 align-middle whitespace-nowrap text-muted-foreground">
                      <span className="truncate">{date}</span>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="p-1 align-middle whitespace-nowrap text-right font-semibold">
                      {amountDisplay}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="p-1 align-middle whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(transaction, e);
                        }}
                        className="p-1"
                        aria-label={`View ${transaction.reference}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
