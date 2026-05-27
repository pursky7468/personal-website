import { useTranslations } from "next-intl"
import { AnimateIn } from "@/components/AnimateIn"

export function HeroSection() {
  const t = useTranslations("home")
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <AnimateIn>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Steve Lin</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            {t("heroTagline")}
          </p>
        </AnimateIn>
      </div>
    </section>
  )
}
