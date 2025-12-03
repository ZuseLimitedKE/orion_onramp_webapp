import { useEffect, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Building2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
} from 'lucide-react'
import { toast } from 'sonner'
import type { CreateBusinessFormData } from '@/types/businesses'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBusinessContext } from '@/contexts/BusinessContext'
import { useBusinesses } from '@/hooks/businesses'
import {
  BUSINESS_REGISTRATION_TYPES,
  BUSINESS_TYPES,
  createBusinessSchema,
} from '@/types/businesses'

// schema that matches the business form data (without the id field)
const businessProfileSchema = createBusinessSchema

type BusinessProfileFormData = CreateBusinessFormData

const BusinessProfile = () => {
  const { currentBusiness } = useBusinessContext()
  const { updateBusiness, isUpdating } = useBusinesses()

  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<BusinessProfileFormData>({
    resolver: (
      zodResolver as unknown as (
        schema: unknown,
      ) => Resolver<BusinessProfileFormData>
    )(businessProfileSchema),
    defaultValues: {
      tradingName: currentBusiness?.tradingName || '',
      description: currentBusiness?.description || '',
      legalBusinessName: currentBusiness?.legalBusinessName || '',
      businessType: currentBusiness?.businessType,
      registrationType: currentBusiness?.registrationType,
      generalEmail: currentBusiness?.generalEmail || '',
      supportEmail: currentBusiness?.supportEmail || '',
      disputesEmail: currentBusiness?.disputesEmail || '',
      phoneNumber: currentBusiness?.phoneNumber || '',
      website: currentBusiness?.website || '',
      country: currentBusiness?.country || '',
      city: currentBusiness?.city || '',
      streetAddress: currentBusiness?.streetAddress || '',
      building: currentBusiness?.building || '',
      postalCode: currentBusiness?.postalCode || '',
      cryptoWalletAddress: currentBusiness?.cryptoWalletAddress || '',
      revenuePin: currentBusiness?.revenuePin || '',
      businessRegistrationNumber:
        currentBusiness?.businessRegistrationNumber || '',
    },
  })

  // Reset form for when current business changes
  useEffect(() => {
    if (currentBusiness) {
      reset({
        tradingName: currentBusiness.tradingName || '',
        description: currentBusiness.description || '',
        legalBusinessName: currentBusiness.legalBusinessName || '',
        businessType: currentBusiness.businessType,
        registrationType: currentBusiness.registrationType,
        generalEmail: currentBusiness.generalEmail || '',
        supportEmail: currentBusiness.supportEmail || '',
        disputesEmail: currentBusiness.disputesEmail || '',
        phoneNumber: currentBusiness.phoneNumber || '',
        website: currentBusiness.website || '',
        country: currentBusiness.country || '',
        city: currentBusiness.city || '',
        streetAddress: currentBusiness.streetAddress || '',
        building: currentBusiness.building || '',
        postalCode: currentBusiness.postalCode || '',
        cryptoWalletAddress: currentBusiness.cryptoWalletAddress || '',
        revenuePin: currentBusiness.revenuePin || '',
        businessRegistrationNumber:
          currentBusiness.businessRegistrationNumber || '',
      })
    }
  }, [currentBusiness, reset])

  const onSubmit = async (data: BusinessProfileFormData) => {
    if (!currentBusiness?.id) {
      toast.error('No business selected')
      return
    }

    try {
      // Adding id to the data for the update
      const updateData = {
        ...data,
        id: currentBusiness.id,
      }

      await updateBusiness({
        id: currentBusiness.id,
        data: updateData,
      })

      setIsEditing(false)
      toast.success('Business profile updated successfully')
    } catch (error) {
      console.error('Failed to update business profile:', error)
      toast.error('Failed to update business profile')
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(onSubmit)(e)
  }

  if (!currentBusiness) {
    return (
      <Card className="border-border">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-foreground">
            No Business Selected
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please select a business to view and edit the profile
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Business Information</CardTitle>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={handleEdit}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={!isDirty || isUpdating}
                className="bg-primary hover:bg-primary-hover"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        <CardDescription>
          Update your business details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tradingName">Trading Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tradingName"
                    placeholder="Your trading name"
                    className="pl-10"
                    {...register('tradingName')}
                    disabled={!isEditing}
                  />
                </div>
                {errors.tradingName && (
                  <p className="text-sm text-red-500">
                    {errors.tradingName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalBusinessName">Legal Business Name</Label>
                <Input
                  id="legalBusinessName"
                  placeholder="Legal business name"
                  {...register('legalBusinessName')}
                  disabled={!isEditing}
                />
                {errors.legalBusinessName && (
                  <p className="text-sm text-red-500">
                    {errors.legalBusinessName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your business..."
                {...register('description')}
                disabled={!isEditing}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={watch('businessType') ?? undefined}
                  onValueChange={(value: BUSINESS_TYPES) =>
                    setValue('businessType', value, { shouldDirty: true })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
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
                  <p className="text-sm text-red-500">
                    {errors.businessType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationType">Registration Type</Label>
                <Select
                  value={watch('registrationType') ?? undefined}
                  onValueChange={(value: BUSINESS_REGISTRATION_TYPES) =>
                    setValue('registrationType', value, { shouldDirty: true })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select registration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={BUSINESS_REGISTRATION_TYPES.SOLE_PROPRIETORSHIP}
                    >
                      {BUSINESS_REGISTRATION_TYPES.SOLE_PROPRIETORSHIP}
                    </SelectItem>
                    <SelectItem
                      value={BUSINESS_REGISTRATION_TYPES.REGISTERED_COMPANY}
                    >
                      {BUSINESS_REGISTRATION_TYPES.REGISTERED_COMPANY}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.registrationType && (
                  <p className="text-sm text-red-500">
                    {errors.registrationType.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="generalEmail">General Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="generalEmail"
                    type="email"
                    placeholder="info@company.com"
                    className="pl-10"
                    {...register('generalEmail')}
                    disabled={!isEditing}
                  />
                </div>
                {errors.generalEmail && (
                  <p className="text-sm text-red-500">
                    {errors.generalEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    placeholder="+254 700 000000"
                    className="pl-10"
                    {...register('phoneNumber')}
                    disabled={!isEditing}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  placeholder="support@company.com"
                  {...register('supportEmail')}
                  disabled={!isEditing}
                />
                {errors.supportEmail && (
                  <p className="text-sm text-red-500">
                    {errors.supportEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="disputesEmail">Disputes Email</Label>
                <Input
                  id="disputesEmail"
                  type="email"
                  placeholder="disputes@company.com"
                  {...register('disputesEmail')}
                  disabled={!isEditing}
                />
                {errors.disputesEmail && (
                  <p className="text-sm text-red-500">
                    {errors.disputesEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  type="url"
                  placeholder="https://company.com"
                  className="pl-10"
                  {...register('website')}
                  disabled={!isEditing}
                />
              </div>
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="country"
                    placeholder="Country"
                    className="pl-10"
                    {...register('country')}
                    disabled={!isEditing}
                  />
                </div>
                {errors.country && (
                  <p className="text-sm text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  {...register('city')}
                  disabled={!isEditing}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                placeholder="Street address"
                {...register('streetAddress')}
                disabled={!isEditing}
              />
              {errors.streetAddress && (
                <p className="text-sm text-red-500">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="building">Building/Suite</Label>
                <Input
                  id="building"
                  placeholder="Building, suite, unit, etc."
                  {...register('building')}
                  disabled={!isEditing}
                />
                {errors.building && (
                  <p className="text-sm text-red-500">
                    {errors.building.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="Postal code"
                  {...register('postalCode')}
                  disabled={!isEditing}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Financial Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cryptoWalletAddress">
                  Crypto Wallet Address
                </Label>
                <Input
                  id="cryptoWalletAddress"
                  placeholder="0x..."
                  {...register('cryptoWalletAddress')}
                  disabled={!isEditing}
                />
                {errors.cryptoWalletAddress && (
                  <p className="text-sm text-red-500">
                    {errors.cryptoWalletAddress.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenuePin">Revenue PIN</Label>
                <Input
                  id="revenuePin"
                  placeholder="Revenue PIN"
                  {...register('revenuePin')}
                  disabled={!isEditing}
                />
                {errors.revenuePin && (
                  <p className="text-sm text-red-500">
                    {errors.revenuePin.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessRegistrationNumber">
                Business Registration Number
              </Label>
              <Input
                id="businessRegistrationNumber"
                placeholder="Registration number"
                {...register('businessRegistrationNumber')}
                disabled={!isEditing}
              />
              {errors.businessRegistrationNumber && (
                <p className="text-sm text-red-500">
                  {errors.businessRegistrationNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Read-only Information */}
          {!isEditing && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium">System Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business-id">Business ID</Label>
                  <Input
                    id="business-id"
                    value={currentBusiness.id}
                    readOnly
                    className="bg-muted font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-status">Status</Label>
                  <Input
                    id="business-status"
                    value={currentBusiness.status}
                    readOnly
                    className="bg-muted capitalize"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="created-at">Created Date</Label>
                <Input
                  id="created-at"
                  value={new Date(
                    currentBusiness.createdAt,
                  ).toLocaleDateString()}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default BusinessProfile
