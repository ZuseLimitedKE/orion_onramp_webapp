import { type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import {
  MapPin,
  Building,
  Hash,
  Wallet,
  CreditCard,
  FileText,
} from 'lucide-react'
import type { SubmitBusinessFormData } from '@/types/businesses'

interface DocumentsStepProps {
  form: UseFormReturn<SubmitBusinessFormData>
}

export function DocumentsStep({ form }: DocumentsStepProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      {/* Business Address */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Business Address
          </CardTitle>
          <CardDescription>
            Physical location of your business operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Country */}
            <Field>
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="country"
                  placeholder="e.g., United States"
                  className={`pl-10 ${errors.country ? 'border-red-500' : ''}`}
                  {...register('country')}
                />
              </div>
              {errors.country && (
                <FieldDescription className="text-red-500">
                  {errors.country.message}
                </FieldDescription>
              )}
            </Field>

            {/* City */}
            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="city"
                  placeholder="e.g., New York"
                  className={`pl-10 ${errors.city ? 'border-red-500' : ''}`}
                  {...register('city')}
                />
              </div>
              {errors.city && (
                <FieldDescription className="text-red-500">
                  {errors.city.message}
                </FieldDescription>
              )}
            </Field>
          </div>

          {/* Street Address */}
          <Field>
            <FieldLabel htmlFor="streetAddress">Street Address</FieldLabel>
            <Input
              id="streetAddress"
              placeholder="e.g., 123 Main Street"
              className={errors.streetAddress ? 'border-red-500' : ''}
              {...register('streetAddress')}
            />
            {errors.streetAddress && (
              <FieldDescription className="text-red-500">
                {errors.streetAddress.message}
              </FieldDescription>
            )}
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Building/Suite */}
            <Field>
              <FieldLabel htmlFor="building">Building/Suite</FieldLabel>
              <Input
                id="building"
                placeholder="e.g., Suite 101, Floor 2"
                {...register('building')}
              />
              <FieldDescription>
                Apartment, suite, unit, building, floor, etc.
              </FieldDescription>
            </Field>

            {/* Postal Code */}
            <Field>
              <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="postalCode"
                  placeholder="e.g., 10001"
                  className="pl-10"
                  {...register('postalCode')}
                />
              </div>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Financial Information
          </CardTitle>
          <CardDescription>
            Optional financial details for enhanced payment processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Crypto Wallet Address */}
            <Field>
              <FieldLabel htmlFor="cryptoWalletAddress">
                Crypto Wallet Address
              </FieldLabel>
              <div className="relative">
                <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cryptoWalletAddress"
                  placeholder="0x1234...abcd"
                  className="pl-10 font-mono text-sm"
                  {...register('cryptoWalletAddress')}
                />
              </div>
              <FieldDescription>
                Wallet address for receiving cryptocurrency payments
              </FieldDescription>
            </Field>

            {/* Revenue PIN */}
            <Field>
              <FieldLabel htmlFor="revenuePin">Revenue PIN</FieldLabel>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="revenuePin"
                  placeholder="e.g., P123456789"
                  className="pl-10"
                  {...register('revenuePin')}
                />
              </div>
              <FieldDescription>
                Tax identification number or revenue PIN
              </FieldDescription>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Address & Document Guidelines
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Provide your actual business operating address</li>
                <li>
                  • PO Box addresses may not be accepted for some services
                </li>
                <li>
                  • Ensure the address matches your business registration
                  documents
                </li>
                <li>
                  • Crypto wallet addresses are optional but help with DeFi
                  integrations
                </li>
                <li>• Revenue PIN helps with tax compliance and reporting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Upload
          </CardTitle>
          <CardDescription>
            Upload supporting documents to speed up the verification process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-border rounded-lg text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Document upload functionality will be available after initial
                submission
              </p>
              <p className="text-xs text-muted-foreground">
                You can upload business registration certificates, tax
                documents, and other supporting materials from your business
                settings page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
