import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { BusinessCreationProgress } from './BusinessCreationProgress'
import { BasicInfoStep } from './steps/BasicInfoStep'
import { LegalDetailsStep } from './steps/LegalDetailsStep'
import { ContactInfoStep } from './steps/ContactInfoStep'
import { DocumentsStep } from './steps/DocumentsStep'
import { ReviewStep } from './steps/ReviewStep'

import { useBusinesses } from '@/hooks/businesses'
import {
  type SubmitBusinessFormData,
  submitBusinessForApprovalSchema,
} from '@/types/businesses'

const STEPS = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Tell us about your business',
    component: BasicInfoStep,
  },
  {
    id: 2,
    title: 'Legal Details',
    description: 'Registration and industry information',
    component: LegalDetailsStep,
  },
  {
    id: 3,
    title: 'Contact Information',
    description: 'How customers can reach you',
    component: ContactInfoStep,
  },
  {
    id: 4,
    title: 'Additional Details',
    description: 'Address and documents',
    component: DocumentsStep,
  },
  {
    id: 5,
    title: 'Review & Submit',
    description: 'Review your information',
    component: ReviewStep,
  },
]

export function BusinessCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const { createDraft, submitForApproval, isCreating, isSubmitting } =
    useBusinesses()

  const form = useForm<SubmitBusinessFormData>({
    resolver: (
      zodResolver as unknown as (
        schema: unknown,
      ) => Resolver<SubmitBusinessFormData>
    )(submitBusinessForApprovalSchema),
    defaultValues: {
      tradingName: '',
      description: '',
      businessType: undefined,
      legalBusinessName: '',
      registrationType: undefined,
      generalEmail: '',
      supportEmail: '',
      disputesEmail: '',
      phoneNumber: '',
      website: '',
      twitterHandle: '',
      facebookPage: '',
      instagramHandle: '',
      country: '',
      city: '',
      streetAddress: '',
      building: '',
      postalCode: '',
      cryptoWalletAddress: '',
      revenuePin: '',
      businessRegistrationCertificate: '',
      businessRegistrationNumber: '',
      industryName: '',
      categoryName: '',
    },
  })

  const { handleSubmit, trigger } = form

  const currentStepData = STEPS.find((step) => step.id === currentStep)
  const CurrentStepComponent = currentStepData?.component

  const isLoading = isCreating || isSubmitting

  // Validate current step before proceeding
  const validateCurrentStep = async () => {
    const stepFields = getStepFields(currentStep)
    const isValid = await trigger(stepFields)
    return isValid
  }

  // Get fields that need validation for each step
  const getStepFields = (step: number): (keyof SubmitBusinessFormData)[] => {
    switch (step) {
      case 1:
        return ['tradingName', 'description', 'businessType']
      case 2:
        return [
          'legalBusinessName',
          'registrationType',
          'businessRegistrationNumber',
          'industryName',
          'categoryName',
        ]
      case 3:
        return ['generalEmail', 'phoneNumber', 'website']
      case 4:
        return []
      default:
        return []
    }
  }

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      const isValid = await validateCurrentStep()
      if (!isValid) {
        toast.error('Please fill in all required fields before continuing')
        return
      }

      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmitBusiness = async (formData: SubmitBusinessFormData) => {
    try {
      // Create draft first
      const response = await createDraft(formData)
      const businessId = response.business.id

      // Submit for approval
      await submitForApproval({
        id: businessId,
        data: {
          ...formData,
          tradingName: formData.tradingName || '',
          legalBusinessName: formData.legalBusinessName || '',
          businessRegistrationNumber: formData.businessRegistrationNumber || '',
          generalEmail: formData.generalEmail || '',
          registrationType: formData.registrationType!,
          businessType: formData.businessType!,
        },
      })

      toast.success('Business submitted successfully!')
      navigate({ to: '/dashboard/settings' })
    } catch (error) {
      toast.error('Failed to submit business. Please try again.')
      console.error('Failed to submit business:', error)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create Business
            </h1>
            <p className="text-muted-foreground">
              Set up your business profile to start accepting payments
            </p>
          </div>
        </div>

        <BusinessCreationProgress currentStep={currentStep} steps={STEPS} />
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {currentStepData?.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {currentStepData?.description}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {STEPS.length}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(handleSubmitBusiness)}>
            {CurrentStepComponent && <CurrentStepComponent form={form} />}

            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary-hover"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    handleSubmit(handleSubmitBusiness)()
                  }}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary-hover"
                >
                  {isLoading ? 'Submitting...' : 'Submit for Approval'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
