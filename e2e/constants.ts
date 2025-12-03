if (!process.env.E2E_TEST_USER_EMAIL || !process.env.E2E_TEST_USER_PASSWORD) {
  throw new Error('E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD must be set')
}
export const BASE_URL = 'http://localhost:3001'

// Pre-verified test user for login tests
export const verifiedUser = {
  email: process.env.E2E_TEST_USER_EMAIL,
  password: process.env.E2E_TEST_USER_PASSWORD,
}

// Test data for signup tests (will need email verification)
export const testUser = {
  name: 'John Doe',
  email: `test-${Date.now()}@example.com`,
  password: 'TestPass123',
  weakPassword: 'weak',
  invalidEmail: 'invalid-email@invalid-site',
  businessName: 'Test Business Ltd',
  phoneNumber: '+254115816456',
}
