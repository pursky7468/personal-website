import { test, expect } from "@playwright/test"

const pages = ["/", "/projects", "/blog", "/about"]

test.describe("SEO", () => {
  for (const path of pages) {
    test(`${path} has non-empty <title>`, async ({ page }) => {
      await page.goto(path)
      const title = await page.title()
      expect(title.length).toBeGreaterThan(0)
      expect(title).toContain("Steve Lin")
    })

    test(`${path} has og:title and og:description meta tags`, async ({ page }) => {
      await page.goto(path)
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content")
      const ogDesc = await page.locator('meta[property="og:description"]').getAttribute("content")
      expect(ogTitle).toBeTruthy()
      expect(ogDesc).toBeTruthy()
    })
  }

  test("/robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt")
    expect(response?.status()).toBe(200)
    const body = await response?.text()
    expect(body).toMatch(/User-[Aa]gent/)
  })

  test("/sitemap.xml is accessible and contains known routes", async ({ page }) => {
    const response = await page.goto("/sitemap.xml")
    expect(response?.status()).toBe(200)
    const body = await response?.text()
    expect(body).toContain("/projects")
    expect(body).toContain("/blog")
    expect(body).toContain("/about")
  })
})
