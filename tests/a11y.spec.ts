import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const pages = ["/", "/projects", "/blog", "/about"]

test.describe("Accessibility (axe-core)", () => {
  for (const path of pages) {
    test(`${path} has no critical accessibility violations`, async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze()
      const critical = results.violations.filter((v) => v.impact === "critical")
      expect(critical).toHaveLength(0)
    })
  }
})
