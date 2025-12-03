import { test, expect } from '@playwright/test'
import { login, createBusiness, BASE_URL, BUSINESS_TYPES } from './utils'

test.describe('Business Update Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await login(page)
  })

  test('user can update business profile', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`)

    // Check if "No businesses yet" is visible.

    await expect(page.getByText('Loading business data...')).not.toBeVisible({
      timeout: 10000,
    })

    const noBusinessText = page.getByText('No businesses yet')
    if (await noBusinessText.isVisible()) {
      console.log('No business found, creating a new one...')
      await createBusiness(page)
      await page.goto(`${BASE_URL}/dashboard/settings?tab=profile`)
    } else {
      console.log('Business found, navigating to settings...')
      await page.goto(`${BASE_URL}/dashboard/settings?tab=profile`)
    }

    //  Verify we are on the settings page
    await expect(page.getByText('Business Information')).toBeVisible()

    //  Enter Edit Mode
    await page.getByRole('button', { name: 'Edit Profile' }).click()

    //  Update fields
    const newTradingName = `Updated Business ${Date.now()}`
    await page.getByLabel('Trading Name').fill(newTradingName)

    const newDescription = `Updated description at ${new Date().toISOString()}`
    await page.getByLabel('Business Description').fill(newDescription)
    //  Update the select fields using combobox role
    // Business Type select
    await page
      .getByRole('combobox')
      .filter({ hasText: 'Select business type' })
      .click()
    await page.getByRole('option', { name: BUSINESS_TYPES.STARTER }).click()

    //  Save Changes
    await page.getByRole('button', { name: 'Save Changes' }).click()

    //  Verify success
    await expect(
      page.locator('[data-sonner-toast]', {
        hasText: 'Business profile updated successfully',
      }),
    ).toBeVisible({ timeout: 10000 })

    //  Verify updates are reflected and edit mode is exited
    await expect(
      page.getByRole('button', { name: 'Edit Profile' }),
    ).toBeVisible() // Edit button returns

    // Check the values in the inputs (which should now be disabled)
    await expect(page.getByLabel('Trading Name')).toHaveValue(newTradingName)
    await expect(page.getByLabel('Business Description')).toHaveValue(
      newDescription,
    )
    await expect(page.getByLabel('Trading Name')).toBeDisabled()
  })
})
