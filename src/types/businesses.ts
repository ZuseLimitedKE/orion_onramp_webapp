import { z } from 'zod'

// Business Type Enums
export enum BUSINESS_TYPES {
    STARTER = "Starter business",
    REGISTERED = "Registered Business",
}

export enum BUSINESS_REGISTRATION_TYPES {
  SOLE_PROPRIETORSHIP = 'Sole Proprietorship',
  REGISTERED_COMPANY = 'Registered Company',
}

export enum BUSINESS_STATUS {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  SUSPENDED = 'Suspended',
}

export enum USER_ROLES {
  ADMIN = 'Admin',
  DEVELOPER = 'Developer',
  FINANCE = 'Finance',
  SUPPORT = 'Support',
}

export enum USER_INVITATION_STATUS {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled',
}

// Zod Schemas for Form Validation
export const createBusinessSchema = z.object({
  tradingName: z.string().min(1, 'Trading name is required').optional(),
  description: z.string().optional(),
  staffSize: z.string().optional(),
  annualSalesVolume: z.string().optional(),
  industryName: z.string().optional(),
  categoryName: z.string().optional(),
  businessType: z.enum([BUSINESS_TYPES.STARTER, BUSINESS_TYPES.REGISTERED]).optional(),
  industryId: z.uuid().optional().nullable(),
  categoryId: z.uuid().optional().nullable(),
  legalBusinessName: z.string().optional(),
  registrationType: z
    .enum([
      BUSINESS_REGISTRATION_TYPES.SOLE_PROPRIETORSHIP,
      BUSINESS_REGISTRATION_TYPES.REGISTERED_COMPANY,
    ])
    .optional(),
  generalEmail: z.email('Invalid email format').optional().or(z.literal('')),
  supportEmail: z.email('Invalid email format').optional().or(z.literal('')),
  disputesEmail: z.email('Invalid email format').optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  website: z.url('Invalid website URL').optional().or(z.literal('')),
  twitterHandle: z.string().optional(),
  facebookPage: z.string().optional(),
  instagramHandle: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  streetAddress: z.string().optional(),
  building: z.string().optional(),
  postalCode: z.string().optional(),
  cryptoWalletAddress: z.string().optional(),
  revenuePin: z.string().optional(),
  businessRegistrationCertificate: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
})

// Schema for submitting business for approval (with required fields)
export const submitBusinessForApprovalSchema = createBusinessSchema.extend({
  tradingName: z.string().min(1, 'Trading name is required'),
  legalBusinessName: z.string().min(1, 'Legal business name is required'),
  registrationType: z.enum(
    [
      BUSINESS_REGISTRATION_TYPES.SOLE_PROPRIETORSHIP,
      BUSINESS_REGISTRATION_TYPES.REGISTERED_COMPANY,
    ],
    { message: 'Registration type is required' },
  ),
  businessRegistrationNumber: z.string().min(1, 'Business registration number is required'),
  generalEmail: z.email('Valid email is required'),
  businessType: z.enum([BUSINESS_TYPES.STARTER, BUSINESS_TYPES.REGISTERED], {
    message: 'Business type is required',
  }),
})

// Schema for updating business (includes ID)
export const updateBusinessSchema = createBusinessSchema.extend({
})

// Schema for inviting users
export const inviteUserSchema = z.object({
  email: z.email('Valid email is required'),
  role: z.enum(
    [
      USER_ROLES.ADMIN,
      USER_ROLES.DEVELOPER,
      USER_ROLES.FINANCE,
      USER_ROLES.SUPPORT,
    ],
    {
      message: 'User role is required',
    },
  ),
})

// TypeScript Interfaces
export interface BusinessType {
  id: string
  ownerId: string
  tradingName?: string
  description?: string
  staffSize?: string
  annualSalesVolume?: string
  businessType?: BUSINESS_TYPES
  legalBusinessName?: string
  registrationType?: BUSINESS_REGISTRATION_TYPES
  generalEmail?: string
  supportEmail?: string
  disputesEmail?: string
  phoneNumber?: string
  website?: string
  twitterHandle?: string
  facebookPage?: string
  instagramHandle?: string
  country?: string
  city?: string
  streetAddress?: string
  building?: string
  postalCode?: string
  cryptoWalletAddress?: string
  revenuePin?: string
  businessRegistrationCertificate?: string
  businessRegistrationNumber?: string
  // Resolved names instead of raw IDs for better UX
  industryName?: string
  categoryName?: string
  status: BUSINESS_STATUS
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface Invitation {
  id: string
  businessId: string
  invitedBy: string
  email: string
  role: USER_ROLES
  status: USER_INVITATION_STATUS
  createdAt: Date | string
}

export interface Category {
  id: string
  name: string
}

export interface Industry {
  id: string
  name: string
  categories: Array<Category>
}

// Form Data Types
export type CreateBusinessFormData = z.infer<typeof createBusinessSchema>
export type SubmitBusinessFormData = z.infer<typeof submitBusinessForApprovalSchema>
export type UpdateBusinessFormData = z.infer<typeof updateBusinessSchema>
export type InviteUserFormData = z.infer<typeof inviteUserSchema>

// API Response Types
export interface BusinessListResponse {
  businesses: Array<BusinessType>
}

export interface BusinessResponse {
  business: BusinessType
}

export interface CreateBusinessResponse {
  message: string
  business: {
    id: string
  }
}

export interface IndustriesResponse {
  industries: Array<Industry>
}

export interface InviteResponse {
  message: string
  invite: {
    invite_id: string
  }
}

// Frontend-specific types for UI state management
export interface BusinessCreationStep {
  id: number
  title: string
  description: string
  isCompleted: boolean
  isActive: boolean
}

export interface BusinessFormErrors {
  [key: string]: string | undefined
}

// Business status display helpers
export const BUSINESS_STATUS_COLORS = {
  [BUSINESS_STATUS.DRAFT]: 'bg-gray-100 text-gray-800',
  [BUSINESS_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [BUSINESS_STATUS.APPROVED]: 'bg-green-100 text-green-800',
  [BUSINESS_STATUS.REJECTED]: 'bg-red-100 text-red-800',
  [BUSINESS_STATUS.SUSPENDED]: 'bg-orange-100 text-orange-800',
} as const

export const USER_ROLE_DESCRIPTIONS = {
  [USER_ROLES.ADMIN]: 'Full access to all business settings and operations',
  [USER_ROLES.DEVELOPER]:
    'Access to API keys, documentation, and technical settings',
  [USER_ROLES.FINANCE]:
    'Access to transactions, payments, and financial reports',
  [USER_ROLES.SUPPORT]: 'Access to customer support tools and basic settings',
} as const
