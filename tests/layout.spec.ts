import { test, expect } from "@playwright/test"

const pages = ["/", "/projects", "/blog", "/about"]

test.describe("Layout", () => {
  for (const path of pages) {
    test(`Navbar and Footer visible on ${path}`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole("link", { name: "Steve Lin" }).first()).toBeVisible()
      await expect(page.getByRole("link", { name: "Projects" }).first()).toBeVisible()
      await expect(page.getByRole("link", { name: "Blog" }).first()).toBeVisible()
      await expect(page.getByRole("link", { name: "About" }).first()).toBeVisible()
      await expect(page.getByText("© 2026 Steve Lin")).toBeVisible()
    })
  }

  test("Dark mode toggle changes html class and persists on reload", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: "Toggle theme" }).click()
    await expect(page.locator("html")).toHaveClass(/dark/)
    await page.reload()
    await expect(page.locator("html")).toHaveClass(/dark/)
  })

  test("Mobile hamburger opens Sheet menu at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/")
    const hamburger = page.getByRole("button", { name: "Open menu" })
    await expect(hamburger).toBeVisible()
    await hamburger.click()
    await expect(page.getByRole("dialog")).toBeVisible()
  })
})
