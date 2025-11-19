import { type UseFormReturn } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  FileCheck,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react'
import {
  type CreateBusinessFormData,
  BUSINESS_TYPES,
} from '@/types/businesses'

interface ReviewStepProps {
  form: UseFormReturn<CreateBusinessFormData>
}

export function ReviewStep({ form }: ReviewStepProps) {
  const { watch } = form
  const formData = watch()

  const isRegisteredBusiness =
    formData.businessType === BUSINESS_TYPES.REGISTERED

  // Check completion status for different sections
  const basicInfoComplete = !!(formData.tradingName && formData.businessType)
  const legalDetailsComplete = isRegisteredBusiness
    ? !!(
        formData.legalBusinessName &&
        formData.registrationType &&
        formData.businessRegistrationNumber
      )
    : !!(formData.legalBusinessName || formData.registrationType)
  const contactInfoComplete = !!(formData.generalEmail && formData.phoneNumber)
  const addressComplete = !!(
    formData.country &&
    formData.city &&
    formData.streetAddress
  )

  const overallComplete =
    basicInfoComplete &&
    legalDetailsComplete &&
    contactInfoComplete &&
    addressComplete

  return (
    <div className="space-y-6">
      {/* Submission Status */}
      <Card
        className={`border-2 ${overallComplete ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}
      >
        <CardContent>
          <div className="flex items-start gap-3">
            <div
              className={`rounded-full p-2 ${overallComplete ? 'bg-green-100' : 'bg-yellow-100'}`}
            >
              {overallComplete ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1">
                {overallComplete ? 'Ready for Submission' : 'Review Required'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {overallComplete
                  ? 'Your business profile is complete and ready for approval review.'
                  : 'Please review and complete any missing required information before submitting.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information Review */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Basic Information
            {basicInfoComplete ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Trading Name</p>
              <p className="text-sm font-medium">
                {formData.tradingName || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Business Type</p>
              <div className="flex items-center gap-2">
                {formData.businessType ? (
                  <Badge variant="secondary" className="text-xs">
                    {formData.businessType}
                  </Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">Not selected</p>
                )}
              </div>
            </div>
          </div>
          {formData.description && (
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm">{formData.description}</p>
            </div>
          )}
          {(formData.staffSize || formData.annualSalesVolume) && (
            <div className="grid gap-3 md:grid-cols-2">
              {formData.staffSize && (
                <div>
                  <p className="text-xs text-muted-foreground">Staff Size</p>
                  <p className="text-sm">{formData.staffSize}</p>
                </div>
              )}
              {formData.annualSalesVolume && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Annual Sales Volume
                  </p>
                  <p className="text-sm">{formData.annualSalesVolume}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Details Review */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Legal Details
            {legalDetailsComplete ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">
                Legal Business Name
              </p>
              <p className="text-sm font-medium">
                {formData.legalBusinessName || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Registration Type</p>
              <p className="text-sm">
                {formData.registrationType || 'Not selected'}
              </p>
            </div>
          </div>
          {formData.businessRegistrationNumber && (
            <div>
              <p className="text-xs text-muted-foreground">
                Registration Number
              </p>
              <p className="text-sm font-mono">
                {formData.businessRegistrationNumber}
              </p>
            </div>
          )}
          {(formData.industryName || formData.categoryName) && (
            <div className="grid gap-3 md:grid-cols-2">
              {formData.industryName && (
                <div>
                  <p className="text-xs text-muted-foreground">Industry</p>
                  <Badge variant="outline" className="text-xs">
                    {formData.industryName}
                  </Badge>
                </div>
              )}
              {formData.categoryName && (
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <Badge variant="outline" className="text-xs">
                    {formData.categoryName}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information Review */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Contact Information
            {contactInfoComplete ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">General Email</p>
              <p className="text-sm font-medium">
                {formData.generalEmail || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone Number</p>
              <p className="text-sm font-medium">
                {formData.phoneNumber || 'Not provided'}
              </p>
            </div>
          </div>
          {formData.website && (
            <div>
              <p className="text-xs text-muted-foreground">Website</p>
              <p className="text-sm text-blue-600 hover:underline">
                <a
                  href={formData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formData.website}
                </a>
              </p>
            </div>
          )}
          {(formData.supportEmail || formData.disputesEmail) && (
            <>
              <Separator />
              <div className="grid gap-3 md:grid-cols-2">
                {formData.supportEmail && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Support Email
                    </p>
                    <p className="text-sm">{formData.supportEmail}</p>
                  </div>
                )}
                {formData.disputesEmail && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Disputes Email
                    </p>
                    <p className="text-sm">{formData.disputesEmail}</p>
                  </div>
                )}
              </div>
            </>
          )}
          {(formData.twitterHandle ||
            formData.facebookPage ||
            formData.instagramHandle) && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Social Media
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.twitterHandle && (
                    <Badge variant="outline" className="text-xs">
                      Twitter: {formData.twitterHandle}
                    </Badge>
                  )}
                  {formData.facebookPage && (
                    <Badge variant="outline" className="text-xs">
                      Facebook: {formData.facebookPage}
                    </Badge>
                  )}
                  {formData.instagramHandle && (
                    <Badge variant="outline" className="text-xs">
                      Instagram: {formData.instagramHandle}
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Address & Additional Details Review */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Address & Additional Details
            {addressComplete ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Business Address</p>
            <div className="text-sm">
              {formData.streetAddress && <p>{formData.streetAddress}</p>}
              {formData.building && <p>{formData.building}</p>}
              {(formData.city || formData.postalCode) && (
                <p>
                  {[formData.city, formData.postalCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              {formData.country && <p>{formData.country}</p>}
              {!formData.streetAddress &&
                !formData.city &&
                !formData.country && (
                  <p className="text-muted-foreground">Address not provided</p>
                )}
            </div>
          </div>

          {(formData.cryptoWalletAddress || formData.revenuePin) && (
            <>
              <Separator />
              <div className="grid gap-3 md:grid-cols-2">
                {formData.cryptoWalletAddress && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Crypto Wallet
                    </p>
                    <p className="font-mono text-xs break-all">
                      {formData.cryptoWalletAddress}
                    </p>
                  </div>
                )}
                {formData.revenuePin && (
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue PIN</p>
                    <p className="text-sm font-mono">{formData.revenuePin}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Submission Information */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-2">
                What happens after submission?
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Your business will be reviewed by our compliance team</li>
                <li>• Review typically takes 1-3 business days</li>
                <li>
                  • You'll receive email updates on your application status
                </li>
                <li>
                  • Once approved, you can start processing payments immediately
                </li>
                <li>
                  • You can still edit your business profile while under review
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
