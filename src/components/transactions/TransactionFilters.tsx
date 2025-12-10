import { useEffect, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import type {
  TOKEN_TYPE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  TransactionFilters as TransactionFiltersType,
} from '@/types/transactions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface TransactionFiltersProps {
  filters: TransactionFiltersType;
  onFiltersChange: (filters: TransactionFiltersType) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading = false,
}: TransactionFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  const handleSearchSubmit = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
    });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? undefined : (status as TRANSACTION_STATUS),
    });
  };

  const handleTypeChange = (type: string) => {
    onFiltersChange({
      ...filters,
      type: type === 'all' ? undefined : (type as TRANSACTION_TYPE),
    });
  };

  const handleTokenChange = (token: string) => {
    onFiltersChange({
      ...filters,
      token: token === 'all' ? undefined : (token as TOKEN_TYPE),
    });
  };

  const hasActiveFilters = 
    !!filters.status || 
    !!filters.type || 
    !!filters.token || 
    !!filters.search;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-5">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference, email..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(searchValue);
                }
              }}
              onBlur={() => handleSearchSubmit(searchValue)}
              className="pl-9"
              disabled={isLoading}
            />
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status ?? 'all'}
            onValueChange={(v) => handleStatusChange(v)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <Filter className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="successful">Successful</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="onramped">Onramped</SelectItem>
              <SelectItem value="offramped">Offramped</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select
            value={filters.type ?? 'all'}
            onValueChange={(v) => handleTypeChange(v)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="on_ramp">On-Ramp</SelectItem>
              <SelectItem value="off_ramp">Off-Ramp</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>

          {/* Token Filter */}
          <Select
            value={filters.token ?? 'all'}
            onValueChange={(v) => handleTokenChange(v)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tokens</SelectItem>
              <SelectItem value="KESy_TESTNET">KESy Testnet</SelectItem>
              <SelectItem value="KESy_MAINNET">KESy Mainnet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters & Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Active filters: {[
                filters.status && `Status: ${filters.status}`,
                filters.type && `Type: ${filters.type}`,
                filters.token && `Token: ${filters.token}`,
                filters.search && `Search: "${filters.search}"`,
              ].filter(Boolean).join(', ')}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
