import { test, expect } from "@playwright/test"

test.describe("Blog", () => {
  test("/blog page is accessible", async ({ page }) => {
    const response = await page.goto("/blog")
    expect(response?.status()).toBe(200)
  })

  test("empty state is shown when no published posts", async ({ page }) => {
    await page.goto("/blog")
    await expect(page.getByText("文章籌備中")).toBeVisible()
  })

  test("draft post (test) does not appear in blog list", async ({ page }) => {
    await page.goto("/blog")
    const draftLink = page.getByRole("link", { name: "Test Post" })
    await expect(draftLink).not.toBeVisible()
  })

  test("/blog/test (draft) returns 404", async ({ page }) => {
    const response = await page.goto("/blog/test")
    expect(response?.status()).toBe(404)
  })
})
