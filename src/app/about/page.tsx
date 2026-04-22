import type { Metadata } from "next"
import { Mail } from "lucide-react"
import { GithubIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { AnimateIn } from "@/components/AnimateIn"
import aboutData from "@/data/about.json"
import skillsData from "@/data/skills.json"

export const metadata: Metadata = {
  title: "About",
  description: "About Steve Lin — automation engineer exploring AI and LLM tooling.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 space-y-12">
      <AnimateIn>
        <section>
          <h1 className="text-3xl font-bold tracking-tight mb-4">About</h1>
          <div className="space-y-3">
            {aboutData.bio.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === aboutData.bio.length - 1
                    ? "font-medium text-foreground"
                    : "text-muted-foreground leading-relaxed"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <section>
          <h2 className="text-xl font-semibold mb-4">Currently Exploring</h2>
          <p className="text-muted-foreground">{aboutData.currentlyExploring}</p>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.15}>
        <section>
          <h2 className="text-xl font-semibold mb-6">Tech I Use</h2>
          <div className="space-y-8">
            {Object.entries(skillsData).map(([group, categories]) => (
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
                        {(items as string[]).map((item) => (
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
