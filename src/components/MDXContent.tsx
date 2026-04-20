"use client"

import { useMDXComponent } from "next-contentlayer2/hooks"

interface MDXContentProps {
  code: string
}

export function MDXContent({ code }: MDXContentProps) {
  const MDXComponent = useMDXComponent(code)
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-code:font-mono prose-pre:bg-neutral-900 prose-pre:border">
      <MDXComponent />
    </article>
  )
}
