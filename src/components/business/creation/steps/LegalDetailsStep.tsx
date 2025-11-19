import { type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
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
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { Building, FileCheck, Factory, AlertCircle } from 'lucide-react'
import {
  type CreateBusinessFormData,
  BUSINESS_REGISTRATION_TYPES,
  BUSINESS_TYPES,
} from '@/types/businesses'
import { useIndustries } from '@/hooks/businesses'

interface LegalDetailsStepProps {
  form: UseFormReturn<CreateBusinessFormData>
}

export function LegalDetailsStep({ form }: LegalDetailsStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form

  const businessType = watch('businessType')
  const registrationType = watch('registrationType')
  const selectedIndustryName = watch('industryName')
  const { industries, isLoading: industriesLoading } = useIndustries()

  const selectedIndustry = industries.find(
    (industry) => industry.name === selectedIndustryName,
  )
  const isRegisteredBusiness = businessType === BUSINESS_TYPES.REGISTERED

  return (
    <div className="space-y-6">
      {/* Business Type Notice */}
      {businessType && (
        <Card
          className={`border-2 ${isRegisteredBusiness ? 'border-primary/20 bg-primary/5' : 'border-blue-200 bg-blue-50'}`}
        >
          <CardContent>
            <div className="flex items-start gap-3">
              <div
                className={`rounded-full p-2 ${isRegisteredBusiness ? 'bg-primary/10' : 'bg-blue-100'}`}
              >
                {isRegisteredBusiness ? (
                  <AlertCircle className="h-4 w-4 text-primary" />
                ) : (
                  <FileCheck className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">
                  {isRegisteredBusiness
                    ? 'Registered Business Requirements'
                    : 'Starter Business Information'}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRegisteredBusiness
                    ? "As a registered business, you'll need to provide your legal business name and registration details."
                    : 'For starter businesses, legal details are optional but can help with verification.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {/* Legal Business Name */}
        <Field>
          <FieldLabel htmlFor="legalBusinessName">
            Legal Business Name* {isRegisteredBusiness && '*'}
          </FieldLabel>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="legalBusinessName"
              placeholder="e.g., Acme Tech Solutions Ltd."
              className={`pl-10 ${errors.legalBusinessName ? 'border-red-500' : ''}`}
              {...register('legalBusinessName')}
            />
          </div>
          {errors.legalBusinessName && (
            <FieldDescription className="text-red-500">
              {errors.legalBusinessName.message}
            </FieldDescription>
          )}
          <FieldDescription>
            The official registered name of your business
          </FieldDescription>
        </Field>

        {/* Registration Type and Number */}
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="registrationType">
              Registration Type* {isRegisteredBusiness && '*'}
            </FieldLabel>
            <Select
              value={registrationType ?? undefined}
              onValueChange={(value: BUSINESS_REGISTRATION_TYPES) =>
                setValue('registrationType', value)
              }
            >
              <SelectTrigger
                className={errors.registrationType ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select registration type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={BUSINESS_REGISTRATION_TYPES.SOLE_PROPRIETORSHIP}
                >
                  Sole Proprietorship
                </SelectItem>
                <SelectItem
                  value={BUSINESS_REGISTRATION_TYPES.REGISTERED_COMPANY}
                >
                  Registered Company
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.registrationType && (
              <FieldDescription className="text-red-500">
                {errors.registrationType.message}
              </FieldDescription>
            )}
            <FieldDescription>
              {registrationType ===
              BUSINESS_REGISTRATION_TYPES.SOLE_PROPRIETORSHIP
                ? 'Individual business owner'
                : registrationType ===
                    BUSINESS_REGISTRATION_TYPES.REGISTERED_COMPANY
                  ? 'Incorporated business entity'
                  : 'Choose your business registration type'}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="businessRegistrationNumber">
              Registration Number* {isRegisteredBusiness && '*'}
            </FieldLabel>
            <Input
              id="businessRegistrationNumber"
              placeholder="e.g., 12345678"
              className={
                errors.businessRegistrationNumber ? 'border-red-500' : ''
              }
              {...register('businessRegistrationNumber')}
            />
            {errors.businessRegistrationNumber && (
              <FieldDescription className="text-red-500">
                {errors.businessRegistrationNumber.message}
              </FieldDescription>
            )}
            <FieldDescription>
              Official registration number from authorities
            </FieldDescription>
          </Field>
        </div>

        {/* Industry Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Industry & Category
            </CardTitle>
            <CardDescription className="text-xs">
              Help us understand your business sector for better service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Industry */}
              <Field>
                <FieldLabel htmlFor="industryName">Industry</FieldLabel>
                <Select
                  value={selectedIndustryName ?? undefined}
                  onValueChange={(value) => {
                    setValue('industryName', value)
                    setValue('categoryName', '') // Reset category when industry changes
                  }}
                  disabled={industriesLoading}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue
                      placeholder={
                        industriesLoading ? 'Loading...' : 'Select industry'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.id} value={industry.name}>
                        {industry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Category */}
              <Field>
                <FieldLabel htmlFor="categoryName">Category</FieldLabel>
                <Select
                  value={watch('categoryName') ?? undefined}
                  onValueChange={(value) => setValue('categoryName', value)}
                  disabled={
                    !selectedIndustry ||
                    selectedIndustry.categories.length === 0
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue
                      placeholder={
                        !selectedIndustry
                          ? 'Select industry first'
                          : selectedIndustry.categories.length === 0
                            ? 'No categories available'
                            : 'Select category'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry?.categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Selected Industry/Category Display */}
            {(selectedIndustryName || watch('categoryName')) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {selectedIndustryName && (
                  <Badge variant="secondary" className="text-xs">
                    <Factory className="h-3 w-3 mr-1" />
                    {selectedIndustryName}
                  </Badge>
                )}
                {watch('categoryName') && (
                  <Badge variant="outline" className="text-xs">
                    {watch('categoryName')}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registration Certificate Upload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Business Registration Certificate{' '}
              {isRegisteredBusiness && '(Optional)'}
            </CardTitle>
            <CardDescription className="text-xs">
              Upload your business registration certificate for faster
              verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <Input
                id="businessRegistrationCertificate"
                placeholder="Certificate file URL or identifier"
                {...register('businessRegistrationCertificate')}
              />
              <FieldDescription>
                You can also upload this later in your business settings
              </FieldDescription>
            </Field>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
