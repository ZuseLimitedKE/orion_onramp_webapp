import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export const Route = createFileRoute('/dashboard/transactions')({
  component: RouteComponent,
})


type Transaction = {
  id: string;
  type: "on-ramp" | "off-ramp";
  amount: string;
  currency: string;
  hbarAmount: string;
  status: "completed" | "processing" | "failed";
  timestamp: string;
  userId: string;
  txHash: string;
};

const mockTransactions: Transaction[] = [
  {
    id: "TXN-2024-001",
    type: "on-ramp",
    amount: "1,250",
    currency: "KES",
    hbarAmount: "45.2",
    status: "completed",
    timestamp: "2024-11-04 14:32",
    userId: "user_abc123",
    txHash: "0x1a2b3c4d5e6f...",
  },
  {
    id: "TXN-2024-002",
    type: "off-ramp",
    amount: "5,000",
    currency: "NGN",
    hbarAmount: "120.5",
    status: "completed",
    timestamp: "2024-11-04 14:28",
    userId: "user_def456",
    txHash: "0x7g8h9i0j1k2l...",
  },
  {
    id: "TXN-2024-003",
    type: "on-ramp",
    amount: "2,300",
    currency: "KES",
    hbarAmount: "82.4",
    status: "processing",
    timestamp: "2024-11-04 14:20",
    userId: "user_ghi789",
    txHash: "0x3m4n5o6p7q8r...",
  },
  {
    id: "TXN-2024-004",
    type: "off-ramp",
    amount: "3,100",
    currency: "NGN",
    hbarAmount: "75.8",
    status: "completed",
    timestamp: "2024-11-04 14:15",
    userId: "user_jkl012",
    txHash: "0x9s0t1u2v3w4x...",
  },
  {
    id: "TXN-2024-005",
    type: "on-ramp",
    amount: "8,750",
    currency: "KES",
    hbarAmount: "315.6",
    status: "failed",
    timestamp: "2024-11-04 14:05",
    userId: "user_mno345",
    txHash: "0x5y6z7a8b9c0d...",
  },
];

function RouteComponent() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-primary bg-primary/10";
      case "processing":
        return "text-amber-500 bg-amber-500/10";
      case "failed":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all transactions across your platform
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="on-ramp">On-ramp</SelectItem>
                <SelectItem value="off-ramp">Off-ramp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Transactions Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">HBAR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-secondary/50 transition-colors">
                  <TableCell className="font-semibold text-foreground">{tx.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-full ${
                          tx.type === "on-ramp" ? "bg-primary/10" : "bg-secondary"
                        }`}
                      >
                        {tx.type === "on-ramp" ? (
                          <ArrowDownLeft className="h-4 w-4 text-primary" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-foreground" />
                        )}
                      </div>
                      <span className="capitalize">{tx.type.replace("-", " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(
                        tx.status
                      )}`}
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{tx.userId}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{tx.timestamp}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {tx.amount} {tx.currency}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {tx.hbarAmount} HBAR
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredTransactions.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-semibold text-foreground">
              No transactions found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
