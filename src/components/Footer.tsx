import { Mail } from "lucide-react"
import { GithubIcon } from "@/components/icons"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <p className="text-sm text-muted-foreground">© 2026 Steve Lin</p>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/pursky7468"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={`mailto:purskyrone@gmail.com`}
            aria-label="Send email"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
