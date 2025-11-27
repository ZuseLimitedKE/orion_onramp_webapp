import { toast } from 'sonner';
import { Calendar, Coins, Copy, ExternalLink, Hash, Mail } from 'lucide-react';
import { TransactionStatusBadge } from './TransactionStatusBadge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTransactionDetails } from '@/hooks/transactions/useTransactionDetails';
import {
  TRANSACTION_TYPE_LABELS,
  convertToMajorUnits,
  formatCurrency,
  getTransactionType,
} from '@/types/transactions';


interface TransactionDetailsProps {
  transactionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetails({
  transactionId,
  open,
  onOpenChange,
}: TransactionDetailsProps) {
  const { transaction, isLoading } = useTransactionDetails(
    open ? transactionId : undefined
  );

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error(`Failed to copy ${label}`);
    }
  };

  if (!transaction && !isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Complete information for transaction {transaction?.reference}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="space-y-4">
              {/* Loading skeleton */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : transaction ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Reference
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{transaction.reference}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(transaction.reference, 'Reference')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="mt-1">
                        <TransactionStatusBadge status={transaction.transactionStatus} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Type
                      </label>
                      <div className="mt-1">
                        <Badge variant="outline">
                          {TRANSACTION_TYPE_LABELS[getTransactionType(transaction)]}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Token
                      </label>
                      <div className="mt-1">
                        <Badge variant="secondary" className="font-mono">
                          {transaction.token}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amount & Financial Details */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Financial Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Amount
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Coins className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">
                          {formatCurrency(convertToMajorUnits(transaction.amount), 'KES')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Created
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Information */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">User Information</h3>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{transaction.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(transaction.email, 'Email')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Paystack Details */}
              {transaction.authorizationUrl && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Authorization URL
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-blue-600 truncate flex-1">
                            {transaction.authorizationUrl}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={transaction.authorizationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Open
                            </a>
                          </Button>
                        </div>
                      </div>
                      {transaction.accessCode && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Access Code
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-sm">{transaction.accessCode}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(transaction.accessCode!, 'Access Code')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                    <pre className="text-sm bg-muted p-3 rounded-lg overflow-auto">
                      {JSON.stringify(transaction.metadata, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Transaction not found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}