import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3001'

// Pre-verified test user for login tests
const verifiedUser = {
  email: process.env.E2E_TEST_USER_EMAIL || 'orion_test@orionramp.com',
  password: process.env.E2E_TEST_USER_PASSWORD || '0RionRocks_2025!',
}

// Test data for signup tests (will need email verification)
const testUser = {
  name: 'John Doe',
  email: `test-${Date.now()}@example.com`,
  password: 'TestPass123',
  weakPassword: 'weak',
  invalidEmail: 'invalid-email@invalid-site',
  businessName: 'Test Business Ltd',
  phoneNumber: '+254115816456',
}

test.describe('Authentication Flow - Priority 1: Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test('should display signup form by default', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /create your business account/i }),
    ).toBeVisible()
    await expect(
      page
        .locator('.inline-flex.gap-1.rounded-lg')
        .getByRole('button', { name: /sign up/i }),
    ).toHaveClass(/bg-background/)
  })

  test('should toggle between signup and login forms', async ({ page }) => {
    // Start on signup
    await expect(
      page.getByRole('heading', { name: /create your business account/i }),
    ).toBeVisible()

    // Click Login tab (in the toggle buttons at the top)
    await page.locator('#login-tab').click()
    await expect(
      page.getByRole('heading', { name: /login to your account/i }),
    ).toBeVisible()

    // Click Sign Up tab (in the toggle buttons at the top)
    await page.locator('#signup-tab').click()
    await expect(
      page.getByRole('heading', { name: /create your business account/i }),
    ).toBeVisible()
  })

  test('user can sign up with email/password', async ({ page }) => {
    // Fill out signup form
    await page.getByLabel(/full name/i).fill(testUser.name)
    await page.getByLabel(/^email$/i).fill(testUser.email)
    await page.getByLabel(/^password$/i).fill(testUser.password)
    await page.getByLabel(/confirm password/i).fill(testUser.password)
    await page.getByLabel(/business name/i).fill(testUser.businessName)
    await page.getByLabel(/phone number/i).fill(testUser.phoneNumber)

    // Submit form
    await page.getByRole('button', { name: /create account/i }).click()

    // Wait for success message
    await expect(
      page.locator('[data-sonner-toast]', { hasText: 'Check your email' }),
    ).toBeVisible({ timeout: 20000 })
  })

  test('user can login with valid credentials', async ({ page }) => {
    // Use pre-verified test account
    // Switch to login form via tab toggle
    await page.locator('#login-tab').click()

    // Fill login form with verified user credentials
    await page.getByLabel(/^email$/i).fill(verifiedUser.email)
    await page.getByLabel(/^password$/i).fill(verifiedUser.password)

    // Submit
    await page.locator('#login-button').click()

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  /*test('user can log out', async ({ page }) => {
    // Login first via tab toggle with verified user
    await page
      .locator('.inline-flex.gap-1.rounded-lg')
      .getByRole('button', { name: /^login$/i })
      .click()
    await page.getByLabel(/^email$/i).fill(verifiedUser.email)
    await page.getByLabel(/^password$/i).fill(verifiedUser.password)
    await page.getByRole('button', { name: /^login$/i }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })

    // Logout (adjust selector based on your logout button)
    await page.getByRole('button', { name: /log ?out/i }).click()

    // Should redirect to login page
    await expect(page).toHaveURL(BASE_URL)
  })
*/
  test('password visibility toggle works', async ({ page }) => {
    const passwordInput = page.getByLabel(/^password$/i)
    const toggleButton = page
      .locator('button[type="button"]')
      .filter({ has: page.locator('svg') })
      .first()

    // Initially password type
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Click to show password
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')

    // Click to hide password
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })
})

test.describe('Authentication Flow - Priority 2: Error Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test('user cannot sign up with invalid email', async ({ page }) => {
    await page.getByLabel(/full name/i).fill(testUser.name)
    await page.getByLabel(/^email$/i).fill(testUser.invalidEmail)
    await page.getByLabel(/^password$/i).fill(testUser.password)
    await page.getByLabel(/confirm password/i).fill(testUser.password)
    await page.getByLabel(/business name/i).fill(testUser.businessName)
    await page.getByLabel(/phone number/i).fill(testUser.phoneNumber)

    await page.getByRole('button', { name: /create account/i }).click()

    // Should show validation error
    await expect(page.getByText(/enter a valid email/i)).toBeVisible()
  })

  test('user cannot sign up with weak password', async ({ page }) => {
    await page.getByLabel(/full name/i).fill(testUser.name)
    await page.getByLabel(/^email$/i).fill(testUser.email)
    await page.getByLabel(/^password$/i).fill(testUser.weakPassword)
    await page.getByLabel(/confirm password/i).fill(testUser.weakPassword)
    await page.getByLabel(/business name/i).fill(testUser.businessName)
    await page.getByLabel(/phone number/i).fill(testUser.phoneNumber)

    await page.getByRole('button', { name: /create account/i }).click()

    // Should show password strength error
    await expect(
      page.getByText(/Password must be at least 8 characters/i),
    ).toBeVisible()
  })

  test('user cannot sign up with mismatched passwords', async ({ page }) => {
    await page.getByLabel(/full name/i).fill(testUser.name)
    await page.getByLabel(/^email$/i).fill(testUser.email)
    await page.getByLabel(/^password$/i).fill(testUser.password)
    await page.getByLabel(/confirm password/i).fill('DifferentPass123')
    await page.getByLabel(/business name/i).fill(testUser.businessName)
    await page.getByLabel(/phone number/i).fill(testUser.phoneNumber)

    await page.getByRole('button', { name: /create account/i }).click()

    // Should show password mismatch error
    await expect(page.getByText(/password.*match/i)).toBeVisible()
  })

  test('user cannot login with invalid credentials', async ({ page }) => {
    await page.locator('#login-tab').click()

    await page.getByLabel(/^email$/i).fill(verifiedUser.email)
    await page.getByLabel(/^password$/i).fill('WrongPassword123')

    await page.locator('#login-button').click()

    // Should show error message
    await expect(
      page.locator('[data-sonner-toast]', {
        hasText: 'invalid email or password',
      }),
    ).toBeVisible()
  })

  test('user cannot log in before email verification', async ({ page }) => {
    // First, create an unverified account
    const unverifiedUser = {
      name: 'Test User',
      email: `unverified-${Date.now()}@example.com`,
      password: 'TestPass123',
      businessName: 'Test Business',
      phoneNumber: '+254115816456',
    }

    // Sign up
    await page.getByLabel(/full name/i).fill(unverifiedUser.name)
    await page.getByLabel(/^email$/i).fill(unverifiedUser.email)
    await page.getByLabel(/^password$/i).fill(unverifiedUser.password)
    await page.getByLabel(/confirm password/i).fill(unverifiedUser.password)
    await page.getByLabel(/business name/i).fill(unverifiedUser.businessName)
    await page.getByLabel(/phone number/i).fill(unverifiedUser.phoneNumber)
    await page.getByRole('button', { name: /create account/i }).click()

    // Wait for signup success
    await expect(
      page.locator('[data-sonner-toast]', { hasText: 'Check your email' }),
    ).toBeVisible({ timeout: 20000 })

    //  attempt to login with this unverified account
    await page.locator('#login-tab').click()

    await page.getByLabel(/^email$/i).fill(unverifiedUser.email)
    await page.getByLabel(/^password$/i).fill(unverifiedUser.password)

    await page.locator('#login-button').click()

    await expect(
      page.locator('[data-sonner-toast]', {
        hasText: 'Please verify your email address first.',
      }),
    ).toBeVisible({ timeout: 20000 })
  })
  test('unauthorized access redirects to login', async ({ page }) => {
    // Try to access protected route directly
    await page.goto(`${BASE_URL}/dashboard`)

    // Should redirect to login page
    await expect(page).toHaveURL(BASE_URL)
  })
})

test.describe('Authentication Flow - Priority 3: Miscellaneous', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test('forgot password link navigates to reset form', async ({ page }) => {
    await page.locator('#login-tab').click()

    await page.getByText(/forgot your password/i).click()

    // Should show reset password form
    await expect(
      page.getByRole('heading', { name: /reset.*password|forgot.*password/i }),
    ).toBeVisible()
  })

  test('resend verification link works from signup success', async ({
    page,
  }) => {
    // Complete signup
    await page.getByLabel(/full name/i).fill(testUser.name)
    await page.getByLabel(/^email$/i).fill(`new-${Date.now()}@example.com`)
    await page.getByLabel(/^password$/i).fill(testUser.password)
    await page.getByLabel(/confirm password/i).fill(testUser.password)
    await page.getByLabel(/business name/i).fill(testUser.businessName)
    await page.getByLabel(/phone number/i).fill(testUser.phoneNumber)

    await page.getByRole('button', { name: /create account/i }).click()

    // Click resend email button in toast
    await expect(
      page.locator('[data-sonner-toast] button', { hasText: 'Resend Email' }),
    ).toBeVisible({ timeout: 20000 })

    await page
      .locator('[data-sonner-toast] button', { hasText: 'Resend Email' })
      .click()
    // Should navigate to resend verification form
    await expect(
      page.getByRole('heading', { name: /resend.*verification/i }),
    ).toBeVisible()
  })

  test('navigation between auth forms preserves no data', async ({ page }) => {
    // Fill signup form
    await page.getByLabel(/full name/i).fill(testUser.name)
    await page.getByLabel(/^email$/i).fill(testUser.email)

    // Switch to login via tab toggle
    await page.locator('#login-tab').click()

    // Switch back to signup via tab toggle
    await page.locator('#signup-tab').click()

    // Fields should be empty (form resets on mode change)
    await expect(page.getByLabel(/full name/i)).toHaveValue('')
    await expect(page.getByLabel(/^email$/i)).toHaveValue('')
  })
})
