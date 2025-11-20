import { type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Building2, FileText, Briefcase } from 'lucide-react'
import { type SubmitBusinessFormData, BUSINESS_TYPES } from '@/types/businesses'

interface BasicInfoStepProps {
  form: UseFormReturn<SubmitBusinessFormData>
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const { register, setValue, watch, formState: { errors }} = form

  const businessType = watch('businessType')

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trading Name */}
        <Field>
          <FieldLabel htmlFor="tradingName">Trading Name <span className='text-red-400'>*</span></FieldLabel>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="tradingName"
              placeholder="e.g., Acme Tech Solutions"
              className={`pl-10 ${errors.tradingName ? 'border-red-500' : ''}`}
              {...register('tradingName')}
            />
          </div>
          {errors.tradingName && (
            <FieldDescription className="text-red-500">
              {errors.tradingName.message}
            </FieldDescription>
          )}
          <FieldDescription>
            The name your customers will know you by
          </FieldDescription>
        </Field>

        {/* Business Type */}
        <Field>
          <FieldLabel htmlFor="businessType">Business Type <span className='text-red-400'>*</span></FieldLabel>
          <Select
            value={businessType ?? undefined}
            onValueChange={(value: BUSINESS_TYPES) =>
              setValue('businessType', value)
            }
          >
            <SelectTrigger
              className={errors.businessType ? 'border-red-500' : ''}
            >
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BUSINESS_TYPES.STARTER}>
                {BUSINESS_TYPES.STARTER}
              </SelectItem>
              <SelectItem value={BUSINESS_TYPES.REGISTERED}>
                {BUSINESS_TYPES.REGISTERED}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.businessType && (
            <FieldDescription className="text-red-500">
              {errors.businessType.message}
            </FieldDescription>
          )}
          <FieldDescription>
            {businessType === BUSINESS_TYPES.STARTER
              ? 'For individuals and small businesses'
              : businessType === BUSINESS_TYPES.REGISTERED
                ? 'For registered companies and enterprises'
                : 'Choose the type that best describes your business'}
          </FieldDescription>
        </Field>
      </div>

      {/* Business Description */}
      <Field>
        <FieldLabel htmlFor="description">Business Description</FieldLabel>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Textarea
            id="description"
            placeholder="Tell us about your business, what products or services you offer..."
            className={`pl-10 min-h-[100px] resize-none ${errors.description ? 'border-red-500' : ''}`}
            {...register('description')}
          />
        </div>
        {errors.description && (
          <FieldDescription className="text-red-500">
            {errors.description.message}
          </FieldDescription>
        )}
        <FieldDescription>
          This helps us understand your business better and provide relevant
          services
        </FieldDescription>
      </Field>

      {/* Business Size Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Business Size (Optional)
          </CardTitle>
          <CardDescription className="text-xs">
            Help us tailor our services to your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Staff Size */}
            <Field>
              <FieldLabel htmlFor="staffSize">Number of Employees</FieldLabel>
              <Select
                value={watch('staffSize') ?? undefined}
                onValueChange={(value) => setValue('staffSize', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select staff size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Just me</SelectItem>
                  <SelectItem value="2-5">2-5 employees</SelectItem>
                  <SelectItem value="6-20">6-20 employees</SelectItem>
                  <SelectItem value="21-50">21-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="200+">200+ employees</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Annual Sales Volume */}
            <Field>
              <FieldLabel htmlFor="annualSalesVolume">
                Annual Sales Volume
              </FieldLabel>
              <Select
                value={watch('annualSalesVolume') ?? undefined}
                onValueChange={(value) => setValue('annualSalesVolume', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select sales volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100k">$0 - $100K</SelectItem>
                  <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                  <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                  <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                  <SelectItem value="10m+">$10M+</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Business Type Information */}
      {businessType && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">
                  {businessType === BUSINESS_TYPES.STARTER
                    ? 'Starter Business'
                    : 'Registered Business'}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {businessType === BUSINESS_TYPES.STARTER
                    ? 'Perfect for individuals, freelancers, and small businesses just getting started. Lower documentation requirements and faster approval process.'
                    : 'Ideal for registered companies and established businesses. Full feature access with comprehensive verification requirements.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
