import type { MetadataRoute } from "next"
import { allPosts, allProjects } from "contentlayer/generated"

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/about", "/projects", "/blog"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }))

  const projectRoutes = allProjects
    .filter((p) => !p.draft)
    .map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date(p.date) }))

  const postRoutes = allPosts
    .filter((p) => !p.draft)
    .map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.date) }))

  return [...staticRoutes, ...projectRoutes, ...postRoutes]
}
