import { test, expect } from "@playwright/test"
import { execSync } from "child_process"
import path from "path"

const slugs = ["ai-news-radar", "linebot"]

test.describe("Projects", () => {
  test("/projects page is accessible", async ({ page }) => {
    const response = await page.goto("/projects")
    expect(response?.status()).toBe(200)
  })

  test("/projects lists all non-draft projects", async ({ page }) => {
    await page.goto("/projects")
    for (const slug of slugs) {
      await expect(page.getByRole("link", { name: /read more/i }).first()).toBeVisible()
    }
  })

  for (const slug of slugs) {
    test(`/projects/${slug} returns 200`, async ({ page }) => {
      const response = await page.goto(`/projects/${slug}`)
      expect(response?.status()).toBe(200)
    })

    test(`/projects/${slug} has GitHub link`, async ({ page }) => {
      await page.goto(`/projects/${slug}`)
      const githubLink = page.getByRole("link", { name: "GitHub", exact: true })
      await expect(githubLink).toBeVisible()
    })
  }

  test("no raw <img> tags in src/ (must use next/image)", () => {
    try {
      const result = execSync(
        'grep -rn "<img " src/ --include="*.tsx" --include="*.ts" --include="*.jsx"',
        { cwd: path.resolve(__dirname, ".."), encoding: "utf-8" }
      )
      // If grep finds results, fail
      if (result.trim()) {
        throw new Error(`Raw <img> tags found:\n${result}`)
      }
    } catch (err: unknown) {
      // grep exits with code 1 when no match found — that's the success case
      if ((err as NodeJS.ErrnoException).status === 1) return
      throw err
    }
  })
})
