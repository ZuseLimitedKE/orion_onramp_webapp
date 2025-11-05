import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Key, FileText } from "lucide-react";

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

const stats = [
  {
    title: "Total Transactions",
    value: "12,543",
    change: "+12.5%",
    trend: "up",
    icon: Activity,
  },
  {
    title: "Total Volume",
    value: "$2.4M",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "1,429",
    change: "+3.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "API Calls",
    value: "45,231",
    change: "-2.4%",
    trend: "down",
    icon: Key,
  },
];

const recentTransactions = [
  { id: "TXN-001", type: "On-ramp", amount: "1,250 KES", status: "completed", time: "2 mins ago" },
  { id: "TXN-002", type: "Off-ramp", amount: "5,000 NGN", status: "completed", time: "5 mins ago" },
  { id: "TXN-003", type: "On-ramp", amount: "2,300 KES", status: "processing", time: "12 mins ago" },
  { id: "TXN-004", type: "Off-ramp", amount: "3,100 NGN", status: "completed", time: "18 mins ago" },
  { id: "TXN-005", type: "On-ramp", amount: "8,750 KES", status: "completed", time: "25 mins ago" },
];

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your platform activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-primary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={`text-xs font-medium ${
                    stat.trend === "up" ? "text-primary" : "text-destructive"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{transaction.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium">
                        {transaction.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{transaction.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{transaction.amount}</p>
                    <p
                      className={`text-xs font-medium ${
                        transaction.status === "completed"
                          ? "text-primary"
                          : "text-warning"
                      }`}
                    >
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors">
              <Key className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Create API Key</p>
                <p className="text-sm opacity-90">Generate a new API key for your application</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-primary text-primary hover:bg-primary-light transition-colors">
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">View Documentation</p>
                <p className="text-sm opacity-90">Learn how to integrate Orion API</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:bg-secondary transition-colors">
              <Activity className="h-5 w-5 text-foreground" />
              <div className="text-left">
                <p className="font-semibold text-foreground">View All Transactions</p>
                <p className="text-sm text-muted-foreground">See complete transaction history</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* API Status */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">API Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              <div>
                <p className="text-sm font-medium text-foreground">M-Pesa Integration</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              <div>
                <p className="text-sm font-medium text-foreground">Nigerian Banks</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              <div>
                <p className="text-sm font-medium text-foreground">Hedera Network</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
