import { type Page, expect } from '@playwright/test'
import { verifiedUser } from './constants'
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
