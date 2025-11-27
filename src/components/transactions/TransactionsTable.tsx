import { useNavigate } from '@tanstack/react-router';
import { ArrowDownLeft, ArrowUpRight, Eye } from 'lucide-react';
import { TransactionStatusBadge } from './TransactionStatusBadge';
import type {EnhancedTransaction} from '@/types/transactions';
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
}

export function TransactionsTable({
  transactions,
  isLoading = false,
  onTransactionClick,
}: TransactionsTableProps) {
  const navigate = useNavigate();

  const handleViewDetails = (transaction: EnhancedTransaction, e?: React.MouseEvent) => {
    // Prevent event bubbling if called from button click
    if (e) {
      e.stopPropagation();
    }

    if (onTransactionClick) {
      onTransactionClick(transaction);
    } else {
      navigate({
        to: '/dashboard/transactions/$id',
        params: { id: transaction.id },
      });
    }
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
              No transactions found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {`Try adjusting your search or filters`}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Token</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const type = getTransactionType(transaction);
              const TypeIcon = getTransactionIcon(type);
              const amountDisplay = getAmountDisplay(transaction);
              const date = new Date(transaction.createdAt).toLocaleDateString();

              return (
                <TableRow 
                  key={transaction.id}
                  className="hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(transaction)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{transaction.reference}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-full ${TRANSACTION_TYPE_COLORS[type]}`}
                      >
                        <TypeIcon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm capitalize">
                        {TRANSACTION_TYPE_LABELS[type]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TransactionStatusBadge status={transaction.transactionStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{transaction.email}</p>
                      {transaction.user?.name && (
                        <p className="text-muted-foreground text-xs">
                          {transaction.user.name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                      {transaction.token}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {date}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {amountDisplay}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(transaction);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}