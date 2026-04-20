import { test, expect } from "@playwright/test"

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
]

const pages = ["/", "/projects", "/blog", "/about"]

test.describe("Responsive", () => {
  for (const vp of viewports) {
    test(`No horizontal scroll at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      for (const path of pages) {
        await page.goto(path)
        const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
        const innerWidth = await page.evaluate(() => window.innerWidth)
        expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1)
      }
    })
  }

  test("Hamburger visible at 375px, desktop nav hidden", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/")
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible()
    // Desktop nav links should not be visible (hidden via md: class)
    const desktopNav = page.locator("nav .hidden.md\\:flex")
    await expect(desktopNav).toBeHidden()
  })

  test("Max-width container respected at 1280px", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto("/")
    const maxWidth = await page.evaluate(() => {
      const main = document.querySelector("main")
      return main ? main.scrollWidth : 0
    })
    expect(maxWidth).toBeLessThanOrEqual(1280)
  })
})
