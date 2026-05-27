import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

// Derive base slug by stripping the lang suffix: "slug.zh-TW" → "slug"
function deriveSlug(flattenedPath: string): string {
  const base = flattenedPath.replace(/^blog\//, '')
  return base.replace(/\.(zh-TW|en)$/, '')
}

// Derive lang from filename: "slug.zh-TW.mdx" → "zh-TW", "slug.mdx" → "zh-TW" (legacy default)
function deriveLang(sourceFileName: string): string {
  const match = sourceFileName.match(/\.(zh-TW|en)\.mdx$/)
  return match ? match[1] : 'zh-TW'
}

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    summary: { type: 'string', required: true },
    draft: { type: 'boolean', default: false },
  },
  computedFields: {
    lang: {
      type: 'string',
      resolve: (doc) => deriveLang(doc._raw.sourceFileName),
    },
    slug: {
      type: 'string',
      resolve: (doc) => deriveSlug(doc._raw.flattenedPath),
    },
    url: {
      type: 'string',
      resolve: (doc) => {
        const lang = deriveLang(doc._raw.sourceFileName)
        const slug = deriveSlug(doc._raw.flattenedPath)
        return `/${lang}/blog/${slug}`
      },
    },
  },
}))

const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'projects/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    github: { type: 'string' },
    featured: { type: 'boolean', default: false },
    draft: { type: 'boolean', default: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace('projects/', ''),
    },
    url: {
      type: 'string',
      resolve: (doc) => `/projects/${doc._raw.flattenedPath.replace('projects/', '')}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Project],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
  },
})
