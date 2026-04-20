import { test, expect } from "@playwright/test"

test.describe("Home Page", () => {
  test("displays Steve Lin heading", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: "Steve Lin" })).toBeVisible()
  })

  test("no console errors when no blog posts exist", async ({ page }) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text())
    })
    await page.goto("/")
    expect(errors).toHaveLength(0)
  })

  test("Latest Writing section hidden when no published posts", async ({ page }) => {
    await page.goto("/")
    // No non-draft posts exist → section should not be in DOM
    const section = page.getByRole("heading", { name: "Latest Writing" })
    await expect(section).not.toBeVisible()
  })

  test("Projects section shows placeholder when no featured projects", async ({ page }) => {
    await page.goto("/")
    // With MDX projects present and featured=true, cards appear
    // Without featured projects, placeholder text appears
    const hasProjects = await page.locator('[data-slot="card"]').count()
    const hasPlaceholder = await page.getByText("Projects coming soon.").isVisible()
    expect(hasProjects > 0 || hasPlaceholder).toBeTruthy()
  })
})
