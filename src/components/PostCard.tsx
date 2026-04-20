import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface PostCardProps {
  title: string
  summary: string
  date: string
  tags: string[]
  slug: string
}

export function PostCard({ title, summary, date, tags, slug }: PostCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="group border-b pb-6 last:border-0">
      <Link href={`/blog/${slug}`} className="block">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{summary}</p>
        <div className="mt-2 flex items-center gap-3">
          <time className="text-xs text-muted-foreground">{formattedDate}</time>
          <div className="flex gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal py-0">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </article>
  )
}
