import { test, expect } from '@playwright/test'
import {
  fillBasicInfo,
  fillContactInfo,
  fillDocuments,
  fillLegalDetails,
  login,
  BASE_URL,
} from './utils'

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
