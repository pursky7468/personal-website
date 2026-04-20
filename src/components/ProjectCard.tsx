import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { GithubIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  slug: string
  github?: string
}

export function ProjectCard({ title, description, tags, slug, github }: ProjectCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${slug}`}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Read more <ArrowRight className="h-3 w-3" />
          </Link>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} GitHub repository`}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" /> GitHub
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
