import { test, expect } from "@playwright/test"

test.describe("About Page", () => {
  test("page is accessible (status 200)", async ({ page }) => {
    const response = await page.goto("/about")
    expect(response?.status()).toBe(200)
  })

  test("displays tech badges", async ({ page }) => {
    await page.goto("/about")
    const badges = page.locator(".rounded-full")
    await expect(badges.first()).toBeVisible()
    expect(await badges.count()).toBeGreaterThan(5)
  })

  test("GitHub and Email links exist with href", async ({ page }) => {
    await page.goto("/about")
    const githubLink = page.getByRole("link", { name: /github/i })
    const emailLink = page.getByRole("link", { name: /email/i })
    await expect(githubLink).toBeVisible()
    await expect(emailLink).toBeVisible()
    expect(await githubLink.getAttribute("href")).toContain("github.com")
    expect(await emailLink.getAttribute("href")).toContain("mailto:")
  })
})
