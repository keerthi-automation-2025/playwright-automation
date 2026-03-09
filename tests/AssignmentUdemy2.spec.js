import { test, expect} from '@playwright/test';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = `BASE_URL`;
const YAHOO_USER = {email: 'testyahoo@yahoo.com',password: 'Qwert123!'};
const GMAIL_USER = {email: 'testgmail@gmail.com',password: 'Qwert123!'};

async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('#email', user.email);
  await page.fill('#password', user.password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

test('Booking access should be denied for different user', async ({ page , request}) => {
  const apiContext = await request.newContext();
  const loginRes = await apiContext.post(`${API_URL}/auth/login`, {
    data: {
      email: YAHOO_USER.email,
      password: YAHOO_USER.password
    }
  });
 // expect(loginRes.ok()).toBeTruthy();
 expect(loginRes.status()).toBe(200);
  const loginJson = await loginRes.json();
  const token = loginJson.token;
  // Step 2 — Fetch Events
  const eventsRes = await apiContext.get(`${API_URL}/events`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  expect(eventsRes.ok()).toBeTruthy();
  const eventsJson = await eventsRes.json();
  const eventId = eventsJson.data[0].id;
  // Step 3 — Create Booking
  const bookingRes = await apiContext.post(`${API_URL}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      eventId: eventId,
      customerName: 'Yahoo User',
      customerEmail: YAHOO_USER.email,
      customerPhone: '9876543210',
      quantity: 1
    }
  });

  expect(bookingRes.ok()).toBeTruthy();

  const bookingJson = await bookingRes.json();
  const yahooBookingId = bookingJson.data.id;

  // -----------------------
  // Step 4 — Login as Gmail User (UI)
  // -----------------------
  await loginAs(page, GMAIL_USER);

  // -----------------------
  // Step 5 — Navigate to Yahoo Booking
  // -----------------------
  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, {
    waitUntil: 'networkidle'
  });

  // -----------------------
  // Step 6 — Validate Access Denied
  // -----------------------
  await expect(page.locator('text=Access Denied')).toBeVisible();
  await expect(
    page.locator('text=You are not authorized to view this booking')
  ).toBeVisible();

});