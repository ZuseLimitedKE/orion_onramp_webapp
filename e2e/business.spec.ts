import { test, expect, type Page } from '@playwright/test'
import { generateRandomString, login } from './utils'
import { BASE_URL } from './constants'

// Business Types (matching src/types/businesses.ts)
const BUSINESS_TYPES = {
  STARTER: 'Starter business',
  REGISTERED: 'Registered Business',
}

const BUSINESS_REGISTRATION_TYPES = {
  SOLE_PROPRIETORSHIP: 'Sole Proprietorship',
  REGISTERED_COMPANY: 'Registered Company',
}

test.describe('Business Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await login(page)
  })

  test('user can create a business', async ({ page }) => {
    // Check if we are on dashboard
    await expect(page).toHaveURL(/\/dashboard/)

    //  navigate directly to be safe and consistent, as the dashboard state depends on existing businesses.
    await page.goto(`${BASE_URL}/dashboard/business/create`)

    await expect(page).toHaveURL(/\/dashboard\/business\/create/)
    await expect(
      page.getByRole('heading', { name: 'Create Business' }),
    ).toBeVisible()

    await test.step('Step 1: Basic Information', async () => {
      await fillBasicInfo(page)
      await page.getByRole('button', { name: 'Next' }).click()
    })

    await test.step('Step 2: Legal Details', async () => {
      await fillLegalDetails(page)
      await page.getByRole('button', { name: 'Next' }).click()
    })

    await test.step('Step 3: Contact Information', async () => {
      await fillContactInfo(page)
      await page.getByRole('button', { name: 'Next' }).click()
    })

    await test.step('Step 4: Additional Details', async () => {
      await fillDocuments(page)
      await page.getByRole('button', { name: 'Next' }).click()
    })

    await test.step('Step 5: Review & Submit', async () => {
      // Verify we are on the review step
      await expect(
        page.getByRole('heading', { name: 'Review & Submit' }),
      ).toBeVisible()

      // Submit
      await page.getByRole('button', { name: 'Submit for Approval' }).click()

      // Expect success message or redirection
      await expect(
        page.locator('[data-sonner-toast]', {
          hasText: 'Business submitted successfully',
        }),
      ).toBeVisible({ timeout: 10000 })

      // Should redirect to settings/profile
      await expect(page).toHaveURL(/\/dashboard\/settings/, { timeout: 10000 })
    })
  })
})

async function fillBasicInfo(page: Page) {
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

async function fillLegalDetails(page: Page) {
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

async function fillContactInfo(page: Page) {
  await page
    .getByLabel(/general email/i)
    .fill(`contact-${Date.now()}@example.com`)
  await page.getByLabel(/phone number/i).fill('+15551234567')
  await page.getByLabel(/website/i).fill('https://example.com')
}

async function fillDocuments(page: Page) {
  await page.getByLabel(/country/i).fill('United States')
  await page.getByLabel(/city/i).fill('New York')
  await page.getByLabel(/street address/i).fill('123 Test St')
  await page.getByLabel(/postal code/i).fill('10001')
}
