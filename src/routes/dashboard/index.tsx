/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Link, createFileRoute } from '@tanstack/react-router'
import { Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, DollarSign, FileText, Key, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBusinessContext } from '@/contexts/BusinessContext';
import { useTransactions } from '@/hooks/transactions/useTransactions';
import { TransactionStatusBadge } from '@/components/transactions/TransactionStatusBadge';
import { TRANSACTION_STATUS, TRANSACTION_TYPE_LABELS, convertToMajorUnits, formatCurrency } from '@/types/transactions';

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { currentBusiness, businesses } = useBusinessContext();
  
  const { 
    transactions, 
    isLoading: transactionsLoading,
    pagination 
  } = useTransactions({
    businessId: currentBusiness?.id || '',
    environmentType: 'test',
    page: 1,
    limit: 5,
  });

  const calculateStats = () => {
    if (transactionsLoading || !transactions.length) {
      return {
        totalTransactions: 0,
        totalVolume: 0,
        onrampTransactions: 0,
        offrampTransactions: 0,
        onrampVolume: 0,
        offrampVolume: 0,
      };
    }

    const totalTransactions = pagination?.totalItems || transactions.length;
    const totalVolume = transactions.reduce((sum, tx) => sum + convertToMajorUnits(tx.amount), 0);
    
    const onrampTransactions = transactions.filter(tx => 
      tx.transactionStatus === TRANSACTION_STATUS.ONRAMPED
    );
      
    const offrampTransactions = transactions.filter(tx => 
      tx.transactionStatus === TRANSACTION_STATUS.OFFRAMPED
    );

    const onrampVolume = onrampTransactions.reduce((sum, tx) => sum + convertToMajorUnits(tx.amount), 0);
    const offrampVolume = offrampTransactions.reduce((sum, tx) => sum + convertToMajorUnits(tx.amount), 0);

    return {
      totalTransactions,
      totalVolume,
      onrampTransactions: onrampTransactions.length,
      offrampTransactions: offrampTransactions.length,
      onrampVolume,
      offrampVolume,
    };
  };

   const stats = calculateStats();
  const hasBusinesses = businesses.length > 0;
  const isBusinessApproved = currentBusiness?.status === 'Approved';

  const dashboardStats = [
    {
      title: "Total Transactions",
      value: stats.totalTransactions.toLocaleString(),
      icon: Activity,
      description: "All time transactions"
    },
    {
      title: "Total Volume",
      value: formatCurrency(stats.totalVolume, 'KES'),
      icon: DollarSign,
      description: "Total processed volume"
    },
    {
      title: "On-Ramp Transactions",
      value: stats.onrampTransactions.toLocaleString(),
      icon: ArrowDownLeft,
      description: `Volume: ${formatCurrency(stats.onrampVolume, 'KES')}`
    },
    {
      title: "Off-Ramp Transactions",
      value: stats.offrampTransactions.toLocaleString(),
      icon: ArrowUpRight,
      description: `Volume: ${formatCurrency(stats.offrampVolume, 'KES')}`
    },
  ];

  const recentTransactions = transactions.slice(0, 5).map(tx => ({
    id: tx.id,
    reference: tx.reference,
    type: tx.transactionStatus === TRANSACTION_STATUS.ONRAMPED ? 'on_ramp' : 
           tx.transactionStatus === TRANSACTION_STATUS.OFFRAMPED ? 'off_ramp' : 'on_ramp',
    amount: formatCurrency(convertToMajorUnits(tx.amount), 'KES'),
    status: tx.transactionStatus,
    time: new Date(tx.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    email: tx.email,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {currentBusiness ? `Welcome to ${currentBusiness.tradingName || currentBusiness.legalBusinessName}` : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {currentBusiness 
            ? `Here's an overview of your business activity.` 
            : 'Get started by creating your first business.'}
        </p>
      </div>

      {!hasBusinesses ? (
        <Card className="border-border text-center py-12">
          <CardContent>
            <div className="max-w-md mx-auto">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No businesses yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first business to start processing transactions and managing your payment operations.
              </p>
              <Button asChild>
                <Link to="/dashboard/business/create">
                  Create Your First Business
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : !currentBusiness ? (
        // Loading business state
        <Card className="border-border">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">Loading business data...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat) => (
              <Card key={stat.title} className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recent Transactions */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard/transactions" className="flex items-center gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 animate-pulse">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-24"></div>
                          <div className="h-3 bg-muted rounded w-32"></div>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="h-4 bg-muted rounded w-16 ml-auto"></div>
                          <div className="h-3 bg-muted rounded w-20 ml-auto"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground text-sm">
                              {transaction.reference}
                            </span>
                            <TransactionStatusBadge 
                              status={transaction.status} 
                              className="text-xs"
                              showIcon={false}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {transaction.email} • {transaction.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground text-sm">
                            {transaction.amount}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {TRANSACTION_TYPE_LABELS[transaction.type as keyof typeof TRANSACTION_TYPE_LABELS] || transaction.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No transactions yet. Start processing payments to see them here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start h-auto p-4">
                  <Link to="/dashboard/settings" search={{ tab: 'api-keys' }}>
                    <Key className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <p className="font-semibold">Manage API Keys</p>
                      <p className="text-sm opacity-90">Configure your test and live environments</p>
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full justify-start h-auto p-4">
                  <a 
                    href="" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <p className="font-semibold">View Documentation</p>
                      <p className="text-sm opacity-90">Learn how to integrate Orion API</p>
                    </div>
                  </a>
                </Button>

                <Button asChild variant="outline" className="w-full justify-start h-auto p-4">
                  <Link to="/dashboard/transactions">
                    <Activity className="h-5 w-5 mr-3 text-foreground" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">View All Transactions</p>
                      <p className="text-sm text-muted-foreground">See complete transaction history</p>
                    </div>
                  </Link>
                </Button>

                {!isBusinessApproved && currentBusiness?.status === 'Pending' && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-sm font-medium text-amber-900">
                      Business Under Review
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Your business is pending approval. You can still set up test environments.
                    </p>
                  </div>
                )}

                {isBusinessApproved && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm font-medium text-green-900">
                      Business Approved
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Your business is fully approved and ready for live transactions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Business Status */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Business Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className={`flex items-center gap-3 p-4 rounded-lg ${
                  currentBusiness.status === 'Approved' 
                    ? 'bg-green-50 border border-green-200' 
                    : currentBusiness.status === 'Pending'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className={`h-3 w-3 rounded-full ${
                    currentBusiness.status === 'Approved' 
                      ? 'bg-green-500' 
                      : currentBusiness.status === 'Pending'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">Business Approval</p>
                    <p className="text-xs text-muted-foreground capitalize">{currentBusiness.status}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}