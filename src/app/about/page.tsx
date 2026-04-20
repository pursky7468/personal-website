import type { Metadata } from "next"
import { Mail } from "lucide-react"
import { GithubIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { AnimateIn } from "@/components/AnimateIn"

export const metadata: Metadata = {
  title: "About",
  description: "About Steve Lin — builder, tinkerer, AI tooling enthusiast.",
}

const skills = {
  Languages: ["Python", "TypeScript", "C#", "SQL"],
  Frameworks: ["FastAPI", "Next.js", ".NET 8", "Electron"],
  "AI / LLM": ["Claude API", "MCP", "Groq", "Gemini", "sentence-transformers"],
  Data: ["PostgreSQL", "SQLite", "SQLAlchemy", "FTS5"],
  Tools: ["Docker", "Git", "Vercel", "GitHub Actions"],
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 space-y-12">
      <AnimateIn>
        <section>
          <h1 className="text-3xl font-bold tracking-tight mb-4">About</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              Hi, I&apos;m Steve. I like building things — full-stack applications, AI pipelines, and tools
              that solve problems I actually have. Most of what you&apos;ll find here are personal projects
              built to scratch an itch or explore something new.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              I tend to work end-to-end: from database schema to UI to deployment. Lately I&apos;ve been
              spending a lot of time with LLM integrations, particularly building custom MCP servers for Claude.
            </p>
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <section>
          <h2 className="text-xl font-semibold mb-4">Currently Exploring</h2>
          <p className="text-muted-foreground">
            MCP (Model Context Protocol) tooling, semantic search without dedicated vector databases,
            and building personal knowledge systems with AI assistance.
          </p>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.15}>
        <section>
          <h2 className="text-xl font-semibold mb-6">Tech I Use</h2>
          <div className="space-y-4">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="flex flex-col sm:flex-row sm:items-start gap-2">
                <span className="text-sm font-medium text-muted-foreground w-32 shrink-0 pt-0.5">
                  {category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <Badge key={item} variant="outline" className="font-normal">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.2}>
        <section>
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <div className="flex gap-3">
            <a
              href="https://github.com/pursky7468"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-8 px-3 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <GithubIcon className="h-4 w-4 mr-2" />
              GitHub
            </a>
            <a
              href="mailto:purskyrone@gmail.com"
              className="inline-flex items-center h-8 px-3 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </a>
          </div>
        </section>
      </AnimateIn>
    </div>
  )
}
