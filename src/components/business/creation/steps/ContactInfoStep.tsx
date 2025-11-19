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
  Mail,
  Phone,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  HeadphonesIcon,
  MessageSquare,
} from 'lucide-react'
import type { CreateBusinessFormData } from '@/types/businesses'

interface ContactInfoStepProps {
  form: UseFormReturn<CreateBusinessFormData>
}

export function ContactInfoStep({ form }: ContactInfoStepProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      {/* Essential Contact Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Essential Contact Information
          </CardTitle>
          <CardDescription>
            Required contact details for customer support and business
            operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* General Email */}
            <Field>
              <FieldLabel htmlFor="generalEmail">General Email *</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="generalEmail"
                  type="email"
                  placeholder="info@yourcompany.com"
                  className={`pl-10 ${errors.generalEmail ? 'border-red-500' : ''}`}
                  {...register('generalEmail')}
                />
              </div>
              {errors.generalEmail && (
                <FieldDescription className="text-red-500">
                  {errors.generalEmail.message}
                </FieldDescription>
              )}
              <FieldDescription>
                Primary contact email for business inquiries
              </FieldDescription>
            </Field>

            {/* Phone Number */}
            <Field>
              <FieldLabel htmlFor="phoneNumber">Phone Number *</FieldLabel>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className={`pl-10 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  {...register('phoneNumber')}
                />
              </div>
              {errors.phoneNumber && (
                <FieldDescription className="text-red-500">
                  {errors.phoneNumber.message}
                </FieldDescription>
              )}
              <FieldDescription>
                Primary contact number for urgent matters
              </FieldDescription>
            </Field>
          </div>

          {/* Website */}
          <Field>
            <FieldLabel htmlFor="website">Website</FieldLabel>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                type="url"
                placeholder="https://www.yourcompany.com"
                className={`pl-10 ${errors.website ? 'border-red-500' : ''}`}
                {...register('website')}
              />
            </div>
            {errors.website && (
              <FieldDescription className="text-red-500">
                {errors.website.message}
              </FieldDescription>
            )}
            <FieldDescription>
              Your business website (leave empty if you don't have one)
            </FieldDescription>
          </Field>
        </CardContent>
      </Card>

      {/* Support Contact Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5 text-primary" />
            Support Contact Information
          </CardTitle>
          <CardDescription>
            Dedicated support channels for customer assistance (optional but
            recommended)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Support Email */}
            <Field>
              <FieldLabel htmlFor="supportEmail">Support Email</FieldLabel>
              <div className="relative">
                <HeadphonesIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="supportEmail"
                  type="email"
                  placeholder="support@yourcompany.com"
                  className={`pl-10 ${errors.supportEmail ? 'border-red-500' : ''}`}
                  {...register('supportEmail')}
                />
              </div>
              {errors.supportEmail && (
                <FieldDescription className="text-red-500">
                  {errors.supportEmail.message}
                </FieldDescription>
              )}
              <FieldDescription>
                Dedicated email for customer support inquiries
              </FieldDescription>
            </Field>

            {/* Disputes Email */}
            <Field>
              <FieldLabel htmlFor="disputesEmail">Disputes Email</FieldLabel>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="disputesEmail"
                  type="email"
                  placeholder="disputes@yourcompany.com"
                  className={`pl-10 ${errors.disputesEmail ? 'border-red-500' : ''}`}
                  {...register('disputesEmail')}
                />
              </div>
              {errors.disputesEmail && (
                <FieldDescription className="text-red-500">
                  {errors.disputesEmail.message}
                </FieldDescription>
              )}
              <FieldDescription>
                Email for handling payment disputes and chargebacks
              </FieldDescription>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Presence */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">
            Social Media Presence
          </CardTitle>
          <CardDescription>
            Connect your social media accounts to build trust with customers
            (all optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Twitter */}
            <Field>
              <FieldLabel htmlFor="twitterHandle">Twitter Handle</FieldLabel>
              <div className="relative">
                <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitterHandle"
                  placeholder="@yourcompany"
                  className="pl-10"
                  {...register('twitterHandle')}
                />
              </div>
              <FieldDescription>Your Twitter/X username</FieldDescription>
            </Field>

            {/* Facebook */}
            <Field>
              <FieldLabel htmlFor="facebookPage">Facebook Page</FieldLabel>
              <div className="relative">
                <Facebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="facebookPage"
                  placeholder="facebook.com/yourcompany"
                  className="pl-10"
                  {...register('facebookPage')}
                />
              </div>
              <FieldDescription>Your Facebook page URL</FieldDescription>
            </Field>

            {/* Instagram */}
            <Field>
              <FieldLabel htmlFor="instagramHandle">
                Instagram Handle
              </FieldLabel>
              <div className="relative">
                <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="instagramHandle"
                  placeholder="@yourcompany"
                  className="pl-10"
                  {...register('instagramHandle')}
                />
              </div>
              <FieldDescription>Your Instagram username</FieldDescription>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Tips */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Contact Information Best Practices
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  • Use professional email addresses that match your domain
                </li>
                <li>
                  • Ensure phone numbers are monitored during business hours
                </li>
                <li>• Keep social media profiles updated and professional</li>
                <li>
                  • Consider having separate emails for different types of
                  inquiries
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
