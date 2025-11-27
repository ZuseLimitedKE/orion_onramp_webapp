import { z } from 'zod';
import type { EnvironmentType } from './environments';

export enum TOKEN_TYPE {
  KESy_MAINNET = 'KESy_MAINNET',
  KESy_TESTNET = 'KESy_TESTNET',
}

export enum TRANSACTION_STATUS {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  ONRAMPED = 'onramped',
  OFFRAMPED = 'offramped',
}

export enum TRANSACTION_TYPE {
  ON_RAMP = 'on_ramp',
  OFF_RAMP = 'off_ramp',
}

export const transactionStatusSchema = z.enum([
  TRANSACTION_STATUS.PENDING,
  TRANSACTION_STATUS.SUCCESSFUL,
  TRANSACTION_STATUS.FAILED,
  TRANSACTION_STATUS.ONRAMPED,
  TRANSACTION_STATUS.OFFRAMPED,
]);

export const transactionTypeSchema = z.enum([
  TRANSACTION_TYPE.ON_RAMP,
  TRANSACTION_TYPE.OFF_RAMP,
]);

export const tokenTypeSchema = z.enum([
  TOKEN_TYPE.KESy_TESTNET,
  TOKEN_TYPE.KESy_MAINNET,
]);

// Transaction data structure
export interface Transaction {
  id: string;
  environmentID: string;
  reference: string;
  token: TOKEN_TYPE;
  amount: number; // in cents
  email: string;
  transactionStatus: TRANSACTION_STATUS;
  authorizationUrl?: string;
  accessCode?: string;
  paystackResponseRaw?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Enhanced frontend transaction with derived fields
export interface EnhancedTransaction extends Transaction {
  amountMajor: number;
  type: TRANSACTION_TYPE;
  currency: string;
  tokenAmount?: number;
  user?: {
    email: string;
    name?: string;
  };
}

// API Response types
export interface TransactionsResponse {
  data: Array<Transaction>;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface TransactionResponse {
  transaction: Transaction;
}

// Filter types
export interface TransactionFilters {
  status?: TRANSACTION_STATUS;
  type?: TRANSACTION_TYPE;
  token?: TOKEN_TYPE;
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

export interface TransactionsQueryParams {
  business_id: string;
  environment_type: EnvironmentType;
  page?: number;
  limit?: number;
  status?: TRANSACTION_STATUS;
  type?: TRANSACTION_TYPE;
  search?: string;
}

// Form types for transaction initialization
export interface InitializeTransactionRequest {
  amount: number;
  email: string;
  token: TOKEN_TYPE;
  callback_url?: string;
  channels?: Array<string>;
  currency?: string;
  metadata: {
    orderID: string;
    [key: string]: any;
  };
}

export interface InitializeTransactionResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
  message: string;
}

// Status colors for UI
export const TRANSACTION_STATUS_COLORS = {
  [TRANSACTION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [TRANSACTION_STATUS.SUCCESSFUL]: 'bg-green-100 text-green-800 border-green-200',
  [TRANSACTION_STATUS.FAILED]: 'bg-red-100 text-red-800 border-red-200',
  [TRANSACTION_STATUS.ONRAMPED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [TRANSACTION_STATUS.OFFRAMPED]: 'bg-purple-100 text-purple-800 border-purple-200',
} as const;

export const TRANSACTION_TYPE_COLORS = {
  [TRANSACTION_TYPE.ON_RAMP]: 'bg-blue-50 text-blue-700 border-blue-200',
  [TRANSACTION_TYPE.OFF_RAMP]: 'bg-purple-50 text-purple-700 border-purple-200',
} as const;

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPE.ON_RAMP]: 'On-Ramp',
  [TRANSACTION_TYPE.OFF_RAMP]: 'Off-Ramp',
} as const;

// Helper function to determine transaction type from token and amount
export const getTransactionType = (transaction: Transaction): TRANSACTION_TYPE => {
  // For now, we'll determine based on token type or other metadata
  // might adjust this based on the business logic
  if (transaction.metadata?.type) {
    return transaction.metadata.type as TRANSACTION_TYPE;
  }
  
  // Default to on-ramp for positive amounts (receiving crypto) This is an assumption for now
  return TRANSACTION_TYPE.ON_RAMP;
};

// Helper to convert amount from cents to major units
export const convertToMajorUnits = (amountInCents: number): number => {
  return amountInCents / 100;
};

// Helper to format currency
export const formatCurrency = (amount: number, currency: string = 'KES'): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};