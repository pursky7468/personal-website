import type { Metadata } from "next"
import { Mail } from "lucide-react"
import { GithubIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { AnimateIn } from "@/components/AnimateIn"

export const metadata: Metadata = {
  title: "About",
  description: "About Steve Lin — automation engineer exploring AI and LLM tooling.",
}

const skills = {
  Professional: {
    Languages: ["C#", "C++", "Python"],
    Frameworks: ["WPF", "MFC", ".NET 8"],
    Vision: ["OpenCV", "Emgu CV", "VTK", "3D Point Cloud"],
    Automation: ["RoboDK", "OpenCASCADE", "PLC", "TCP/IP"],
  },
  Exploring: {
    Languages: ["TypeScript", "Python"],
    Frameworks: ["FastAPI", "Next.js"],
    "AI / LLM": ["Claude API", "MCP", "Groq", "Gemini", "sentence-transformers"],
    Data: ["PostgreSQL", "SQLite", "SQLAlchemy", "FTS5"],
    Tools: ["Docker", "Git", "Vercel", "GitHub Actions"],
  },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 space-y-12">
      <AnimateIn>
        <section>
          <h1 className="text-3xl font-bold tracking-tight mb-4">About</h1>
          <div className="space-y-3 text-muted-foreground leading-relaxed">
            <p>
              I&apos;m Steve, an automation engineer based in Taiwan with 9+ years of experience in
              industrial robotics, machine vision, and system integration — working across robotic
              arms, AMRs, 3D point cloud processing, and AI-based inspection systems.
            </p>
            <p>
              Outside of work, I&apos;ve been building personal tools to explore what&apos;s possible
              with modern AI and LLM APIs. Most of what you&apos;ll find here are side projects built
              to scratch an itch: connecting Claude&apos;s MCP to real data sources, automating my
              own information workflow, and figuring out how AI fits into the kind of systems I work
              with professionally.
            </p>
            <p className="font-medium text-foreground">
              My day job is C# and C++. My weekend is Python and TypeScript.
            </p>
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <section>
          <h2 className="text-xl font-semibold mb-4">Currently Exploring</h2>
          <p className="text-muted-foreground">
            MCP (Model Context Protocol) tooling, semantic search without dedicated vector databases,
            and figuring out how LLM agents can interact with industrial automation systems.
          </p>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.15}>
        <section>
          <h2 className="text-xl font-semibold mb-6">Tech I Use</h2>

          <div className="space-y-8">
            {Object.entries(skills).map(([group, categories]) => (
              <div key={group}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  {group === "Professional" ? "Professional" : "Personal / Exploring"}
                </p>
                <div className="space-y-3">
                  {Object.entries(categories).map(([category, items]) => (
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
