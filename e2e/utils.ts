import { type Page, expect } from '@playwright/test'
import { verifiedUser, BASE_URL } from './constants'

export { BASE_URL }


const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export function generateRandomString(length: number): string {
  let result: string = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export async function login(page: Page) {
  // Use pre-verified test account
  // Switch to login form via tab toggle
  await page.locator('#login-tab').click()

  // Fill login form with verified user credentials
  await page.getByLabel(/^email$/i).fill(verifiedUser.email)
  await page.getByLabel(/^password$/i).fill(verifiedUser.password)

  // Submit
  await page.locator('#login-button').click()

  // Should redirect to dashboard
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 })
}

// Business Types (matching src/types/businesses.ts)
export const BUSINESS_TYPES = {
  STARTER: 'Starter business',
  REGISTERED: 'Registered Business',
}

export const BUSINESS_REGISTRATION_TYPES = {
  SOLE_PROPRIETORSHIP: 'Sole Proprietorship',
  REGISTERED_COMPANY: 'Registered Company',
}


export async function fillBasicInfo(page: Page) {
  await page.getByLabel(/trading name/i).fill(`Test Business ${Date.now()}`)

  // Select Business Type
  await page.getByText('Select business type').click()
  await page.getByRole('option', { name: BUSINESS_TYPES.REGISTERED }).click()

  await page
    .getByLabel(/business description/i)
    .fill('This is a test business created by Playwright.')

  // Optional fields
  await page.getByText('Select staff size').click()
  await page.getByRole('option', { name: '2-5 employees' }).click()

  await page.getByText('Select sales volume').click()
  await page.getByRole('option', { name: '$100K - $500K' }).click()
}

export async function fillLegalDetails(page: Page) {
  await page
    .getByLabel(/legal business name/i)
    .fill('Test Business Legal Name Ltd.')

  // Registration Type
  await page.getByText('Select registration type').click()
  await page
    .getByRole('option', {
      name: BUSINESS_REGISTRATION_TYPES.REGISTERED_COMPANY,
    })
    .click()

  await page.getByLabel(/registration number/i).fill(generateRandomString(15))

  // Industry (Handle potential empty list or loading)
  // We'll attempt to select the first available option if specific ones aren't guaranteed
  await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 })
  const industryTrigger = page.getByText('Select industry', { exact: true })
  await industryTrigger.click()

  // Wait for options to populate
  const firstOption = page.getByRole('option').first()
  if (await firstOption.isVisible({ timeout: 5000 })) {
    await firstOption.click()

    // Category
    const categoryTrigger = page.getByText('Select category', { exact: true })
    await categoryTrigger.click()
    await expect(page.getByRole('option').first()).toBeVisible({
      timeout: 5000,
    })
    await page.getByRole('option').first().click()
  } else {
    // Close the dropdown if no options (click outside or press escape)
    await page.keyboard.press('Escape')
  }
}

export async function fillContactInfo(page: Page) {
  await page
    .getByLabel(/general email/i)
    .fill(`contact-${Date.now()}@example.com`)
  await page.getByLabel(/phone number/i).fill('+15551234567')
  await page.getByLabel(/website/i).fill('https://example.com')
}

export async function fillDocuments(page: Page) {
  await page.getByLabel(/country/i).fill('United States')
  await page.getByLabel(/city/i).fill('New York')
  await page.getByLabel(/street address/i).fill('123 Test St')
  await page.getByLabel(/postal code/i).fill('10001')
}

export async function createBusiness(page: Page) {
    // Navigate to create business page
    await page.goto(`${BASE_URL}/dashboard/business/create`)
    
    await fillBasicInfo(page)
    await page.getByRole('button', { name: 'Next' }).click()
    
    await fillLegalDetails(page)
    await page.getByRole('button', { name: 'Next' }).click()
    
    await fillContactInfo(page)
    await page.getByRole('button', { name: 'Next' }).click()
    
    await fillDocuments(page)
    await page.getByRole('button', { name: 'Next' }).click()
    
    // Submit
    await page.getByRole('button', { name: 'Submit for Approval' }).click()
    
    // Wait for success
    await expect(
        page.locator('[data-sonner-toast]', {
          hasText: 'Business submitted successfully',
        }),
      ).toBeVisible({ timeout: 10000 })
      
      // Should redirect to settings/profile
      await expect(page).toHaveURL(/\/dashboard\/settings/, { timeout: 10000 })
}