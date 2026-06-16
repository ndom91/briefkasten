import { expect, test } from "@playwright/test"

test('has title "Briefkasten"', async ({ page }) => {
  await page.goto(process.env.PW_URL ?? "http://localhost:3000")

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Briefkasten/)
})

test("has auth providers available", async ({ page }) => {
  await page.goto(process.env.PW_URL ?? "http://localhost:3000")

  // Expects page to NOT have "No providers found" warning
  await expect(page.getByText("No Auth.js Providers found")).not.toBeVisible()
})
